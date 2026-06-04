/**
 * Cloudflare Worker — CareJobsUK Document Upload
 * 
 * Handles:
 *   POST /api/r2/presign   → returns a presigned PUT URL + public URL
 *   OPTIONS /*             → CORS preflight
 * 
 * Bindings required (set in wrangler.toml):
 *   - R2 bucket bound as DOCUMENTS_BUCKET
 *   - Environment variable: ALLOWED_ORIGIN (your frontend URL)
 *   - Environment variable: R2_PUBLIC_URL  (your R2 public domain)
 */

// ── Allowed file types per document category ──────────────────
const ALLOWED = {
  cv: {
    mimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    extensions: ['.pdf', '.doc', '.docx'],
    maxBytes: 5 * 1024 * 1024, // 5MB
    label: 'CV',
  },
  coverLetter: {
    mimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    extensions: ['.pdf', '.doc', '.docx'],
    maxBytes: 3 * 1024 * 1024, // 3MB
    label: 'Cover Letter',
  },
  careCertificate: {
    mimeTypes: [
      'application/pdf',
      'image/png',
      'image/jpeg',
    ],
    extensions: ['.pdf', '.png', '.jpg', '.jpeg'],
    maxBytes: 10 * 1024 * 1024, // 10MB
    label: 'Care Certificate',
  },
  references: {
    mimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    extensions: ['.pdf', '.doc', '.docx'],
    maxBytes: 5 * 1024 * 1024, // 5MB
    label: 'References',
  },
};

// ── CORS headers ───────────────────────────────────────────────
function corsHeaders(env, req) {
  const origin = req.headers.get('Origin') || '';
  const allowed = env.ALLOWED_ORIGIN || '*';
  return {
    'Access-Control-Allow-Origin': allowed === '*' ? '*' : (origin === allowed ? origin : ''),
    'Access-Control-Allow-Methods': 'POST, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  };
}

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...extraHeaders },
  });
}

// ── Main handler ───────────────────────────────────────────────
export default {
  async fetch(request, env) {
    const cors = corsHeaders(env, request);
    const url = new URL(request.url);

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }
if (request.method === 'POST' && url.pathname === '/api/r2/upload') {
  return handleUpload(request, env, cors);
}
    // Only handle POST /api/r2/presign
    if (request.method === 'POST' && url.pathname === '/api/r2/presign') {
      return handlePresign(request, env, cors);
    }

    return json({ error: 'Not found' }, 404, cors);
  },
};
async function handleUpload(request, env, cors) {
  const docType = url.searchParams.get('docType');
  const userId = url.searchParams.get('userId');
  const fileName = url.searchParams.get('fileName');

  const rules = ALLOWED[docType];
  if (!rules) return json({ error: 'Invalid docType' }, 400, cors);

  const safeFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  const storageKey = `${userId}/${docType}/${Date.now()}_${safeFileName}`;

  const fileBuffer = await request.arrayBuffer();

  await env.DOCUMENTS_BUCKET.put(storageKey, fileBuffer, {
    httpMetadata: { contentType: request.headers.get('Content-Type') }
  });

  const publicUrl = `${env.R2_PUBLIC_URL}/${storageKey}`;
  return json({ publicUrl }, 200, cors);
}
// ── Presign handler ────────────────────────────────────────────
async function handlePresign(request, env, cors) {
  // 1. Parse body
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400, cors);
  }

  const { userId, docType, fileName, fileType, fileSize } = body;

  // 2. Validate required fields
  if (!userId || !docType || !fileName || !fileType || !fileSize) {
    return json({ error: 'Missing required fields: userId, docType, fileName, fileType, fileSize' }, 400, cors);
  }

  // 3. Validate docType
  const rules = ALLOWED[docType];
  if (!rules) {
    return json({ error: `Invalid docType. Must be one of: ${Object.keys(ALLOWED).join(', ')}` }, 400, cors);
  }

  // 4. Validate MIME type
  if (!rules.mimeTypes.includes(fileType)) {
    return json({
      error: `Invalid file type for ${rules.label}. Allowed: ${rules.extensions.join(', ')}`,
    }, 400, cors);
  }

  // 5. Validate file extension from fileName
  const ext = '.' + fileName.split('.').pop().toLowerCase();
  if (!rules.extensions.includes(ext)) {
    return json({
      error: `Invalid file extension for ${rules.label}. Allowed: ${rules.extensions.join(', ')}`,
    }, 400, cors);
  }

  // 6. Validate file size
  if (fileSize > rules.maxBytes) {
    return json({
      error: `File too large for ${rules.label}. Maximum size: ${rules.maxBytes / 1024 / 1024}MB`,
    }, 400, cors);
  }

  // 7. Build a safe storage key: userId/docType/timestamp_sanitisedFileName
  const safeFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  const storageKey = `${userId}/${docType}/${Date.now()}_${safeFileName}`;

  // 8. Generate presigned PUT URL (valid for 5 minutes)
  let uploadUrl;
  try {
    uploadUrl = await env.DOCUMENTS_BUCKET.createPresignedUrl('PUT', storageKey, {
      expiresIn: 300,
      httpMetadata: {
        contentType: fileType,
        // Content-Disposition so browsers download with original filename
        contentDisposition: `attachment; filename="${safeFileName}"`,
      },
    });
  } catch (err) {
    console.error('R2 presign error:', err);
    return json({ error: 'Failed to generate upload URL. Please try again.' }, 500, cors);
  }

  // 9. Build the public URL (served from R2 public bucket or custom domain)
  const publicBase = env.R2_PUBLIC_URL?.replace(/\/$/, '');
  if (!publicBase) {
    return json({ error: 'R2_PUBLIC_URL environment variable not set' }, 500, cors);
  }
  const publicUrl = `${publicBase}/${storageKey}`;

  // 10. Return both URLs to the frontend
  return json({ uploadUrl, publicUrl, storageKey }, 200, cors);
}