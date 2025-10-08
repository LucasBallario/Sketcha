import React from 'react'

export default function Information() {
  return (
    <div className='flex justify-center items-center mt-30 gap-10'>
        <div>
            <h1 className='text-6xl font-bold'>How it works?</h1>
        </div>

        <div className='max-w-[600px] leading-relaxed whitespace-pre-line flex flex-col gap-y-8'>
            <p>
                <span className='font-bold'>Upload Your Sketch</span><br />
                {`Take a photo or scan your hand-drawn restaurant design and upload it to our platform. Any sketch style works—from rough napkin drawings to detailed floor plans`}
            </p>
            <p>
            <span className='font-bold'>AI Works Its Magic</span>{`
Our advanced AI analyzes your sketch, understanding the layout, furniture placement, and design intent.
Within minutes, it generates a photorealistic architectural render with professional lighting and materials.`}
            </p>
            <p>
            <span className='font-bold'>Download & Share</span>{`
Get your high-resolution render instantly. Use it for presentations,
investor pitches, social media, or design approvals.
Make revisions anytime with new sketches.`}
            </p>
        </div>
    </div>
  )
}
