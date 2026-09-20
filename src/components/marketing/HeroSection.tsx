'use client';

import { HugeiconsIcon } from "@hugeicons/react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsRightIcon,
} from "@hugeicons/core-free-icons";;
import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export interface HeroImage {
  src: string;
  alt: string;
}

const DEFAULT_IMAGES: HeroImage[] = [
  { src: '/hero-img1.png', alt: 'Callio AI dashboard floating over a bright meadow landscape' },
  { src: '/hero-img2.png', alt: 'Callio AI performance overview over a scenic landscape' },
  { src: '/hero-img3.png', alt: 'Callio AI call analytics over a scenic landscape' },
];

const ROTATE_AFTER_MS = 5000;

export interface HeroSectionProps {
  badgeLead?: string;
  badgeTrail?: string;
  headingTop?: string;
  headingItalic?: string;
  headingEnd?: string;
  subcopy?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  images?: HeroImage[];
  caption?: ReactNode;
}

/**
 * Marketing hero section — pixel-faithful to the approved reference mock.
 *
 * Light canvas (white) with left-aligned Inter headline, glass badge pill,
 * black primary CTA + outlined secondary CTA, and an auto-rotating product
 * visual (`/hero-img1.png` → `/hero-img3.png`) with caption + carousel dots.
 *
 * Built only from shadcn/ui (luma) primitives: `Badge`, `Button`.
 * All copy is overridable via props so the section is reusable elsewhere.
 */
