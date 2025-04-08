"use server";
import { stripe } from "@/lib/stripe";
import { StripeState } from "@/types/actions";
import { currentUser } from "@clerk/nextjs/server";

export const createStripeSession = async (
  prevState: StripeState,
  formData: FormData
): Promise<StripeState> => {
  const priceId = formData.get("priceId") as string;

  const user = await currentUser();
  if (!user) {
    throw new Error("認証が必要です。");
  }

  try {
    const dbUser = await prisma?.user.findUnique({
      where: { clerkId: user.id },
    });

    let customerId = dbUser?.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.emailAddresses[0].emailAddress,
        metadata: {
          clerkId: user.id,
        },
      });

      await prisma?.user.update({
        where: { clerkId: user.id },
        data: {
          stripeCustomerId: customer.id,
        },
      });

      customerId = customer.id;
    }

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.BASE_URL}/dashboard/?success=true`,
      cancel_url: `${process.env.BASE_URL}/dashboard/?canceled=true`,
      metadata: {
        clerkId: user.id,
      },
    });

    if (!session.url) {
      throw new Error("セッションの作成に失敗しました。");
    }

    return {
      status: "success",
      error: "",
      redirectUrl: session.url,
    };
  } catch (error) {
    console.error("Stripe session creation error", error);
    return {
      status: "error",
      error: "決済処理中にエラーが発生しました。",
      redirectUrl: "",
    };
  }
};
