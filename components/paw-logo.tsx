import { cn } from "@/lib/utils";

export function PawLogo({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <span
        className="flex h-9 w-9 items-center justify-center rounded-full bg-[#17352d] text-[#f7f1e9]"
        aria-hidden="true"
      >
        <PawMark className="h-5 w-5" />
      </span>
      <span className="text-xl font-bold tracking-tight text-[#17352d]">PET HANDBOOK</span>
    </span>
  );
}

export function PawMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <ellipse cx="6.5" cy="9" rx="1.9" ry="2.5" />
      <ellipse cx="12" cy="6.7" rx="2" ry="2.7" />
      <ellipse cx="17.5" cy="9" rx="1.9" ry="2.5" />
      <path d="M12 11.2c-2.7 0-5 2.1-5 4.6 0 1.7 1.3 2.7 3 2.7.9 0 1.4-.4 2-.4s1.1.4 2 .4c1.7 0 3-1 3-2.7 0-2.5-2.3-4.6-5-4.6Z" />
    </svg>
  );
}
