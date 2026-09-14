'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import Image from 'next/image';

interface TemperaturePaneCardProps {
  currentTemp: number | string;
  label: string;
}

const TemperaturePaneCard = ({ currentTemp, label }: TemperaturePaneCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = cardRef.current;
    if (!el) return;

    gsap.fromTo(
      el,
      { opacity: 0, x: 15, backdropFilter: 'blur(0px)' },
      { opacity: 1, x: 0, backdropFilter: 'blur(24px)', duration: 0.6, delay: 0.3, ease: 'power2.out' },
    );
  }, []);

  return (
    <div
      ref={cardRef}
      className="overflow-hidden w-[190px] h-fit rounded-lg border-1 border-[#ffffff10] backdrop-blur-xl bg-[#ffffff2c] shadow-[inset_0_0_25px_rgba(255,255,255,.3),0_20px_25px_-5px_rgba(0,0,0,0.08),0_10px_10px_-5px_rgba(0,0,0,0.02)] flex flex-row justify-end">
      <div className="temp-wrapper text-center p-[20px_20px_18px_20px] w-fit">
        <div className="monospaced weather text-[#ffffff] pb-1 text-[10px]">{label}</div>
        <div className="temperature font-body flex justify-center text-accent mr-[-3px]">
          <span className="text-[40px] semibold leading-[1] tracking-[1.5px]">{currentTemp}</span>{' '}
          <span className="text-[30px] leading-[1.15]">°</span>
        </div>
      </div>
      <Image
        src="/images/home/leessummitMO.svg"
        className="absolute left-[10px] top-[10px] z-2"
        alt=""
        width={90}
        height={90}
      />
    </div>
  );
};

export default TemperaturePaneCard;
