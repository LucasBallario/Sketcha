import Stripe from "stripe";
import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata.user_id;
    const credits = parseInt(session.metadata.credits);

    await supabase.rpc("increment_credits", {
      user_id: userId,
      amount: credits,
    });
  }

  return NextResponse.json({ received: true });
}
