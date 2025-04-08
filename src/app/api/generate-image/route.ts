import { NextResponse } from "next/server";

import axios from "axios";
import FormData from "form-data";
import sharp from "sharp";

export async function POST(req: Request) {
  const { keyword } = await req.json();
  console.log("keyword", keyword);
  try {
    const payload = {
      prompt: `Create Image with ${keyword}`,
      output_format: "png",
    };

    const formData = new FormData();
    formData.append("prompt", payload.prompt);
    formData.append("output_format", payload.output_format);

    const response = await axios.postForm(
      `https://api.stability.ai/v2beta/stable-image/generate/core`,
      formData,
      {
        validateStatus: undefined,
        responseType: "arraybuffer",
        headers: {
          Authorization: `Bearer ${process.env.STABLE_DIFFUSION_API_KEY}`,
          Accept: "image/*",
        },
      }
    );

    if (response.status !== 200) {
      throw new Error(`${response.status}: ${response.data.toString()}`);
    }

    //画像の最適化
    const optimizedImage = await sharp(response.data)
      .resize(1280, 720)
      .png({ quality: 80, compressionLevel: 9 })
      .toBuffer();

    // Base64エンコーディング
    const base64 = optimizedImage.toString("base64");
    const imageUrl = `data:image/png;base64,${base64}`;

    return NextResponse.json({
      imageUrl,
    });
  } catch (error) {
    console.log("Error generating image", error);
    return NextResponse.json(
      {
        error: "Failed to generate image",
      },
      { status: 500 }
    );
  }
}
