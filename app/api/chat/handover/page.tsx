"use client"

import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F8F7F2] text-[#24352B]">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-5 md:px-16">
        <div className="flex items-center gap-2">
          <span className="text-3xl">🐾</span>
          <span className="text-2xl font-bold tracking-tight">PawPort</span>
        </div>

        <Link
          href="/handover"
          className="rounded-full bg-[#24352B] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#3B5445]"
        >
          Create Care Passport →
        </Link>
      </nav>

      {/* Hero */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-8 pb-20 pt-16 md:grid-cols-2 md:px-16 md:pt-24">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#D8D6CB] bg-white px-4 py-2 text-sm">
            🐾 AI-powered pet care handover
          </div>

          <h1 className="max-w-3xl text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
            Every pet comes with their own
            <span className="text-[#C9784A]"> instructions.</span>
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-relaxed text-[#617066]">
            PawPort transforms scattered conversations between pet parents and boarding facilities into a structured
            Care Passport—so every caregiver knows exactly what makes each pet feel safe, comfortable, and at home.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href="/handover"
              className="rounded-full bg-[#24352B] px-7 py-4 font-semibold text-white shadow-lg transition hover:-translate-y-1 hover:bg-[#3B5445]"
            >
              Start Pet Handover 🐾
            </Link>

            <a
              href="#how-it-works"
              className="rounded-full border border-[#CFCBC0] bg-white px-7 py-4 font-semibold transition hover:bg-[#EFEDE5]"
            >
              See how it works
            </a>
          </div>

          <div className="mt-12 flex gap-8 text-sm text-[#617066]">
            <div>
              <p className="text-2xl font-bold text-[#24352B]">3 min</p>
              <p>Conversational handover</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#24352B]">1 profile</p>
              <p>Structured Care Passport</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#24352B]">0</p>
              <p>Critical details missed</p>
            </div>
          </div>
        </div>

        {/* Hero Card */}
        <div className="relative">
          <div className="rounded-[2rem] bg-[#24352B] p-6 text-white shadow-2xl md:p-8">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="text-sm text-[#B8C4BC]">CARE PASSPORT</p>
                <h2 className="text-3xl font-bold">Bruno 🐶</h2>
              </div>
              <div className="rounded-2xl bg-[#E9A96A] px-4 py-2 text-sm font-semibold text-[#24352B]">Active Stay</div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-xs uppercase tracking-wider text-[#B8C4BC]">🍽 Feeding</p>
                <p className="mt-1 font-medium">8 AM & 7 PM · Kibble + gravy</p>
              </div>

              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-xs uppercase tracking-wider text-[#B8C4BC]">🐕 Social behaviour</p>
                <p className="mt-1 font-medium">Slow introduction to unfamiliar dogs</p>
              </div>

              <div className="rounded-2xl border border-[#E9A96A]/40 bg-[#E9A96A]/10 p-4">
                <p className="text-xs uppercase tracking-wider text-[#E9A96A]">⚠ Attention needed</p>
                <p className="mt-1 font-medium">Anxiety during thunderstorms</p>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#C9784A]">🐾</div>
              <p className="text-sm text-[#B8C4BC]">Every caregiver starts informed.</p>
            </div>
          </div>

          <div className="absolute -bottom-5 -left-5 -z-0 h-28 w-28 rounded-full bg-[#E9A96A]/30 blur-2xl" />
        </div>
      </section>

      {/* Problem */}
      <section className="bg-white px-8 py-20 md:px-16">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-[#C9784A]">The problem</p>

          <h2 className="max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">
            Important care instructions shouldn&apos;t get lost between shifts.
          </h2>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              [
                "💬",
                "Scattered information",
                "Instructions are spread across calls, WhatsApp messages and verbal conversations.",
              ],
              [
                "🔄",
                "Staff handovers",
                "Critical details can disappear when caregivers and shifts change.",
              ],
              [
                "⚠️",
                "One missed detail",
                "A feeding restriction or behavioural trigger can completely change a pet's stay.",
              ],
            ].map(([icon, title, text]) => (
              <div key={title} className="rounded-3xl border border-[#E7E5DD] p-7">
                <div className="text-3xl">{icon}</div>
                <h3 className="mt-5 text-xl font-bold">{title}</h3>
                <p className="mt-3 leading-relaxed text-[#617066]">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="px-8 py-20 md:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#C9784A]">How PawPort works</p>
            <h2 className="mt-4 text-4xl font-bold md:text-5xl">From conversation to continuity of care.</h2>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-4">
            {[
              ["01", "Tell us about your pet", "A natural conversation replaces long intake forms."],
              ["02", "PawPort asks deeper", "Contextual follow-ups uncover details that matter."],
              ["03", "Critical details surface", "Important instructions are automatically highlighted."],
              ["04", "Care Passport created", "Every caregiver gets one structured pet profile."],
            ].map(([number, title, text]) => (
              <div key={number} className="relative">
                <p className="text-5xl font-bold text-[#E9A96A]">{number}</p>
                <h3 className="mt-5 text-xl font-bold">{title}</h3>
                <p className="mt-3 leading-relaxed text-[#617066]">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 pb-20 md:px-16">
        <div className="mx-auto max-w-6xl rounded-[2rem] bg-[#C9784A] px-8 py-16 text-center text-white md:px-16">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/70">PawPort Care System</p>
          <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-bold md:text-6xl">
            The handover shouldn&apos;t depend on memory.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-white/85">
            Create a complete Care Passport before your pet&apos;s next stay.
          </p>

          <Link
            href="/handover"
            className="mt-9 inline-block rounded-full bg-white px-8 py-4 font-semibold text-[#24352B] transition hover:scale-105"
          >
            Start Pet Handover →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E7E5DD] px-8 py-8 text-center text-sm text-[#617066]">
        🐾 PawPort — Every pet comes with their own instructions.
      </footer>
    </main>
  )
}