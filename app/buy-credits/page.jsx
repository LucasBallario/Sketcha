"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function BuyCreditsPage() {
  const { user } = useAuth();
  const router = useRouter();

  const handleBuy = async (amount, label) => {
    if (!user) {
      alert("Please log in first!");
      router.push("/login");
      return;
    }

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, amount }),
    });

    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else alert("Error starting checkout");
  };

  const plans = [
    {
      name: "Pay as you go",
      description: "Perfect for testing or occasional renders.",
      credits: 5,
      price: "$5 one-time",
      amount: 5,
    },
    {
      name: "Standard Pack",
      description: "Ideal for regular users — best value.",
      credits: 15,
      price: "$10 one-time",
      amount: 10,
    },
    {
      name: "Unlimited",
      description: "Unlimited renders for a full month.",
      credits: "∞",
      price: "$25 / month",
      amount: 25,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 py-16">
      <h1 className="text-4xl font-bold mb-10 text-foreground">
        Choose Your Plan
      </h1>

      <div className="grid md:grid-cols-3 gap-8 w-full max-w-5xl">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className="border border-border rounded-2xl shadow-lg p-8 bg-card flex flex-col items-center text-center transition hover:scale-105"
          >
            <h2 className="text-2xl font-semibold mb-2">{plan.name}</h2>
            <p className="text-muted-foreground mb-4">{plan.description}</p>
            <p className="text-4xl font-bold mb-6 text-primary">
              {plan.price}
            </p>
            <p className="mb-6 text-sm text-muted-foreground">
              Includes {plan.credits} credits
            </p>
            <button
              onClick={() => handleBuy(plan.amount, plan.name)}
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition"
            >
              Get Started
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={() => router.push("/transform")}
        className="mt-10 text-muted-foreground hover:text-foreground transition"
      >
        ← Back to Transform
      </button>
    </div>
  );
}
