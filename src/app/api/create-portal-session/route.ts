import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import prisma from "@/lib/prisma";

export async function POST() {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: {
        clerkId: user.id,
      },
    });

    if (!dbUser?.stripeCustomerId) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: dbUser.stripeCustomerId,
      return_url: `${
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      }/dashboard/settings`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.log("Error:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
