import "./globals.css";

import { GoogleTagManager } from "@next/third-parties/google";
import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import { Suspense } from "react";

import ChatwootWidget from "@/components/ChatwootWidget";
import AppLayout from "@/components/layout/AppLayout";
import MetaPixel from "@/components/MetaPixel";
import PostHogIdentify from "@/components/PostHogIdentify";
import ReoProvider from "@/components/ReoProvider";
import { SentryErrorBoundary } from "@/components/SentryErrorBoundary";
import SpinLoader from "@/components/SpinLoader";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppConfigProvider } from "@/context/AppConfigContext";
import { OnboardingProvider } from "@/context/OnboardingContext";
import { OrgConfigProvider } from "@/context/OrgConfigContext";
import { TelephonyConfigWarningsProvider } from "@/context/TelephonyConfigWarningsContext";
import { AuthProvider } from "@/lib/auth";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});


const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Callio",
  description: "Deploy human-sounding AI phone agents that resolve customer inquiries, book qualified appointments, and execute outbound calling at enterprise scale.",
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
    ],
    shortcut: "/icon.png",
    apple: [
      { url: "/icon.png", type: "image/png" },
    ],
  },
  openGraph: {
    title: "CallioAI — Autonomous AI Voice Calling for Modern Business",
    description: "Deploy human-sounding AI phone agents that resolve customer inquiries, book qualified appointments, and execute outbound calling at enterprise scale.",
    images: [{ url: "/icon.png", width: 512, height: 512, alt: "CallioAI Logo" }],
  },
  twitter: {
    card: "summary",
    title: "CallioAI — Autonomous AI Voice Calling for Modern Business",
    description: "Deploy human-sounding AI phone agents that resolve customer inquiries, book qualified appointments, and execute outbound calling at enterprise scale.",
    images: ["/icon.png"],
  },
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID?.trim();
  const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim();
  const reoClientId = process.env.NEXT_PUBLIC_REO_CLIENT_ID?.trim();

  return (
    <html lang="en" className={cn(inter.variable, geistMono.variable)} suppressHydrationWarning>
      <head>
        {/* Light-only lock (2026-09-20): dark mode removed per user request.
            Always strip .dark so cards/sidebar render white via shadcn light tokens. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  document.documentElement.classList.remove('dark');
                  localStorage.setItem('theme', 'light');
                } catch (e) {
                  document.documentElement.classList.remove('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className="antialiased font-sans">
        {gtmId ? <GoogleTagManager gtmId={gtmId} /> : null}
        {metaPixelId ? <MetaPixel pixelId={metaPixelId} /> : null}
        <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light" enableSystem={false} disableTransitionOnChange>
          <SentryErrorBoundary>
            <AuthProvider>
              <AppConfigProvider>
                <Suspense fallback={<SpinLoader />}>
                  <OrgConfigProvider>
                    <TelephonyConfigWarningsProvider>
                      <OnboardingProvider>
                        <PostHogIdentify />
                        {reoClientId ? <ReoProvider clientId={reoClientId} /> : null}
                        <TooltipProvider delayDuration={0}>
                          <AppLayout>
                            {children}
                          </AppLayout>
                          <Toaster />
                          <ChatwootWidget />
                        </TooltipProvider>
                      </OnboardingProvider>
                    </TelephonyConfigWarningsProvider>
                  </OrgConfigProvider>
                </Suspense>
              </AppConfigProvider>
            </AuthProvider>
          </SentryErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}
