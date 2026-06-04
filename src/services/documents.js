import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase"; // your existing firebase.js

const WORKER_URL = "https://carejobsuk-documents.karabojomane.workers.dev";

export async function uploadDocument(file, docType, user) {
  const token = await user.getIdToken();

  // Step 1: validate + get storage key
  const presignRes = await fetch(`${WORKER_URL}/api/r2/presign`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      userId: user.uid,
      docType,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
    }),
  });

  const { storageKey, publicUrl, error } = await presignRes.json();
  if (error) throw new Error(error);

  // Step 2: stream file to R2
  await fetch(`${WORKER_URL}/api/r2/upload?key=${storageKey}`, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });

  // Step 3: save publicUrl to Firestore on the user's profile
  await updateDoc(doc(db, "users", user.uid), {
    [`documents.${docType}`]: publicUrl,
    [`documents.${docType}UpdatedAt`]: new Date(),
  });

  return publicUrl;
}