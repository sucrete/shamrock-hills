import HalfHero from '@/components/ui/HalfHero';
import NewsletterSignup from '@/components/shared/NewsletterSignup';
import Footer from '@/components/shared/footer/Footer';

import BookingEngine from '@/components/book-tee-time/BookingEngine';

import { defaultMetadata } from '@/utils/generateMetaData';
import { Metadata } from 'next';
import { Fragment } from 'react';

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Book Tee Time | Reserve your round at Shamrock Hills Golf Club in Lee's Summit, MO.",
};

const BookTeeTime = () => {
  return (
    <Fragment>
      <main>
        <HalfHero
          BGHeroSrc="/images/hero-images/hv-2.webp"
          imageOffset="-40%"
          imageHeight="200%"
          overlayOpacity=".55"
          heroText="Book Tee Time"
        />
        <BookingEngine />
        {/* <NewsletterSignup className='bg-white' inputFieldClass="placeholder:text-black/70 focus:border-black bg-accent" /> */}
      </main>
      <Footer />
    </Fragment>
  );
};

export default BookTeeTime;
