import { Crown, Rocket, Sparkles } from "lucide-react";

export const STRIPE_PLANS = {
  STARTER: "price_1R6LUVCQ44kuzkacnULEx7us",
  PRO: "price_1R6LUuCQ44kuzkacL5dAXUJF",
  ENTERPRISE: "price_1R6LVGCQ44kuzkaccPfkKnUC",
};

export const plans = [
  {
    name: "Starter",
    icon: Sparkles,
    price: "￥1000",
    description: "個人利用に最適なプランです。",
    features: ["月50クレジット付与", "基本的な画像生成", "メールサポート"],
    buttonText: "Starterプランを選択",
    priceId: STRIPE_PLANS.STARTER,
  },
  {
    name: "Pro",
    icon: Rocket,
    price: "￥2000",
    description: "プロフェッショナルな制作活動に",
    features: [
      "月120クレジット付与",
      "優先サポート",
      "商用利用可能",
      "メールサポート",
    ],
    popular: true,
    buttonText: "Proプランを選択",
    priceId: STRIPE_PLANS.PRO,
  },
  {
    name: "Enterprise",
    icon: Crown,
    price: "￥5000",
    description: "ビジネス向けの完全なソリューション",
    features: [
      "月300クレジット付与",
      "24時間優先サポート",
      "API利用可能",
      "メールサポート",
    ],
    buttonText: "Enterpriseプランを選択",
    priceId: STRIPE_PLANS.ENTERPRISE,
  },
];
