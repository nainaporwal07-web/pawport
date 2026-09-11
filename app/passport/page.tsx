"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type CareProfile = {
  identity: {
    name?: string;
    species?: string;
    breed?: string;
    age?: string;
    gender?: string;
  };
  feeding: {
    food?: string;
    mealTimings?: string;
    quantity?: string;
    treats?: string;
    foodsToAvoid?: string;
  };
  routine: {
    wakeUp?: string;
    walks?: string;
    toilet?: string;
    sleep?: string;
  };
  behaviour: {
    aroundPeople?: string;
    aroundAnimals?: string;
    triggers?: string;
    otherQuirks?: string;
    separationAnxiety?: string;
    aggression?: string;
  };
  comfort: {
    favouriteToys?: string;
    comfortObjects?: string;
    calmingPreferences?: string;
    dislikes?: string;
  };
  alerts: string[];
};

const STORAGE_KEY = "pawport-live-profile";
const FALLBACK_PROFILE: CareProfile = {
  identity: { name: undefined, species: undefined, breed: undefined, age: undefined, gender: undefined },
  feeding: { food: undefined, mealTimings: undefined, quantity: undefined, treats: undefined, foodsToAvoid: undefined },
  routine: { wakeUp: undefined, walks: undefined, toilet: undefined, sleep: undefined },
  behaviour: { aroundPeople: undefined, aroundAnimals: undefined, triggers: undefined, otherQuirks: undefined, separationAnxiety: undefined, aggression: undefined },
  comfort: { favouriteToys: undefined, comfortObjects: undefined, calmingPreferences: undefined, dislikes: undefined },
  alerts: [],
};

const formatValue = (value: string | undefined | null): string => {
  if (typeof value === "string" && value.trim()) return value.trim();
  return "Not provided";
};

const formatAlerts = (value: string[] | undefined): string[] => {
  if (!Array.isArray(value) || value.length === 0) {
    return ["Not provided"];
  }

  const cleaned = value.filter((item) => typeof item === "string" && item.trim().length > 0);
  return cleaned.length > 0 ? cleaned : ["Not provided"];
};

const buildCareNotes = (profile: CareProfile) => {
  const noteParts: string[] = [];

  const name = formatValue(profile.identity.name);
  const species = formatValue(profile.identity.species);
  const age = formatValue(profile.identity.age);
  const food = formatValue(profile.feeding.food);
  const quantity = formatValue(profile.feeding.quantity);
  const mealTimings = formatValue(profile.feeding.mealTimings);
  const wakeUp = formatValue(profile.routine.wakeUp);
  const walks = formatValue(profile.routine.walks);
  const behaviour = formatValue(profile.behaviour.otherQuirks);
  const alerts = formatAlerts(profile.alerts);

  if (name !== "Not provided") {
    noteParts.push(`${name} is the pet in this handover.`);
  }

  if (species !== "Not provided" || age !== "Not provided") {
    const identitySummary = [species !== "Not provided" ? species : null, age !== "Not provided" ? age : null]
      .filter(Boolean)
      .join(" • ");
    noteParts.push(identitySummary ? `Profile: ${identitySummary}.` : "Profile details are still being collected.");
  }

  if (food !== "Not provided" || quantity !== "Not provided" || mealTimings !== "Not provided") {
    const feedingParts: string[] = [];

    if (food !== "Not provided") {
      feedingParts.push(`Food: ${food}`);
    } else {
      feedingParts.push("Food details have not been provided");
    }

    if (quantity !== "Not provided") {
      feedingParts.push(`Quantity: ${quantity}`);
    }

    if (mealTimings !== "Not provided") {
      feedingParts.push(`Meals are at ${mealTimings}`);
    } else if (quantity !== "Not provided") {
      feedingParts.push("Meal timings have not been provided");
    }

    if (food !== "Not provided" && quantity !== "Not provided" && mealTimings !== "Not provided") {
      noteParts.push(`${name !== "Not provided" ? `${name} eats` : "Pet eats"} ${food} ${quantity.toLowerCase()} at ${mealTimings}.`);
    } else if (food !== "Not provided" && mealTimings !== "Not provided") {
      noteParts.push(`${name !== "Not provided" ? `${name} eats` : "Pet eats"} ${food} at ${mealTimings}. Meal quantity has not been provided.`);
    } else if (food !== "Not provided" && quantity !== "Not provided") {
      noteParts.push(`${name !== "Not provided" ? `${name} eats` : "Pet eats"} ${food} ${quantity.toLowerCase()}. Meal timings have not been provided.`);
    } else if (food !== "Not provided") {
      noteParts.push(`${name !== "Not provided" ? `${name} eats` : "Pet eats"} ${food}. Meal timings have not been provided.`);
    } else if (mealTimings !== "Not provided") {
      noteParts.push(`Meals are at ${mealTimings}. Food details have not been provided.`);
    } else if (quantity !== "Not provided") {
      noteParts.push(`Quantity is ${quantity}. Food and meal timings have not been provided.`);
    } else {
      noteParts.push("Feeding details have not been provided.");
    }
  }

  if (wakeUp !== "Not provided" || walks !== "Not provided") {
    noteParts.push(`Routine: ${wakeUp !== "Not provided" ? `wake-up ${wakeUp}` : "wake-up not provided"}${walks !== "Not provided" ? `; walks ${walks}` : ""}.`);
  }

  if (behaviour !== "Not provided") {
    noteParts.push(`Behaviour detail: ${behaviour}.`);
  }

  if (alerts[0] !== "Not provided") {
    noteParts.push(`Care alerts: ${alerts.join("; ")}.`);
  }

  if (noteParts.length === 0) {
    return "Pet profile details are still being collected. No information has been provided yet.";
  }

  return noteParts.join(" ");
};

