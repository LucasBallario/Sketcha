"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

export default function BuyCreditsPage() {
  const router = useRouter()
  const { user } = useAuth()

  const handleBuy = async (planType) => {
    if (!user) {
      alert("Please log in first!")
      router.push("/login")
      return
    }

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, planType }),
      })

      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert("Error starting checkout")
      }
    } catch (error) {
      console.error("Checkout error:", error)
      alert("Something went wrong.")
    }
  }

  const plans = [
    {
      name: "Pay as you go",
      description: "Perfect for testing or occasional renders.",
      credits: 5,
      price: "$5 one-time",
      planType: "payg",
    },
    {
      name: "Standard Pack",
      description: "Ideal for regular users — best value.",
      credits: 15,
      price: "$10 one-time",
      planType: "standard",
    },
    {
      name: "Unlimited",
      description: "Unlimited renders for a full month.",
      credits: "∞",
      price: "$25 / month",
      planType: "unlimited",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 py-16">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-foreground">Buy Credits</h1>
        <p className="text-muted-foreground mt-2">
          Choose the plan that best fits your creative workflow.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className="bg-card border border-border rounded-2xl shadow-lg p-8 flex flex-col items-center text-center hover:scale-[1.02] transition-all duration-200"
          >
            <h2 className="text-2xl font-semibold text-foreground mb-3">
              {plan.name}
            </h2>
            <p className="text-muted-foreground mb-4">{plan.description}</p>
            <p className="text-5xl font-bold text-primary mb-2">
              {plan.credits}
            </p>
            <p className="text-gray-500 mb-6">{plan.price}</p>
            <button
              onClick={() => handleBuy(plan.planType)}
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition"
            >
              Get Started
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
