"use client"

import ProtectedRoute from "../../components/ProtectedRoute"
import { useEffect, useState } from "react"
import Image from "next/image"
import LoadingPage from "./components/LoadingPage"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { useCredits } from "@/hooks/useCredits"

export default function Page() {
  return (
    <ProtectedRoute>
      <TransformPageContent />
    </ProtectedRoute>
  )
}

function TransformPageContent() {
  const router = useRouter()

  const { user } = useAuth() as any
  const userId = user ? String(user.id) : null

  const { credits, loading: creditsLoading, decrementCredits } =
    useCredits(userId)

  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedStyles, setSelectedStyles] = useState<string | null>(null)
  const [selectedMaterials, setSelectedMaterials] = useState<string | null>(null)
  const [renderedImage, setRenderedImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const styles = {
    modern: "Modern minimalist Scandinavian",
    industrial: "Industrial loft with urban edge",
    luxury: "Upscale fine dining elegance",
    rustic: "Rustic countryside farmhouse",
    coastal: "Mediterranean coastal",
    contemporary: "Sleek contemporary urban",
    zen: "Minimalist Japanese Zen",
    bohemian: "Bohemian eclectic artistic",
    artdeco: "1920s Art Deco glamour",
    tropical: "Tropical island paradise",
  }

  const materials = {
    wood: "natural oak wood, wooden textures, timber finishes, wood grain details",
    marble: "polished marble surfaces, marble countertops, luxurious stone finishes",
    industrial: "exposed brick, concrete floors, raw steel beams, reclaimed wood, metal fixtures",
    glass: "glass panels, transparent surfaces, mirrored accents, crystal elements",
    leather: "premium leather upholstery, leather seating, tufted leather banquettes",
    fabric: "soft fabric upholstery, linen textures, velvet seating, textile elements",
    metal: "brushed metal fixtures, stainless steel accents, brass details, copper elements",
    stone: "natural stone walls, stone flooring, rock textures, slate surfaces",
    bamboo: "natural bamboo, sustainable materials, bamboo accents, eco-friendly finishes",
    mixed: "eclectic mix of materials, varied textures, diverse finishes, complementary materials",
  }

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000)
  }, [])

  const generatePrompt = () => `
    Professional architectural rendering of a restaurant interior...

    STYLE: ${selectedStyles}
    PRIMARY MATERIALS: ${selectedMaterials}

    Render as if photographed by a professional architectural photographer.
  `

  const handleGenerateRender = async () => {
    if (!selectedImage || !selectedStyles || !selectedMaterials) {
      alert("Please upload an image and select style + material.")
      return
    }

    if (!userId) {
      alert("Please log in first.")
      return
    }

    if (creditsLoading) {
      alert("Checking your credits...")
      return
    }

    if (!credits || credits <= 0) {
      alert("You have no credits left!")
      return
    }

    try {
      setIsLoading(true)

      const formData = new FormData()
      formData.append("prompt", generatePrompt())

      const response = await fetch(selectedImage)
      const blob = await response.blob()
      formData.append("image", blob, "sketch.png")

      const res = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()

      if (data.error) {
        console.error(data.error)
        alert("Generation failed.")
      } else {
        await decrementCredits()
        router.push(`/result?image=${encodeURIComponent(String(data.image))}`)
      }
    } catch (err) {
      console.error(err)
      alert("Unexpected error.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) return <LoadingPage />

  return (
    <div>
      {!selectedImage && (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
          <div className="w-full max-w-2xl">
            <h1 className="text-5xl font-bold text-center">Transform your Sketch</h1>
            <p className="text-center text-muted-foreground mt-2">
              Upload your sketch and watch it come to life
            </p>

            <div className="mt-8 flex flex-col items-center bg-card p-12 border rounded-2xl shadow-lg">
              <label className="cursor-pointer">
                <input
                  type="file"
                  className="sr-only"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      const imageUrl = URL.createObjectURL(file)
                      setSelectedImage(imageUrl)
                    }
                  }}
                />
                <span className="px-8 py-4 bg-primary text-white rounded-xl shadow hover:bg-primary/90">
                  Choose File
                </span>
              </label>
            </div>
          </div>
        </div>
      )}

      {selectedImage && (
        <div className="min-h-screen flex flex-col items-center px-6 py-16">
          <div className="bg-card p-10 border rounded-2xl shadow-2xl max-w-6xl w-full flex flex-col md:flex-row gap-14">
            <div className="w-full md:w-1/2 flex flex-col gap-6">
              <h2 className="text-3xl font-semibold">Customize your design</h2>

              <p className="text-gray-700">
                Credits left: <span className="font-semibold">{creditsLoading ? "…" : credits ?? 0}</span>
              </p>

              <button
                onClick={() => router.push("/buy-credits")}
                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-zinc-700"
              >
                Buy Credits
              </button>

              <select
                onChange={(e) => setSelectedMaterials(e.target.value)}
                className="px-4 py-3 bg-zinc-800 text-white rounded-lg border"
              >
                <option value="">Select material</option>
                {Object.keys(materials).map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>

              <select
                onChange={(e) => setSelectedStyles(e.target.value)}
                className="px-4 py-3 bg-zinc-800 text-white rounded-lg border"
              >
                <option value="">Select style</option>
                {Object.keys(styles).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>

              <button
                onClick={handleGenerateRender}
                disabled={!selectedImage || !selectedStyles || !selectedMaterials || creditsLoading || !credits}
                className={`mt-4 px-8 py-4 rounded-xl ${
                  !credits ? "bg-gray-400 cursor-not-allowed" : "bg-primary text-white hover:bg-primary/90"
                }`}
              >
                Generate Render
              </button>
            </div>

            <div className="w-full md:w-1/2 relative">
              <Image
                src={selectedImage}
                alt="Preview"
                width={500}
                height={500}
                className="rounded-xl border shadow-xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
