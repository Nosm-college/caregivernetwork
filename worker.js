const ALLOWED = {
  cv: {
    mimeTypes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    extensions: [".pdf", ".doc", ".docx"],
    maxBytes: 5 * 1024 * 1024,
    label: "CV",
  },
  coverLetter: {
    mimeTypes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    extensions: [".pdf", ".doc", ".docx"],
    maxBytes: 3 * 1024 * 1024,
    label: "Cover Letter",
  },
  careCertificate: {
    mimeTypes: ["application/pdf", "image/png", "image/jpeg"],
    extensions: [".pdf", ".png", ".jpg", ".jpeg"],
    maxBytes: 10 * 1024 * 1024,
    label: "Care Certificate",
  },
  references: {
    mimeTypes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    extensions: [".pdf", ".doc", ".docx"],
    maxBytes: 5 * 1024 * 1024,
    label: "References",
  },
};

function corsHeaders(env, req) {
  const origin = req.headers.get("Origin") || "";
  const allowed = env.ALLOWED_ORIGIN || "*";
  return {
    "Access-Control-Allow-Origin":
      allowed === "*" ? "*" : origin === allowed ? origin : "",
    "Access-Control-Allow-Methods": "POST, PUT, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
  };
}

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...extraHeaders },
  });
}

export default {
  async fetch(request, env) {
    const cors = corsHeaders(env, request);
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    // Step 1: validate & return storageKey + publicUrl
    if (request.method === "POST" && url.pathname === "/api/r2/presign") {
      return handlePresign(request, env, cors);
    }

    // Step 2: receive the actual file and store it in R2
    if (request.method === "PUT" && url.pathname === "/api/r2/upload") {
      return handleUpload(request, env, cors, url);
    }

    return json({ error: "Not found" }, 404, cors);
  },
};

async function handlePresign(request, env, cors) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400, cors);
  }

  const { userId, docType, fileName, fileType, fileSize } = body;

  if (!userId || !docType || !fileName || !fileType || !fileSize) {
    return json(
      {
        error:
          "Missing required fields: userId, docType, fileName, fileType, fileSize",
      },
      400,
      cors,
    );
  }

  const rules = ALLOWED[docType];
  if (!rules) {
    return json(
      {
        error: `Invalid docType. Must be one of: ${Object.keys(ALLOWED).join(", ")}`,
      },
      400,
      cors,
    );
  }

  if (!rules.mimeTypes.includes(fileType)) {
    return json(
      {
        error: `Invalid file type for ${rules.label}. Allowed: ${rules.extensions.join(", ")}`,
      },
      400,
      cors,
    );
  }

  const ext = "." + fileName.split(".").pop().toLowerCase();
  if (!rules.extensions.includes(ext)) {
    return json(
      {
        error: `Invalid file extension for ${rules.label}. Allowed: ${rules.extensions.join(", ")}`,
      },
      400,
      cors,
    );
  }

  if (fileSize > rules.maxBytes) {
    return json(
      {
        error: `File too large for ${rules.label}. Maximum: ${rules.maxBytes / 1024 / 1024}MB`,
      },
      400,
      cors,
    );
  }

  const publicBase = env.R2_PUBLIC_URL?.replace(/\/$/, "");
  if (!publicBase) {
    return json(
      { error: "R2_PUBLIC_URL environment variable not set" },
      500,
      cors,
    );
  }

  const safeFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const storageKey = `${userId}/${docType}/${Date.now()}_${safeFileName}`;
  const publicUrl = `${publicBase}/${storageKey}`;

  return json({ storageKey, publicUrl }, 200, cors);
}

async function handleUpload(request, env, cors, url) {
  const storageKey = url.searchParams.get("key");
  if (!storageKey) {
    return json({ error: "Missing storage key" }, 400, cors);
  }

  try {
    const fileBuffer = await request.arrayBuffer();
    await env.DOCUMENTS_BUCKET.put(storageKey, fileBuffer, {
      httpMetadata: { contentType: request.headers.get("Content-Type") },
    });
    return json({ ok: true }, 200, cors);
  } catch (err) {
    console.error("R2 upload error:", err);
    return json({ error: "Failed to store file" }, 500, cors);
  }
}
