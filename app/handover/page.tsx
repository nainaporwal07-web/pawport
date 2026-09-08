"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type ChatRole = "user" | "assistant";

type ChatMessage = {
  role: ChatRole;
  content: string;
};

type ProfileSectionData = {
  name?: string;
  species?: string;
  breed?: string;
  age?: string;
  gender?: string;
  food?: string;
  mealTimings?: string;
  quantity?: string;
  treats?: string;
  foodsToAvoid?: string;
  wakeUp?: string;
  walks?: string;
  toilet?: string;
  sleep?: string;
  aroundPeople?: string;
  aroundAnimals?: string;
  triggers?: string;
  separationAnxiety?: string;
  aggression?: string;
  favouriteToys?: string;
  comfortObjects?: string;
  calmingPreferences?: string;
  dislikes?: string;
  allergies?: string;
  medicalConditions?: string;
  medication?: string;
  emergencyInstructions?: string;
};

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

const EMPTY_PROFILE: CareProfile = {
  identity: {
    name: undefined,
    species: undefined,
    breed: undefined,
    age: undefined,
    gender: undefined,
  },
  feeding: {
    food: undefined,
    mealTimings: undefined,
    quantity: undefined,
    treats: undefined,
    foodsToAvoid: undefined,
  },
  routine: {
    wakeUp: undefined,
    walks: undefined,
    toilet: undefined,
    sleep: undefined,
  },
  behaviour: {
    aroundPeople: undefined,
    aroundAnimals: undefined,
    triggers: undefined,
    otherQuirks: undefined,
    separationAnxiety: undefined,
    aggression: undefined,
  },
  comfort: {
    favouriteToys: undefined,
    comfortObjects: undefined,
    calmingPreferences: undefined,
    dislikes: undefined,
  },
  alerts: [],
};

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    role: "assistant",
    content:
      "Hi! I’m PawPort. Tell me about your pet and I’ll turn the conversation into a Care Passport for their handover.",
  },
];

const sectionConfig = [
  {
    title: "Pet Identity",
    fields: [
      ["Name", "identity", "name"],
      ["Species", "identity", "species"],
      ["Breed", "identity", "breed"],
      ["Age", "identity", "age"],
      ["Gender", "identity", "gender"],
    ],
  },
  {
    title: "Feeding",
    fields: [
      ["Food", "feeding", "food"],
      ["Meal timings", "feeding", "mealTimings"],
      ["Quantity", "feeding", "quantity"],
      ["Treats", "feeding", "treats"],
      ["Foods to avoid", "feeding", "foodsToAvoid"],
    ],
  },
  {
    title: "Routine",
    fields: [
      ["Wake-up", "routine", "wakeUp"],
      ["Walks", "routine", "walks"],
      ["Toilet", "routine", "toilet"],
      ["Sleep", "routine", "sleep"],
    ],
  },
  {
    title: "Behaviour",
    fields: [
      ["Around people", "behaviour", "aroundPeople"],
      ["Around animals", "behaviour", "aroundAnimals"],
      ["Triggers", "behaviour", "triggers"],
      ["Separation anxiety", "behaviour", "separationAnxiety"],
      ["Aggression", "behaviour", "aggression"],
    ],
  },
  {
    title: "Comfort",
    fields: [
      ["Favourite toys", "comfort", "favouriteToys"],
      ["Comfort objects", "comfort", "comfortObjects"],
      ["Calming preferences", "comfort", "calmingPreferences"],
      ["Things they dislike", "comfort", "dislikes"],
    ],
  },
  {
    title: "Care Alerts",
    fields: [
      ["Allergies", "alerts", "allergies"],
      ["Medical conditions", "alerts", "medicalConditions"],
      ["Medication", "alerts", "medication"],
      ["Emergency instructions", "alerts", "emergencyInstructions"],
    ],
  },
] as const;

