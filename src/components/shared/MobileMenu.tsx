'use client';

import { useMobileMenuContext } from '@/context/MobileMenuContext';
import { navLeft, navRight } from '@/data/header';
import { cn } from '@/utils/cn';
import gsap from 'gsap';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import NavCTAButton from './header/NavCTAButton';
import Image from 'next/image';

import Clover from '@public/images/icons/sh-clover.svg'

const mobileNavEntries = [...navLeft, ...navRight];

const MobileMenu = () => {
  const { isOpen, closeMenu } = useMobileMenuContext();
  const sidebarRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [openGroupId, setOpenGroupId] = useState<string | null>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, closeMenu]);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    if (isOpen) {
      gsap.set(overlay, { display: 'block' });
      const tween = gsap.fromTo(
        overlay,
        { opacity: 0, backdropFilter: 'blur(0px)' },
        { opacity: 1, backdropFilter: 'blur(6px)', duration: 0.35, ease: 'power2.out' },
      );
      return () => { tween.kill(); };
    } else {
      const tween = gsap.to(overlay, {
        opacity: 0,
        backdropFilter: 'blur(0px)',
        duration: 0.25,
        ease: 'power2.in',
        onComplete: () => { gsap.set(overlay, { display: 'none' }); },
      });
      return () => { tween.kill(); };
    }
  }, [isOpen]);

  useEffect(() => {
    const items = listRef.current ? Array.from(listRef.current.querySelectorAll('li')) : [];
    const cta = ctaRef.current;
    const targets = cta ? [...items, cta] : items;

    if (isOpen) {
      const tween = gsap.fromTo(
        targets,
        { opacity: 0, x: 5 },
        { opacity: 1, x: 0, duration: 0.5, stagger: 0.05, delay: 0.15, ease: 'power2.out' },
      );
      return () => { tween.kill(); };
    } else {
      gsap.set(targets, { opacity: 0, y: 1 });
    }
  }, [isOpen]);

  return (
    <>
    {mounted && createPortal(
      <>
        <div
          ref={overlayRef}
          className="fixed inset-0 z-[998] bg-black/20 hidden xl:hidden"
          aria-hidden="true"
        />
        <aside
          ref={sidebarRef}
          className={cn(
            'fixed top-0 right-0 z-[999] h-screen bg-white transition-transform duration-300 ease-in-out w-[95%] xl:hidden flex flex-col',
            isOpen ? 'translate-x-0' : 'translate-x-full',
          )}>
          <div className="flex items-center justify-between pl-6 pr-4 py-6 sm:px-6 sm:py-6">
            <Image className='size-8' src={Clover} width={100} height={100} alt=''/>
            <button
              onClick={closeMenu}
              className="relative flex size-5 cursor-pointer items-center justify-center transition-all duration-200"
              aria-label="Close mobile menu">
              <span className="sr-only">Close Menu</span>
              <span className="absolute block h-[1.5px] w-6 bg-[#2c2c2c] rotate-45" />
              <span className="absolute block h-[1.5px] w-6 bg-[#2c2c2c] -rotate-45" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto pt-5 px-10 sm:px-8">
            <ul ref={listRef}>
              {mobileNavEntries.map((entry) =>
                entry.kind === 'link' ? (
                  <li key={entry.id}>
                    <Link
                      href={entry.href}
                      onClick={closeMenu}
                      className="block py-2 text-[14px] medium text-black hover:text-black transition-colors"
                      {...(entry.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                      {entry.label}
                    </Link>
                  </li>
                ) : (
                  <li key={entry.id}>
                    <button
                      type="button"
                      onClick={() => setOpenGroupId((current) => (current === entry.id ? null : entry.id))}
                      aria-expanded={openGroupId === entry.id}
                      className="flex w-full items-center justify-between py-2 text-[14px] medium text-black">
                      {entry.label}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        className={cn(
                          'size-4 transition-transform duration-300',
                          openGroupId === entry.id && 'rotate-180',
                        )}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                      </svg>
                    </button>
                    {openGroupId === entry.id && (
                      <ul className="pb-2 pl-4 border-l border-[#004a3b14]">
                        {entry.items.map((item) => (
                          <li key={item.id}>
                            <Link
                              href={item.href}
                              onClick={closeMenu}
                              className="block py-2 text-[14px] medium text-black/70 hover:text-black transition-colors">
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ),
              )}
            </ul>

            <div ref={ctaRef} className=" pt-6 pb-6 sm:pb-8">
              <NavCTAButton
                href="/book-tee-time"
                className="flex"
                btnClassName="btn-header-bushwood hover:btn-white-dark w-full justify-center"
                label="Book Tee Time"
                onClick={closeMenu}
              />
            </div>
          </nav>
        </aside>
      </>,
      document.body
    )}
    </>
  );
};

export default MobileMenu;
