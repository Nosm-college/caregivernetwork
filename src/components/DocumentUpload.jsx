import { useState } from "react";
import { useAuth } from "../context/AuthContext"; // your existing auth context
import { uploadDocument } from "../services/documents";

export default function DocumentUpload() {
  const { user } = useAuth();
  const [status, setStatus] = useState("idle"); // idle | uploading | done | error
  const [error, setError] = useState(null);

  async function handleFileChange(e, docType) {
    const file = e.target.files[0];
    if (!file) return;

    setStatus("uploading");
    setError(null);

    try {
      const url = await uploadDocument(file, docType, user);
      console.log("Uploaded:", url);
      setStatus("done");
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  }

  return (
    <div>
      <label>
        Upload CV
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => handleFileChange(e, "cv")}
          disabled={status === "uploading"}
        />
      </label>

      <label>
        Upload Cover Letter
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => handleFileChange(e, "coverLetter")}
          disabled={status === "uploading"}
        />
      </label>

      {status === "uploading" && <p>Uploading...</p>}
      {status === "done" && <p>Upload complete.</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}