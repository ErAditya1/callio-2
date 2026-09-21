"use client";

// PARKED (2026-09-20): dark-mode toggle removed per user request — app is
// light-only (white mode for cards, sidebar, everything). Not deleted: restore
// by reverting this file to git HEAD and re-adding <ThemeToggle/> in AppSidebar.
// import { HugeiconsIcon } from "@hugeicons/react";
import {
  Moon01Icon,
  Sun01Icon,
} from "@hugeicons/core-free-icons";;
// import { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
  variant?: "ghost" | "outline" | "default";
  size?: "default" | "sm" | "lg" | "icon";
}

export default function ThemeToggle(_props: ThemeToggleProps) {
  // Light-only: render nothing. Theme is locked to light in layout.tsx.
  return null;
}
