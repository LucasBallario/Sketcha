"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"

export default function Page() {
  const [selectedImage, setSelectedImage] = useState(null)
  const [showStyles, setShowStyles] = useState(false)
  const [selectedStyles, setSelectedStyles] = useState(null)
 
    return (
<div>
   {!selectedImage && (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <div className="w-full max-w-2xl space-y-8">
          <div className="text-center space-y-3">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-balance text-foreground">
              Transform your Sketch
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto text-pretty">
              Upload your sketch and watch it come to life
            </p>
          </div>
  
          <div className="flex flex-col items-center justify-center space-y-4 bg-card border-2 border-border rounded-2xl p-12 shadow-lg">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
  
            <div className="flex justify-center">
              <label className="relative cursor-pointer">
                <input type="file" className="sr-only" accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0]
                  if(file) {
                    const imageUrl = URL.createObjectURL(file);
                    setSelectedImage(imageUrl);
                    setShowStyles(true);
                  }
                }}
              />
                <span className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground font-semibold text-lg rounded-xl hover:bg-primary/90 transition-all duration-200 shadow-xl hover:shadow-xl hover:scale-105 active:scale-95">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Choose File
                </span>
              </label>
            </div>
  
            <p className="text-xs text-muted-foreground">Supports: JPG, PNG, SVG, WebP (Max 10MB)</p>
          </div>
        </div>
      </div>
      )}
    
    {selectedImage && (
      <div className="flex justify-center items-center mt-10 ">
        <Image
        className="shadow-lg"
        src={selectedImage}
        alt="Preview"
        height={500}
        width={500}
        />  
       </div>
    )}

</div>
    )}