# UI - Frontend Application

Next.js 15 frontend for the Dograh voice AI platform.

## Project Structure

```
ui/
├── src/
│   ├── app/          # Next.js App Router pages
│   ├── components/   # React components
│   ├── lib/          # Utilities and configurations
│   ├── client/       # Auto-generated API client
│   ├── context/      # React context providers
│   ├── hooks/        # Custom React hooks
│   ├── constants/    # Application constants
│   └── types/        # TypeScript type definitions
├── public/           # Static assets
└── package.json
```

## Where to Find Things

| Looking for...      | Go to...                                             |
| ------------------- | ---------------------------------------------------- |
| Pages/routes        | `src/app/` - Next.js App Router (file-based routing) |
| Reusable components | `src/components/` - organized by feature             |
| Base UI primitives  | `src/components/ui/` - shadcn/ui components          |
| Workflow builder    | `src/components/flow/` - React Flow based            |
| API calls           | `src/client/` - auto-generated from OpenAPI spec     |
| Auth utilities      | `src/lib/auth/`                                      |
| Helper functions    | `src/lib/utils.ts`                                   |
| Global state        | `src/context/` - React context providers             |

## Tech Stack

- Next.js 15 with App Router, React 19, TypeScript
- Tailwind CSS with shadcn/ui components
- Zustand for state management
- @xyflow/react for workflow builder

## Global Design Tokens

These apply everywhere (marketing site, auth pages, app console) unless a
section below overrides them.

- Font is Inter (`font-sans`) — loaded once in `src/app/layout.tsx` via
  `next/font/google` (`--font-inter`). Never introduce another font: no serif,
  no custom webfonts, no per-page font imports.
- Ink: headlines `#0b0b0e` (near-black), body/subcopy `#5b5c64`, muted
  `neutral-500`/`neutral-600`.
- Headings are `font-medium` with tight tracking (`-0.02em` to `-0.025em`) and
  tight leading (`1.04–1.12`); body copy uses `leading-[1.6]`.
- UI library: shadcn/ui (luma/radix style) primitives from `src/components/ui/`
  plus `lucide-react` icons. No custom CSS for one-off elements — shared
  keyframes/utilities live in `src/app/globals.css`.
- Black CTAs: near-black background (`#17171c` marketing, `bg-neutral-950`
  auth), white text. Pills (`rounded-full`) on auth, `rounded-[10px]` on
  marketing.
- Text selection site-wide is black (`selection:bg-neutral-900
  selection:text-white`) — never violet.
- Accent indigo `#5b50e6` is marketing-only and used sparingly.

## API Client

The `src/client/` directory is auto-generated from the backend OpenAPI spec. Whenever you add a
new api route in backend, and wish to use it in the UI, generate the client using below command.

```bash
npm run generate-client
```

## Conventions

### File Uploads

Always use a hidden `<input type="file">` with a visible `<Button>` that triggers it via `fileInputRef.current?.click()`. Never use a visible `<Input type="file">` — the native file input styling is inconsistent and confusing. Show the selected filename next to or below the button.

### Authenticated API Calls

Components that make API calls must wait for auth to be ready before fetching. Use `useAuth()` and guard the `useEffect` with `authLoading` and `user`:

```tsx
const { user, loading: authLoading } = useAuth();
const hasFetched = useRef(false);

useEffect(() => {
  if (authLoading || !user || hasFetched.current) return;
  hasFetched.current = true;
  fetchData();
}, [authLoading, user]);
```

The auth interceptor (which attaches the Bearer token) is only registered once auth is fully loaded. Fetching before that sends unauthenticated requests that silently fail.

### API Error Handling

The generated client does **not** throw on HTTP error responses — it resolves to `{ data, error }`. A `try/catch` only catches network failures, so a 4xx/5xx slips through silently if you only check `response.data`. Always check `response.error`:

