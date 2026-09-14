import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/utils/cn';

import { Logo } from '../../svg-components/Logos';
import WhiteBadge from '@public/images/logos/sh-logo-white.svg';
import TextualLogo from '@public/images/logos/sh-logo-text-flat.svg';
import TextualLogoStacked from '@public/images/logos/sh-logo-type.svg';

interface LogoBoxProps {
  isScrolled?: boolean;
  className?: string;
}
const LogoBox = ({ isScrolled }: LogoBoxProps) => {
  return (
    <div
      className={`absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] md:w-[350px] duration-400 top-0}`}>
      <Link className="relative" href="/">
        <span className="sr-only">Home</span>
        <figure className="max-w-[100%] duration-500 relative">
          {/* <Logo className={isScrolled ? 'fill-black' : 'fill-white'} /> */}
          <Image
            className={cn('transition-opacity duration-200 absolute w-[65px] md:w-[115px] -translate-x-1/2 left-1/2 -top-[25px]', isScrolled ? 'opacity-0' : 'opacity-100')}
            src={WhiteBadge}
            width={300}
            height={350}
            alt=""
          />
          <Image
            className={cn('transition-all duration-200 absolute w-[400px] md:w-[340px]', isScrolled ? 'opacity-100 translate-y-[-6px] md:translate-y-[-12px]' : 'opacity-0 translate-y-[10px]')}
            src={TextualLogo}
            width={300}
            height={350}
            alt=""
          />
        </figure>
      </Link>
    </div>
  );
};

export default LogoBox;
