"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

const faqs = [
  {
    question: "クレジットはどのように計算されますか？",
    answer:
      "1回の画像生成または編集操作につき1クレジットが消費されます。画像のサイズや処理の複雑さによって、必要なクレジット数が変動する場合があります。",
  },
  {
    question: "生成された画像の著作権はどうなりますか？",
    answer:
      "AImagineで生成された画像の著作権は、生成したユーザーに帰属します。商用利用も可能です。ただし、他者の著作権を侵害するような使用は禁止されています。",
  },
  {
    question: "アップロードした画像のプライバシーは守られますか？",
    answer:
      "はい。アップロードされた画像は暗号化して保存され、処理完了後24時間で自動的に削除されます。また、他のユーザーがアクセスすることはできません。",
  },
  {
    question: "プランはいつでも変更できますか？",
    answer:
      "はい、いつでもプランの変更が可能です。アップグレードの場合は即時反映され、ダウングレードは次の請求サイクルから適用されます。",
  },
  {
    question: "APIの利用制限はありますか？",
    answer:
      "プロプラン以上では、1分あたり60リクエストまでのAPI利用が可能です。ビジネスプランではカスタムの制限設定が可能です。",
  },
  {
    question: "サポートの対応時間を教えてください",
    answer:
      "フリープランは平日10-18時、プロプランは平日9-20時、ビジネスプランは24時間365日のサポートを提供しています。",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-center mb-12">よくある質問</h2>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
