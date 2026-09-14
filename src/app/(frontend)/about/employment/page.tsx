import HalfHero from '@/components/ui/HalfHero';
import Footer from '@/components/shared/footer/Footer';

import { defaultMetadata } from '@/utils/generateMetaData';
import { Metadata } from 'next';
import { Fragment } from 'react';

import { sanityFetch } from '@/sanity/lib/live';
import { EMPLOYMENT_QUERY } from '@/sanity/lib/queries';

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Employment & Volunteers | Shamrock Hills Golf Club',
};

const Employment = async () => {
  const { data } = await sanityFetch({ query: EMPLOYMENT_QUERY });

  return (
    <Fragment>
      <main className="bg-background-2">
        <HalfHero
          BGHeroSrc="/images/shared/feeling-this-fairway.jpg"
          imageOffset="-27%"
          imageHeight="170%"
          overlayOpacity=".35"
          heroText="Employment & Volunteers"
        />
        {data?.body && (
          <section className="py-20 md:py-28 lg:py-[140px]">
            <div className="main-container mx-auto max-w-[900px]">
              <div className="tinymce-content" dangerouslySetInnerHTML={{ __html: data.body }} />
            </div>
          </section>
        )}
      </main>
      <Footer />
    </Fragment>
  );
};

export default Employment;
