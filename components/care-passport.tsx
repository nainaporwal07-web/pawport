'use client';

import Image from "next/image";
import { useState } from "react";
import { PawMark } from "@/components/paw-logo";
import { cn } from "@/lib/utils";

type PassportProfile = {
  identity: {
    name?: string;
    species?: string;
    breed?: string;
    age?: string;
    sex?: string;
  };
  feeding?: Record<string, string | undefined>;
  routine?: Record<string, string | undefined>;
  behaviour?: Record<string, string | undefined>;
  comfort?: Record<string, string | undefined>;
  medicalInformation?: Record<string, string | undefined>;
  allergies?: Record<string, string | undefined>;
  specialInstructions?: Record<string, string | undefined>;
  likes?: Record<string, string | undefined>;
  dislikes?: Record<string, string | undefined>;
  alerts?: string[];
};

const defaultProfile: PassportProfile = {
  identity: { name: undefined, species: undefined, breed: undefined, age: undefined, sex: undefined },
  feeding: {},
  routine: {},
  behaviour: {},
  comfort: {},
  medicalInformation: {},
  allergies: {},
  specialInstructions: {},
  likes: {},
  dislikes: {},
  alerts: [],
};

function formatValue(value?: string | null) {
  if (typeof value === "string" && value.trim()) return value.trim();
  return "Not provided yet";
}

function formatList(value?: string[] | null) {
  if (!Array.isArray(value) || value.length === 0) return ["Not provided yet"];
  return value.filter((item) => typeof item === "string" && item.trim().length > 0);
}

