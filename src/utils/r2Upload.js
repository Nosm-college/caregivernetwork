const WORKER_BASE = "https://carejobsuk-documents.karabojomane.workers.dev";

export async function uploadToR2(file, userId, docType, onProgress) {
  // Step 1: validate & get storageKey
  const presignRes = await fetch(`${WORKER_BASE}/api/r2/presign`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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
    throw new Error(err.error || "Failed to validate upload");
  }

  const { storageKey, publicUrl } = await presignRes.json();

  // Step 2: PUT file to worker
  await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(
      "PUT",
      `${WORKER_BASE}/api/r2/upload?key=${encodeURIComponent(storageKey)}`,
    );
    xhr.setRequestHeader("Content-Type", file.type);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () =>
      xhr.status === 200
        ? resolve()
        : reject(new Error(`Upload failed with status ${xhr.status}`));
    xhr.onerror = () => reject(new Error("Network error during upload"));
    xhr.send(file);
  });

  return publicUrl;
}

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

export function validateFile(file, docType) {
  const rules = ALLOWED_TYPES[docType];
  if (!rules) return "Unknown document type";

  if (!rules.mimeTypes.includes(file.type)) {
    return `Invalid file type. Please upload a ${rules.label}`;
  }

  if (file.size > rules.maxMB * 1024 * 1024) {
    return `File too large. Maximum size for this document is ${rules.maxMB}MB`;
  }

  const ext = "." + file.name.split(".").pop().toLowerCase();
  if (!rules.accept.includes(ext)) {
    return `Invalid file extension. Allowed: ${rules.accept}`;
  }

  return null;
}

export function getAcceptString(docType) {
  return ALLOWED_TYPES[docType]?.accept || "*";
}
