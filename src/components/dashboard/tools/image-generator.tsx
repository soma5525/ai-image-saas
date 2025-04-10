"use client";

import { generateImage } from "@/actions/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState } from "react";
import { GenerateImageState } from "@/types/actions";
import { Download, Loader, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { SignInButton, useUser } from "@clerk/nextjs";
import Image from "next/image";

const initialState: GenerateImageState = {
  status: "idle",
};

const ImageGenerator = () => {
  const { isSignedIn } = useUser();

  const [state, formAction, pending] = useActionState(
    generateImage,
    initialState
  );

  const handleDownload = () => {
    if (!state.imageUrl) {
      return;
    }
    try {
      const base64Data = state.imageUrl.split(",")[1];
      const blob = new Blob([Buffer.from(base64Data, "base64")], {
        type: "image/png",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${state.keyword}.png`;
      document.body.appendChild(link);
      link.click();

      // 一時的なリンクを削除
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("画像をダウンロードしました");
    } catch (error) {
      console.error("Download error", error);
      toast.error("画像のダウンロードに失敗しました");
    }
  };

  // エラーが発生した場合のトースト通知
  if (state.status === "error" && state.error) {
    toast.error(state.error, {
      description: state.details,
    });
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="keyword">キーワード</Label>
            <Input
              id="keyword"
              name="keyword"
              placeholder="作成したい画像のキーワードを入力"
              required
            />
          </div>

          {isSignedIn ? (
            <Button
              type="submit"
              disabled={pending}
              className={cn("w-full duration-200", pending && "bg-primary/80")}
            >
              {pending ? (
                <div className="flex items-center justify-center">
                  <Loader className="mr-2 animate-spin" />
                  <span>生成中...</span>
                </div>
              ) : (
                <>
                  <ImageIcon className="mr-2" />
                  <span>画像を生成</span>
                </>
              )}
            </Button>
          ) : (
            <SignInButton mode="modal">
              <Button className="w-full">
                <ImageIcon className="mr-2" />
                ログインして生成
              </Button>
            </SignInButton>
          )}
        </form>
      </div>

      {/* imagePreview */}
      {state.imageUrl && (
        <div className="space-y-4">
          <div className="overflow-hidden rounded-lg border bg-background">
            <div className="aspect-video relative">
              <Image
                src={state.imageUrl}
                alt="Generated image"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <Button className="w-full" variant="outline" onClick={handleDownload}>
            <Download className="mr-2" />
            ダウンロード
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImageGenerator;
