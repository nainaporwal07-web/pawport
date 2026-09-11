import Link from "next/link";
import { PawLogo } from "@/components/paw-logo";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-[#e7ddcf] bg-[#f7f1e9]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-8">
        <Link href="/" aria-label="PET HANDBOOK home">
          <PawLogo />
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/#how-it-works" className="hidden text-sm font-medium text-[#617066] transition-colors hover:text-[#17352d] sm:block">
            How it works
          </Link>
          <Link href="/handover" className="rounded-full bg-[#17352d] px-5 py-2.5 text-sm font-semibold text-[#f7f1e9] shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
            Start Pet Handover
          </Link>
        </nav>
      </div>
    </header>
  );
}
