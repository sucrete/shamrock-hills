'use client';

import RevealAnimation from '../animation/RevealAnimation';

import ParallaxImageBackground from './ParallaxImageBackground';
import ProgressiveBlur from './ProgressiveBlur';
interface HalfHeroProps {
  heroText?: string;
  BGHeroSrc?: string;
  imageOffset?: string;
  overlayOpacity?: string;
  imageHeight?: string;
}

const HalfHero = ({
  heroText,
  BGHeroSrc = '/images/hero-images/aaa-golf-course-2.jpg',
  imageHeight = '120%',
  imageOffset = '-10%',
  overlayOpacity = '.7',
}: HalfHeroProps) => {
  return (
    // saved classNames ->  h-[99svh] xl:max-h-[90svh]
    <section className=" bg-bushwood bg-cover bg-top bg-no-repeat relative z-20 h-[280px] sm:h-[380px] md:h-[500px] overflow-hidden">
      {/* <ProgressiveBlur blurBlockHeight="150px" /> */}
      <ParallaxImageBackground src={BGHeroSrc} offset={imageOffset} height={imageHeight} />
      <div
        className="bg-scrim-top top-0 left-0 absolute h-[100%] w-[100%] -z-1"
        style={{ opacity: overlayOpacity }}></div>
      <div className="absolute w-full bottom-3 px-3 md:bottom-5 z-5 lg:px-20 xl:px-25">
        <RevealAnimation delay={0.1} offset={10}>
          <div className="h1-wrapper flex w-full max-w-[1920px] mx-auto">
            <div className="prophylactic">
              {heroText && <h1 className="text-[#ffffff] text-[1.5rem] sm:text-[3rem]">{heroText}</h1>}
            </div>
          </div>
        </RevealAnimation>
      </div>
    </section>
  );
};

export default HalfHero;
