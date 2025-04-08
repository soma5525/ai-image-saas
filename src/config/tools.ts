import ImageGenerator from "@/components/dashboard/tools/image-generator";
import BackgroundRemover from "@/components/dashboard/tools/background-remover";
export const tools = {
  "image-generator": {
    title: "画像生成",
    description: "AIを使用して画像を生成",
    component: ImageGenerator,
  },
  "remove-bg": {
    title: "背景削除",
    description: "画像から背景を自動で削除",
    component: BackgroundRemover,
  },
  optimize: {
    title: "画像圧縮",
    description: "画像を圧縮するツールです。",
    component: ImageGenerator,
  },
};

export type ToolType = keyof typeof tools;