```tsx
const response = await someApiCall({ ... });
if (response.error) {
  setError(detailFromError(response.error, "Failed to save thing"));
  return;
}
// ...use response.data
```

Use `detailFromError` from `@/lib/apiError` to turn the error into a string — never render `error.detail` directly. FastAPI returns `detail` as a string for `HTTPException` but as an **array** of `{ msg, loc, ... }` objects for 422 validation errors; passing that array to React (`{error}`) crashes the page with "Objects are not valid as a React child". The helper normalizes both shapes and takes an optional fallback message.

## Marketing Website Design System

The public website (`/`, `/pricing`, `/ai-*`, `/use-cases/*`, … — everything rendered
through the marketing branch of `src/components/layout/AppLayout.tsx`) follows the
approved reference mock (light Orbit-style landing). The app console (sidebar shell,
dashboards) stays dark — **never apply these rules to app routes.**

### Scope rule (most important)

- Website-only changes go through `MarketingNavbar`, `src/components/marketing/*`,
  and marketing pages under `src/app/`. `MarketingNavbar` is used ONLY by the
  marketing branch of `AppLayout` — the console never renders it.
- Until the user explicitly asks for copy changes: **design only.** Keep all links,
  labels, routes, and auth logic identical; change classes/styling alone.

### Canvas & color

- Page background is `#F6F4FF` (light lavender-white). The hero
  (`HeroSection`) hardcodes `bg-[#F6F4FF]`.
- The header bar uses the identical `#F6F4FF` — solid, never plain white, never
  translucency — so navbar and hero render as one seamless canvas. Both must always
  share the exact same hex; a different shade on either side paints a visible seam.
- The marketing wrapper carries the `.site-light` class (defined in
  `src/app/globals.css`), which pins all theme tokens to light values so
  `bg-background`, `text-foreground`, `text-muted-foreground`, `bg-card`,
  `border-border`, etc. resolve light inside the marketing subtree.
- Text: headline `#0b0b0e`, body/subcopy `#5b5c64`, muted `neutral-500/600`.
- Accent (use sparingly): indigo `#5b50e6`; pale indigo text (`-300`/`-400`) is NOT
  readable on white — always use `-600` variants for text on light canvas.
- Buttons: primary is near-black `#17171c` (hover `#232329`), white text,
  `rounded-[10px]`; secondary is white with `border-[#e2e2e6]` / `border-neutral-200`.
- Badge pill: `bg-[#f4f2ff]`, `border-[#e3ddff]`, text `#5b50e6`, dot `#5b50e6`.
- Headline underline accent: gradient bar `from-[#c4b5fd] via-[#a78bfa] to-[#e879f9]`,
  `h-[4px] rounded-full`, absolutely positioned under the underlined phrase.
- Never use plain `bg-white`, translucency (`bg-white/75`), or `backdrop-blur` on the
  header — solid `#F6F4FF` only, identical to the user-supplied swatch.

### Typography & layout

- Font is Inter (`font-sans`); never introduce another font on marketing pages.
- Hero headline: `font-medium` (italic word `font-light italic`), `tracking-[-0.025em]`,
  `leading-[1.04]`, sizes `44px → 60px (sm) → 68px (lg)`, exactly 2 lines
  (second line gets `sm:whitespace-nowrap`; mobile may wrap).
- Container: `max-w-7xl` with `px-6 sm:px-10 lg:px-8` — header and hero share it.
- Header: `h-16 sm:h-[72px]`, brand left, links absolutely centered
  (`absolute left-1/2 -translate-x-1/2`), CTAs right; bottom hairline + soft shadow
  appear only after scrolling (`window.scrollY > 20`) so the bar blends seamlessly
  into the hero at the top.
- Seam rule (no gap line allowed): the marketing `main` in `AppLayout` carries an
  explicit `bg-[#F6F4FF]` and its top offset must equal the header height exactly
  (`pt-16 sm:pt-[72px]`). Never leave the offset zone to inherit a token background —
  any mismatch paints a visible strip between header and hero.
