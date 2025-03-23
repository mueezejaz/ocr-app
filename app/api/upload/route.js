import { NextResponse } from "next/server";
import { Mistral } from "@mistralai/mistralai";
import dotenv from "dotenv";

dotenv.config();

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const apiKey = process.env.MISTRAL_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing API Key" }, { status: 500 });
    }
    const client = new Mistral({ apiKey });

    const fileName = file.name || "uploaded_file.pdf";
    const fileNameWithoutExt = fileName.replace(/\.[^/.]+$/, "");

    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadedPdf = await client.files.upload({
      file: {
        fileName,
        content: buffer,
      },
      purpose: "ocr",
    });

    const signedUrl = await client.files.getSignedUrl({ fileId: uploadedPdf.id });

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