export function HeroSection({
  badgeLead = 'Autonomous Voice Engine',
  badgeTrail = 'Sub-350ms Latency',
  headingTop = 'AI voice agents',
  headingItalic = 'actually',
  headingEnd = 'close deals.',
  subcopy = 'Turn every call into an opportunity. Eliminate missed calls, engage leads instantly, and book meetings automatically with human-grade conversational voice intelligence.',
  primaryLabel = 'Get Started Free',
  primaryHref = '/workflow',
  secondaryLabel = 'Book a Demo',
  secondaryHref = '/demo',
  images = DEFAULT_IMAGES,
  caption = (
    <>
      From first call to confirmed meeting <span aria-hidden="true">—</span> on autopilot.
    </>
  ),
}: HeroSectionProps) {
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);
  const [paused, setPaused] = useState(false);
  const total = images.length;
  // Extra trailing clone of the first slide so autoplay always moves left,
  // wrapping seamlessly: … → last → clone → (silent snap) → first → …
  const track = total > 1 ? [...images, images[0]] : images;
  const visible = index % total;

  // Autoplay only: always advances left, always animated.
  useEffect(() => {
    if (total < 2 || paused) return;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    const timer = setTimeout(() => {
      if (index >= total) {
        // Safety net (normally handled by onTransitionEnd below).
        setAnimate(false);
        setIndex(0);
        return;
      }
      setAnimate(true);
      setIndex((prev) => prev + 1);
    }, ROTATE_AFTER_MS);
    return () => clearTimeout(timer);
  }, [index, total, paused]);

  // After sliding onto the trailing clone, snap back to the first slide
  // with animation off so the loop never reverses direction.
  const handleTrackTransitionEnd = () => {
    if (index >= total) {
      setAnimate(false);
      setIndex(0);
    }
  };

  // Manual navigation is always instant (no animation).
  const goToSlide = (i: number) => {
    setAnimate(false);
    setIndex(((i % total) + total) % total);
  };
  const goToPrevious = () => {
    setAnimate(false);
    setIndex(index === 0 ? total - 1 : index - 1);
  };
  const goToNext = () => {
    setAnimate(false);
    setIndex(index >= total ? 0 : (index + 1) % (total + 1));
  };

  return (
    <section className="bg-white text-neutral-900">
      <div className="mx-auto w-full max-w-7xl px-6 pt-12 pb-14 sm:px-10 lg:px-8">
        {/* Badge pill — outline variant so default dark bg never fights the white pill */}
        <div className="mt-7">
          <Badge
            variant="outline"
            className="h-auto items-center gap-1.5 rounded-full border-[#e3ddff] bg-[#f4f2ff] px-3.5 py-[7px] text-[13px] font-medium text-[#0b0b0e] shadow-none hover:bg-[#f4f2ff]"
          >
            {/* <span className="size-1.5 rounded-full bg-[#5b50e6]" aria-hidden="true" /> */}
            {badgeLead}
            <span className="text-neutral-400" aria-hidden="true">
              •
            </span>
            <span className="font-semibold text-[#0b0b0e]">{badgeTrail}</span>
          </Badge>
        </div>

        {/* Headline — two lines, exactly like the reference mock */}
        <h1 className="mt-6 text-[44px] leading-[1.04] font-medium tracking-[-0.025em] text-[#0b0b0e] sm:text-[60px] lg:text-[68px]">
          <span className="block">{headingTop}</span>
          <span className="block sm:whitespace-nowrap">
            that <em className="font-light italic">{headingItalic}</em>{' '}
            <span className="relative inline-block">
              {headingEnd}
              <span
                aria-hidden="true"
                className="absolute right-0 -bottom-[3px] left-0 h-[4px] rounded-full bg-gradient-to-r from-[#0b0b0e] via-[#4b4b52] to-[#a1a1aa]"
              />
            </span>
          </span>
        </h1>

        {/* Subcopy */}
        <p className="mt-5 max-w-[640px] text-[16.5px] leading-[1.55] text-[#5b5c64]">{subcopy}</p>

        {/* CTAs */}
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <Button
            asChild
            className="h-[46px] rounded-[10px] bg-[#17171c] px-5 text-[15px] font-medium text-white shadow-[0_10px_24px_-10px_rgba(0,0,0,0.5)] hover:bg-[#232329]"
          >
            <Link href={primaryHref}>
              {primaryLabel}
              <HugeiconsIcon icon={ChevronsRightIcon} className="ml-1 h-4 w-4" strokeWidth={2.25} />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-[46px] rounded-[10px] border-[#e2e2e6] bg-white px-5 text-[15px] font-medium text-neutral-900 shadow-none hover:bg-neutral-50"
          >
            <Link href={secondaryHref}>{secondaryLabel}</Link>
          </Button>
        </div>

        {/* Sliding product visual (right-to-left) with manual controls */}
        <div
          className="relative mt-10 w-full overflow-hidden rounded-[16px]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div
            className={`flex ${animate
              ? 'transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none'
              : 'transition-none'
              }`}
            style={{ transform: `translateX(-${index * 100}%)` }}
            onTransitionEnd={handleTrackTransitionEnd}
          >
            {track.map((image, i) => (
              <div
                key={`${image.src}-${i}`}
                className="relative aspect-[16/12] w-full shrink-0 sm:aspect-[16/8] lg:aspect-[2.35/1]"
                aria-hidden={i === visible && i < total ? undefined : true}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  priority={i === 0}
                  sizes="(max-width: 1200px) 100vw, 1200px"
                  className="object-cover object-center"
                />
              </div>
            ))}
          </div>
          {/* Soft bottom fade into the caption, as in the mock */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white via-white/55 to-transparent"
          />
          {total > 1 && (
            <>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={goToPrevious}
                aria-label="Previous visual"
                className="absolute top-1/2 left-3 z-10 h-10 w-10 -translate-y-1/2 rounded-full border-neutral-200 bg-white/90 text-neutral-800 shadow-sm backdrop-blur hover:bg-white sm:left-5"
              >
                <HugeiconsIcon icon={ChevronLeftIcon} className="h-5 w-5" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={goToNext}
                aria-label="Next visual"
                className="absolute top-1/2 right-3 z-10 h-10 w-10 -translate-y-1/2 rounded-full border-neutral-200 bg-white/90 text-neutral-800 shadow-sm backdrop-blur hover:bg-white sm:right-5"
              >
                <HugeiconsIcon icon={ChevronRightIcon} className="h-5 w-5" />
              </Button>
            </>
          )}
        </div>

        {/* Caption + carousel dots */}
        <p className="mt-9 text-center text-[15.5px] text-[#3a3a41]">{caption}</p>
        <div className="mt-4 flex items-center justify-center gap-2" role="tablist" aria-label="Hero visuals">
          {images.map((image, i) => (
            <button
              key={image.src}
              type="button"
              role="tab"
              aria-selected={i === visible}
              aria-label={`Show visual ${i + 1} of ${total}`}
              onClick={() => goToSlide(i)}
              className={`h-2.5 w-2.5 rounded-full transition-colors ${i === visible
                ? 'bg-gradient-to-r from-neutral-900 to-neutral-500'
                : 'bg-neutral-300 hover:bg-neutral-400'
                }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
