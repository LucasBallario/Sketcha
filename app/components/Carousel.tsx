'use client'
import React from 'react'
import Image from 'next/image'

export default function Carousel() {
  const images = [
    '/example1.jpg',
    '/example2.jpg',
    '/example3.jpg',
    '/example4.jpg',
  ]

  // se duplican las imagenes para hacer el loop
  const loopImages = [...images, ...images]

  return (
    <div className="overflow-hidden w-full py-15">
      <div className="flex animate-scroll gap-6">
        {loopImages.map((src, index) => (
          <div
            key={index}
            className="relative flex-shrink-0 w-[300px] h-[200px]"
          >
            <Image
              src={src}
              alt={`Render ${index + 1}`}
              fill
              className="object-cover rounded-xl"
            />
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 20s linear infinite;
          width: max-content;
        }
      `}</style>
    </div>
  )
}
