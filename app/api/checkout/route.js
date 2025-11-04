import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const { userId, planType } = await req.json();

  if (!userId || !planType) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  // Mapeo de planes con sus price IDs
  const planMap = {
    payg: process.env.STRIPE_PRICE_PAYG,
    standard: process.env.STRIPE_PRICE_STANDARD,
    unlimited: process.env.STRIPE_PRICE_UNLIMITED,
  };

  const priceId = planMap[planType];
  if (!priceId)
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: planType === "unlimited" ? "subscription" : "payment",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cancel`,
      metadata: {
        user_id: userId,
        plan: planType,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
