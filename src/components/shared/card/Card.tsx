import { cn } from '@/utils/cn';
import Image from 'next/image';
import LinkButton from '../../ui/button/LinkButton';

interface CardProps {
  imgURL: string;
  title: string;
  description: string;
  linkURL: string;
  linkText: string;
  lqip: string;
  linkQuestion: boolean
}

const Card = ({ imgURL = '', title, description, linkURL = '', linkText = '', lqip = '', linkQuestion = false }: CardProps) => {
  return (
    <article className="text-left bg-[#f3f2f1]">
      <div className="bg-[#ffffff] relative overflow-hidden rounded-[20px] transition-transform duration-500 hover:transition-transform hover:duration-500 border border-[#80808021] ">
        {imgURL.length > 0 && (
          <figure className="h-[260px] max-w-full overflow-hidden xl:max-w-[609px]">
            <Image
              src={imgURL}
              placeholder="blur"
              blurDataURL={lqip}
              width={409}
              height={250}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </figure>
        )}

        <div className="space-y-6 p-6">
          <div>
            <h3 className="sm:text-heading-5 md:text-[20px] mb-2 semibold leading-[1.3]">{title}</h3>
            <p className="text-tagline-1 text-[15px]">{description}</p>
          </div>
          <div className="flex justify-start md:block">
            {linkQuestion && (
              <LinkButton
                href={linkURL}
                className="btn btn-md btn-white hover:btn-secondary w-full sm:w-auto"
                aria-label={`Read more about ${title}`}
                target="_blank">
                {linkText}
              </LinkButton>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default Card;
