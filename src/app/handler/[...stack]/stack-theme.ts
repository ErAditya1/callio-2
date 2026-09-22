// Dark token overrides for the embedded Stack Auth form so it blends into
// the new premium glassmorphism auth card surface.
// Stack's theme parser does not accept OKLCH strings, so keep values in hex.

import type { StackTheme } from "@stackframe/stack";
import type { ComponentProps } from "react";

type ThemeConfig = NonNullable<ComponentProps<typeof StackTheme>["theme"]>;

export const stackAuthDarkTheme: ThemeConfig = {
  dark: {
    // Card / shell surface  (#09090b + white/5 overlay ≈ #101014)
    background: "#09090b",
    foreground: "#fafafa",
    card: "#09090b",
    cardForeground: "#fafafa",
    popover: "#18181b",
    popoverForeground: "#fafafa",
    // CTA — indigo-600 (#4f46e5) primary
    primary: "#4f46e5",
    primaryForeground: "#ffffff",
    // Secondary and muted surfaces — zinc-900 tones
    secondary: "#18181b",
    secondaryForeground: "#a1a1aa",
    muted: "#18181b",
    mutedForeground: "#71717a",
    accent: "#27272a",
    accentForeground: "#fafafa",
    destructive: "#ef4444",
    destructiveForeground: "#fafafa",
    // Borders and inputs — white/10 glassmorphism feel
    border: "#27272a",
    input: "#27272a",
    ring: "#4f46e5",
  },
  radius: "0.75rem",
};
