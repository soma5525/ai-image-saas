"use client";

import { createStripeSession } from "@/actions/stripe";
import { Button } from "@/components/ui/button";
import { plans } from "@/config/plans";
import { StripeState } from "@/types/actions";
import { Check } from "lucide-react";
import { useActionState } from "react";
import { toast } from "sonner";

const initialState: StripeState = {
  status: "idle",
  error: "",
  redirectUrl: "",
};

const Page = () => {
  const [state, formAction, pending] = useActionState(
    async (prevState: StripeState, formData: FormData) => {
      const result = await createStripeSession(prevState, formData);

      if (result.status === "error") {
        toast.error(result.error);
      } else if (result.status === "success" && result.redirectUrl) {
        window.location.href = result.redirectUrl;
      }
      return result;
    },
    initialState
  );

  return (
    <div className="container py-8 mx-auto">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold">料金プラン</h1>
        <p className="mt-4 text-muted-foreground text-lg">
          あなたのニーズに合わせて最適なプランをお選びください。
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 md:grid-cols-1 mx-auto max-w-7xl">
        {plans.map((plan) => {
          const Icon = plan.icon;
          return (
            <div
              key={plan.name}
              className={`border rounded-xl bg-card p-8 shadow-sm flex flex-col ${
                plan.popular ? "ring-2 ring-primary scale-105" : ""
              }`}
            >
              <div className="space-y-6 flex-1">
                <div className="space-y-4">
                  {plan.popular && (
                    <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm w-fit">
                      人気プラン
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Icon className="size-6 text-primary" />
                    <h2 className="text-2xl font-bold">{plan.name}</h2>
                  </div>
                  <p className="text-muted-foreground">{plan.description}</p>
                </div>
                <div className="flex items-end mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground ml-2">/月</span>
                </div>
              </div>

              <ul className="space-y-4 text-sm flex-1">
                {plan.features.map((feature) => (
                  <li className="flex items-center gap-3" key={feature}>
                    <Check className="size-4 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <form action={formAction}>
                <input name="priceId" value={plan.priceId} type="hidden" />
                <Button
                  className="w-full mt-8"
                  size={"lg"}
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.buttonText}
                </Button>
              </form>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Page;
