"use client";

import React from "react";
import Image from "next/image";
import Carousel from "./Carousel";
import Information from "./Information";
import StyleSelector from "./StyleSelector";
import Footer from "./Footer";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useUserProfile } from "@/lib/useUserProfile";

export default function Banner() {
  const { user, signOut } = useAuth();

  const userId = user?.id || null;

  const { profile = null, loading } = useUserProfile(userId) || {};

  const displayName =
    (profile && profile.full_name && profile.full_name.split(" ")[0]) ||
    (user?.user_metadata?.full_name?.split(" ")[0]) ||
    "User";

  return (
    <div className="flex flex-col min-h-screen px-8">
      {/* Header */}
      <div className="flex justify-between items-center py-6">
        <Image src="/logo.png" width={100} height={100} alt="logo" />
        <p className="cursor-pointer text-slate-700 hover:text-black">How it works</p>

        {!user && (
          <Link href="/login">
            <button className="border-2 border-black bg-white text-black rounded-xl px-4 py-2 cursor-pointer hover:bg-black hover:text-white transition">
              Log in
            </button>
          </Link>
        )}

        {user && !loading && (
          <div className="flex items-center gap-4">
            <p className="text-gray-700 font-medium">Hi, {displayName}</p>
            <button
              onClick={signOut}
              className="border-2 border-black bg-white text-black rounded-xl px-4 py-2 cursor-pointer hover:bg-black hover:text-white transition"
            >
              Log out
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-12 mt-8">
        <div className="flex flex-col gap-6">
          <Image className="rounded-xl shadow-md" src="/sketch.jpg" width={450} height={450} alt="sketch" />
          <Image className="rounded-xl shadow-md" src="/example.jpg" width={450} height={300} alt="example" />
        </div>

        <div className="max-w-xl text-center md:text-left">
          <h1 className="text-4xl font-bold leading-tight mb-4">From Sketch to Reality</h1>
          <p className="text-gray-700 text-lg">
            Bring your restaurant vision to life with AI-powered professional renders. Upload your restaurant sketch and
            watch as our AI transforms it into a professional architectural rendering — perfect for presentations,
            investor pitches, and design visualization, no 3D modeling skills required.
          </p>

          <Link href="/transform">
            <button className="py-4 px-8 mt-6 bg-black text-white font-bold border rounded-xl cursor-pointer hover:bg-white hover:text-black hover:border-2 transition">
              Start Now
            </button>
          </Link>
        </div>
      </div>

      <Carousel />
      <Information />
      <StyleSelector />
      <Footer />
    </div>
  );
}
