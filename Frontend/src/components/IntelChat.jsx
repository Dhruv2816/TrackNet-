import React, { useState } from "react";
import Inputs from "./Inputs";
import Chat from "./Chat";

export default function IntelChat() {
  // 1️⃣ Lifted state
  const [files, setFiles] = useState([]);
  const [intelText, setIntelText] = useState("");
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 2️⃣ Helper to read File objects as text
  const readFilesAsText = (files) =>
    Promise.all(
      files.map(
        (file) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(reader.error);
            reader.readAsText(file);
          })
      )
    );

  // 3️⃣ Submission: read files → POST JSON → update response/error
  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setResponse("");
    try {
      const fileContents = await readFilesAsText(files);
      const payload = {
        files: fileContents,
        typedIntel: intelText,
        mapKeypoints: [],  // wire up if you need
        query,
      };
      const res = await fetch("http://localhost:5000/api/process-intel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      setResponse(data.response || "No response");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto my-20 max-w-screen-lg px-4 space-y-8">
      <Inputs
        files={files}
        setFiles={setFiles}
        intelText={intelText}
        setIntelText={setIntelText}
      />
      <Chat
        query={query}
        setQuery={setQuery}
        onSubmit={handleSubmit}
        loading={loading}
        error={error}
        response={response}
      />
    </div>
  );
}
