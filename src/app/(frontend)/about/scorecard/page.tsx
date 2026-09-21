import Image from 'next/image';
import Link from 'next/link';

import HalfHero from '@/components/ui/HalfHero';
import Footer from '@/components/shared/footer/Footer';

import { defaultMetadata } from '@/utils/generateMetaData';
import { Metadata } from 'next';
import { Fragment } from 'react';

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Scorecard | Shamrock Hills Golf Club',
};

const Scorecard = () => {
  return (
    <Fragment>
      <main className="bg-background-4">
        <HalfHero
          BGHeroSrc="/images/shamrock-hills/banners/banner-4.webp"
          imageOffset="-15%"
          imageHeight="120%"
          overlayOpacity=".7"
          heroText="Scorecard"
        />
        <div className="main-container py-[2rem] md:py-[12rem]">
          <Link href={'/images/shamrock-hills/shamrock-hills-scorecard.png'} target="_blank">
            <div className="scorecard-wrapper w-full rounded-[22px] shadow-h transition-transform hover:translate-y-[-2px]">
              <Image
                className="w-full h-full"
                src={'/images/shamrock-hills/shamrock-hills-scorecard.png'}
                width={1400}
                height={700}
                alt=""
              />
            </div>
          </Link>
        </div>
      </main>
      <Footer />
    </Fragment>
  );
};

export default Scorecard;
