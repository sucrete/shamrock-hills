'use client';

import RevealAnimation from '../animation/RevealAnimation';
import Map from '../shared/Map';
import Image from 'next/image';
import Link from 'next/link';

const WhereToFindUs = () => {
  return (
    <section className=" pb-14 md:pb-16 lg:pb-[88px] xl:pb-[10rem] overflow-hidden bg-background-3">
      <div className="main-container">
        <div className="w-full">
          <RevealAnimation delay={0.6}>
            <div className="rounded-[20px] bg-white p-2.5 w-full">
              <div className="w-full h-[300px] md:h-[400px] lg:h-[480px] overflow-hidden rounded-2xl">
                <Map />
              </div>
            </div>
          </RevealAnimation>
        </div>
      </div>
    </section>
  );
};

export default WhereToFindUs;