const mergeProfile = (
  current: CareProfile,
  incoming: Partial<Record<string, unknown>>
): CareProfile => {
  const next: CareProfile = {
    identity: { ...current.identity },
    feeding: { ...current.feeding },
    routine: { ...current.routine },
    behaviour: { ...current.behaviour },
    comfort: { ...current.comfort },
    alerts: [...current.alerts],
  };

  const mergeObject = (target: Record<string, unknown>, source?: Record<string, unknown>) => {
    if (!source || typeof source !== "object") return target;

    Object.entries(source).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        target[key] = value;
      }
    });

    return target;
  };

  if (incoming.identity && typeof incoming.identity === "object") {
    mergeObject(next.identity, incoming.identity as Record<string, unknown>);
  }

  if (incoming.feeding && typeof incoming.feeding === "object") {
    mergeObject(next.feeding, incoming.feeding as Record<string, unknown>);
  }

  if (incoming.routine && typeof incoming.routine === "object") {
    mergeObject(next.routine, incoming.routine as Record<string, unknown>);
  }

  if (incoming.behaviour && typeof incoming.behaviour === "object") {
    mergeObject(next.behaviour, incoming.behaviour as Record<string, unknown>);
  }

  if (incoming.comfort && typeof incoming.comfort === "object") {
    mergeObject(next.comfort, incoming.comfort as Record<string, unknown>);
  }

  if (Array.isArray(incoming.alerts)) {
    const cleanAlerts = incoming.alerts.filter(
      (alert): alert is string => typeof alert === "string" && alert.trim().length > 0
    );

    next.alerts = cleanAlerts.length > 0 ? cleanAlerts : [];
  }

  return next;
};

const formatValue = (value: string | undefined | null): string => {
  if (typeof value === "string" && value.trim()) return value.trim();
  return "Not provided yet";
};

const formatAlerts = (value: string[] | undefined) => {
  if (!Array.isArray(value) || value.length === 0) {
    return ["Not provided yet"];
  }

  return value.filter((item) => typeof item === "string" && item.trim().length > 0);
};