- Hero vertical rhythm: badge → `mt-6` headline → `mt-5` subcopy → `mt-7` CTAs →
  `mt-10` visual → `mt-9` caption → `mt-4` carousel dots.
- Radii: buttons `10px`, visual cards `16px`, dropdowns `16px` (`rounded-2xl`),
  pills/dots `full`.
- Shadows (subtle only, never heavy): cards use one shared soft shadow
  `0_1px_2px_rgba(16,16,20,0.06),0_12px_32px_-16px_rgba(16,16,20,0.12)` with a
  hairline `border-neutral-200/80`; black buttons use
  `0_4px_12px_-6px_rgba(0,0,0,0.35)`. No large blurred color shadows.

### Components & assets

- Build marketing UI only from shadcn/ui (luma) primitives (`Button`, `Badge`, …)
  plus `lucide-react` icons. No custom CSS for one-off elements.
- `HeroSection` (`src/components/marketing/HeroSection.tsx`) is reusable: all copy,
  links, image, and caption are props with reference-matching defaults.
- Hero visual uses `/hero-img1.png` → `/hero-img3.png` from `public/` (there is no
  `hero-image.png`). Auto-rotating slider (`5s`, right-to-left `translateX`
  track, reduced-motion aware, pauses on hover) with clickable dots (`tablist`)
  plus shadcn `Button` prev/next chevrons (white pills, `aria-label`s) — active
  dot is a black-grey gradient (`from-neutral-900 to-neutral-500`), inactive
  `neutral-300`. Autoplay loops one direction forever via a trailing clone of
  the first slide + silent snap-back (`onTransitionEnd`); MANUAL navigation
  (dots, prev/next) is always instant — animation runs on autoplay only. Each slide is a `relative` aspect-ratio wrapper
  (`aspect-[16/12] sm:aspect-[16/8] lg:aspect-[2.35/1]`) with `next/image` +
  `fill` (`object-cover`), inside an `overflow-hidden rounded-[16px]` viewport
  with a white bottom fade into the caption. Reusable via `images` prop.
- Text selection site-wide is black (`selection:bg-neutral-900
  selection:text-white`) — never violet.
- `HeroInteractiveCall.tsx` is intentionally unmounted (kept for later reuse) —
  do not delete it.
- `AboutSection` (`src/components/marketing/AboutSection.tsx`) is the editorial
  pattern for statement sections, faithful to the reference mock: narrow left rail
  (`210px`, `18px`, `font-medium`, uppercase, ink `#0b0b0e`) + wide right column with a large statement (`28px → 32px → 35px`, `font-medium`,
  `tracking-[-0.01em]`, `leading-[1.28]`, `#0b0b0e`) and muted body (`15.5px`,
  `leading-[1.65]`, `#5b5c64`, `max-w-[580px]`). Grid `lg:grid-cols-[210px_1fr]`
  with a wide `lg:gap-24`. No accent color in this section.
  Same `#F6F4FF` canvas, reusable via `eyebrow` / `heading` / `paragraphs` props.
- `FeaturesSection` (`src/components/marketing/FeaturesSection.tsx`) is the
  detailed-features pattern: header (small indigo dash + gray sentence-case
  eyebrow, `32px → 44px` black medium statement, muted description) followed by
  alternating text/visual rows (`lg:grid-cols-2`, flipped via `lg:order-*`,
  `py-14 sm:py-16`) with NO divider lines and NO closing statement (removed per
  user request). All headings/numerals are black — the only color in
  the section is body gray plus monochrome black/grey preview accents (never
  chromatic blue/violet/green in the cards). Visuals are small white schematic previews  (`max-w-[400px]`, `rounded-2xl`, soft shadow, `aria-hidden`) built from shadcn
  `Card`/`Badge` + one functional lucide icon each — never invent stats, names,
  or testimonials in them. No card grids, no gradients. Reusable via `eyebrow` /
  `heading` / `description` / `features` props. White canvas
  (`bg-white`) like the FAQ section.
