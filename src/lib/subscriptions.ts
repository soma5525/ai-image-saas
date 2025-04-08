import { STRIPE_PLANS } from "@/config/plans";
import { SubscriptionStatus } from "@prisma/client";
import Stripe from "stripe";
import prisma from "./prisma";

function getPlanDetails(subscription: Stripe.Subscription) {
  const priceId = subscription.items.data[0].price.id;
  let status: SubscriptionStatus = "FREE";
  let credits = 5;

  switch (priceId) {
    case STRIPE_PLANS.STARTER:
      status = "STARTER";
      credits = 50;
      break;
    case STRIPE_PLANS.PRO:
      status = "PRO";
      credits = 120;
      break;
    case STRIPE_PLANS.ENTERPRISE:
      status = "ENTERPRISE";
      credits = 300;
      break;
  }

  return { priceId, status, credits };
}

export async function handleSubscriptionCreated(
  subscription: Stripe.Subscription
) {
  const { priceId, status, credits } = getPlanDetails(subscription);

  return prisma.user.update({
    where: {
      stripeCustomerId: subscription.customer as string,
    },
    data: {
      subscriptionStatus: status,
      credits: credits,
      subscription: {
        create: {
          stripeSubscriptionId: subscription.id,
          stripePriceId: priceId,
          stripeCurrentPeriodEnd: new Date(
            subscription.current_period_end * 1000
          ),
        },
      },
    },
  });
}

export async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription
) {
  const { priceId, status, credits } = getPlanDetails(subscription);

  return prisma.user.update({
    where: {
      stripeCustomerId: subscription.customer as string,
    },
    data: {
      subscriptionStatus: subscription.cancel_at_period_end ? "FREE" : status,
      credits: subscription.cancel_at_period_end ? 5 : credits,
      subscription: {
        upsert: {
          create: {
            stripeSubscriptionId: subscription.id,
            stripePriceId: priceId,
            stripeCurrentPeriodEnd: new Date(
              subscription.current_period_end * 1000
            ),
          },
          update: {
            stripePriceId: priceId,
            stripeCurrentPeriodEnd: new Date(
              subscription.current_period_end * 1000
            ),
          },
        },
      },
    },
  });
}

export async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription
) {
  const { priceId, status, credits } = getPlanDetails(subscription);

  // ユーザーを見つける
  const user = await prisma.user.findUnique({
    where: {
      stripeCustomerId: subscription.customer as string,
    },
    include: {
      subscription: true,
    },
  });

  if (!user || !user.subscription) {
    console.error("ユーザーまたはサブスクリプションが見つかりませんでした");
    return null;
  }

  // サブスクリプションを削除
  await prisma.subscription.delete({
    where: {
      id: user.subscription.id,
    },
  });

  // ユーザー情報を更新
  return prisma.user.update({
    where: {
      stripeCustomerId: subscription.customer as string,
    },
    data: {
      subscriptionStatus: "FREE",
      credits: 5,
    },
  });
}
