'use client'
import React, { useState } from 'react'
import Image from 'next/image'

export default function StyleSelector() {
    const [currentStyle, setCurrentStyle] = useState(null)

    const images = [
        {name: "default" , img:"/default.jpg"},
        {name: "Art Deco" , img:"/artdeco.jpg"},
        {name: "Industrial", img:"/industrial.jpg"},
        {name:"Japanese", img:"/japananese.jpg"},
        {name:"Luxury", img:"/luxury.jpg"},
        {name:"Mediterranean", img:"/mediterranean.jpg"},
        {name:"Minimalist", img:"/modernminimalist.jpg"}
    ]

        const selectedImage = currentStyle === null ? images.find((img) => img.name === "default")
        : images.find((img) => img.name === currentStyle)

  return (
    

    <div className='flex mt-40 mb-6 gap-6 justify-center'>
    
        <div>
          <h2 className='text-2xl font bold text-slate-600 mb-8'>Check out the different styles</h2>
           <Image 
           src={selectedImage.img}
           alt={selectedImage.name}
           height={400}
           width={400}
           className='object-cover rounded-xl transition-opacity duration-500 ease-in-out'
           />
        </div>

        <div className='grid grid-cols-2 gap-2'>
          {images
          .filter((img) => img.name !== "default")
          .map((image) => (
            <button key={image.name}
            onClick={() => setCurrentStyle(image.name)}
            className={`px-4 py-2 rounded-xl border-2 transition-all duration-300 cursor:pointer ${
                currentStyle === image.name
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-black border-gray-400 hover:bg-gray-100'
              }`}
            > {image.name}</button>
          ))
          }
        </div>
    </div>
  )
}
