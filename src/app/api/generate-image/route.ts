import { NextResponse } from "next/server";

import axios from "axios";
import FormData from "form-data";
import sharp from "sharp";

export const maxDuration = 300; // 5分のタイムアウト

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
        timeout: 60000, // 60秒のタイムアウト
      }
    );

    if (response.status !== 200) {
      console.error("API Error:", response.status, response.data.toString());
      return NextResponse.json(
        {
          error: "画像生成に失敗しました。もう一度お試しください。",
          details: response.data.toString(),
        },
        { status: response.status }
      );
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
    console.error("Error generating image:", error);

    if (axios.isAxiosError(error)) {
      if (error.code === "ECONNABORTED") {
        return NextResponse.json(
          {
            error: "画像生成がタイムアウトしました。もう一度お試しください。",
          },
          { status: 504 }
        );
      }

      return NextResponse.json(
        {
          error: "画像生成に失敗しました。",
          details: error.message,
        },
        { status: error.response?.status || 500 }
      );
    }

    return NextResponse.json(
      {
        error: "予期せぬエラーが発生しました。",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
