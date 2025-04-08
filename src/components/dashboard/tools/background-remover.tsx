"use client";

import { removeBackground } from "@/actions/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState } from "react";
import { GenerateImageState } from "@/types/actions";
import { Download, Loader, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { SignInButton, useUser } from "@clerk/nextjs";

const initialState: GenerateImageState = {
  status: "idle",
};

const BackgroundRemover = () => {
  const { isSignedIn } = useUser();
  const [state, formAction, pending] = useActionState(
    removeBackground,
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
      link.download = `background-removed.png`;
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

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="image`">ファイルをアップロード</Label>
            <Input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              className="w-full"
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
                  <Layers className="mr-2" />
                  <span>背景を削除</span>
                </>
              )}
            </Button>
          ) : (
            <SignInButton mode="modal">
              <Button className="w-full">
                <Layers className="mr-2" />
                ログインして削除
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
              <img
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

export default BackgroundRemover;
