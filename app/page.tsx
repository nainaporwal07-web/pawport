import Link from "next/link";
import { PawLogo, PawMark } from "@/components/paw-logo";
import { SiteHeader } from "@/components/site-header";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f7f1e9]">
      <SiteHeader />

      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-16 pt-14 md:grid-cols-2 md:px-8 md:pb-24 md:pt-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#e7ddcf] bg-[#fffdfb] px-4 py-1.5 text-sm font-medium text-[#617066]">
              <PawMark className="h-4 w-4 text-[#cc6f47]" />
              AI-powered pet care handover
            </span>

            <h1 className="mt-6 text-5xl font-bold leading-[1.02] tracking-tight text-[#17352d] md:text-6xl lg:text-7xl">
              Every pet comes with their own <span className="text-[#cc6f47]">care story.</span>
            </h1>

            <p className="mt-6 max-w-md text-lg leading-relaxed text-[#617066]">
              PET HANDBOOK turns a natural conversation into a beautiful, trustworthy care handbook that follows the pet through every handover.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/handover"
                className="group inline-flex items-center gap-2 rounded-full bg-[#17352d] px-7 py-4 font-semibold text-[#f7f1e9] shadow-lg shadow-[#17352d]/20 transition-all hover:-translate-y-0.5 hover:shadow-xl"
              >
                Start care conversation
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
              <Link
                href="#how-it-works"
                className="rounded-full border border-[#e7ddcf] bg-[#fffdfb] px-7 py-4 font-semibold text-[#17352d] transition-colors hover:bg-[#f3eee8]"
              >
                See how it works
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[#d8a16a]/30 blur-2xl" />
            <div className="absolute -bottom-8 -left-6 h-28 w-28 rounded-full bg-[#a6b9a8]/40 blur-2xl" />

            <div className="relative overflow-hidden rounded-[2rem] border border-[#e7ddcf] bg-[#fffdfb] shadow-xl">
              <div className="bg-[#17352d] px-8 py-6 text-[#f7f1e9]">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#dfeae7]">PET HANDBOOK</span>
                  <span className="rounded-full bg-[#d8a16a] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#17352d]">
                    Live care notes
                  </span>
                </div>
                <div className="mt-6">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[#cfe0d8]">Profile status</p>
                  <p className="mt-2 text-3xl font-bold tracking-tight">No default pet</p>
                  <p className="mt-2 text-sm text-[#dfeae7]">Built from the conversation as it happens.</p>
                </div>
              </div>
              <div className="space-y-4 p-6">
                <div className="rounded-2xl bg-[#f3eee8] p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-[#617066]">Identity</p>
                  <p className="mt-1 font-medium text-[#17352d]">Name, species, breed, age, sex remain unknown until shared.</p>
                </div>
                <div className="rounded-2xl bg-[#f3eee8] p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-[#617066]">Feeding</p>
                  <p className="mt-1 font-medium text-[#17352d]">Captured directly from the owner’s routine and preferences.</p>
                </div>
                <div className="rounded-2xl border border-[#e6c3b0] bg-[#fff1ea] p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-[#cc6f47]">Care detail</p>
                  <p className="mt-1 font-medium text-[#17352d]">Only confirmed information appears in the final handbook.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[#17352d] md:text-4xl">
            A pet handover has two sides.
          </h2>
          <p className="mt-4 text-[#617066]">
            PET HANDBOOK helps the owner and caregiver stay aligned with one living, accurate care record.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-[#e7ddcf] bg-[#fffdfb] p-8 shadow-sm">
            <span className="text-sm font-semibold uppercase tracking-[0.16em] text-[#cc6f47]">Pet parent</span>
            <p className="mt-4 text-2xl font-semibold leading-snug text-[#17352d]">
              “I want every important care detail to be remembered accurately.”
            </p>
          </div>

          <div className="rounded-3xl border border-[#17352d] bg-[#17352d] p-8 text-[#f7f1e9] shadow-sm">
            <span className="text-sm font-semibold uppercase tracking-[0.16em] text-[#d8a16a]">Caregiver</span>
            <p className="mt-4 text-2xl font-semibold leading-snug">
              “I need the pet’s real preferences, routines, and safety notes in one place.”
            </p>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-20 bg-[#f3eee8]/70 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6 md:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.16em] text-[#cc6f47]">How it works</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#17352d] md:text-4xl">
              From a simple conversation to a complete care handbook.
            </h2>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {[
              {
                n: "01",
                title: "Tell us about the pet",
                text: "Start with a natural message about their routines, preferences, or care needs.",
              },
              {
                n: "02",
                title: "The profile updates live",
                text: "Confirmed details are stored as the conversation continues, without inventing missing facts.",
              },
              {
                n: "03",
                title: "Generate the handbook",
                text: "Get one clear, printable care handbook built from actual owner-provided information.",
              },
            ].map((step) => (
              <div key={step.n} className="rounded-3xl border border-[#e7ddcf] bg-[#fffdfb] p-8 shadow-sm">
                <span className="font-display text-5xl font-bold text-[#d8a16a]">{step.n}</span>
                <h3 className="mt-5 text-xl font-bold text-[#17352d]">{step.title}</h3>
                <p className="mt-3 leading-relaxed text-[#617066]">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-24">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-[#cc6f47] px-8 py-16 text-center text-[#fffaf5] md:px-16">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#d8a16a]/25 blur-3xl" />
          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold md:text-5xl">Their care, in one place.</h2>
            <p className="mx-auto mt-5 max-w-md text-lg text-[#fffaf5]/90">
              Start with a conversation, build the pet profile naturally, and create a single, trusted handbook.
            </p>
            <Link
              href="/handover"
              className="mt-9 inline-flex items-center gap-2 rounded-full bg-[#fffdfb] px-8 py-4 font-semibold text-[#17352d] shadow-lg transition-transform hover:scale-105"
            >
              Start care conversation
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#e7ddcf]">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-[#617066] md:flex-row md:px-8">
          <PawLogo />
          <p>Their care, in one place.</p>
        </div>
      </footer>
    </div>
  );
}
