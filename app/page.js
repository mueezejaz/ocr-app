import FileUpload from "../components/FileUpload.js"
import Head from "next/head.js";
export default function Home() {
  return (
    <>
<Head>
        <title>OCR PDF Converter  Extract Text from PDFs</title>
</Head>
    <main>
      <FileUpload />
    </main>
    </>
  );
}

