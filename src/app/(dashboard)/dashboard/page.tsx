"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  BarChart3,
  Image as ImageIcon,
  FileText,
  Settings,
  Plus,
  Download,
  Trash2,
  Upload,
} from "lucide-react";
import Image from "next/image";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleGenerateImage = () => {
    if (!prompt) return;

    setIsGenerating(true);
    // 実際のAPI呼び出しはここに実装
    setTimeout(() => {
      setGeneratedImage(
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80"
      );
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">ダッシュボード</h1>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid grid-cols-4 lg:w-[400px]">
          <TabsTrigger value="overview">概要</TabsTrigger>
          <TabsTrigger value="generate">画像生成</TabsTrigger>
          <TabsTrigger value="gallery">ギャラリー</TabsTrigger>
          <TabsTrigger value="settings">設定</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  生成した画像
                </CardTitle>
                <ImageIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">今月の生成数</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  クレジット残高
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">150</div>
                <p className="text-xs text-muted-foreground">残りクレジット</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  サブスクリプション
                </CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">プロ</div>
                <p className="text-xs text-muted-foreground">
                  次回更新: 2023/12/01
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>最近の生成</CardTitle>
              <CardDescription>最近生成した画像の一覧</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80",
                  "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80",
                  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80",
                  "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80",
                ].map((src, i) => (
                  <div
                    key={i}
                    className="relative aspect-square rounded-md overflow-hidden"
                  >
                    <Image
                      src={src}
                      alt={`Generated image ${i + 1}`}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="generate" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI画像生成</CardTitle>
              <CardDescription>プロンプトを入力して画像を生成</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="prompt" className="text-sm font-medium">
                  プロンプト
                </label>
                <Textarea
                  id="prompt"
                  placeholder="生成したい画像の詳細を入力してください..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  生成に必要なクレジット: 1
                </div>
                <Button
                  onClick={handleGenerateImage}
                  disabled={!prompt || isGenerating}
                >
                  {isGenerating ? "生成中..." : "画像を生成"}
                </Button>
              </div>

              {generatedImage && (
                <div className="mt-6 space-y-4">
                  <h3 className="text-lg font-medium">生成結果</h3>
                  <div className="relative aspect-video rounded-md overflow-hidden">
                    <Image
                      src={generatedImage}
                      alt="Generated image"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      ダウンロード
                    </Button>
                    <Button variant="outline">
                      <Plus className="mr-2 h-4 w-4" />
                      ギャラリーに追加
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gallery" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>画像ギャラリー</CardTitle>
              <CardDescription>生成した画像のコレクション</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div
                    key={i}
                    className="relative aspect-square rounded-md overflow-hidden group"
                  >
                    <Image
                      src={`https://images.unsplash.com/photo-${
                        1620712943543 + i
                      }?auto=format&fit=crop&q=80`}
                      alt={`Gallery image ${i}`}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>アカウント設定</CardTitle>
              <CardDescription>
                アカウント情報とサブスクリプションの管理
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  メールアドレス
                </label>
                <Input
                  id="email"
                  type="email"
                  defaultValue="user@example.com"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  名前
                </label>
                <Input id="name" defaultValue="ユーザー名" />
              </div>

              <div className="pt-4">
                <Button>設定を保存</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>サブスクリプション</CardTitle>
              <CardDescription>現在のプラン: プロ</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">次回請求日</p>
                  <p className="text-sm text-muted-foreground">2023/12/01</p>
                </div>
                <Button variant="outline">プランを変更</Button>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">支払い方法</p>
                  <p className="text-sm text-muted-foreground">
                    •••• •••• •••• 4242
                  </p>
                </div>
                <Button variant="outline">更新</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
