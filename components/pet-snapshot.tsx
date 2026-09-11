'use client';

import { PawMark } from "@/components/paw-logo";
import { cn } from "@/lib/utils";

type SnapshotProfile = {
  identity?: {
    name?: string | null;
    species?: string | null;
    breed?: string | null;
    age?: string | null;
    sex?: string | null;
  };
  feeding?: Record<string, string | null | undefined>;
  routine?: Record<string, string | null | undefined>;
  behaviour?: Record<string, string | null | undefined>;
  comfort?: Record<string, string | null | undefined>;
  medicalInformation?: Record<string, string | null | undefined>;
  allergies?: Record<string, string | null | undefined>;
  specialInstructions?: Record<string, string | null | undefined>;
  alerts?: string[];
};

const categoryMeta = {
  identity: { icon: "🐾", label: "Identity" },
  feeding: { icon: "🍽", label: "Feeding" },
  routine: { icon: "⏰", label: "Routine" },
  behaviour: { icon: "💛", label: "Behaviour" },
  comfort: { icon: "🧸", label: "Comfort" },
  alerts: { icon: "⚠️", label: "Care notes" },
};

function formatValue(value?: string | null) {
  if (typeof value === "string" && value.trim()) return value.trim();
  return "Not provided yet";
}

export function PetSnapshot({ profile, onGenerate }: { profile: SnapshotProfile; onGenerate: () => void }) {
  const identity = profile.identity ?? {};
  const feeding = profile.feeding ?? {};
  const routine = profile.routine ?? {};
  const behaviour = profile.behaviour ?? {};
  const comfort = profile.comfort ?? {};
  const alerts = Array.isArray(profile.alerts) ? profile.alerts.filter(Boolean) : [];

  const hasInfo = Boolean(
    identity.name || identity.species || identity.breed || identity.age || identity.sex ||
    Object.values(feeding).some((v) => !!v) ||
    Object.values(routine).some((v) => !!v) ||
    Object.values(behaviour).some((v) => !!v) ||
    Object.values(comfort).some((v) => !!v) ||
    alerts.length
  );

  const ready = hasInfo;

  const identitySummary = [identity.name, identity.species, identity.breed].filter(Boolean).join(" • ") || "Details being collected";

  return (
    <div className="flex h-full flex-col rounded-[2rem] border border-[#e8d9c9] bg-[#fffdfb] p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-bold text-[#17352d]">Pet Snapshot</h2>
        <PawMark className="h-5 w-5 text-[#17352d]" />
      </div>

      {!hasInfo ? (
        <div className="flex flex-1 flex-col items-center justify-center py-12 text-center">
          <span className="animate-paw-float flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f3eee8] text-3xl">
            🐾
          </span>
          <p className="mt-5 max-w-[14rem] text-pretty text-sm leading-relaxed text-[#617066]">
            Your pet&apos;s details will appear here as the conversation unfolds.
          </p>
        </div>
      ) : (
        <div className="mt-5 flex flex-1 flex-col">
          <div className="rounded-[1.25rem] bg-[#17352d] p-5 text-[#f7f1e9]">
            <p className="font-display text-2xl font-bold uppercase tracking-wide">{identity.name ?? "Pet"}</p>
            <p className="mt-1 text-sm text-[#dfeae7]">{identitySummary}</p>
          </div>

          <ul className="mt-4 space-y-2.5">
            {Object.entries(categoryMeta).map(([key, meta]) => {
              const count = key === "identity"
                ? [identity.name, identity.species, identity.breed, identity.age, identity.sex].filter(Boolean).length
                : key === "feeding"
                  ? Object.values(feeding).filter(Boolean).length
                  : key === "routine"
                    ? Object.values(routine).filter(Boolean).length
                    : key === "behaviour"
                      ? Object.values(behaviour).filter(Boolean).length
                      : key === "comfort"
                        ? Object.values(comfort).filter(Boolean).length
                        : alerts.length;

              const done = count > 0;
              return (
                <li
                  key={key}
                  className={cn(
                    "flex items-center justify-between rounded-xl border px-4 py-3 transition-colors",
                    done ? "border-[#e7ddcf] bg-[#f3eee8]" : "border-dashed border-[#e7ddcf] bg-transparent"
                  )}
                >
                  <span className="flex items-center gap-2.5 text-sm font-medium text-[#17352d]">
                    <span aria-hidden="true">{meta.icon}</span>
                    {meta.label}
                  </span>
                  {done ? (
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-[#17352d]">
                      {count === 1 ? "Added" : `${count} details`}
                    </span>
                  ) : (
                    <span className="text-xs text-[#617066]">Not added yet</span>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="mt-auto pt-6">
            <p className="mb-3 text-center text-sm font-medium text-[#17352d]">Ready to generate the handbook?</p>
            <button
              type="button"
              onClick={onGenerate}
              disabled={!ready}
              className={cn(
                "w-full rounded-full px-6 py-3.5 font-semibold transition-all",
                ready ? "bg-[#cc6f47] text-[#fffaf5] shadow-lg shadow-[#cc6f47]/25 hover:-translate-y-0.5 hover:shadow-xl" : "cursor-not-allowed bg-[#f3eee8] text-[#617066]"
              )}
            >
              Generate Care Handbook
            </button>
            {!ready && (
              <p className="mt-2 text-center text-xs text-[#617066]">Conversation details unlock the handbook.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
