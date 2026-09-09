import Image from "next/image";
import { cn } from "@/lib/utils";

export function BrandLogo({
  className,
  inverse = false,
  mark = false,
  imageOnly = false,
}: {
  className?: string;
  inverse?: boolean;
  mark?: boolean;
  imageOnly?: boolean;
}) {
  if (mark || imageOnly) {
    return (
      <div className={cn("relative inline-flex items-center justify-center shrink-0 aspect-square", className)}>
        <Image
          src="/icon.png"
          alt="CallioAI"
          width={36}
          height={36}
          className="h-full w-full object-contain"
          priority
        />
      </div>
    );
  }

  return (
    <div className={cn("inline-flex items-center gap-2.5 font-bold tracking-tight select-none", className)}>
      <div className="relative flex h-8 w-8 shrink-0 items-center justify-center">
        <Image
          src="/icon.png"
          alt="CallioAI"
          width={32}
          height={32}
          className="h-full w-full object-contain"
          priority
        />
      </div>
      <span className={cn(
        "text-xl tracking-tight font-extrabold flex items-center",
        inverse ? "text-white" : "text-foreground"
      )}>
        Callio<span className="bg-gradient-to-r from-indigo-500 to-violet-400 bg-clip-text text-transparent">AI</span>
      </span>
    </div>
  );
}
