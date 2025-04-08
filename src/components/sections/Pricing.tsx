"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";

function PricingCard({
  title,
  price,
  features,
  buttonText,
  popular,
}: {
  title: string;
  price: string;
  features: string[];
  buttonText: string;
  popular: boolean;
}) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`relative bg-card p-6 rounded-lg border ${
        popular ? "border-primary shadow-lg" : ""
      }`}
    >
      {popular && (
        <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full absolute -top-2 right-4">
          人気
        </span>
      )}
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <div className="mb-4">
        <span className="text-3xl font-bold">{price}</span>
        <span className="text-muted-foreground">/月</span>
      </div>
      <ul className="space-y-2 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center text-sm">
            <Zap className="h-4 w-4 text-primary mr-2" />
            {feature}
          </li>
        ))}
      </ul>
      <Button className="w-full" variant={popular ? "default" : "outline"}>
        {buttonText}
      </Button>
    </motion.div>
  );
}

export function Pricing() {
  return (
    <section id="pricing" className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">料金プラン</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <PricingCard
            title="フリー"
            price="¥0"
            features={[
              "月50クレジット",
              "基本的な画像生成",
              "標準画質での出力",
              "基本的なサポート",
            ]}
            buttonText="無料で始める"
            popular={false}
          />
          <PricingCard
            title="プロ"
            price="¥2,980"
            features={[
              "月500クレジット",
              "高度な画像生成",
              "HD画質での出力",
              "優先サポート",
              "API アクセス",
            ]}
            buttonText="プロプランを選択"
            popular={true}
          />
          <PricingCard
            title="ビジネス"
            price="¥9,800"
            features={[
              "月2000クレジット",
              "最高品質の画像生成",
              "4K画質での出力",
              "24時間サポート",
              "カスタムAPI統合",
            ]}
            buttonText="ビジネスプランを選択"
            popular={false}
          />
        </div>
      </div>
    </section>
  );
}