- `PricingSection` (`src/components/marketing/PricingSection.tsx`) is the pricing
  pattern: centered header (dash eyebrow, `55px` medium statement, muted
  description), three equal white tier cards (`rounded-2xl`, `p-6/7`, soft
  shadow) in `lg:grid-cols-3` with plan name, audience line, and a SHARED
  ordered feature list rendered in every card — included rows get an emerald
  check, excluded rows stay visible but muted + struck through (`neutral-400`,
  faded check), never hidden. Middle (Growth) tier elevated
  (`lg:-translate-y-2`, stronger shadow) with the black CTA; others outlined.
  Ends with a centered black footnote + contact link. No prices shown unless
  specified — never invent them. Same white canvas (`bg-white`) as Features/FAQ,
  reusable via `eyebrow` / `heading` / `description` / `plans` / `features` /
  `footnote` props.
- `FaqAccordion` (`src/components/marketing/FaqAccordion.tsx`) is the FAQ pattern:
  pure-white canvas (`bg-white` — the one deliberate exception to `#F6F4FF`),
  left rail (`12.5px` muted `FAQs` label, `30px` medium ink heading, outlined
  `rounded-full` contact pill linking `/contact`) + right accordion list with
  hairline dividers (`border-neutral-200/80`, top + last bottom) and `Plus`
  togglers (rotate 45° when open). Questions `15.5px` medium `neutral-800`,
  answers `14.5px` `neutral-500`. Grid `lg:grid-cols-[280px_1fr]`, `lg:gap-20`.
  Content lives in the file's `FAQS` array — design changes must not alter it.
  Note: it renders its own full `<section>` — do not wrap it in another padded
  section (homepage mounts it bare; `/pricing` mounts it in a spaced `div`).
- `MarketingFooter` follows the same system: pure-white canvas (`bg-white`, NO
  divider lines, NO top hairline), 5 link columns (`17px` semibold ink
  headings, `15px` `neutral-500` links — Legal holds only real pages: Privacy,
  Terms, Enterprise Security), then a spaced (`mt-14`) bottom row with the app
  description left and the copyright line right (stacked on mobile),
  finished by a giant gradient wordmark (`CALLIO`, `24vw → 280px`, cropped at
  the base, `aria-hidden`). Content (columns, links, bottom bar) must not change
  — design only. Never link a route without verifying `src/app/<route>/page.tsx`
  exists (`/cookies` does NOT exist — do not add it).
- Old-design homepage sections are PARKED, not deleted: they sit inside
  `{/* PARKED ... */}` comment blocks in `src/app/page.tsx` with their imports
  `//`-commented at the top. To restore one, uncomment its block plus its import.
  The live homepage currently renders only Hero, About, Features, Pricing, FAQ,
  and Footer.

## Auth Pages Design System

`/auth/login` and `/auth/signup` follow the approved reference mock (white
split-screen card) and the landing type rules above. `AuthShell` (dark) still
serves the Stack Auth handler route — do not restyle it for auth changes.

- Routes: `/auth/login` is a server page (resolves the signup flag) rendering
  the client `LoginForm` (`src/app/auth/login/LoginForm.tsx`); `/auth/signup`
  is a client page (`src/app/auth/signup/page.tsx`). `/login` is the raw shadcn
  demo — NOT the real login page.
- Layout: `/auth/login` renders inside the shared `FlowShell`
  (`src/components/auth/FlowShell.tsx`) as step 1 — see Demo Flow below.
  `/auth/signup` still uses `AuthCardShell`
  (`src/components/auth/AuthCardShell.tsx`): white canvas (`bg-white`),
  full-viewport split, centered `max-w-[360px]` column, `/auth-page-img.png`
  visual right. No brand mark on any form column (removed per user request).
