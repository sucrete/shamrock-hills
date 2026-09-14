'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react';
import doubleArrow from '@public/images/double-arrow.svg';
import { cn } from '@/utils/cn';
import RevealAnimation from '../animation/RevealAnimation';

interface Hole {
  number: number;
  videoId: string | null;
}

// Video IDs pulled from shamrockhills.com/About/CourseTour. Holes 5 and 13
// have no video on the live site ("Coming soon...") — Hole 5's scraped ID
// (un5KFa6X884) 404s on YouTube's oEmbed endpoint, a dead link on the live
// site itself, not a scraping error.
const HOLES: Hole[] = [
  { number: 1, videoId: 'Gju_d87UP5Q' },
  { number: 2, videoId: 'CJRk2lzDlF4' },
  { number: 3, videoId: 'T_sGB6q1H8I' },
  { number: 4, videoId: 've3Ix_00Dok' },
  { number: 5, videoId: null },
  { number: 6, videoId: 'cvcTihVVcLw' },
  { number: 7, videoId: 'D7mN9fivq60' },
  { number: 8, videoId: 'DY7Ip9uMEwU' },
  { number: 9, videoId: 'HIHndmyIUb0' },
  { number: 10, videoId: 'QPCzWk8esRQ' },
  { number: 11, videoId: 'scwjbfYCzT0' },
  { number: 12, videoId: 'Qc8uS7vpiLY' },
  { number: 13, videoId: null },
  { number: 14, videoId: 'Wz76vydaLrQ' },
  { number: 15, videoId: 'KnBh-oNjNAE' },
  { number: 16, videoId: 'nmM4-zSRt5I' },
  { number: 17, videoId: 'Xg7pbAozm0Y' },
  { number: 18, videoId: 'R4LsrXNpiRw' },
];

const FRONT_NINE = HOLES.slice(0, 9);
const BACK_NINE = HOLES.slice(9, 18);

type DockEntry =
  | { kind: 'hole'; hole: Hole; index: number }
  | { kind: 'arrow'; label: string; rotated: boolean; onClick: () => void };

// Shared Aceternity-style magnify physics: a circle directly under the cursor
// grows to 80px, tapering back to 40px by ±150px away, so a few neighbors on
// either side visibly grow too, not just the hovered one.
const useDockMagnify = (mouseX: MotionValue<number>, ref: React.RefObject<HTMLDivElement | null>) => {
  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });
  const sizeTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
  const fontSizeTransform = useTransform(distance, [-150, 0, 150], [15, 28, 15]);
  const size = useSpring(sizeTransform, { mass: 0.1, stiffness: 150, damping: 12 });
  const fontSize = useSpring(fontSizeTransform, { mass: 0.1, stiffness: 150, damping: 12 });
  return { size, fontSize };
};

const DockTooltip = ({ label }: { label: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 10, x: '-50%' }}
    animate={{ opacity: 1, y: 0, x: '-50%' }}
    exit={{ opacity: 0, y: 2, x: '-50%' }}
    className="font-monospace absolute -top-8 left-1/2 w-fit rounded-md bg-[#01251e] px-2 pt-1 pb-1.5 text-[10px] font-[500] tracking-[0.15px] whitespace-pre text-white uppercase shadow-[0_4px_12px_rgba(0,0,0,0.25)]">
    {label}
  </motion.div>
);

