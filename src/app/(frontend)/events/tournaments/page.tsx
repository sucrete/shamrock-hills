import HalfHero from '@/components/ui/HalfHero';
import Footer from '@/components/shared/footer/Footer';
import TournamentInquiryForm from '@/components/tournaments/TournamentInquiryForm';

import { defaultMetadata } from '@/utils/generateMetaData';
import { Metadata } from 'next';
import { Fragment } from 'react';

import { sanityFetch } from '@/sanity/lib/live';
import { TOURNAMENTS_QUERY } from '@/sanity/lib/queries';

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Tournaments | Shamrock Hills Golf Club',
};

const Tournaments = async () => {
  const { data } = await sanityFetch({ query: TOURNAMENTS_QUERY });

  return (
    <Fragment>
      <main className="bg-background-2">
        <HalfHero
          BGHeroSrc="/images/shamrock-hills/banners/banner-5.webp"
          imageOffset="-15%"
          imageHeight="170%"
          overlayOpacity=".35"
          heroText="Tournaments"
        />
        {data?.body && (
          <section className="py-20 md:py-28 lg:py-[140px]">
            <div className="main-container mx-auto max-w-[900px]">
              <div className="tinymce-content" dangerouslySetInnerHTML={{ __html: data.body }} />
            </div>
          </section>
        )}
        <section className="px-5 pt-12 pb-20 md:pt-12 md:pb-28 lg:pt-16 lg:pb-[140px]">
          <TournamentInquiryForm />
        </section>
      </main>
      <Footer />
    </Fragment>
  );
};

export default Tournaments;
