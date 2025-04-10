"use server";
import { decrementUserCredits, getUserCredits } from "@/lib/credits";
import { GenerateImageState, RemoveBackgroundState } from "@/types/actions";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function generateImage(
  state: GenerateImageState,
  formData: FormData
): Promise<GenerateImageState> {
  const user = await currentUser();
  if (!user) {
    return {
      status: "error",
      error: "ユーザーが見つかりません",
    };
  }

  const credits = await getUserCredits();
  if (credits === null || credits < 1) {
    redirect("/dashboard/plan?reason=insufficient_credits");
  }

  try {
    const keyword = formData.get("keyword");

    if (!keyword || typeof keyword !== "string") {
      return {
        status: "error",
        error: "キーワードを入力してください",
      };
    }

    const response = await fetch(`${process.env.BASE_URL}/api/generate-image`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ keyword }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        status: "error",
        error: data.error || "画像の生成に失敗しました",
        details: data.details,
      };
    }

    await decrementUserCredits(user.id);
    revalidatePath("/dashboard");

    return {
      status: "success",
      imageUrl: data.imageUrl,
      keyword: keyword,
    };
  } catch (error) {
    console.error("Image generation error:", error);
    return {
      status: "error",
      error: "画像の生成中にエラーが発生しました",
      details: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function removeBackground(
  state: RemoveBackgroundState,
  formData: FormData
): Promise<RemoveBackgroundState> {
  const user = await currentUser();
  if (!user) {
    return {
      status: "error",
      error: "ユーザーが見つかりません",
    };
  }

  const credits = await getUserCredits();
  if (credits === null || credits < 1) {
    redirect("/dashboard/plan?reason=insufficient_credits");
  }

  const image = formData.get("image");

  if (!image) {
    return {
      status: "error",
      error: "画像をアップロードしてください",
    };
  }

  try {
    const response = await fetch(
      `${process.env.BASE_URL}/api/remove-background`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        status: "error",
        error: data.error || "画像の背景削除に失敗しました",
        details: data.details,
      };
    }

    await decrementUserCredits(user.id);
    revalidatePath("/dashboard");

    return {
      status: "success",
      imageUrl: data.imageUrl,
    };
  } catch (error) {
    console.error("Background removal error:", error);
    return {
      status: "error",
      error: "画像の背景削除中にエラーが発生しました",
      details: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
