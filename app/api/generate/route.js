import { NextResponse } from "next/server"
import Replicate from "replicate"

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

export async function POST(request) {
  try {
    const formData = await request.formData()
    const prompt = formData.get("prompt")
    const image = formData.get("image")

    if (!prompt || !image) {
      return NextResponse.json(
        { error: "Missing prompt or image" },
        { status: 400 }
      )
    }

    // Convertir imagen a base64
    const bytes = await image.arrayBuffer()
    const base64Image = Buffer.from(bytes).toString("base64")

    // Ejecutar el modelo en Replicate
    const output = await replicate.run("bytedance/seedream-4", {
      input: {
        prompt: prompt,
        input_image: "data:image/png;base64," + base64Image,
        output_quality: "high",
      },
    })

    // Asegurarse de obtener correctamente la URL del render
    const imageUrl = Array.isArray(output) ? output[0] : output

    return NextResponse.json({ image: imageUrl })
  } catch (error) {
    console.error("Error generating render:", error)
    return NextResponse.json(
      { error: "Render generation failed", details: error.message },
      { status: 500 }
    )
  }
}
