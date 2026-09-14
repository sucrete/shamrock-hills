import HalfHero from '@/components/ui/HalfHero';
import CourseInfo from '@/components/course/CourseInfo';
import HoleTourCarousel from '@/components/course/HoleTourCarousel';
import NewsletterSignup from '@/components/shared/NewsletterSignup';

import Footer from '@/components/shared/footer/Footer';

import { defaultMetadata } from '@/utils/generateMetaData';
import { Metadata } from 'next';
import { Fragment } from 'react';

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Course Layout | A preview of each hole at Shamrock Hills Golf Club.',
};

const Course = () => {
  return (
    <Fragment>
      <main>
        <HalfHero
          BGHeroSrc="/images/shamrock-hills/sh-12.webp"
          imageOffset="-15%"
          imageHeight="120%"
          overlayOpacity=".4"
          heroText="Course"
        />
        <CourseInfo />
        <HoleTourCarousel />
      </main>
      <Footer />
    </Fragment>
  );
};

export default Course;
