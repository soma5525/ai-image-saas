"use client";

import { motion } from "framer-motion";
import { Sparkles, Image as ImageIcon, FileDown } from "lucide-react";
import Image from "next/image";

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-card p-6 rounded-lg border"
    >
      <div className="mb-4 text-primary">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </motion.div>
  );
}

export function Features() {
  return (
    <section id="features" className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">主要機能</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Sparkles className="h-8 w-8" />}
            title="AI画像生成"
            description="プロンプトを入力するだけで、高品質な画像を生成。ブログのアイキャッチやSNS投稿に最適"
          />
          <FeatureCard
            icon={<ImageIcon className="h-8 w-8" />}
            title="背景除去"
            description="ワンクリックで背景を自動削除。商品写真や人物写真の編集が簡単に"
          />
          <FeatureCard
            icon={<FileDown className="h-8 w-8" />}
            title="画像最適化"
            description="WebP形式への変換や最適なサイズへの圧縮で、表示速度を改善"
          />
        </div>
        <div className="mt-16 grid md:grid-cols-2 gap-8">
          <div className="relative h-[300px] rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80"
              alt="AI Image Generation"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative h-[300px] rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80"
              alt="AI Image Processing"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
