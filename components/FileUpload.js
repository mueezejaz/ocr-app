"use client";
import React, { useState, useCallback, useRef } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { saveAs } from "file-saver";

const FileUpload = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [ocrData, setOcrData] = useState(null);
  const [jsonFileName, setJsonFileName] = useState("ocr_output.json");
  const converterRef = useRef(null);

  const handleFile = useCallback((file) => {
    if (loading) return;
    setMessage("");
    setOcrData(null);
    setLoading(true);

    const fileType = file.name.split(".").pop().toLowerCase();

    if (fileType === "pdf") {
      sendToBackend(file, file.name);
    } else {
      setMessage("❌ Unsupported file type. Please upload a PDF file.");
      setLoading(false);
      converterRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [loading]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => handleFile(acceptedFiles[0]),
    accept: "application/pdf",
    multiple: false,
    disabled: loading,
  });

  const sendToBackend = async (pdfFile, originalFileName) => {
    setMessage("⚙️ Uploading file...");
    const formData = new FormData();
    formData.append("file", pdfFile);

    try {
      const response = await axios.post("/api/upload", formData);
      setOcrData(response.data.ocrData);
      setMessage("✅ File processed successfully! Ready to download.");
      setJsonFileName(originalFileName.replace(/\.[^/.]+$/, "") + ".json");
    } catch (error) {
      console.error("Upload failed", error);
      setMessage("❌ Upload failed.");
    }
    setLoading(false);
  };

  const downloadJson = () => {
    if (!ocrData) return;
    const jsonBlob = new Blob([JSON.stringify(ocrData, null, 2)], { type: "application/json" });
    saveAs(jsonBlob, jsonFileName);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-blue-200 px-4 py-10">
      <div
        {...getRootProps()}
        className={`w-full max-w-md p-6 border-2 border-dashed ${
          loading ? "border-gray-300 opacity-50 cursor-not-allowed" : "border-gray-500 hover:bg-gray-100"
        } flex flex-col items-center justify-center rounded-lg bg-white shadow-lg transition duration-200`}
      >
        <input {...getInputProps()} disabled={loading} />
        <p className="text-gray-700 text-center text-lg font-semibold">
          {loading ? "Processing..." : "Drag & Drop your PDF file here or"}
          {!loading && <span className="text-blue-600 font-bold"> click to browse</span>}
        </p>
      </div>

      <button 
        onClick={() => document.querySelector("input[type='file']").click()} 
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
      >
        Select File Manually
      </button>

      {message && <p className="mt-4 text-lg font-semibold text-red-600">{message}</p>}

      {ocrData && (
        <div className="mt-6 flex flex-col items-center">
          <button
            onClick={downloadJson}
            className="bg-green-500 text-white text-lg px-6 py-2 rounded-lg shadow-lg hover:bg-green-600 transition duration-200"
          >
            📥 Download File
          </button>
      <p className="mt-2 text-gray-600 text-sm max-w-xs text-center">
        You can upload this file to any AI tool and ask questions about the content of the PDF you uploaded.
      </p>   </div>
      )}
<div className="mt-10 bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg text-center border border-gray-200">
  <h2 className="text-xl font-extrabold text-gray-900">Convert Other File Types to PDF</h2>
  <p className="text-gray-600 text-sm mt-3">Use these tools to convert different file types into PDF:</p>

  <ul className="mt-5 space-y-4 text-left">
    {[
      { name: "JPG to PDF", url: "https://www.ilovepdf.com/jpg_to_pdf", desc: "Convert images to PDF." },
      { name: "Word to PDF", url: "https://www.ilovepdf.com/word_to_pdf", desc: "Convert DOCX to PDF." },
      { name: "PPT to PDF", url: "https://smallpdf.com/ppt-to-pdf", desc: "Convert PowerPoint to PDF." },
    ].map(({ name, url, desc }) => (
      <li key={name} className="flex items-center space-x-3">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 font-semibold hover:text-blue-700 transition duration-200"
        >
          {name}
        </a>
        <span className="text-gray-500 text-sm">— {desc}</span>
      </li>
    ))}
  </ul>
</div>

    </div>
  );
};

export default FileUpload;

