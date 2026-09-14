'use client';

import RevealAnimation from '../animation/RevealAnimation';
import CTACheckList from './cta/CTACheckList';
import CtaInputForm from './cta/CtaInputForm';
import { cn } from '@/utils/cn';
import Image from 'next/image';

interface CTAV1Props {
  className?: string;
  btnClass?: string;
  ctaBtnText?: string;
  listTextClass?: string;
  inputFieldClass?: string;
  checkListVariant?: 'default' | 'gray';
}

const NewsletterSignup = ({
  btnClass,
  ctaBtnText,
  className,
  listTextClass,
  inputFieldClass,
  checkListVariant = 'default',
}: CTAV1Props) => {
  return (
    <section className={cn("xl:pt-[160px] pt-[50px] xl:pb-[160px] sm:pb-[100px] md:pb-[70px] pb-[1.5rem] bg-background-2", className)}>
      <div className="main-container">
        <RevealAnimation delay={0.1}>
          <div className="flex md:flex-row flex-col pt-8 pb-10 px-6 md:pt-13 md:pb-13 md:px-10 bg-[#eaf5cf] border-white/20 border-[1.5px] rounded-[20px] justify-between align-middle">
            <div className="md:basis-[45%] flex flex-col justify-center pb-6 md:pb-0 text-center md:text-left">
              {/* <p className="text-[32px] text-accent leading-[1.1]">Newsletter Signup.</p> */}
              <p className="newsletter-heading text-[30px] md:text-[35px] text-black tracking-[-1px] leading-[1.1] font-serif font-[500] pt-5 md:pt-0 -mt-[1.25rem]">
                {' '}
                <span className="newsletter-icon-wrapper inline-block -mb-[.75rem] md:-mb-[1.25rem] -ml-[1rem]">
                  <Image src={'/images/shared/golf-ball.png'} width={70} height={70} alt="" className='ball-graphic w-[50px] md:w-[70px] md:mt-0'/>
                </span>
                Stay up-to-date on Bushwood
                 news and exclusives. 
                {/* <span className="text-white">→</span> */}
              </p>
            </div>
            <div className="md:max-w-[45%] flex flex-col justify-center align-middle pr-[1rem]">
              <div className="form-wrapper">
                <CtaInputForm btnClass={btnClass} ctaBtnText='Sign Up' inputFieldClass={inputFieldClass}/>
                <CTACheckList
                  className="xl:justify-start gap-x-4 gap-y-5 sm:gap-x-6 sm:gap-y-0 pt-5 pl-1"
                  listAnimationDelay={.5}
                  ctaCheckListData={[
                    {
                      id: '1',
                      text: 'All the latest news',
                    },
                    {
                      id: '2',
                      text: 'Subscriber exclusives',
                    },
                  ]}
                  listTextClass={listTextClass}
                  checkListVariant={checkListVariant}
                />
              </div>
            </div>
          </div>
        </RevealAnimation>
      </div>
    </section>
  );
};

export default NewsletterSignup;
