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
    const image = formData.get("image"); // Blob del <input type="file">

    if (!prompt || !image) {
      return NextResponse.json(
        { error: "Missing prompt or image" },
        { status: 400 }
      );
    }

    // Leer el blob y generar un data URI (válido como "uri" según el Schema)
    const bytes = await image.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const mime = image.type || "image/png"; // por las dudas
    const dataUri = `data:${mime};base64,${base64}`;

    console.log("🟡 Prompt (first 180):", String(prompt).slice(0, 180) + "…");
    console.log("🟡 Image type/size:", mime, image.size);
    console.log("🧩 dataUri prefix ok:", dataUri.startsWith("data:image"));

    const input = {
      prompt:
        String(prompt) +
        "\n\nStrictly preserve the original geometry, perspective, furniture placement and camera. Do not change the layout.",
      image_input: [dataUri],                 
      aspect_ratio: "match_input_image",
      size: "2K",                             
      max_images: 1,
      sequential_image_generation: "disabled",
    };

    console.log("🧠 Payload check:", {
      image_input_len: input.image_input.length,
      aspect_ratio: input.aspect_ratio,
      size: input.size,
      seq: input.sequential_image_generation,
    });

    // Crear predicción y hacer polling hasta terminar
    let prediction = await replicate.predictions.create({
      model: "bytedance/seedream-4", // usa la versión por defecto actual
      input,
    });

    while (prediction.status !== "succeeded" && prediction.status !== "failed") {
      console.log("⏳ Render status:", prediction.status);
      await new Promise((r) => setTimeout(r, 2000));
      prediction = await replicate.predictions.get(prediction.id);
    }

    if (prediction.status === "failed") {
      console.error("❌ Prediction failed:", prediction?.error || "(no error payload)");
      return NextResponse.json(
        { error: "Render generation failed on model side" },
        { status: 500 }
      );
    }

    const output = prediction.output;
    const finalImage = Array.isArray(output) ? output[0] : output;
    console.log("✅ Rendered image URL:", finalImage);

    return NextResponse.json({ image: finalImage });
  } catch (error) {
    console.error("❌ Error generating render:");
    console.error("Message:", error.message);
    return NextResponse.json(
      { error: "Render generation failed", details: error.message },
      { status: 500 }
    );
  }
}
