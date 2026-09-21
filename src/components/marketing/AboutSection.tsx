import type { ReactNode } from 'react';

export interface AboutSectionProps {
  eyebrow?: string;
  heading?: ReactNode;
  paragraphs?: string[];
}

export function AboutSection({
  eyebrow = 'WHY WE BUILT CALLIOAI',
  heading = (
    <>
      Every missed call is a property{' '}
      <span className="text-[#4d4d5b]">opportunity left unanswered.</span>
    </>
  ),
  paragraphs = [
    'Real estate moves quickly. A buyer might enquire about a property today and speak to another agent tomorrow. When your team is busy, even a promising lead can go unanswered.',
    'CallioAI helps real estate professionals respond faster by answering calls, following up with new enquiries, and scheduling property visits automatically. So your team can spend less time chasing leads and more time building relationships and closing deals.',
  ],
}: AboutSectionProps) {
  return (
    <section className="bg-[#FFFFFF] text-neutral-900">
      <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:px-10 sm:py-28 lg:px-8">

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">

          {/* Left Column: Section Heading */}
          <div className="flex items-start justify-start">
            <p className="max-w-[240px] text-[31px] font-semibold uppercase leading-[1.35] tracking-[0.02em] text-[#0b0b0e]">
              {eyebrow}
            </p>
          </div>

          {/* Right Column: Main Heading and Description */}
          <div className="w-full text-left lg:ml-auto">

            <h2 className="w-full text-[44px] font-medium leading-[1.2] tracking-[-0.035em] text-[#0b0b0e]">
              {heading}
            </h2>

            <div className="mt-6 w-full space-y-4">

              {paragraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-[18px] font-normal leading-[1.6] text-[#777780]"
                >
                  {paragraph}
                </p>
              ))}

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