- Right visual asset: `public/auth-page-img.png` (dithered grayscale garden).
  The shell takes `imageSrc`/`imageAlt` overrides — use them instead of
  hardcoding a different image.
- Typography (landing rules, scaled to the narrow column): login heading `36px →
  40px (sm)`; signup heading `30px → 34px (sm)` with `sm:whitespace-nowrap` so
  "Create your account" stays on one line. Both `font-medium`,
  `tracking-[-0.02em]`, `leading-[1.08]`, `#0b0b0e`, centered; subcopy `16px`,
  `leading-[1.6]`, `#5b5c64`, centered, `mt-3`.
- Vertical rhythm: heading block → `mt-7` social buttons → `mt-5` Or divider →
  `mt-5` form (`space-y-3`) → `mt-6` switch link.
- Social buttons: `SocialAuthButtons` + `OrDivider`
  (`src/components/auth/SocialAuthButtons.tsx`) — two pill outline buttons
  (`h-10`, `rounded-full`, `border-neutral-200`, `13px` medium) with inline
  Google/Apple SVGs. OAuth is NOT wired: clicks toast "not available yet —
  please continue with email". Labels switch via `mode="in" | "up"`.
- Inputs: `h-11`, `rounded-xl`, placeholder-only with `sr-only` labels.
  Submit: black pill (`h-11 w-full rounded-full bg-neutral-950
  hover:bg-neutral-800`).
- Footer: tiny (`11px`, `neutral-400`) Help / Terms / Privacy links pointing at
  `/contact`, `/terms`, `/privacy`. Never link a route without verifying
  `src/app/<route>/page.tsx` exists (`/help` does NOT exist — do not add it).
- Auth logic is currently DEMO-SHORTCIRCUITED (see Demo Flow below): no client
  call, no `/api/auth/session`, redirect is to `/create-agent`. When the demo
  ends, restore the generated-client call + session route + `/after-sign-in`
  redirect — design-only changes touch classes/markup alone.

## Demo Flow (frontend-only prototype)

The click-through is 4 steps — `login → create-agent → payment → activation →
dashboard` — built with NO backend. All four steps share ONE shell
(`FlowShell`, `src/components/auth/FlowShell.tsx`) in the exact login-page
format: step content on the LEFT, the SAME `/auth-page-img.png` artwork fixed
on the RIGHT (sticky full-height, identical on every step — never change it).
Only the left content swaps per step, so the steps read as one continuous
page. These flags and shortcuts exist only for the demo:

- `DEMO_OPEN_ROUTES = true` in `src/middleware.ts` AND in
  `src/lib/auth/providers/LocalProviderWrapper.tsx` — every page is visitable
  without login. Set both to `false` to restore the login gate.
- Step 1 `/auth/login` submits without any API call (any email creds continue;
  email is kept in `localStorage` as `demo_user_email`) and redirects to
  `/create-agent`. The backend-failure warning toast is gone by design.
  (`/auth/signup` is outside the flow and keeps the old `AuthCardShell`.)
- Step 2 `/create-agent` (`src/app/create-agent/page.tsx`): agent details
  (purpose / language / voice dropdowns, in-browser voice preview via
  `speechSynthesis`), instructions (textareas, knowledge-file upload),
  contacts (client-side CSV parse + valid/invalid counts, sample CSV download,
  review dialog, consent checkbox). Draft persists to `localStorage`
  (`demo_agent_draft`).
- Step 3 `/payment` (`src/app/payment/page.tsx`): minimal shadcn checkout in
  **INR** (`en-IN` formatting) with **UPI** (default, recommended) + card
  methods, UPI-ID/card validation, order summary with 18% GST. Price is a
  **PLACEHOLDER** (`PRICE_INR` constant at the top of the file) — confirm the
  real amount before launch. Pay stores `demo_payment` and routes to
  `/activation`.
