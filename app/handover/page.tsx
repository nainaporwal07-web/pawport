"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type ChatRole = "user" | "assistant";

type ChatMessage = {
  role: ChatRole;
  content: string;
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
      "Hi! I'm PawPort. Tell me about your pet and I'll turn the conversation into a Care Passport for their handover.",
  },
];

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

const formatAlerts = (value: string[] | undefined): string[] => {
  if (!Array.isArray(value) || value.length === 0) {
    return ["Not provided yet"];
  }

  const cleaned = value.filter((item) => typeof item === "string" && item.trim().length > 0);
  return cleaned.length > 0 ? cleaned : ["Not provided yet"];
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
    if (!storedProfile) return;

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
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(liveProfile));
  }, [liveProfile]);

  const previewData = useMemo(
    () => [
      ["Name", formatValue(liveProfile.identity.name)],
      ["Species", formatValue(liveProfile.identity.species)],
      ["Breed", formatValue(liveProfile.identity.breed)],
      ["Age", formatValue(liveProfile.identity.age)],
      ["Food", formatValue(liveProfile.feeding.food)],
      ["Meals", formatValue(liveProfile.feeding.mealTimings)],
      ["Walks", formatValue(liveProfile.routine.walks)],
      ["Sleep", formatValue(liveProfile.routine.sleep)],
      ["Care notes", formatAlerts(liveProfile.alerts).join(", ")],
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
          : "Thanks — I've updated your pet's handover details.";

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
          : "I'm having trouble reaching PawPort right now. Please try again.";

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
            </div>
          </div>

          <button
            type="button"
            className="rounded-full border border-[#d9c4b5] bg-white/60 px-4 py-2 text-sm font-medium text-[#17352d] transition hover:bg-white"
          >
            Start Pet Handover
          </button>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.55fr_0.95fr]">
          <section className="rounded-[30px] border border-[#e8d9c9] bg-[#fffdfb] p-4 shadow-[0_18px_40px_rgba(23,53,45,0.06)] sm:p-6 lg:p-8">
            <h1 className="mb-5 text-3xl font-semibold tracking-tight text-[#17352d] sm:text-4xl">
              Tell me about your pet
            </h1>

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

          <aside className="rounded-[30px] bg-[#17352d] p-5 text-white shadow-[0_18px_40px_rgba(23,53,45,0.06)] sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="text-2xl font-semibold tracking-tight">Care Passport</h2>
              <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#dfeae7]">
                {progress}/6
              </span>
            </div>

            <div className="space-y-3">
              {previewData.map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-white/6 p-3">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#b9c9c4]">{label}</div>
                  <div className="mt-1 text-sm text-[#f8f3ee]">{value}</div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
