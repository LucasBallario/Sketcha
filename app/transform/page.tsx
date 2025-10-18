"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import LoadingPage from "./components/LoadingPage"
import { useRouter } from "next/navigation";

export default function Page() {
  const [selectedImage, setSelectedImage] = useState(null)
  const [showStyles, setShowStyles] = useState(false)
  const [selectedStyles, setSelectedStyles] = useState(null)
  const [selectedMaterials, setSelectedMaterials] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [renderedImage, setRenderedImage] = useState(null)
  const router = useRouter();


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

  const generatePrompt = () => {
    return `Professional architectural rendering of a restaurant interior based on the provided sketch.

STYLE: ${styles[selectedStyles]}
PRIMARY MATERIALS: ${materials[selectedMaterials]}
Render as if photographed by a professional architectural photographer.`
  }

  const handleChangeImage = () => {
    setSelectedImage(null)
    setRenderedImage(null)
  }

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000)
  }, [])

  const handleGenerateRender = async () => {
    if (!selectedImage || !selectedStyles || !selectedMaterials) {
      alert("Please upload an image and select style + material before generating.")
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
        console.error("Replicate error:", data.error)
        alert("Something went wrong while generating the render.")
      } else {
        router.push(`/result?image=${encodeURIComponent(String(data.image))}`);
      }
    } catch (error) {
      console.error("Error generating render:", error)
      alert("An unexpected error occurred.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) return <LoadingPage />

  return (
    <div>
      {!selectedImage && (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
          <div className="w-full max-w-2xl space-y-8">
            <div className="text-center space-y-3">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground">
                Transform your Sketch
              </h1>
              <p className="text-lg text-muted-foreground max-w-md mx-auto">
                Upload your sketch and watch it come to life
              </p>
            </div>

            <div className="flex flex-col items-center justify-center space-y-4 bg-card border-2 border-border rounded-2xl p-12 shadow-lg">
              <label className="relative cursor-pointer">
                <input
                  type="file"
                  className="sr-only"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0]
                    if (file) {
                      const imageUrl = URL.createObjectURL(file)
                      setSelectedImage(imageUrl)
                      setShowStyles(true)
                    }
                  }}
                />
                <span className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground font-semibold text-lg rounded-xl hover:bg-primary/90 transition-all duration-200 shadow-xl hover:scale-105 active:scale-95">
                  Choose File
                </span>
              </label>
              <p className="text-xs text-muted-foreground">
                Supports: JPG, PNG, SVG, WebP (Max 10MB)
              </p>
            </div>
          </div>
        </div>
      )}

      {selectedImage && (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 py-16">
          <div className="bg-card border border-border rounded-2xl shadow-2xl p-10 max-w-6xl w-full flex flex-col md:flex-row items-center gap-14">
            <div className="w-full md:w-1/2 flex flex-col gap-6">
              <h2 className="text-3xl font-semibold text-foreground text-center md:text-left">
                Customize your restaurant design
              </h2>

              <select
                onChange={(e) => setSelectedMaterials(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-800 text-white rounded-lg border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-400 hover:bg-zinc-700 transition-colors text-lg"
              >
                <option value="">Select main material</option>
                {Object.entries(materials).map(([key]) => (
                  <option key={key} value={key}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </option>
                ))}
              </select>

              <select
                onChange={(e) => setSelectedStyles(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-800 text-white rounded-lg border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-400 hover:bg-zinc-700 transition-colors text-lg"
              >
                <option value="">Select preferred style</option>
                {Object.entries(styles).map(([key]) => (
                  <option key={key} value={key}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </option>
                ))}
              </select>

              <button
                onClick={handleGenerateRender}
                className="mt-4 px-8 py-4 bg-primary text-primary-foreground font-semibold text-lg rounded-xl hover:bg-primary/90 transition-all duration-200 shadow-md hover:scale-105 active:scale-95"
              >
                Generate Render
              </button>
            </div>

            <div className="w-full md:w-1/2 relative flex flex-col items-center gap-6">
              <button
                onClick={handleChangeImage}
                className="absolute top-4 right-4 px-3 py-2 bg-black/50 text-white text-sm rounded-md border border-white/20 backdrop-blur-sm hover:bg-black/40 transition-all duration-200"
              >
                Change Image
              </button>

              <Image
                className="rounded-xl shadow-xl border border-border"
                src={selectedImage}
                alt="Preview"
                height={500}
                width={500}
              />

              {renderedImage && (
                <div className="mt-8 w-full flex flex-col items-center">
                  <h3 className="text-xl font-semibold mb-4 text-foreground">
                    Generated Render
                  </h3>
                  <Image
                    className="rounded-xl shadow-xl border border-border"
                    src={renderedImage}
                    alt="Generated Render"
                    height={500}
                    width={500}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
