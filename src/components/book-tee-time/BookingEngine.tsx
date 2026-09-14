'use client';

import RevealAnimation from '../animation/RevealAnimation';

const BookingEngine = () => {
  return (
    <section className='bg-[#fff]'>
      <div className="main-container py-[2rem] md:py-[10rem]">
        <RevealAnimation delay={0.3}>
          <iframe
            src="https://bookateetime.teequest.com/course/129?selectedHoles=9&walking=true"
            style={{ width: '100%', minHeight: '1000px', border: 'none' }}></iframe>
        </RevealAnimation>
      </div>
    </section>
  );
};
export default BookingEngine;
