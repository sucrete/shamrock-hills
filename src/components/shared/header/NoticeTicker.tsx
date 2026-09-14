'use client';

import { cn } from '@/utils/cn';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface NoticeTickerProps {
  isScrolled: boolean;
  notices: string[];
  visible: boolean;
}

export default function NoticeTicker({ isScrolled, notices, visible }: NoticeTickerProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const slotA = useRef<HTMLSpanElement>(null);
  const slotB = useRef<HTMLSpanElement>(null);
  const indexRef = useRef(0);
  const isAActive = useRef(true);

  useEffect(() => {
    gsap.to(barRef.current, {
      yPercent: isScrolled ? -100 : 0,
      duration: 0.45,
      ease: 'power2.inOut',
    });
  }, [isScrolled]);

  useEffect(() => {
    if (notices.length <= 1) return;
    const interval = setInterval(() => {
      indexRef.current = (indexRef.current + 1) % notices.length;
      const next = indexRef.current;

      const outgoing = isAActive.current ? slotA.current : slotB.current;
      const incoming = isAActive.current ? slotB.current : slotA.current;

      if (incoming) {
        incoming.textContent = notices[next];
        gsap.set(incoming, { y: 14, opacity: 0 });
      }

      const tl = gsap.timeline();
      tl.to(outgoing, { y: -14, opacity: 0, duration: 0.35, ease: 'power2.in' }).to(
        incoming,
        { y: 0, opacity: 1, duration: 0.35, ease: 'power2.out' },
        '-=0.1',
      );

      isAActive.current = !isAActive.current;
    }, 5000);

    return () => clearInterval(interval);
  }, [notices]);

  if (!visible || notices.length === 0) return null;

  return (
    <div
      ref={barRef}
      className={cn(
        'fixed top-0 left-0 w-full z-[51] bg-ns-dark-green text-white monospaced h-[36px] flex items-center justify-center overflow-hidden',
        'sm:text-[12px]',
      )}>
      <div className="relative h-full flex items-center justify-center w-full">
        <span ref={slotA} className="absolute w-full text-center px-4">
          {notices[0]}
        </span>
        <span ref={slotB} className="absolute w-full text-center px-4 opacity-0">
          {notices[1]}
        </span>
      </div>
    </div>
  );
}
