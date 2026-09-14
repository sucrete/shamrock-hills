'use client';
import { useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function ParallaxImageBackground({
  src,
  alt = '',
  height = '120%',
  offset = '-10%',
  sizes = '100vw',
}: any) {
  const containerRef = useRef(null);
  const imageRef = useRef(null);

  useGSAP(() => {
    gsap.to(imageRef.current, {
      yPercent: 20, // Move the image 20% down
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top bottom', // Start when top of container hits bottom of viewport
        end: 'bottom top',   // End when bottom of container hits top of viewport
        scrub: true,         // Syncs animation to native scrollbar
      },
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden -z-10 pointer-events-none">
      <div
        ref={imageRef}
        className="absolute inset-0 w-full"
        style={{ height, transform: `translateY(${offset})`, willChange: 'transform' }}
      >
        <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" priority />
      </div>
    </div>
  );
}