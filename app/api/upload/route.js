import { NextResponse } from "next/server";
import multer from "multer";
import fs from "fs";
import path from "path";
import { Mistral } from "@mistralai/mistralai";
import dotenv from "dotenv";

dotenv.config();

const upload = multer({ dest: "uploads/" });
export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  try {
    const apiKey = process.env.MISTRAL_API_KEY;
    const client = new Mistral({ apiKey });

    const fileNameWithoutExt = file.name.split(".").slice(0, -1).join(".");
    const buffer = await file.arrayBuffer();
    const uploadedPdf = await client.files.upload({
      file: {
        fileName: file.name,
        content: Buffer.from(buffer),
      },
      purpose: "ocr",
    });

    const signedUrl = await client.files.getSignedUrl({
      fileId: uploadedPdf.id,
    });

    const ocrResponse = await client.ocr.process({
      model: "mistral-ocr-latest",
      document: {
        type: "document_url",
        documentUrl: signedUrl.url,
      },
    });

    return NextResponse.json({
      message: "OCR processing complete!",
      ocrData: ocrResponse,
      fileName: `${fileNameWithoutExt}.json`,
    });
  } catch (error) {
    console.error("OCR processing error:", error);
    return NextResponse.json({ error: "Failed to process OCR" }, { status: 500 });
  }
}

