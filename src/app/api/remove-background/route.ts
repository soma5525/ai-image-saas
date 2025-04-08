import { NextResponse } from "next/server";

import axios from "axios";
import FormData from "form-data";
import sharp from "sharp";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("image") as File;

  if (!file) {
    return NextResponse.json(
      { error: "画像をアップロードしてください" },
      { status: 400 }
    );
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const optimizedInputImage = await sharp(buffer)
    .resize(1280, 720)
    .png({ quality: 80, compressionLevel: 9 })
    .toBuffer();

  try {
    const formData = new FormData();
    formData.append("image", optimizedInputImage, {
      filename: "image.png",
      contentType: "image/png",
    });
    formData.append("output_format", "png");

    const response = await axios.postForm(
      `https://api.stability.ai/v2beta/stable-image/edit/remove-background`,
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