// Ported near-verbatim from Aceternity's Floating Dock component
// (ui.aceternity.com/components/floating-dock), swapping framer-motion's
// icon slot for a plain hole number and neutral/gray-scale classes for the
// site's own dark-green palette.
const HoleDockIcon = ({
  mouseX,
  hole,
  selected,
  onClick,
}: {
  mouseX: MotionValue<number>;
  hole: Hole;
  selected: boolean;
  onClick: () => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const { size, fontSize } = useDockMagnify(mouseX, ref);

  return (
    <button type="button" onClick={onClick} aria-label={`Hole ${hole.number}`} className="cursor-pointer">
      <motion.div
        ref={ref}
        style={{ width: size, height: size }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={cn(
          'relative flex aspect-square items-center justify-center rounded-full',
          selected ? 'bg-ns-green text-[#01251e]' : 'bg-[#173730] text-white/80',
        )}>
        <AnimatePresence>{hovered && <DockTooltip label="Hole" />}</AnimatePresence>
        <motion.span style={{ fontSize }} className="font-heading relative -bottom-[1.5px] font-medium">
          {hole.number}
        </motion.span>
      </motion.div>
    </button>
  );
};

// Same dock circle, but for the "Back 9" / "Front 9" pagination arrow instead
// of a hole number — reuses the exact same magnify math so it grows/shrinks
// in step with its neighboring hole circles.
const ArrowDockIcon = ({
  mouseX,
  label,
  rotated,
  onClick,
}: {
  mouseX: MotionValue<number>;
  label: string;
  rotated: boolean;
  onClick: () => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const { size } = useDockMagnify(mouseX, ref);
  const iconSize = useTransform(size, (s) => s / 3.125);

  return (
    <button type="button" onClick={onClick} aria-label={label} className="cursor-pointer">
      <motion.div
        ref={ref}
        style={{ width: size, height: size }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative flex aspect-square items-center justify-center rounded-full bg-[#173730] text-white/80">
        <AnimatePresence>{hovered && <DockTooltip label={label} />}</AnimatePresence>
        <motion.div style={{ width: iconSize, height: iconSize }} className={cn('relative', rotated && 'rotate-180')}>
          <Image src={doubleArrow} alt="" fill className="object-contain opacity-80 brightness-0 invert" />
        </motion.div>
      </motion.div>
    </button>
  );
};

const HoleDock = ({
  items,
  selectedIndex,
  onSelectHole,
}: {
  items: DockEntry[];
  selectedIndex: number;
  onSelectHole: (index: number) => void;
}) => {
  const mouseX = useMotionValue(Infinity);
  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className="mx-auto flex h-16 w-fit items-end gap-4 rounded-2xl bg-[#01251e] px-4 pb-3">
      {items.map((item) =>
        item.kind === 'hole' ? (
          <HoleDockIcon
            key={`hole-${item.hole.number}`}
            mouseX={mouseX}
            hole={item.hole}
            selected={item.index === selectedIndex}
            onClick={() => onSelectHole(item.index)}
          />
        ) : (
          <ArrowDockIcon
            key={`arrow-${item.label}`}
            mouseX={mouseX}
            label={item.label}
            rotated={item.rotated}
            onClick={item.onClick}
          />
        ),
      )}
    </motion.div>
  );
};

// Below 611px there's no room for the floating dock's front-nine/back-nine
// pagination, so all 18 holes are laid out at once in a static 2x9 grid
// instead — same rounded container + ns-green "active" styling as the
// desktop dock at rest, but no magnify/hover behavior and no tooltip labels.
// Grid columns are fluid (no hardcoded circle size), so this can never grow
// wider than the carousel itself.
const HoleGridMobile = ({
  selectedIndex,
  onSelectHole,
}: {
  selectedIndex: number;
  onSelectHole: (index: number) => void;
}) => (
  <div className="grid grid-cols-9 gap-1.5 rounded-2xl bg-[#01251e] p-2.5">
    {HOLES.map((hole, index) => (
      <button
        key={hole.number}
        type="button"
        onClick={() => onSelectHole(index)}
        aria-label={`Hole ${hole.number}`}
        className={cn(
          'font-heading flex aspect-square w-full cursor-pointer items-center justify-center rounded-full text-[11px] font-medium',
          index === selectedIndex ? 'bg-ns-green text-[#01251e]' : 'bg-[#173730] text-white/80',
        )}>
        {hole.number}
      </button>
    ))}
  </div>
);

const HoleTourCarousel = () => {
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel({});
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [page, setPage] = useState<0 | 1>(0);

  const goToIndex = useCallback(
    (index: number) => {
      emblaMainApi?.scrollTo(index);
    },
    [emblaMainApi],
  );

  const goBackNine = useCallback(() => {
    setPage(1);
    goToIndex(9);
  }, [goToIndex]);

  const goFrontNine = useCallback(() => {
    setPage(0);
    goToIndex(8);
  }, [goToIndex]);

  const onSelect = useCallback(() => {
    if (!emblaMainApi) return;
    const index = emblaMainApi.selectedScrollSnap();
    setSelectedIndex(index);
    setPage(index >= 9 ? 1 : 0);
  }, [emblaMainApi]);

  useEffect(() => {
    if (!emblaMainApi) return;
    onSelect();
    emblaMainApi.on('select', onSelect).on('reInit', onSelect);
  }, [emblaMainApi, onSelect]);

  const frontNineItems = useMemo<DockEntry[]>(
    () => [
      ...FRONT_NINE.map((hole, index): DockEntry => ({ kind: 'hole', hole, index })),
      { kind: 'arrow', label: 'Back 9', rotated: false, onClick: goBackNine },
    ],
    [goBackNine],
  );

  const backNineItems = useMemo<DockEntry[]>(
    () => [
      { kind: 'arrow', label: 'Front 9', rotated: true, onClick: goFrontNine },
      ...BACK_NINE.map((hole, i): DockEntry => ({ kind: 'hole', hole, index: i + 9 })),
    ],
    [goFrontNine],
  );

  return (
    <section className="course-tour-carousel bg-background-2 py-16 md:py-24">
      <div className="main-container">
        <RevealAnimation delay={0.1}>
          <div className="mx-auto w-full max-w-[950px]">
            {/* Main carousel */}
            <div className="overflow-hidden" ref={emblaMainRef}>
              <div className="-ml-4 flex touch-pan-y">
                {HOLES.map((hole) => (
                  <div key={hole.number} className="min-w-0 shrink-0 grow-0 basis-full pl-4">
                    <div className="flex h-[280px] w-full select-none items-center justify-center overflow-hidden rounded-2xl bg-background-1 md:h-[420px] lg:h-[528px]">
                      {hole.videoId ? (
                        <iframe
                          className="h-full w-full border-0"
                          src={`https://www.youtube.com/embed/${hole.videoId}`}
                          title={`Shamrock Hills Golf Club — Hole ${hole.number} flyover`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          referrerPolicy="strict-origin-when-cross-origin"
                          allowFullScreen
                        />
                      ) : (
                        <p className="text-tagline-1 text-black/50">Coming soon...</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hole dock, paginated front-nine / back-nine. Both docks are
                absolutely positioned in the same spot so the outgoing one can
                slide up and fade out while the incoming one slides up and
                fades in from below, at the same time. */}
            <div className="relative mt-8 hidden h-16 min-[611px]:block">
              <AnimatePresence initial={false}>
                <motion.div
                  key={page}
                  className="absolute inset-x-0 flex justify-center"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut', delay: 0.12 } }}
                  exit={{ opacity: 0, y: -5, transition: { duration: 0.16, ease: 'easeIn' } }}>
                  <HoleDock
                    items={page === 0 ? frontNineItems : backNineItems}
                    selectedIndex={selectedIndex}
                    onSelectHole={goToIndex}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-8 min-[611px]:hidden">
              <HoleGridMobile selectedIndex={selectedIndex} onSelectHole={goToIndex} />
            </div>
          </div>
        </RevealAnimation>
      </div>
    </section>
  );
};

export default HoleTourCarousel;
