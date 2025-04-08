import { stripe } from "@/lib/stripe";
import {
  handleSubscriptionCreated,
  handleSubscriptionUpdated,
  handleSubscriptionDeleted,
} from "@/lib/subscriptions";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: Request) {
  try {
    let event;
    const body = await request.text();
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (endpointSecret) {
      const signature = request.headers.get("stripe-signature") as string;
      try {
        event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
      } catch {
        console.log(`Webhook signature verification failed.`);
        return new Response(`Webhook error while verifying signature.`, {
          status: 400,
        });
      }
    }

    if (!event) {
      return new NextResponse("webhook event error", {
        status: 500,
      });
    }

    const subscription = event.data.object as Stripe.Subscription;

    // イベントの種類によって処理を分岐
    switch (event.type) {
      case "customer.subscription.created": {
        await handleSubscriptionCreated(subscription);
        break;
      }

      case "customer.subscription.updated": {
        await handleSubscriptionUpdated(subscription);
        break;
      }

      case "customer.subscription.deleted": {
        await handleSubscriptionDeleted(subscription);
        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