export default function HandoverPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(1);
  const [liveProfile, setLiveProfile] = useState<CareProfile>(EMPTY_PROFILE);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedProfile = window.localStorage.getItem(STORAGE_KEY);

    if (storedProfile) {
      try {
        const parsed = JSON.parse(storedProfile) as Partial<CareProfile>;
        setLiveProfile({
          ...EMPTY_PROFILE,
          ...parsed,
          identity: { ...EMPTY_PROFILE.identity, ...parsed.identity },
          feeding: { ...EMPTY_PROFILE.feeding, ...parsed.feeding },
          routine: { ...EMPTY_PROFILE.routine, ...parsed.routine },
          behaviour: { ...EMPTY_PROFILE.behaviour, ...parsed.behaviour },
          comfort: { ...EMPTY_PROFILE.comfort, ...parsed.comfort },
          alerts: Array.isArray(parsed.alerts) ? parsed.alerts : [],
        });
      } catch {
        // Ignore malformed stored data and fall back to the empty profile.
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(liveProfile));
  }, [liveProfile]);

  const profileSections = useMemo(
    () => [
      {
        title: "Pet Identity",
        entries: [
          ["Name", liveProfile.identity.name],
          ["Species", liveProfile.identity.species],
          ["Breed", liveProfile.identity.breed],
          ["Age", liveProfile.identity.age],
          ["Gender", liveProfile.identity.gender],
        ],
      },
      {
        title: "Feeding",
        entries: [
          ["Food", liveProfile.feeding.food],
          ["Meal timings", liveProfile.feeding.mealTimings],
          ["Quantity", liveProfile.feeding.quantity],
          ["Treats", liveProfile.feeding.treats],
          ["Foods to avoid", liveProfile.feeding.foodsToAvoid],
        ],
      },
      {
        title: "Routine",
        entries: [
          ["Wake-up", liveProfile.routine.wakeUp],
          ["Walks", liveProfile.routine.walks],
          ["Toilet", liveProfile.routine.toilet],
          ["Sleep", liveProfile.routine.sleep],
        ],
      },
      {
        title: "Behaviour",
        entries: [
          ["Around people", liveProfile.behaviour.aroundPeople],
          ["Around animals", liveProfile.behaviour.aroundAnimals],
          ["Triggers", liveProfile.behaviour.triggers],
          ["Other quirks", liveProfile.behaviour.otherQuirks],
          ["Separation anxiety", liveProfile.behaviour.separationAnxiety],
          ["Aggression", liveProfile.behaviour.aggression],
        ],
      },
      {
        title: "Comfort",
        entries: [
          ["Favourite toys", liveProfile.comfort.favouriteToys],
          ["Comfort objects", liveProfile.comfort.comfortObjects],
          ["Calming preferences", liveProfile.comfort.calmingPreferences],
          ["Things they dislike", liveProfile.comfort.dislikes],
        ],
      },
      {
        title: "Care Alerts",
        entries: [
          ["Allergies", formatAlerts(liveProfile.alerts)[0]],
          ["Medical conditions", ""],
          ["Medication", ""],
          ["Emergency instructions", ""],
        ],
      },
    ],
    [liveProfile]
  );

  const handleGeneratePassport = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(liveProfile));
    }

    router.push("/passport");
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const nextInput = input.trim();
    if (!nextInput || isLoading) return;

    const userMessage: ChatMessage = { role: "user", content: nextInput };
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Something went wrong while contacting PawPort.");
      }

      const assistantMessage =
        typeof data?.message === "string" && data.message.trim()
          ? data.message
          : "Thanks — I’ve updated your pet’s handover details.";

      setMessages((current) => [...current, { role: "assistant", content: assistantMessage }]);

      if (data?.profileUpdate && typeof data.profileUpdate === "object") {
        setLiveProfile((current) => mergeProfile(current, data.profileUpdate));
      }

      if (typeof data?.progress === "number") {
        setProgress(Math.min(Math.max(data.progress, 1), 6));
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "I’m having trouble reaching PawPort right now. Please try again.";

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: message,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f1e9] text-[#17352d]">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <header className="mb-6 flex items-center justify-between rounded-[28px] border border-[#dcd0c5] bg-[#f4efe9]/90 px-4 py-3 shadow-[0_12px_30px_rgba(23,53,45,0.06)] backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#17352d] text-lg font-bold text-[#f7f1e9]">
              P
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xl font-semibold tracking-tight">PawPort</span>
              <span className="hidden h-5 w-px bg-[#d9c4b5] sm:block" />
              <span className="text-sm font-medium text-[#5a6b63]">Pet Handover</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-2 rounded-full border border-[#e5d2c2] bg-white/60 px-3 py-1.5 text-sm font-medium text-[#1d453d] sm:flex">
              <span className="h-2.5 w-2.5 rounded-full bg-[#cc6f47]" />
              Step {progress} of 6
            </div>
            <button className="rounded-full border border-[#d9c4b5] bg-transparent px-4 py-2 text-sm font-medium text-[#17352d] transition hover:bg-white">
              Save & Exit
            </button>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.5fr_0.92fr]">
          <section className="rounded-[30px] border border-[#e8d9c9] bg-[#fffdfb] p-4 shadow-[0_18px_40px_rgba(23,53,45,0.06)] sm:p-6 lg:p-8">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#cc6f47]">
                  PawPort care intake
                </p>
                <h1 className="text-3xl font-semibold tracking-tight text-[#17352d] sm:text-4xl">
                  Tell us about your pet
                </h1>
              </div>
              <div className="rounded-full border border-[#e8d7c9] bg-[#f7f1e9] px-3 py-1.5 text-sm font-medium text-[#17352d] sm:hidden">
                Step {progress} of 6
              </div>
            </div>

            <p className="mb-6 max-w-2xl text-base leading-7 text-[#4c615a]">
              PawPort will turn this conversation into a polished Care Passport for your pet’s boarding stay.
            </p>

            <div className="rounded-[28px] border border-[#e8d9c9] bg-[#f9f3ee] p-3 sm:p-4">
              <div className="mb-4 flex h-[520px] flex-col gap-4 overflow-y-auto pr-1">
                {messages.map((message, index) => (
                  <div
                    key={`${message.role}-${index}`}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[82%] rounded-[22px] px-4 py-3 text-sm leading-6 shadow-sm sm:text-[15px] ${
                        message.role === "user"
                          ? "bg-[#17352d] text-[#f8f3ee]"
                          : "border border-[#e5d8cb] bg-[#fffdfb] text-[#17352d]"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-2 rounded-[22px] border border-[#e5d8cb] bg-[#fffdfb] px-4 py-3 text-sm text-[#17352d] shadow-sm">
                      <span className="inline-flex h-2.5 w-2.5 animate-bounce rounded-full bg-[#cc6f47] [animation-delay:-0.2s]" />
                      <span className="inline-flex h-2.5 w-2.5 animate-bounce rounded-full bg-[#cc6f47] [animation-delay:-0.1s]" />
                      <span className="inline-flex h-2.5 w-2.5 animate-bounce rounded-full bg-[#cc6f47]" />
                    </div>
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit} className="flex gap-3 border-t border-[#ebdfd2] pt-4">
                <textarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Tell PawPort about your pet…"
                  rows={1}
                  className="min-h-[52px] flex-1 resize-none rounded-[18px] border border-[#e1d0c2] bg-white px-4 py-3 text-sm text-[#17352d] placeholder:text-[#7a8d86] focus:border-[#cc6f47] focus:outline-none"
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      handleSubmit(event as unknown as FormEvent);
                    }
                  }}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="inline-flex items-center justify-center rounded-[18px] bg-[#cc6f47] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#b85d3a] disabled:cursor-not-allowed disabled:bg-[#d7b7a7]"
                >
                  {isLoading ? "Sending..." : "Send"}
                </button>
              </form>

              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleGeneratePassport}
                  className="inline-flex items-center justify-center rounded-[18px] bg-[#17352d] px-5 py-3 text-sm font-semibold text-[#fffdfb] transition hover:bg-[#102a26]"
                >
                  Generate Care Passport
                </button>
              </div>
            </div>
          </section>

          <aside className="lg:sticky lg:top-6 lg:self-start">
            <div className="rounded-[30px] border border-[#ead9ca] bg-[#fffdfb] p-5 shadow-[0_18px_40px_rgba(23,53,45,0.06)] sm:p-6">
              <div className="mb-5 flex items-center justify-between gap-4">
                <h2 className="text-xl font-semibold tracking-tight text-[#17352d]">LIVE CARE PROFILE</h2>
                <span className="rounded-full bg-[#edf3f1] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#3d5a52]">
                  {progress}/6
                </span>
              </div>

              <div className="space-y-5">
                {[
                  { title: "Pet Identity", data: profileSections[0].entries },
                  { title: "Feeding", data: profileSections[1].entries },
                  { title: "Routine", data: profileSections[2].entries },
                  { title: "Behaviour", data: profileSections[3].entries },
                  { title: "Comfort", data: profileSections[4].entries },
                  { title: "Care Alerts", data: [
                      ["Allergies", formatAlerts(liveProfile.alerts)[0]],
                      ["Medical conditions", "Not provided yet"],
                      ["Medication", "Not provided yet"],
                      ["Emergency instructions", "Not provided yet"],
                    ] },
                ].map((section) => (
                  <div key={section.title} className="rounded-[22px] border border-[#f1e3d6] bg-[#f9f3ee] p-4">
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#cc6f47]">
                      {section.title}
                    </h3>

                    <div className="space-y-2.5">
                      {section.data.map(([label, value]) => (
                        <div key={label} className="flex items-start justify-between gap-3 border-b border-[#eee3d7] pb-2 last:border-b-0 last:pb-0">
                          <span className="text-sm text-[#60756d]">{label}</span>
                          <span className="max-w-[52%] text-right text-sm font-medium text-[#17352d]">
                            {typeof value === "string" && value.trim() ? value : "Not provided yet"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
