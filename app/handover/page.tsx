"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CarePassport } from "@/components/care-passport";
import { HandoverChat, type ChatMessage } from "@/components/handover-chat";
import { PawLogo } from "@/components/paw-logo";
import { PetSnapshot } from "@/components/pet-snapshot";

const STORAGE_KEY = "pawport-live-profile";

const EMPTY_PROFILE = {
  identity: { name: undefined, species: undefined, breed: undefined, age: undefined, sex: undefined },
  feeding: {},
  routine: {},
  behaviour: {},
  comfort: {},
  likes: {},
  dislikes: {},
  medicalInformation: {},
  allergies: {},
  specialInstructions: {},
  alerts: [],
};

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    role: "assistant",
    text: "Hi! I'm PET HANDBOOK. Tell me about your pet and I’ll build a living care handbook from the conversation.",
  },
];

const mergeProfile = (current: any, incoming: Record<string, any>) => {
  const next = {
    ...current,
    identity: { ...(current.identity ?? {}) },
    feeding: { ...(current.feeding ?? {}) },
    routine: { ...(current.routine ?? {}) },
    behaviour: { ...(current.behaviour ?? {}) },
    comfort: { ...(current.comfort ?? {}) },
    likes: { ...(current.likes ?? {}) },
    dislikes: { ...(current.dislikes ?? {}) },
    medicalInformation: { ...(current.medicalInformation ?? {}) },
    allergies: { ...(current.allergies ?? {}) },
    specialInstructions: { ...(current.specialInstructions ?? {}) },
    alerts: [...(current.alerts ?? [])],
  };

  if (incoming.identity && typeof incoming.identity === "object") {
    Object.entries(incoming.identity).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") next.identity[key] = value;
    });
  }

  if (incoming.feeding && typeof incoming.feeding === "object") {
    Object.entries(incoming.feeding).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") next.feeding[key] = value;
    });
  }

  if (incoming.routine && typeof incoming.routine === "object") {
    Object.entries(incoming.routine).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") next.routine[key] = value;
    });
  }

  if (incoming.behaviour && typeof incoming.behaviour === "object") {
    Object.entries(incoming.behaviour).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") next.behaviour[key] = value;
    });
  }

  if (incoming.comfort && typeof incoming.comfort === "object") {
    Object.entries(incoming.comfort).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") next.comfort[key] = value;
    });
  }

  if (incoming.likes && typeof incoming.likes === "object") {
    Object.entries(incoming.likes).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") next.likes[key] = value;
    });
  }

  if (incoming.dislikes && typeof incoming.dislikes === "object") {
    Object.entries(incoming.dislikes).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") next.dislikes[key] = value;
    });
  }

  if (incoming.medicalInformation && typeof incoming.medicalInformation === "object") {
    Object.entries(incoming.medicalInformation).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") next.medicalInformation[key] = value;
    });
  }

  if (incoming.allergies && typeof incoming.allergies === "object") {
    Object.entries(incoming.allergies).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") next.allergies[key] = value;
    });
  }

  if (incoming.specialInstructions && typeof incoming.specialInstructions === "object") {
    Object.entries(incoming.specialInstructions).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") next.specialInstructions[key] = value;
    });
  }

  if (Array.isArray(incoming.alerts)) {
    next.alerts = incoming.alerts.filter((alert) => typeof alert === "string" && alert.trim().length > 0);
  }

  return next;
};

export default function HandoverPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(1);
  const [liveProfile, setLiveProfile] = useState<any>(EMPTY_PROFILE);
  const [showPassport, setShowPassport] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored);
      setLiveProfile({
        ...EMPTY_PROFILE,
        ...parsed,
        identity: { ...EMPTY_PROFILE.identity, ...(parsed.identity ?? {}) },
        feeding: { ...EMPTY_PROFILE.feeding, ...(parsed.feeding ?? {}) },
        routine: { ...EMPTY_PROFILE.routine, ...(parsed.routine ?? {}) },
        behaviour: { ...EMPTY_PROFILE.behaviour, ...(parsed.behaviour ?? {}) },
        comfort: { ...EMPTY_PROFILE.comfort, ...(parsed.comfort ?? {}) },
        likes: { ...EMPTY_PROFILE.likes, ...(parsed.likes ?? {}) },
        dislikes: { ...EMPTY_PROFILE.dislikes, ...(parsed.dislikes ?? {}) },
        medicalInformation: { ...EMPTY_PROFILE.medicalInformation, ...(parsed.medicalInformation ?? {}) },
        allergies: { ...EMPTY_PROFILE.allergies, ...(parsed.allergies ?? {}) },
        specialInstructions: { ...EMPTY_PROFILE.specialInstructions, ...(parsed.specialInstructions ?? {}) },
        alerts: Array.isArray(parsed.alerts) ? parsed.alerts : [],
      });
    } catch {
      // ignore malformed storage
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(liveProfile));
    }
  }, [liveProfile]);

  const handleSend = async (text: string) => {
    const nextMessages = [...messages, { role: "user", text }];
    setMessages(nextMessages);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Something went wrong while contacting PET HANDBOOK.");
      }

      const assistantMessage =
        typeof data?.message === "string" && data.message.trim()
          ? data.message
          : "Thanks — I’ve updated the pet profile.";

      setMessages((current) => [...current, { role: "assistant", text: assistantMessage }]);

      if (data?.profileUpdate && typeof data.profileUpdate === "object") {
        setLiveProfile((current: any) => mergeProfile(current, data.profileUpdate));
      }

      if (typeof data?.progress === "number") {
        setProgress(Math.min(Math.max(data.progress, 1), 6));
      }
    } catch (error) {
      const fallbackMessage =
        error instanceof Error
          ? error.message
          : "I’m having trouble reaching PET HANDBOOK right now. Please try again.";

      setMessages((current) => [...current, { role: "assistant", text: fallbackMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeneratePassport = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(liveProfile));
    }
    router.push("/passport");
  };

  return (
    <main className="min-h-screen bg-[#f7f1e9] text-[#17352d]">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <header className="mb-6 flex items-center justify-between rounded-[28px] border border-[#dcd0c5] bg-[#f4efe9]/90 px-4 py-3 shadow-[0_12px_30px_rgba(23,53,45,0.06)] backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <PawLogo />
          </div>

          <button
            type="button"
            onClick={() => setShowPassport(true)}
            className="rounded-full border border-[#d9c4b5] bg-white/60 px-4 py-2 text-sm font-medium text-[#17352d] transition hover:bg-white"
          >
            Preview handbook
          </button>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.55fr_0.95fr]">
          <div className="flex min-h-[60vh] flex-col lg:h-[calc(100vh-9rem)]">
            <HandoverChat
              messages={messages}
              typing={isLoading}
              complete={progress >= 6}
              onSend={handleSend}
            />
          </div>

          <div className="lg:sticky lg:top-6 lg:h-[calc(100vh-9rem)]">
            <PetSnapshot profile={liveProfile} onGenerate={handleGeneratePassport} />
          </div>
        </div>
      </div>

      {showPassport && (
        <CarePassport profile={liveProfile} onContinue={() => setShowPassport(false)} />
      )}
    </main>
  );
}
