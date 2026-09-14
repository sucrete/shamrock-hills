'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import RevealAnimation from '../animation/RevealAnimation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { SmallArrow } from '../ui/Icons';

gsap.registerPlugin(ScrollTrigger);

const IntrasiteLinks = [
  {
    id: 1,
    URL: '/greens-fees',
    text: 'Greens Fees',
    imgURL: '/images/home/putting-green-and-ball.jpg',
  },
  {
    id: 2,
    URL: '/events',
    text: 'Events',
    imgURL: '/images/home/chipping-from-bunker.jpg',
  },
  {
    id: 3,
    URL: '/book-tee-time',
    text: 'Book Tee Time',
    imgURL: '/images/home/close-up-golfer.jpg',
  },
];

interface LinkCardProps {
  linkItem: (typeof IntrasiteLinks)[0];
}

const LinkCard = ({ linkItem }: LinkCardProps) => {
  const arrowRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    gsap.set(arrowRef.current, { rotate: -45 });
  }, []);

  const handleMouseEnter = () => {
    gsap.to(arrowRef.current, { rotate: 0, duration: 0.3, ease: 'back.out(1.4)' });
  };

  const handleMouseLeave = () => {
    gsap.to(arrowRef.current, { rotate: -45, duration: 0.3, ease: 'back.out(1.4)' });
  };
  const HOVER_DURATION = 'duration-300';
  return (
    <Link href={linkItem.URL} className="block group">
      <div
        className={`card-body w-full h-[100px] md:h-[175px] lg:h-[175px] xl:h-[150px] rounded-[15px] relative overflow-hidden cursor-pointer realistic-shadow ${HOVER_DURATION}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}>
        {/* LAYER 1: Background Image & Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <div
            className={`overlay absolute inset-0 bg-scrim-bottom opacity-70 rounded-[15px] transition-opacity ${HOVER_DURATION} group-hover:opacity-70 z-10 shadow-[inset_1px_1px_0_rgba(255,255,255,0.35),inset_0_0_5px_rgba(255,255,255,0.75)]`}
          />
          <div
            className={`the-bg-image bg-cover bg-center absolute inset-0 transition-transform ${HOVER_DURATION} ease-out group-hover:scale-[1.04]`}
            style={{ backgroundImage: `url(${linkItem.imgURL})` }}
          />
        </div>

        {/* LAYER 2: The Content */}
        <div className="w-full h-full px-5 pb-4 md:px-6 md:pb-5 flex items-end justify-start relative z-30">
          <div className="link-title relative h-[1.5em] w-full">
            <span className="absolute bottom-0 left-0 text-white tracking-normal text-[13px] md:text-[16px] lg:text-[16px] whitespace-nowrap">
              {linkItem.text}
            </span>
            <span ref={arrowRef} className="absolute bottom-0 right-0 -mb-1">
              <SmallArrow
                className={`size-7 transition-opacity opacity-70 fill-[#fff] ${HOVER_DURATION} group-hover:opacity-100`}
              />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

const Links = () => {
  const ref = useRef(null);

  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: ref.current,
        start: 'top 80%',
        end: 'top 40%',
        once: true,
        toggleClass: { targets: ref.current, className: 'bg-[#ececec]' },
      });
    },
    { scope: ref },
  );

  return (
    <section className="py-7 md:py-20 lg:py-[70px] xl:py-[80px] relative bg-background-2">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16 ">
        <div
          ref={ref}
          className="rounded-[25px] md:rounded-[32px] overflow-hidden p-4 md:p-6 transition-colors duration-250 shadow-[inset_1px_1px_0_rgba(255,255,255,0.75),inset_0_0_5px_rgba(255,255,255,0.75)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-6">
            {IntrasiteLinks.map((linkItem, index) => (
              <RevealAnimation key={linkItem.id} delay={index * 0.1}>
                <div className="w-full">
                  <LinkCard linkItem={linkItem} />
                </div>
              </RevealAnimation>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Links;
