import { BushwoodLogoScript } from '../../svg-components/BushwoodLogos';
import Link from 'next/link';

interface BushwoodLogoBoxProps {
  classNameProp?: string;
}
const BushwoodLogoBox = ({ classNameProp }: BushwoodLogoBoxProps) => {
  return (
    <div
      className={`absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-[175px] md:w-[210px] duration-400 ${classNameProp == 'bushwood-logo-is-scrolled' ? 'top-[56%] scale-100' : ' top-[68%] scale-100 md:scale-130'}`}>
      <Link href="/">
        <span className="sr-only">Home</span>
        <figure className="max-w-[100%] duration-500">
          <BushwoodLogoScript className={classNameProp} />
        </figure>
      </Link>
    </div>
  );
};

export default BushwoodLogoBox;
