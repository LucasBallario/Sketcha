"use client"

import { useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

export default function ResultPage() {
  const searchParams = useSearchParams()
  const rawImage = searchParams.get("image")
  const image = rawImage ? decodeURIComponent(rawImage) : null

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
      <Image
        src={image}
        alt="Generated Render"
        width={800}
        height={800}
        className="rounded-xl shadow-xl border border-border"
      />
      <div className="mt-6 flex gap-4">
        <a
          href={image}
          download
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90"
        >
          Download Render
        </a>
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
