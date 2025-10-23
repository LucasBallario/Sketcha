'use client'

import { useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

export default function ResultContent() {
  const searchParams = useSearchParams()
  const rawImage = searchParams.get("image")
  const image = rawImage ? decodeURIComponent(rawImage) : null

  const handleDownload = async () => {
    if (!image) return;

    try {
      const response = await fetch(image);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "rendered_design.jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("❌ Error downloading image:", error);
      alert("Failed to download the image. Please try again.");
    }
  };

  if (!image || !image.startsWith("http")) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-lg mb-4">No valid image found.</p>
        <Link href="/transform" className="text-blue-500 hover:underline">
          Go back and try again
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-8">
      <h1 className="text-3xl font-bold mb-6">Your Rendered Design</h1>
      <div className="relative w-full md:w-1/2 max-h-[70vh] overflow-hidden">
        <Image
          src={image}
          alt="Generated Render"
          width={800}
          height={800}
          className="rounded-xl shadow-xl border border-border object-contain w-auto h-auto max-h-[70vh]"
        />
      </div>

      <div className="mt-6 flex gap-4">
        <button
          onClick={handleDownload}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90"
        >
          Download Render
        </button>
        <Link
          href="/transform"
          className="px-6 py-3 bg-zinc-700 text-white rounded-lg font-semibold hover:bg-zinc-600"
        >
          Generate Another
        </Link>
      </div>
    </div>
  )
}
