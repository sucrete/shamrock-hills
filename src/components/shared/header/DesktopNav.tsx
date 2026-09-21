'use client';

import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import Link from 'next/link';
import { useCallback, useRef, useState } from 'react';
import { NavEntry } from '@/data/header';
import { cn } from '@/utils/cn';

interface DesktopNavProps {
  entries: NavEntry[];
  dark: boolean;
}

const ChevronIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="2"
    stroke="currentColor"
    className="size-4 transition-transform duration-300 group-data-[state=open]/trigger:rotate-180"
    aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
  </svg>
);

// One NavigationMenu.Root per nav cluster (left/right of the logo) — see
// radix-ui.com/primitives/docs/components/navigation-menu for the base Root/
// List/Trigger/Content/Viewport shape. The docs' own Viewport is centered
// once per cluster and doesn't track individual triggers (verified against
// the live docs page) — so on top of that we track each open trigger's
// position via its DOM rect and translate the Viewport wrapper to sit under
// it, giving the anchored-per-trigger + slide/grow motion together.
const DesktopNav = ({ entries, dark }: DesktopNavProps) => {
  const listRef = useRef<HTMLUListElement>(null);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  // Whether a trigger in this cluster is currently open — tracked outside state so
  // it's readable synchronously inside the onValueChange callback below.
  const hasOpenItemRef = useRef(false);
  const [offsetLeft, setOffsetLeft] = useState(0);
  const [snapping, setSnapping] = useState(false);

  const trackTrigger = useCallback((id: string) => {
    const trigger = triggerRefs.current[id];
    const list = listRef.current;
    if (!trigger || !list) return;
    const left = trigger.getBoundingClientRect().left - list.getBoundingClientRect().left;

    // Opening fresh (nothing was open a moment ago) should snap straight to the
    // trigger's position, not animate in from wherever the wrapper last sat —
    // that stale-position slide is what showed up as an unwanted travel effect
    // on what should've read as a first hover. Only switching between two
    // already-open triggers should animate.
    if (!hasOpenItemRef.current) {
      setSnapping(true);
      setOffsetLeft(left);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setSnapping(false));
      });
    } else {
      setOffsetLeft(left);
    }
    hasOpenItemRef.current = true;
  }, []);

  const underlineBase =
    "relative before:absolute before:bottom-0 before:left-0 before:h-px before:w-full before:origin-right before:scale-x-0 before:transition-transform before:duration-500 before:content-[''] hover:before:origin-left hover:before:scale-x-100 data-[state=open]:before:origin-left data-[state=open]:before:scale-x-100";

  const itemTextClass = cn(
    'flex items-center gap-1 h-full text-tagline-1 medium transition-colors duration-200 outline-none',
    dark ? 'text-secondary before:bg-secondary' : 'text-white before:bg-white',
    underlineBase,
  );

  return (
    <NavigationMenu.Root
      className="relative"
      onValueChange={(value) => {
        if (value) trackTrigger(value);
        else hasOpenItemRef.current = false;
      }}>
      <NavigationMenu.List ref={listRef} className="m-0 flex list-none items-center gap-6 p-0">
        {entries.map((entry) =>
          entry.kind === 'link' ? (
            <NavigationMenu.Item key={entry.id}>
              <NavigationMenu.Link asChild>
                <Link href={entry.href} className={itemTextClass}>
                  {entry.label}
                </Link>
              </NavigationMenu.Link>
            </NavigationMenu.Item>
          ) : (
            <NavigationMenu.Item key={entry.id} value={entry.id}>
              <NavigationMenu.Trigger
                ref={(el) => {
                  triggerRefs.current[entry.id] = el;
                }}
                className={cn(itemTextClass, 'group/trigger')}>
                {entry.label}
                <ChevronIcon />
              </NavigationMenu.Trigger>
              <NavigationMenu.Content
                className={cn(
                  'absolute top-0 left-0 w-full min-w-[240px] p-2',
                  'data-[motion=from-start]:animate-[nav-enter-from-left_250ms_ease]',
                  'data-[motion=from-end]:animate-[nav-enter-from-right_250ms_ease]',
                  'data-[motion=to-start]:animate-[nav-exit-to-left_250ms_ease]',
                  'data-[motion=to-end]:animate-[nav-exit-to-right_250ms_ease]',
                )}>
                <ul className="space-y-0">
                  {entry.items.map((item) => (
                    <li key={item.id}>
                      <NavigationMenu.Link asChild>
                        <Link
                          href={item.href}
                          className="block rounded-[10px] px-3.5 pt-[8px] pb-[9px] text-[14px] text-secondary/80 transition-colors duration-200 hover:bg-[#55555513] hover:text-secondary">
                          {item.label}
                        </Link>
                      </NavigationMenu.Link>
                    </li>
                  ))}
                </ul>
              </NavigationMenu.Content>
            </NavigationMenu.Item>
          ),
        )}
      </NavigationMenu.List>

      <div
        className={cn(
          'absolute top-full left-0 flex justify-start pt-3 ease-out',
          !snapping && 'transition-transform duration-300',
        )}
        style={{ transform: `translateX(${offsetLeft}px)` }}>
        <NavigationMenu.Viewport
          className={cn(
            'relative h-[var(--radix-navigation-menu-viewport-height)] w-[var(--radix-navigation-menu-viewport-width)]',
            'origin-top overflow-hidden rounded-[16px] bg-[#fffffff7] shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05),0_4px_6px_-4px_rgba(0,0,0,0.05)] backdrop-blur-sm',
            'transition-[width,height] duration-300',
            'data-[state=open]:animate-[nav-scale-in_200ms_ease]',
            'data-[state=closed]:animate-[nav-scale-out_200ms_ease]',
          )}
        />
      </div>
    </NavigationMenu.Root>
  );
};

export default DesktopNav;
