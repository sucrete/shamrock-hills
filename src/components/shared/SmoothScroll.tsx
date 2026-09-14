'use client';
import { usePathname } from 'next/navigation';
import { ReactNode, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // Ensure GSAP refreshes its positions when the page changes
    // since we're no longer using a virtual scroll loop
    ScrollTrigger.refresh();
    window.scrollTo(0, 0);
  }, [pathname]);

  return <>{children}</>;
}