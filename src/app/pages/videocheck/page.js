"use client";

import { useState } from "react";
import "../../../VideoSummarizerPage.css";

export default function VideoSummarizerPage() {
  /* ---------------- State ---------------- */
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  /* ---------------- File Handling ---------------- */
  const handleFileChange = (e) => {
    setError("");
    setSummary("");

    const file = e.target.files?.[0];
    if (!file) return setSelectedFile(null);

    const allowedTypes = ["video/mp4"];
    if (!allowedTypes.includes(file.type)) {
      setError("Invalid file type. Please select an MP4 video.");
      return setSelectedFile(null);
    }

    const maxSizeMB = 50;
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File is too large. Maximum size is ${maxSizeMB} MB.`);
      return setSelectedFile(null);
    }

    setSelectedFile(file);
  };

  /* ---------------- Submit Handler ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return setError("Please select a video file first.");

    setIsLoading(true);
    setError("");
    setSummary("");

    const formData = new FormData();
    formData.append("video", selectedFile);

    try {
      const res = await fetch("/api/SendingWorkoutToGPT", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "API error");

      setSummary(data.summary);
    } catch (err) {
      setError(err.message || "Failed to get summary. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <main className="page">
      <div className="card">
        <h1 className="title">Video Summarizer</h1>

        <form onSubmit={handleSubmit} className="form" encType="multipart/form-data">
          <label className="label">
            Select Video (MP4, ≤ 50 MB):
            <input
              type="file"
              accept="video/mp4"
              onChange={handleFileChange}
              disabled={isLoading}
              className="fileInput"
            />
          </label>

          <button
            type="submit"
            disabled={isLoading || !selectedFile}
            className="submitBtn"
          >
            {isLoading ? "Summarizing…" : "Get Summary"}
          </button>
        </form>

        {error && <p className="error">{error}</p>}

        {summary && (
          <div className="summaryBox">
            <h2 className="summaryTitle">Summary</h2>
            <p className="summaryText">{summary}</p>
          </div>
        )}
      </div>
    </main>
  );
}
