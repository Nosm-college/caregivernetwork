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
export async function uploadToR2(file, userId, docType) {
  const params = new URLSearchParams({ userId, docType, fileName: file.name });
  
  const res = await fetch(`${WORKER_ENDPOINT}?${params}`, {
    method: 'POST',
    headers: { 'Content-Type': file.type },
    body: file,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Upload failed');
  }

  const { publicUrl } = await res.json();
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
