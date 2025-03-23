import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "OCR PDF Converter - Extract Text from PDFs",
  description: "Easily extract text from PDFs using AI-powered OCR technology. Convert scanned PDFs and images into editable text quickly and efficiently.",
  keywords: "OCR, PDF to text, extract text from PDF, image to text, AI OCR converter, scanned document converter",
  author: "Your Project Name",
  robots: "index, follow",
  og: {
    title: "OCR PDF Converter - Extract Text from PDFs",
    description: "Extract text from PDFs and images with AI-powered OCR technology. Fast, efficient, and accurate text recognition.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
