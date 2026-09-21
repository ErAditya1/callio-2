import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

const FOOTER_LINKS = [
  { label: "Help", href: "/contact" },
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
];

/**
 * Shared auth layout — matches the approved reference: white canvas, form
 * column on the left, the dithered garden artwork (`public/auth-page-img.png`)
 * full-bleed on the right. Mobile collapses to the single form column.
 */
export function AuthCardShell({
  children,
  imageSrc = "/auth-page-img.png",
  imageAlt = "Dithered grayscale garden with a circular moon gate over still water",
}: {
  children: ReactNode;
  imageSrc?: string;
  imageAlt?: string;
}) {
  return (
    <div className="min-h-svh bg-white">
      <div className="grid min-h-svh lg:grid-cols-2">
        {/* Form column (LEFT) */}
        <div className="flex flex-col px-6 py-8 sm:px-12 sm:py-10">
          <div className="flex flex-1 items-center justify-center py-10">
            <div className="w-full max-w-[360px]">{children}</div>
          </div>

          <nav
            aria-label="Legal"
            className="flex items-center justify-center gap-5 text-[11px] text-neutral-400"
          >
            {FOOTER_LINKS.map((link) => (
              <Link key={link.label} href={link.href} className="hover:text-neutral-600">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Visual column (RIGHT) — full-bleed artwork to the viewport edge */}
        <div className="relative hidden min-h-svh bg-neutral-100 lg:block">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            priority
            sizes="(max-width: 1024px) 0vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}
