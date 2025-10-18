console.log("🔐 Token exists:", !!process.env.REPLICATE_API_TOKEN);

import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request) {
  try {
    const formData = await request.formData();
    const prompt = formData.get("prompt");
    const image = formData.get("image");

    if (!prompt || !image) {
      return NextResponse.json(
        { error: "Missing prompt or image" },
        { status: 400 }
      );
    }

    // Convertir imagen a base64
    const bytes = await image.arrayBuffer();
    const base64Image = Buffer.from(bytes).toString("base64");

    console.log("🟡 Prompt:", prompt);
    console.log("🟡 Image size:", bytes.byteLength);
    console.log("🟡 Sending request to Replicate...");

    // Crear la predicción
    let prediction = await replicate.predictions.create({
      model:
        "bytedance/seedream-4:e6cff243d7a5e551e1ca2b4bf291413d649c9f1417f9a52c1c0a4fbc36027b83",
      input: {
        prompt: prompt,
        input_image: "data:image/png;base64," + base64Image,
        output_quality: "high",
      },
    });

    // Esperar hasta que la predicción termine
    while (prediction.status !== "succeeded" && prediction.status !== "failed") {
      console.log("⏳ Render status:", prediction.status);
      await new Promise((r) => setTimeout(r, 2000));
      prediction = await replicate.predictions.get(prediction.id);
    }

    if (prediction.status === "failed") {
      throw new Error("The render failed on Replicate side.");
    }

    // Obtener la URL final del render
    const output = prediction.output;
    const imageUrl = Array.isArray(output) ? output[0] : output;

    console.log("✅ Rendered image URL:", imageUrl);

    return NextResponse.json({ image: imageUrl });
  } catch (error) {
    console.error("❌ Error generating render:");
    console.error("Message:", error.message);
    console.error("Stack:", error.stack);
    console.error("Full error object:", error);

    return NextResponse.json(
      {
        error: "Render generation failed",
        details: error.message || JSON.stringify(error),
      },
      { status: 500 }
    );
  }
}
