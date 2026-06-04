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

  // Step 2: PUT file directly to worker
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
