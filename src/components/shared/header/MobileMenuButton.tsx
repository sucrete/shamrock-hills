'use client';

import { HamburgerIcon } from '@/icons';
import { useMobileMenuContext } from '@/context/MobileMenuContext';
import { cn } from '@/utils/cn';

interface MMButtonProps {
  className?: string;
  isScrolled?: boolean;
}

const MobileMenuButton = ({ className = '', isScrolled = false }: MMButtonProps) => {
  const { openMenu } = useMobileMenuContext();

  return (
    <div className="block xl:hidden">
      <button
        onClick={openMenu}
        className={cn(
          'nav-hamburger relative bg-transparent sm:bg-background-4 sm:hover:bg-ns-dark-green flex size-10 sm:size-12 cursor-pointer flex-col items-center justify-center rounded-full transition-all duration-200 group',
          className,
        )}
        aria-label="Open mobile menu">
        <span className="sr-only">Menu</span>
        <span
          className="block w-6 transition-colors duration-300"
          // style={{ color: isScrolled ? '#070b10' : 'var(--color-accent)' }}
          >
          <HamburgerIcon className={cn(isScrolled ? 'text-[#070b10]': 'text-[#fff] sm:text-[#070b10]')} />
        </span>
      </button>
    </div>
  );
};

export default MobileMenuButton;
