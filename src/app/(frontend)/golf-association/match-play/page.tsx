import HalfHero from '@/components/ui/HalfHero';
import Footer from '@/components/shared/footer/Footer';

import { defaultMetadata } from '@/utils/generateMetaData';
import { Metadata } from 'next';
import { Fragment } from 'react';

import { sanityFetch } from '@/sanity/lib/live';
import { MATCH_PLAY_QUERY } from '@/sanity/lib/queries';

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Match Play | Shamrock Hills Golf Club',
};

const MatchPlay = async () => {
  const { data } = await sanityFetch({ query: MATCH_PLAY_QUERY });

  return (
    <Fragment>
      <main className="bg-background-2">
        <HalfHero
          BGHeroSrc="/images/shared/feeling-this-fairway.jpg"
          imageOffset="-27%"
          imageHeight="170%"
          overlayOpacity=".35"
          heroText="Match Play"
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

export default MatchPlay;
