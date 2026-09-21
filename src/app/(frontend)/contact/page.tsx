import HalfHero from '@/components/ui/HalfHero';
import NewsletterSignup from '@/components/shared/NewsletterSignup';
import Footer from '@/components/shared/footer/Footer';
import ContactInfo from '@/components/contact/ContactInfo';
import ContactForm from '@/components/contact/ContactForm';
import ContactMap from '@/components/contact/ContactMap';
import WhereToFindUs from '@/components/contact/WhereToFindUs';

import { defaultMetadata } from '@/utils/generateMetaData';
import { Metadata } from 'next';
import { Fragment } from 'react';

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Contact Us | Shamrock Hills Golf Club in Lee's Summit, MO",
};

const Contact = () => {
  return (
    <Fragment>
      <main>
        <HalfHero
          BGHeroSrc="/images/shamrock-hills/banners/banner-4.webp"
          imageOffset="-14%"
          imageHeight="130%"
          overlayOpacity=".7"
          heroText="Contact Us"
        />
        <ContactInfo />
        <section className="pt-0 pb-12 px-5 bg-background-4 md:pb-[9rem] lg:pb-[12rem]">
          <ContactForm />
        </section>
        {/* <WhereToFindUs/> */}
        {/* <NewsletterSignup
          className="bg-background-2" 
          inputFieldClass="placeholder:text-black/70 focus:border-black bg-accent"
        /> */}
      </main>
      <Footer />
    </Fragment>
  );
};

export default Contact;