- Step 4 `/activation` (`src/app/activation/page.tsx`): "Making your agent…"
  bridge — animated progress bar + sequential checklist (~7s), then
  auto-redirects to the EXISTING dashboard at `/dashboard/overview` (never
  build a new dashboard). A "Go to dashboard now" button skips the wait.
- Steps indicator is `FlowSteps` (4 segments: Login / Create agent / Payment /
  Go live — label above a `3px` bar, reached + active black, upcoming gray).
  It lives in the shell, NOT in the pages — never render a second copy.
- Flow shell spec: white canvas (`bg-white`), left content column
  (`max-w-2xl`, `px-6 sm:px-10`, footer links pinned at the bottom), right
  image column (`400px`, `460px` on `xl`, sticky `h-svh`, `object-cover`,
  hidden below `lg`). Login's form keeps its narrow centered `max-w-[340px]`
  block inside the same pane. Mobile collapses to content only.
- Flow type rules (landing rules): Inter, `32–36px` medium tight headings with
  `mt-10` below the steps, `16px #5b5c64` subcopy, `h-11 rounded-xl` inputs,
  black pill CTAs.
- The flow pages render bare (listed in the standalone-pages early return in
  `src/components/layout/AppLayout.tsx`) — no sidebar, header, or banners.
- Single-page flow (2026-09-20): all 4 steps are components
  (`src/components/auth/flow/LoginStep|CreateAgentStep|PaymentStep|ActivationStep.tsx`)
  orchestrated by `OnboardingFlow` state — ONE `FlowShell`, image never
  unmounts, no `window.location.href` reloads. Legacy routes
  (`/create-agent`, `/payment`, `/activation`) redirect to `/auth/login`;
  `/auth` and `/auth/signin` alias the same flow. No Help/Terms/Privacy footer.
  Create-agent + payment each use ONE card with hairline dividers and the
  subtle shadow
  `shadow-[0_1px_2px_rgba(16,16,20,0.04),0_4px_12px_-8px_rgba(16,16,20,0.06)]`;
  back navigation is a single text-only `Back` link outside the card.
  Activation is a vertical timeline (charcoal fill line, pulsing dark dot,
  muted checks) with auto-redirect and NO button.

## App Console Design System (light-only, shadcn-only)

- Light-only: dark mode removed (2026-09-20). `ThemeSwitcher` is parked
  (returns `null`), `AppSidebar` renders no toggle, `src/app/layout.tsx`
  strips `.dark` + forces `next-themes` to `light`. Never add `dark:` variants
  or a new toggle — cards/sidebar resolve shadcn light tokens only.
- `/overview` parked: `src/app/overview/page.tsx` keeps the original
  line-commented below a redirect to `/dashboard/overview` (comment-out, never
  delete). Sidebar Overview entry is commented the same way; logo + all
  `/overview` links now point at `/dashboard/overview`. Restore via git HEAD.
  Going forward, removed pages/sections are parked in place, not deleted.
- shadcn-only: build app UI from `src/components/ui/` primitives +
  `lucide-react` icons. No custom CSS for one-offs — shared values live in
  `src/app/globals.css` (`--ink #0b0b0e`, `--body #5b5c64`,
  `--accent-indigo #5b50e6` marketing-only, `--cta-black #17171c`,
  `--app-card-shadow` subtle).
- Global type scale (in `globals.css` base + `.app-*` utilities, mirrors the
  website so sizes aren't repeated per page): `h1/.app-h1 32→36px` medium
  tight ink; `.app-section-title 32px`; `.app-h2/h3 18px semibold`;
  `p/.app-subcopy 15–16px #5b5c64 leading-[1.6]`; `.app-muted 13.5px`;
  `.app-eyebrow 13px uppercase`; `.app-card` white `rounded-[16px]`
  `border-neutral-200/80` subtle shadow; `.app-cta-black` pill;
  `.app-back-link` text-only; `::selection` black site-wide.

## Development

```bash
npm install
npm run dev    # Runs on port 3000
```
