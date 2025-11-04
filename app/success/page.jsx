"use client"

import Link from "next/link"
import { CheckCircle } from "lucide-react"

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6">
      <div className="bg-card border border-border rounded-2xl shadow-xl p-10 text-center max-w-lg">
        <CheckCircle className="text-green-500 w-16 h-16 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-foreground mb-4">
          Payment Successful 🎉
        </h1>
        <p className="text-muted-foreground mb-6">
          Thank you for your purchase! Your credits will be added to your account
          in just a few moments.
        </p>
        <Link
          href="/transform"
          className="inline-block bg-primary text-primary-foreground font-semibold py-3 px-6 rounded-lg hover:bg-primary/90 transition"
        >
          Go back to app
        </Link>
      </div>
    </div>
  )
}
