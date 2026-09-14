'use client';

import * as Dialog from '@radix-ui/react-dialog';
import Image, { StaticImageData } from 'next/image';
import { useEffect, useRef, useState } from 'react';
import RevealAnimation from '../animation/RevealAnimation';
import { SmallArrow, X } from '../ui/Icons';
import { cn } from '@/utils/cn';

// Minimum horizontal travel (px) before a touch drag counts as a swipe rather
// than a tap or an incidental wobble.
const SWIPE_THRESHOLD = 50;

interface LightboxProps {
  images: StaticImageData[];
  index: number | null;
  onClose: () => void;
  onNavigate: (direction: -1 | 1) => void;
}

interface KeycapProps {
  label: string;
  onClick: () => void;
  flip?: boolean;
  pressed: boolean;
}

// Ported from https://codepen.io/P233/pen/nqrawW's `.key`/`.keycap` — a two-
// layer build, not just a single beveled div: an outer "socket" with a thick,
// asymmetric three-color border (lighter on top/sides, darker on the bottom
// edge, so the socket itself reads as recessed) holding an inner "cap" face
// with its own soft gradient and ambient shadow. Colors and the border-width
// ratio (thin top, wider sides, thickest bottom) are the pen's own values,
// just scaled down from its 40px key to fit the 30px-max constraint here.
// `.pressed` there is a scale(0.95) toggled by jQuery keydown/keyup; here
// it's the same transform, driven by real keydown/keyup listeners in
// Lightbox below (so actual ArrowLeft/ArrowRight presses squish the
// matching key, not just mouse clicks) plus `active:` for direct clicks.
const Keycap = ({ label, onClick, flip = false, pressed }: KeycapProps) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    className={cn(
      'flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-[4px] outline-none',
      'border-t-[2px] border-r-[4px] border-b-[6px] border-l-[4px] border-solid',
      'border-t-[#ece8e4] border-r-[#dedad6] border-b-[#c9c4c4] border-l-[#dedad6]',
      'bg-[#d3cfcc]',
      'transition-transform duration-100 ease-out',
      'active:scale-95',
      'focus-visible:ring-2 focus-visible:ring-white/60',
      pressed && 'scale-95',
    )}>
    <span
      className={cn(
        'flex size-full items-center justify-center rounded-[3px]',
        'bg-[linear-gradient(to_right,#e5e2e1,#f5f3f1,#e5e2e1)] shadow-[0_0_6px_rgba(0,0,0,0.15)]',
      )}>
      <SmallArrow className={cn('size-3 fill-[#555555]', flip && 'rotate-180')} />
    </span>
  </button>
);

const Lightbox = ({ images, index, onClose, onNavigate }: LightboxProps) => {
  const open = index !== null;
  const image = index !== null ? images[index] : null;
  const [pressedDirection, setPressedDirection] = useState<-1 | 1 | null>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (event: React.TouchEvent) => {
    const touch = event.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (!touchStart.current) return;
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStart.current.x;
    const deltaY = touch.clientY - touchStart.current.y;
    touchStart.current = null;

    // Require the swipe to be mostly horizontal so a vertical drag (e.g.
    // scrolling attempt) doesn't get misread as a navigation gesture.
    if (Math.abs(deltaX) < SWIPE_THRESHOLD || Math.abs(deltaX) < Math.abs(deltaY)) return;

    onNavigate(deltaX < 0 ? 1 : -1);
  };

  useEffect(() => {
    if (!open) return;

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        onNavigate(-1);
        setPressedDirection(-1);
      }
      if (event.key === 'ArrowRight') {
        onNavigate(1);
        setPressedDirection(1);
      }
    };
    const handleKeyup = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') setPressedDirection(null);
    };

    window.addEventListener('keydown', handleKeydown);
    window.addEventListener('keyup', handleKeyup);
    return () => {
      window.removeEventListener('keydown', handleKeydown);
      window.removeEventListener('keyup', handleKeyup);
    };
  }, [open, onNavigate]);

  return (
    <Dialog.Root open={open} onOpenChange={(next) => !next && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[1000] bg-black/90 data-[state=open]:animate-[lightbox-fade-in_200ms_ease] data-[state=closed]:animate-[lightbox-fade-out_200ms_ease]" />
        <Dialog.Content
          onOpenAutoFocus={(event) => event.preventDefault()}
          onClick={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="fixed inset-0 z-[1001] outline-none">
          <Dialog.Title className="sr-only">
            Gallery image {index !== null ? index + 1 : ''} of {images.length}
          </Dialog.Title>

          <Dialog.Close
            aria-label="Close"
            className="absolute top-6 right-6 z-20 flex size-11 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors duration-200 hover:bg-white/20">
            <X className="size-4 fill-white" />
          </Dialog.Close>

          {/* Image centers in the space above the button row. The button row
              lives outside this flex flow (fixed to the viewport bottom,
              below) specifically so it doesn't move when a taller/shorter
              image changes how much space this area needs. */}
          <div
            onClick={(event) => {
              if (event.target === event.currentTarget) onClose();
            }}
            className="flex h-full w-full items-center justify-center p-6 pb-24">
            {image && (
              <RevealAnimation key={index} instant direction="down" offset={10} duration={0.3}>
                {/* Sized by the width/height attributes next/image derives from
                    the static import, so the image lays out at its true pixel
                    size and the max-* rules only ever shrink it. Deliberately
                    no `w-auto`: that would discard those attributes and fall
                    back to intrinsic sizing, which on a 2x display divides the
                    srcset's `2x` candidate by 2 and renders everything at half
                    size. `h-auto` keeps the aspect ratio while width leads, and
                    object-contain guards the ratio if max-h does the clamping. */}
                <Image
                  src={image}
                  alt={`Shamrock Hills Golf Club — photo ${index !== null ? index + 1 : ''}`}
                  priority
                  sizes="100vw"
                  className="h-auto max-w-[calc(100vw-3rem)] max-h-[calc(100vh-7.5rem)] object-contain rounded-sm"
                />
              </RevealAnimation>
            )}
          </div>

          <div className="fixed bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-3">
            <Keycap label="Previous image" onClick={() => onNavigate(-1)} pressed={pressedDirection === -1} flip />
            <Keycap label="Next image" onClick={() => onNavigate(1)} pressed={pressedDirection === 1} />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default Lightbox;
