'use client';
import { cn } from '@/utils/cn';
import Springer from '@/utils/springer';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ReactNode, useRef } from 'react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface RevealAnimationProps {
  children: ReactNode;
  duration?: number;
  delay?: number;
  offset?: number;
  instant?: boolean;
  start?: string;
  end?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
  useSpring?: boolean;
  rotation?: number;
  animationType?: 'from' | 'to';
  className?: string;
  animateChild?: boolean;
}

const RevealAnimation = ({
  children,
  duration = 0.6,
  delay = 0,
  offset = 60,
  instant = false,
  start = 'top 90%',
  end = 'top 50%',
  direction = 'down',
  useSpring = false,
  rotation = 0,
  animationType = 'from',
  className = '',
  animateChild = false,
}: RevealAnimationProps) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const element = elementRef.current;
    if (!element) return;

    const target = animateChild
      ? (element.firstElementChild as HTMLElement | null) ?? element
      : element;

    const spring = useSpring ? Springer.default(0.2, 0.8) : null;
    const ease = useSpring && spring ? spring : 'power2.out';

    const fromVars = {
      opacity: 0.01,
      x: direction === 'left' ? -offset : direction === 'right' ? offset : 0,
      y: direction === 'down' ? offset : direction === 'up' ? -offset : 0,
      rotation: rotation,
    };

    const toVars = {
      opacity: 1,
      x: 0,
      y: 0,
      rotation: 0,
      duration: duration,
      delay: delay,
      ease: ease,
      scrollTrigger: !instant
        ? {
            trigger: element,
            start: start,
            end: end,
            toggleActions: 'play none none none',
            once: true,
          }
        : undefined,
    };

    gsap.fromTo(target, fromVars, toVars);

    if (!instant) {
      ScrollTrigger.refresh();
    }
  }, [duration, delay, offset, instant, start, end, direction, useSpring, rotation, animationType, animateChild]);

  return (
    <div
      ref={elementRef}
      data-ns-animate={true}
      className={cn(className) || undefined}
    >
      {children}
    </div>
  );
};

export default RevealAnimation;
