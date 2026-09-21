"use client"

import { HugeiconsIcon } from "@hugeicons/react";
import {
  CircleCheckIcon,
  InfoIcon,
  Loading02Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "@hugeicons/core-free-icons";
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="bottom-center"
      className="toaster group"
      icons={{
        success: (
          <HugeiconsIcon icon={CircleCheckIcon} className="size-4" />
        ),
        info: (
          <HugeiconsIcon icon={InfoIcon} className="size-4" />
        ),
        warning: (
          <HugeiconsIcon icon={TriangleAlertIcon} className="size-4" />
        ),
        error: (
          <HugeiconsIcon icon={OctagonXIcon} className="size-4" />
        ),
        loading: (
          <HugeiconsIcon icon={Loading02Icon} className="size-4 animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            "font-sans rounded-xl border-neutral-200 bg-white text-neutral-900 shadow-[0_12px_32px_-16px_rgba(16,16,20,0.25)]",
          title: "text-sm font-medium text-neutral-900",
          description: "text-[13px] text-neutral-500",
          success: "[&_svg]:text-emerald-600",
          error: "[&_svg]:text-red-600",
          info: "[&_svg]:text-neutral-500",
          warning: "[&_svg]:text-amber-600",
          actionButton: "rounded-full bg-neutral-950 text-white",
          cancelButton: "rounded-full",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
