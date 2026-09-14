import RevealAnimation from '@/components/animation/RevealAnimation';
import { cn } from '@/utils/cn';
import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';

import Logo from '@public/images/logos/sh-logo-white.svg';
import MGALogo from '@public/images/shared/mga-logo.svg';
import facebook from '@public/images/icons/facebook.svg';
import instagram from '@public/images/icons/instagram.svg';

import WeatherModule from './WeatherModule';
import NewsletterSignup from './NewsletterSignup';

import TQSGears from './TQSGears';

interface FooterOneProps {
  className?: string;
}

const FooterOne: FC<FooterOneProps> = ({ className }) => {
  return (
    <footer
      className={cn(
        'bg-[#00251e] relative h-auto xl:h-[850px] bg-[radial-gradient(ellipse_400%_120%_at_40%_0%,#01251e,#011914)]',
        className,
      )}>
      <div className="main-container">
        <div className="grid grid-cols-16 justify-between gap-x-0 gap-y-5 md:gap-y-16 pt-16 pb-[4.5rem] xl:pt-[6rem] md:pr-2">
          <div className="col-span-16 lg:col-span-4">
            <RevealAnimation delay={0.1} offset={20}>
              <div className="max-w-[100%] md:max-w-[200px] flex flex-col items-center mx-auto lg:mx-0">
                <Link href="/">
                  <figure className="max-w-[125px]">
                    <Image src={Logo} width={400} height={400} alt="" />
                  </figure>
                </Link>
              </div>
            </RevealAnimation>
            <RevealAnimation delay={0.25} offset={10}>
              <div className="flex justify-center items-center gap-3 mt-5 max-w-[100%] md:max-w-[200px]">
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://www.facebook.com/ShamrockHillsGolfClub"
                  className="footer-social-link">
                  <span className="sr-only">Facebook</span>
                  <Image className="size-6" src={facebook} alt="Facebook" />
                </a>
                <div className="bg-stroke-1/25 h-6 w-px"></div>
                {/* TODO: swap in Shamrock Hills' real Instagram URL once confirmed. */}
                <a target="_blank" rel="noopener noreferrer" href="#" className="footer-social-link">
                  <span className="sr-only">Instagram</span>
                  <Image className="size-6" src={instagram} alt="Instagram" />
                </a>
              </div>
            </RevealAnimation>
          </div>
          <div className="col-span-16 grid grid-cols-1 md:gap-x-10 gap-y-12 md:grid-cols-3 md:gap-y-8 lg:col-span-12">
            <div className="space-y-6 pt-4 col-span-1 max-md:**:text-center">
              <RevealAnimation delay={0.3} offset={15}>
                <p className="text-accent/60 pb-2">Hours</p>
                <p className="text-accent md:max-w-[306px]">
                  Pro Shop: 7:30am - 9:00pm
                  <br /> Clubhouse: 8:00am - 9:00pm
                </p>
              </RevealAnimation>
              <RevealAnimation delay={0.4} offset={7}>
                <p className="text-accent/60 pb-2">Location</p>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://maps.app.goo.gl/6oWLDHZ4tJtk38mJ9"
                  className="text-accent hover:text-accent/80 transition duration-250 text-[13px] sm:text-[15px]">
                  3161 South 291 Hwy
                  <br />
                  Lee&apos;s Summit, MO 64082
                </a>
              </RevealAnimation>
              <RevealAnimation delay={0.5} offset={7}>
                <p className="text-accent/60 pb-2">Phone</p>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="tel:8165376556"
                  className="text-accent hover:text-accent/80 transition duration-250 text-[13px] sm:text-[15px]">
                  (816) 537-6556
                </a>
              </RevealAnimation>
            </div>
            <div className="col-span-2">
              <RevealAnimation delay={0.6} offset={20}>
                <div>
                  <WeatherModule />
                </div>
              </RevealAnimation>
              <RevealAnimation delay={0.65} offset={20}>
                <NewsletterSignup />
              </RevealAnimation>
            </div>
          </div>
        </div>
        <RevealAnimation delay={0.75} offset={5}>
          <hr className="border-[#ffffff19]" />
        </RevealAnimation>

        <div className="grid grid-cols-1 md:grid-cols-[22%_22%_22%_34%] pt-[4rem] px-2 max-md:space-y-5">
          <div className="space-y-5">
            <RevealAnimation delay={0.1} offset={15}>
              <div className="space-y-3 flex flex-col items-center md:items-start">
                <p className=" text-accent/60">Pages</p>
                <ul className="space-y-0 text-center md:text-left [&_li]:leading-[130%]">
                  <li>
                    <Link href="/greens-fees" className="footer-link">
                      Rates
                    </Link>
                  </li>
                  <li>
                    <Link href="/course" className="footer-link">
                      Course
                    </Link>
                  </li>
                  <li>
                    <Link href="/lessons" className="footer-link">
                      Lessons
                    </Link>
                  </li>
                </ul>
              </div>
            </RevealAnimation>
            <RevealAnimation delay={0.2} offset={15}>
              <div className="space-y-3 flex flex-col items-center md:items-start">
                <p className=" text-accent/60">Events</p>
                <ul className="space-y-0 text-center md:text-left [&_li]:leading-[130%]">
                  <li>
                    <Link href="/events" className="footer-link">
                      Calendar
                    </Link>
                  </li>
                  <li>
                    <Link href="/events/tournaments" className="footer-link">
                      Tournaments
                    </Link>
                  </li>
                </ul>
              </div>
            </RevealAnimation>
          </div>
          <div className="space-y-5">
            <RevealAnimation delay={0.3} offset={15}>
              <div className="space-y-3 flex flex-col items-center md:items-start">
                <p className=" text-accent/60">Leagues</p>
                <ul className="space-y-0 text-center md:text-left [&_li]:leading-[130%]">
                  <li>
                    <Link href="/leagues/couples" className="footer-link">
                      Couples League
                    </Link>
                  </li>
                  <li>
                    <Link href="/leagues/ladies" className="footer-link">
                      Ladies League
                    </Link>
                  </li>
                  <li>
                    <Link href="/leagues/senior" className="footer-link">
                      Senior League
                    </Link>
                  </li>
                </ul>
              </div>
            </RevealAnimation>
            <RevealAnimation delay={0.4} offset={15}>
              <div className="space-y-3 flex flex-col items-center md:items-start">
                <p className=" text-accent/60">Golf Assoc.</p>
                <ul className="space-y-0 text-center md:text-left [&_li]:leading-[130%]">
                  <li>
                    <Link href="/golf-association" className="footer-link">
                      SHGA Home
                    </Link>
                  </li>
                  <li>
                    <Link href="/golf-association/match-play" className="footer-link">
                      Match Play
                    </Link>
                  </li>
                </ul>
              </div>
            </RevealAnimation>
          </div>
          <div className="">
            <RevealAnimation className='max-md:pb-[3rem]' delay={0.5} offset={15}>
              <div className="space-y-3 flex flex-col items-center md:items-start">
                <p className=" text-accent/60">About</p>
                <ul className="space-y-0 text-center md:text-left [&_li]:leading-[130%]">
                  <li>
                    <Link href="/contact" className="footer-link">
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link href="/about/employment" className="footer-link">
                      Employment & Volunteers
                    </Link>
                  </li>
                  <li>
                    <Link href="/about/scorecard" className="footer-link">
                      Scorecard
                    </Link>
                  </li>
                </ul>
              </div>
            </RevealAnimation>
          </div>
          <div className="max-md:border-t max-md:border-[#ffffff19] max-md:pt-[4rem] max-md:pb-[4.5rem]">
            <div className="flex flex-col justify-between h-full text-center md:text-right md:items-end">
              <RevealAnimation delay={0.6} offset={15}>
                <a className='' href="https://www.mogolf.org/" target="_blank">
                  <Image className="w-[150px] md:w-[200px] h-auto max-md:mx-auto max-md:pb-4" src={MGALogo} width={175} height={50} alt="" />
                </a>
              </RevealAnimation>
              <div className="flex flex-col space-y-2">
                <RevealAnimation delay={0.7} offset={7} start="top 105%">
                  <Link href="/studio" className="" target="_blank">
                    <p className="text-accent/60 pt-1">
                      Copyright Shamrock Hills Golf Club © {new Date().getFullYear()}
                    </p>
                  </Link>
                </RevealAnimation>

                <RevealAnimation delay={0.8} offset={7} start="top 105%">
                  <div className="TQS-attribution-wrapper flex flex-row justify-center md:justify-end">
                    <TQSGears />
                    <p className="text-accent/60">Powered by TeeQuest</p>
                  </div>
                </RevealAnimation>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="relative pt-[35px] pb-[100px] text-center">
          <RevealAnimation delay={1} offset={5} duration={2}>
            <figure className="max-w-full">
              <Image className="w-full" src={TextualLogo} width={400} height={400} alt="" />
            </figure>
          </RevealAnimation>
        </div> */}
      </div>
    </footer>
  );
};

export default FooterOne;
