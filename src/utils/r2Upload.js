/**
 * r2Upload.js  (updated)
 * Uploads a file to Cloudflare R2 via the Worker presign endpoint.
 *
 * Flow:
 *   1. POST /api/r2/presign  → Worker validates type/size, returns { uploadUrl, publicUrl }
 *   2. PUT file directly to R2 using the presigned URL (with XHR for progress)
 *   3. Return publicUrl to caller so it can be saved to Firestore
 */

const WORKER_ENDPOINT = import.meta.env.VITE_R2_PRESIGN_ENDPOINT;

/**
 * @param {File}     file        - The File object to upload
 * @param {string}   userId      - Firebase UID
 * @param {string}   docType     - 'cv' | 'coverLetter' | 'careCertificate' | 'references'
 * @param {function} onProgress  - optional callback(percent: number)
 * @returns {Promise<string>}    - Public URL of the uploaded file
 */
export async function uploadToR2(file, userId, docType, onProgress) {
  // Step 1: Get presigned URL from worker (JSON body, not query params)
  const presignRes = await fetch(`${WORKER_ENDPOINT}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId,
      docType,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
    }),
  });

  if (!presignRes.ok) {
    const err = await presignRes.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to get upload URL');
  }

  const { uploadUrl, publicUrl } = await presignRes.json();

  // Step 2: PUT file directly to R2 using presigned URL (XHR for progress)
  await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', uploadUrl);
    xhr.setRequestHeader('Content-Type', file.type);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () =>
      xhr.status === 200
        ? resolve()
        : reject(new Error(`Upload failed with status ${xhr.status}`));
    xhr.onerror = () => reject(new Error('Network error during upload'));
    xhr.send(file);
  });

  return publicUrl;
}
// ── Client-side validation (fast feedback before hitting the Worker) ──

export const ALLOWED_TYPES = {
  cv: {
    accept: ".pdf,.doc,.docx",
    mimeTypes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    label: "PDF or Word document (.pdf, .doc, .docx)",
    maxMB: 5,
  },
  coverLetter: {
    accept: ".pdf,.doc,.docx",
    mimeTypes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    label: "PDF or Word document (.pdf, .doc, .docx)",
    maxMB: 3,
  },
  careCertificate: {
    accept: ".pdf,.png,.jpg,.jpeg",
    mimeTypes: ["application/pdf", "image/png", "image/jpeg"],
    label: "PDF or image (.pdf, .png, .jpg)",
    maxMB: 10,
  },
  references: {
    accept: ".pdf,.doc,.docx",
    mimeTypes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    label: "PDF or Word document (.pdf, .doc, .docx)",
    maxMB: 5,
  },
};

/**
 * Returns an error string, or null if the file is valid.
 */
export function validateFile(file, docType) {
  const rules = ALLOWED_TYPES[docType];
  if (!rules) return "Unknown document type";

  // Check MIME type (most reliable)
  if (!rules.mimeTypes.includes(file.type)) {
    return `Invalid file type. Please upload a ${rules.label}`;
  }

  // Check size
  if (file.size > rules.maxMB * 1024 * 1024) {
    return `File too large. Maximum size for this document is ${rules.maxMB}MB`;
  }

  // Check extension as a secondary guard
  const ext = "." + file.name.split(".").pop().toLowerCase();
  if (!rules.accept.includes(ext)) {
    return `Invalid file extension. Allowed: ${rules.accept}`;
  }

  return null; // valid
}

/**
 * Helper: get the accept string for an <input type="file"> for a given docType
 */
export function getAcceptString(docType) {
  return ALLOWED_TYPES[docType]?.accept || "*";
}
