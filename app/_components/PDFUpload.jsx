"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

export default function PDFUpload() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type === "application/pdf") {
      setFile(selected);
    } else {
      setStatus("Please select a valid PDF file.");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setStatus("No file selected.");
      return;
    }

    setStatus("Uploading...");

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const res = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed.");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "converted.zip"; // or first JPG if single
      a.click();
      a.remove();
      setStatus("Success! Download started.");
    } catch (err) {
      console.error(err);
      setStatus("Upload failed.");
    }
  };

  return (
    <div>
      <h2 className="font-bold text-4xl text-white">PDF to JPG Converter</h2>
      <div className="max-w-md mx-auto mt-10 p-6 border rounded-2xl shadow-lg bg-slate-200">
        <div
          className="border-2 border-dashed border-slate-300 p-6 rounded-lg text-center cursor-pointer"
          onClick={() => document.getElementById("pdfInput").click()}
        >
          <p className="text-gray-600">Click or drag a PDF here to upload</p>
          {file && <p className="mt-2 font-medium">{file.name}</p>}
          <input
            id="pdfInput"
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            hidden
          />
        </div>

        <div className="mt-4">
          <Button
            className="w-full bg-slate-700 hover:bg-slate-800"
            onClick={handleUpload}
          >
            Convert to JPG
          </Button>
          {status && <p className="text-sm mt-2 text-center">{status}</p>}
        </div>
      </div>
    </div>
  );
}