function renderSection(title: string, entries: Array<[string, string]>) {
  return (
    <section className="rounded-[1.5rem] border border-[#ead8c8] bg-[#f7f2ed] p-4 sm:p-5">
      <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#cc6f47]">{title}</h3>
      <div className="space-y-3">
        {entries.map(([label, value], index) => (
          <div key={`${label}-${index}`} className="flex justify-between gap-3 border-b border-[#e7d9c9] pb-2 last:border-b-0 last:pb-0">
            <span className="text-sm text-[#5d7069]">{label}</span>
            <span className="max-w-[58%] text-right text-sm font-medium text-[#17352d]">{value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function CarePassport({
  profile,
  onContinue,
}: {
  profile: PassportProfile;
  onContinue: () => void;
}) {
  const [downloaded, setDownloaded] = useState<"pdf" | "json" | null>(null);
  const live = { ...defaultProfile, ...profile } as PassportProfile;
  const identity = live.identity ?? defaultProfile.identity;
  const feeding = live.feeding ?? {};
  const routine = live.routine ?? {};
  const behaviour = live.behaviour ?? {};
  const comfort = live.comfort ?? {};
  const medicalInformation = live.medicalInformation ?? {};
  const allergies = live.allergies ?? {};
  const special = live.specialInstructions ?? {};
  const likes = live.likes ?? {};
  const dislikes = live.dislikes ?? {};
  const alerts = formatList(live.alerts);

  function downloadJSON() {
    const payload = {
      identity: identity,
      feeding,
      routine,
      behaviour,
      comfort,
      medicalInformation,
      allergies,
      specialInstructions: special,
      likes,
      dislikes,
      alerts,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(identity.name ?? "pet").toLowerCase().replace(/\s+/g, "-")}-care-handbook.json`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloaded("json");
    setTimeout(() => setDownloaded(null), 2000);
  }

  function downloadPDF() {
    setDownloaded("pdf");
    setTimeout(() => window.print(), 120);
    setTimeout(() => setDownloaded(null), 2200);
  }

  const identityEntries: Array<[string, string]> = [
    ["Name", formatValue(identity.name)],
    ["Species", formatValue(identity.species)],
    ["Breed", formatValue(identity.breed)],
    ["Age", formatValue(identity.age)],
    ["Sex", formatValue(identity.sex)],
  ];

  const feedingEntries: Array<[string, string]> = [
    ["Food", formatValue(feeding.food)],
    ["Meal timings", formatValue(feeding.mealTimes ?? feeding.mealTimings)],
    ["Quantity", formatValue(feeding.quantity)],
    ["Treats", formatValue(feeding.treats)],
    ["Foods to avoid", formatValue(feeding.foodsToAvoid)],
  ];

  const routineEntries: Array<[string, string]> = [
    ["Wake-up", formatValue(routine.wakeUp)],
    ["Walks", formatValue(routine.walks)],
    ["Toilet", formatValue(routine.toilet)],
    ["Sleep", formatValue(routine.sleep)],
  ];

  const behaviourEntries: Array<[string, string]> = [
    ["Around people", formatValue(behaviour.aroundPeople)],
    ["Around animals", formatValue(behaviour.aroundAnimals)],
    ["Triggers", formatValue(behaviour.triggers)],
    ["Separation anxiety", formatValue(behaviour.separationAnxiety)],
    ["Aggression", formatValue(behaviour.aggression)],
    ["Other quirks", formatValue(behaviour.otherQuirks)],
  ];

  const comfortEntries: Array<[string, string]> = [
    ["Favourite toys", formatValue(comfort.favouriteToys)],
    ["Comfort objects", formatValue(comfort.comfortObjects)],
    ["Calming preferences", formatValue(comfort.calmingPreferences)],
    ["Things they dislike", formatValue(comfort.dislikes)],
  ];

  const likesEntries: Array<[string, string]> = [
    ["Likes", formatValue(likes.toys ?? likes.affection ?? likes.touch)],
    ["Comfort rituals", formatValue(likes.affection)],
  ];

  const dislikesEntries: Array<[string, string]> = [
    ["Dislikes", formatValue(dislikes.touch ?? dislikes.handFeeding ?? dislikes.other)],
    ["Handling dislikes", formatValue(dislikes.beingHeld)],
  ];

  const medicalEntries: Array<[string, string]> = [
    ["Conditions", formatValue(medicalInformation.conditions)],
    ["Mobility", formatValue(medicalInformation.mobility)],
    ["Medication", formatValue(medicalInformation.medication ?? medicalInformation.notes)],
    ["Allergies", formatValue(allergies.foods ?? allergies.medications ?? allergies.environmental)],
  ];

  const specialEntries: Array<[string, string]> = [
    ["Care notes", formatValue(special.careNotes)],
    ["Handling notes", formatValue(special.handlingNotes)],
    ["Routines", formatValue(special.routines)],
  ];

  const likesAndDislikesEntries: Array<[string, string]> = [...likesEntries, ...dislikesEntries];

  return (
    <div className="print-root fixed inset-0 z-50 overflow-y-auto bg-[#17352d]/40 backdrop-blur-sm">
      <div className="mx-auto flex min-h-full max-w-2xl flex-col items-center justify-center px-4 py-10">
        <div className="animate-scale-in w-full overflow-hidden rounded-[2rem] border border-[#e8d9c9] bg-[#fffdfb] shadow-2xl">
          <div className="bg-[#17352d] px-8 py-6 text-[#f7f1e9]">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em]">
                <PawMark className="h-4 w-4" /> PET HANDBOOK
              </span>
              <span className="rounded-full bg-[#d8a16a] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#17352d]">
                Care Handbook
              </span>
            </div>

            <div className="mt-6 flex items-center gap-5">
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 border-[#f7f1e9]/20 bg-[#f7f1e9]/10">
                <Image
                  src="/vercel.svg"
                  alt={identity.name ? `Portrait of ${identity.name}` : "Pet portrait"}
                  width={160}
                  height={160}
                  className="h-full w-full object-cover grayscale"
                />
              </div>
              <div>
                <h2 className="font-display text-4xl font-bold uppercase leading-none tracking-wide">
                  {identity.name ?? "Your pet"}
                </h2>
                <p className="mt-2 text-sm text-[#cfe0d8]">
                  {[identity.breed, identity.age].filter(Boolean).join(" • ") || "Details being collected"}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6 px-8 py-8">
            <section className="rounded-[1.5rem] border border-[#ead8c8] bg-[#f7f2ed] p-4 sm:p-5">
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#cc6f47]">Pet Identity</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {identityEntries.map(([label, value], idx) => (
                  <div key={`${label}-${idx}`} className="rounded-[16px] bg-white/70 p-3">
                    <div className="text-xs uppercase tracking-[0.14em] text-[#6c7d77]">{label}</div>
                    <div className="mt-1 text-sm font-medium text-[#17352d]">{value}</div>
                  </div>
                ))}
              </div>
            </section>

            {feedingEntries.some(([, value]) => value !== "Not provided yet") && renderSection("Feeding", feedingEntries)}
            {routineEntries.some(([, value]) => value !== "Not provided yet") && renderSection("Daily routine", routineEntries)}
            {behaviourEntries.some(([, value]) => value !== "Not provided yet") && renderSection("Behaviour", behaviourEntries)}
            {likesEntries.some(([, value]) => value !== "Not provided yet") && renderSection("Likes & dislikes", likesAndDislikesEntries)}
            {comfortEntries.some(([, value]) => value !== "Not provided yet") && renderSection("Comfort preferences", comfortEntries)}
            {medicalEntries.some(([, value]) => value !== "Not provided yet") && renderSection("Health & medications", medicalEntries)}
            {specialEntries.some(([, value]) => value !== "Not provided yet") && renderSection("Special care", specialEntries)}

            {alerts.length > 0 && (
              <section className="rounded-[24px] border border-[#e6c3b0] bg-[#fff1ea] p-4 sm:p-5">
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#cc6f47]">Care notes</h3>
                <ul className="space-y-2">
                  {alerts.map((alert, index) => (
                    <li key={`${alert}-${index}`} className="rounded-[14px] border border-[#eabda4] bg-white/70 px-3 py-2 text-sm font-medium text-[#17352d]">
                      {alert}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <p className="border-t border-[#ead8c8] pt-5 text-center text-xs text-[#617066]">
              Prepared from owner-provided information and confirmed conversation details.
            </p>
          </div>
        </div>

        <div className="no-print mt-6 w-full">
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={downloadPDF}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#17352d] px-6 py-3.5 font-semibold text-[#f7f1e9] shadow-lg transition-transform hover:-translate-y-0.5"
            >
              <span aria-hidden="true">↓</span>
              {downloaded === "pdf" ? "Opening print…" : "Download PDF"}
            </button>
            <button
              type="button"
              onClick={downloadJSON}
              className="flex flex-1 items-center justify-center gap-2 rounded-full border border-[#d9c4b5] bg-[#fffdfb] px-6 py-3.5 font-semibold text-[#17352d] transition-colors hover:bg-[#f5efe9]"
            >
              <span aria-hidden="true">{'{ }'}</span>
              {downloaded === "json" ? "Saved!" : "Download JSON"}
            </button>
          </div>
          <button
            type="button"
            onClick={onContinue}
            className="mx-auto mt-4 block text-sm font-medium text-[#f7f1e9] underline-offset-4 hover:underline"
          >
            ← Continue conversation
          </button>
        </div>
      </div>
    </div>
  );
}
