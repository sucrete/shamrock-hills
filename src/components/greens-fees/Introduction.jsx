'use client';

import { ArrowIcon } from '@/icons';
import Image from 'next/image';

import RevealAnimation from '../animation/RevealAnimation';

const Introduction = () => {

  return (
    <section className="xl:py-[100px] lg:py-[90px] md:py-20 py-16 xl:pb-30 bg-background-3 relative">
      <div className="main-container md:space-y-[70px] space-y-10">
        <div className="space-y-5 text-center">
          <RevealAnimation delay={0.2}>
            <span className="badge badge-cyan">Bonus points</span>
          </RevealAnimation>
          <div className="space-y-5">
            <RevealAnimation delay={0.3}>
              <h2 className="max-w-[674px] mx-auto">Perks you can't pass up.</h2>
            </RevealAnimation>
            <RevealAnimation delay={0.4}>
              <p className="max-w-[578px] mx-auto">
                You may not need another incentive to play our beautiful greens but we can try.
              </p>
            </RevealAnimation>
          </div>
        </div>
        <div className="grid grid-cols-12 lg:gap-8 gap-y-8 items-end">
          <RevealAnimation delay={0.1}>
            <div className="col-span-12 lg:col-span-4 h-full">
              <div className="bg-white rounded-[20px] px-8 py-11 border border-[#80808021] h-full">
                {/* <div className="space-y-4 max-h-[130px]"></div>
                 */}

                <div className="space-y-3">
                  {/* <h3 className="text-heading-5 font-normal line-clamp-1">Manage project finances</h3> */}
                  <Image
                    src={'/images/greens-fees/hearthouse-color.svg'}
                    height={23}
                    width={23}
                    alt=""
                    className="mr-3"
                  />
                  <p className="line-clamp-3">
                    Seniors, veterans, and public responders always receive a $2 discount on greens fees.
                  </p>
                </div>
              </div>
            </div>
          </RevealAnimation>
          <RevealAnimation delay={0.2}>
            <div className="col-span-12 lg:col-span-4 h-full">
              <div className="bg-white rounded-[20px] px-8 py-11 border border-[#80808021] h-full">
                <div className="space-y-3">
                  <Image src={'/images/greens-fees/kid-color.svg'} height={27} width={27} alt="" className="mr-3" />
                  {/* <h3 className="text-heading-5 font-normal line-clamp-1">Streamlined data processes</h3> */}
                  <p className="line-clamp-3">
                    Juniors under 10 play free with paid adult greens fee, 7 days a week!
                    </p>
                </div>
              </div>
            </div>
          </RevealAnimation>
          <RevealAnimation delay={0.3}>
            <div className="col-span-12 lg:col-span-4 h-full">
              <div className="bg-white rounded-[20px] px-8 py-11 border border-[#80808021] h-full">
                <div className="space-y-3">
                  {/* <h3 className="text-heading-5 font-normal line-clamp-1">Real-time Analytics &amp; Insights</h3> */}
                  <Image src={'/images/greens-fees/bir-color.svg'} height={27} width={27} alt="" className="mr-3" />
                  <p className="line-clamp-3">
                    All tee times reserved before 8:00 AM include a bucket of range balls and cup of coffee.
                  </p>
                </div>
              </div>
            </div>
          </RevealAnimation>
        </div>
      </div>

      <RevealAnimation delay={0.1}>
        <div className="entrance-group absolute bottom-0 left-0 w-full">
          <a
            href="#rates"
            className="group inline-block rotate-90 absolute bottom-[-3.5rem] left-1/2 -translate-x-1/2 -translate-y-1/2 ">
            <div className="bg-black group-hover:bg-ns-green/90 relative flex size-14 items-center justify-center overflow-hidden rounded-full transition-all duration-[200ms] ease-in-out max-[426px]:size-12">
              <ArrowIcon className="absolute -translate-x-11 opacity-0 transition-all duration-[200ms] ease-in-out group-hover:translate-x-0 group-hover:opacity-100 size-6 stroke-black" />
              <ArrowIcon className="absolute translate-x-0 opacity-100 transition-all duration-[200ms] ease-in-out group-hover:translate-x-10 group-hover:opacity-0 size-6 stroke-white" />
            </div>
          </a>
        </div>
      </RevealAnimation>
    </section>
  );
};

export default Introduction;
