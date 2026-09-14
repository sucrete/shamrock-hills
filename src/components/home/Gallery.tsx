'use client';

import Image from 'next/image';
import { useCallback, useState } from 'react';
import Masonry from 'react-masonry-css';
import RevealAnimation from '../animation/RevealAnimation';
import Lightbox from './Lightbox';
import { Expand } from '../ui/Icons';

import sh2 from '@public/images/shamrock-hills/gallery/sh-2.webp';
import sh3 from '@public/images/shamrock-hills/gallery/sh-3.webp';
import sh4 from '@public/images/shamrock-hills/gallery/sh-4.webp';
import sh5 from '@public/images/shamrock-hills/gallery/sh-5.webp';
import sh8 from '@public/images/shamrock-hills/gallery/sh-8.webp';
import sh9 from '@public/images/shamrock-hills/gallery/sh-9.webp';
import sh10 from '@public/images/shamrock-hills/gallery/sh-10.webp';
import sh11 from '@public/images/shamrock-hills/gallery/sh-11.webp';
import sh13 from '@public/images/shamrock-hills/gallery/sh-13.webp';
import sh14 from '@public/images/shamrock-hills/gallery/sh-14.webp';
import sh15 from '@public/images/shamrock-hills/gallery/sh-15.webp';
import sh16 from '@public/images/shamrock-hills/gallery/sh-16.webp';
import sh18 from '@public/images/shamrock-hills/gallery/sh-18.webp';
import sh19 from '@public/images/shamrock-hills/gallery/sh-19.webp';
import sh21 from '@public/images/shamrock-hills/gallery/sh-21.webp';
import sh22 from '@public/images/shamrock-hills/gallery/sh-22.webp';
import sh23 from '@public/images/shamrock-hills/gallery/sh-23.webp';

const galleryImages = [sh2, sh3, sh4, sh5, sh8, sh9, sh10, sh11, sh13, sh14, sh15, sh16, sh18, sh19, sh21, sh22, sh23];

const breakpointColumns = {
  default: 4,
  1280: 3,
  768: 2,
  500: 1,
};

const Gallery = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleNavigate = useCallback((direction: -1 | 1) => {
    setSelectedIndex((current) => {
      if (current === null) return current;
      return (current + direction + galleryImages.length) % galleryImages.length;
    });
  }, []);

  return (
    <section className="relative py-16 md:py-20 lg:py-[200px] bg-[#ffffff] overflow-hidden border-t border-[#f2f2f2]">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
        <Masonry
          breakpointCols={breakpointColumns}
          className="flex w-auto -ml-4"
          columnClassName="pl-4 bg-clip-padding flex flex-col gap-4">
          {galleryImages.map((image, index) => (
            <RevealAnimation key={image.src} delay={0.05 * (index % 6)} offset={20}>
              <div
                onClick={() => setSelectedIndex(index)}
                className="brick group relative w-full overflow-hidden rounded-[16px] cursor-pointer"
                style={{ aspectRatio: `${image.width} / ${image.height}` }}>
                <Image
                  src={image}
                  alt={`Shamrock Hills Golf Club — photo ${index + 1}`}
                  fill
                  loading="lazy"
                  sizes="(max-width: 500px) 100vw, (max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
                <div className="pointer-events-none absolute bottom-3 right-3 flex size-9 translate-y-1 items-center justify-center rounded-full bg-black/40 opacity-0 backdrop-blur-sm transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                  <Expand className="size-4 fill-white" />
                </div>
              </div>
            </RevealAnimation>
          ))}
        </Masonry>
      </div>

      <Lightbox
        images={galleryImages}
        index={selectedIndex}
        onClose={() => setSelectedIndex(null)}
        onNavigate={handleNavigate}
      />
    </section>
  );
};

export default Gallery;