export default function PassportPage() {
  const [profile, setProfile] = useState<CareProfile>(FALLBACK_PROFILE);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedProfile = window.localStorage.getItem(STORAGE_KEY);

    if (storedProfile) {
      try {
        const parsed = JSON.parse(storedProfile) as Partial<CareProfile>;
        setProfile({
          ...FALLBACK_PROFILE,
          ...parsed,
          identity: { ...FALLBACK_PROFILE.identity, ...parsed.identity },
          feeding: { ...FALLBACK_PROFILE.feeding, ...parsed.feeding },
          routine: { ...FALLBACK_PROFILE.routine, ...parsed.routine },
          behaviour: { ...FALLBACK_PROFILE.behaviour, ...parsed.behaviour },
          comfort: { ...FALLBACK_PROFILE.comfort, ...parsed.comfort },
          alerts: Array.isArray(parsed.alerts) ? parsed.alerts : [],
        });
      } catch {
        setProfile(FALLBACK_PROFILE);
      }
    }

    setMounted(true);
  }, []);

  const careNote = useMemo(() => buildCareNotes(profile), [profile]);

  const generatedAt = mounted
    ? new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date())
    : "--";

  return (
    <main className="min-h-screen bg-[#f7f1e9] p-4 text-[#17352d] sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 rounded-[28px] border border-[#dcd0c5] bg-[#f3eee8] px-4 py-4 shadow-[0_12px_30px_rgba(23,53,45,0.06)] sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#17352d] text-lg font-bold text-[#f7f1e9]">
                P
              </div>
              <div>
                <p className="text-lg font-semibold tracking-tight">PET HANDBOOK</p>
                <p className="text-xs uppercase tracking-[0.2em] text-[#61776d]">Care Handbook</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link href="/handover" className="rounded-full border border-[#d8c5b5] bg-white px-4 py-2 text-sm font-medium text-[#17352d] transition hover:bg-[#f9f4ef]">
                Back to Handover
              </Link>
              <Link href="/handover" className="rounded-full bg-[#17352d] px-4 py-2 text-sm font-medium text-[#fffdfb] transition hover:bg-[#102a26]">
                Start New Handover
              </Link>
              <button
                type="button"
                onClick={() => window.print()}
                className="rounded-full bg-[#cc6f47] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#b85d3a]"
              >
                Print / Save as PDF
              </button>
            </div>
          </div>
        </header>

        <section className="rounded-[30px] border border-[#ead8c8] bg-[#fffdfb] p-5 shadow-[0_18px_40px_rgba(23,53,45,0.06)] sm:p-7 md:p-8">
          <div className="mb-6 flex flex-col gap-3 border-b border-[#ead8c8] pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#cc6f47]">PET HANDBOOK</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">CARE HANDBOOK</h1>
            </div>
            <div className="text-sm text-[#5d7069]">
              <p>Generated: {generatedAt}</p>
            </div>
          </div>

          <div className="mb-7 rounded-[24px] border border-[#eddcc7] bg-[#f5efe9] p-4 sm:p-5">
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#cc6f47]">CARE NOTES</h2>
            <p className="text-base leading-7 text-[#17352d]">{careNote}</p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <section className="rounded-[24px] border border-[#ead8c8] bg-[#f7f2ed] p-4 sm:p-5">
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#cc6f47]">Pet Identity</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    ["Name", formatValue(profile.identity.name)],
                    ["Species", formatValue(profile.identity.species)],
                    ["Breed", formatValue(profile.identity.breed)],
                    ["Age", formatValue(profile.identity.age)],
                    ["Gender", formatValue(profile.identity.gender)],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-[16px] bg-white/70 p-3">
                      <div className="text-xs uppercase tracking-[0.14em] text-[#6c7d77]">{label}</div>
                      <div className="mt-1 text-sm font-medium text-[#17352d]">{value}</div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-[24px] border border-[#ead8c8] bg-[#f7f2ed] p-4 sm:p-5">
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#cc6f47]">Feeding</h3>
                <div className="space-y-3">
                  {[
                    ["Food", formatValue(profile.feeding.food)],
                    ["Meal timings", formatValue(profile.feeding.mealTimings)],
                    ["Quantity", formatValue(profile.feeding.quantity)],
                    ["Treats", formatValue(profile.feeding.treats)],
                    ["Foods to avoid", formatValue(profile.feeding.foodsToAvoid)],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between gap-3 border-b border-[#e7d9c9] pb-2 last:border-b-0 last:pb-0">
                      <span className="text-sm text-[#5d7069]">{label}</span>
                      <span className="max-w-[58%] text-right text-sm font-medium text-[#17352d]">{value}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-[24px] border border-[#ead8c8] bg-[#f7f2ed] p-4 sm:p-5">
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#cc6f47]">Daily Routine</h3>
                <div className="space-y-3">
                  {[
                    ["Wake-up", formatValue(profile.routine.wakeUp)],
                    ["Walks", formatValue(profile.routine.walks)],
                    ["Toilet", formatValue(profile.routine.toilet)],
                    ["Sleep", formatValue(profile.routine.sleep)],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between gap-3 border-b border-[#e7d9c9] pb-2 last:border-b-0 last:pb-0">
                      <span className="text-sm text-[#5d7069]">{label}</span>
                      <span className="max-w-[58%] text-right text-sm font-medium text-[#17352d]">{value}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="space-y-6">
              <section className="rounded-[24px] border border-[#ead8c8] bg-[#f7f2ed] p-4 sm:p-5">
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#cc6f47]">Behaviour</h3>
                <div className="space-y-3">
                  {[
                    ["Around people", formatValue(profile.behaviour.aroundPeople)],
                    ["Around animals", formatValue(profile.behaviour.aroundAnimals)],
                    ["Triggers", formatValue(profile.behaviour.triggers)],
                    ["Separation anxiety", formatValue(profile.behaviour.separationAnxiety)],
                    ["Aggression", formatValue(profile.behaviour.aggression)],
                    ["Other quirks", formatValue(profile.behaviour.otherQuirks)],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between gap-3 border-b border-[#e7d9c9] pb-2 last:border-b-0 last:pb-0">
                      <span className="text-sm text-[#5d7069]">{label}</span>
                      <span className="max-w-[58%] text-right text-sm font-medium text-[#17352d]">{value}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-[24px] border border-[#ead8c8] bg-[#f7f2ed] p-4 sm:p-5">
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#cc6f47]">Comfort</h3>
                <div className="space-y-3">
                  {[
                    ["Favourite toys", formatValue(profile.comfort.favouriteToys)],
                    ["Comfort objects", formatValue(profile.comfort.comfortObjects)],
                    ["Calming preferences", formatValue(profile.comfort.calmingPreferences)],
                    ["Things they dislike", formatValue(profile.comfort.dislikes)],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between gap-3 border-b border-[#e7d9c9] pb-2 last:border-b-0 last:pb-0">
                      <span className="text-sm text-[#5d7069]">{label}</span>
                      <span className="max-w-[58%] text-right text-sm font-medium text-[#17352d]">{value}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-[24px] border border-[#e6c3b0] bg-[#fff1ea] p-4 sm:p-5">
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#cc6f47]">Care Alerts</h3>
                <ul className="space-y-2">
                  {(formatAlerts(profile.alerts)[0] === "Not provided"
                    ? ["No care alerts provided"]
                    : formatAlerts(profile.alerts)
                  ).map((alert, index) => (
                    <li key={`${alert}-${index}`} className="rounded-[14px] border border-[#eabda4] bg-white/70 px-3 py-2 text-sm font-medium text-[#17352d]">
                      {alert}
                    </li>
                  ))}
                </ul>

                <div className="mt-4 space-y-3">
                  {[
                    ["Allergies", "Not provided"],
                    ["Medical conditions", "Not provided"],
                    ["Medication", "Not provided"],
                    ["Emergency instructions", "Not provided"],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between gap-3 border-b border-[#e7d9c9] pb-2 last:border-b-0 last:pb-0">
                      <span className="text-sm text-[#5d7069]">{label}</span>
                      <span className="max-w-[58%] text-right text-sm font-medium text-[#17352d]">{value}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
