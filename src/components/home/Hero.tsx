import heroVectorImg from '@public/images/home-page-34/hero-vector.svg';
import RevealAnimation from '../animation/RevealAnimation';
import Link from 'next/link';
import LinkButton from '../ui/button/LinkButton';
import TemperaturePaneCard from './TemperaturePaneCard';
import ParallaxImageBackground from '../ui/ParallaxImageBackground';
import { cn } from '@/utils/cn';
import Image from 'next/image';
import NavCTAButton from '../shared/header/NavCTAButton';

import Drone from '@public/images/icons/quadcopter.png';

import { fetchWeather, getWeatherLabel } from '@/utils/weather';

const Hero = async () => {
  const data = await fetchWeather();
  const currentTemp = data ? Math.round(data.current.temperature_2m) : '--';
  const label = data ? getWeatherLabel(data.current.weather_code, data.current.wind_speed_10m) : '';
  const HeadingContent = () => (
    <>
      Welcome to Shamrock <br /> Hills Golf Club
    </>
  );

  return (
    // saved classNames -> h-[99svh] xl:max-h-[90svh]
    <section className="bg-cover bg-[url('/images/shamrock-hills/hero.webp')] bg-top bg-no-repeat relative z-20 h-[600px] md:h-[99svh]">
      <ParallaxImageBackground
        src="/images/shamrock-hills/hero.webp"
        offset="-20%"
        sizes="(max-width: 768px) 200vw, 100vw"
      />
      <div className="top-0 left-0 absolute h-[100%] w-[100%] -z-1 bg-scrim-hero-darker opacity-70"></div>

      <div className="facebook-link absolute left-6 md:left-[6.25rem] bottom-[3rem] md:bottom-10 hidden md:block w-fit">
        <RevealAnimation delay={0.8} direction="left" offset={5}>
          <a
            // TODO: swap in Shamrock Hills' real Facebook URL.
            href="https://www.facebook.com/ShamrockHillsGolfClub"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Shamrock Hills Golf Club on Facebook (opens in new tab)"
            className="block group w-[42px] h-[42px] hover:w-[124px] transition-[width] duration-[250ms] ease-in-out overflow-hidden rounded-full backdrop-blur-xl bg-white/10 border border-[#ffffff30] shadow-[0_20px_25px_-5px_rgba(0,0,0,0.08),0_10px_10px_-5px_rgba(0,0,0,0.02),inset_0_0_10px_rgba(236,236,236,0.18)]">
            <img
              src="/images/icons/f.svg"
              alt=""
              aria-hidden="true"
              className="absolute left-[16px] top-1/2 -translate-y-1/2 h-[17px] w-auto"
            />
            <img
              src="/images/icons/acebook.svg"
              alt=""
              aria-hidden="true"
              className="absolute left-[25px] top-1/2 -translate-y-1/2 h-[17px] w-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
          </a>
        </RevealAnimation>
      </div>

      <div className="temperature-pane hidden md:block absolute md:right-[6.25rem] md:bottom-[3rem]">
        {/* shadow-[0_20px_25px_-5px_rgba(0,0,0,0.08),0_10px_10px_-5px_rgba(0,0,0,0.02),inset_0_0_20px_rgba(236,236,236,0.18)] */}
        <TemperaturePaneCard currentTemp={currentTemp} label={label} />
      </div>
      <div className="main-container center-it top-[54%] min-w-[90vw] md:min-w-[1290px]">
        <div className="text-center space-y-2 md:space-y-4">
          <RevealAnimation delay={0.1} offset={40}>
            {/* 1. Relative Container for the "Stack" */}
            <div className="relative inline-block max-w-[90vw] md:max-w-[776px] mx-auto leading-[1.1] text-center overflow-visible h-fit">
              {/* 2. The Real Heading (Visible Gradient) */}
              <h1 className="hero-heading text-[1.75rem] sm:text-[3.5rem] md:text-[2.75rem] -tracking-[.5px] pb-[0px] -mb-[0.25em] area-light relative text-[#fff]">
                <HeadingContent />
              </h1>
            </div>
          </RevealAnimation>
          <RevealAnimation delay={0.2} offset={40}>
            <p className="lg:max-w-[500px] md:max-w-[500px] sm:max-w-[500px] max-w-[380px] mx-auto text-[#ffffffea] text-[12px] md:text-[14px]">
              Step away from the day-to-day with an engaging round of golf on our beautiful, 170-acre course. Enjoy the
              best of what Lee Summit's countryside has to offer and book a tee time today!
            </p>
          </RevealAnimation>
        </div>
        <div className="button-group flex flex-row space-x-2 w-fit mx-auto pt-5">
          <RevealAnimation delay={0.3} offset={20}>
            <Link className="btn btn-md border-none before:top-[calc(50%-2px)]" href={'/course'}>
              <span className="text-accent">
                <Image className="size-8 inline-block -mt-[3px] mr-2" src={Drone} width={100} height={100} alt="" />
                Course Tour
              </span>
            </Link>
          </RevealAnimation>
          <RevealAnimation delay={0.4} offset={20}>
            <Link
              className="btn btn-md bg-[#ffffff2f] transition-colors border-[#ffffff1f] backdrop-blur-sm hover:bg-[#ffffff40]"
              href={'/events'}>
              <span className="text-accent">Events</span>
            </Link>
          </RevealAnimation>
        </div>
      </div>
    </section>
  );
};

export default Hero;
