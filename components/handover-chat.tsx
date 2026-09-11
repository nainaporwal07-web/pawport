'use client';

import { useEffect, useRef, useState } from "react";
import { PawMark } from "@/components/paw-logo";

export type ChatMessage = { role: "assistant" | "user"; text: string };

export function HandoverChat({
  messages,
  typing,
  complete,
  onSend,
}: {
  messages: ChatMessage[];
  typing: boolean;
  complete: boolean;
  onSend: (text: string) => void;
}) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  function submit() {
    const text = input.trim();
    if (!text || typing) return;
    onSend(text);
    setInput("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.nativeEvent.isComposing && e.keyCode !== 229) {
      e.preventDefault();
      submit();
    }
  }

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[2rem] border border-[#e8d9c9] bg-[#fffdfb] shadow-[0_18px_40px_rgba(23,53,45,0.06)]">
      <div className="flex items-center justify-between border-b border-[#e7ddcf] px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#17352d] text-[#f7f1e9]">
            <PawMark className="h-5 w-5" />
          </span>
          <div>
            <p className="text-lg font-bold leading-tight text-[#17352d]">PET HANDBOOK</p>
            <p className="text-xs text-[#617066]">Pet care conversation</p>
          </div>
        </div>
        <span className="flex items-center gap-2 rounded-full bg-[#f3eee8] px-3 py-1.5 text-xs font-medium text-[#17352d]">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#cc6f47]/60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#cc6f47]" />
          </span>
          {complete ? "Complete" : "Live"}
        </span>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-5">
        {messages.map((m, i) =>
          m.role === "assistant" ? (
            <div key={i} className="flex items-end gap-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#17352d] text-[#f7f1e9]">
                <PawMark className="h-4 w-4" />
              </span>
              <div className="max-w-[85%] rounded-2xl rounded-bl-sm border border-[#e5d8cb] bg-[#f5efe9] px-4 py-3 leading-relaxed text-[#17352d]">
                {m.text}
              </div>
            </div>
          ) : (
            <div key={i} className="flex justify-end">
              <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-[#17352d] px-4 py-3 leading-relaxed text-[#f7f1e9]">
                {m.text}
              </div>
            </div>
          )
        )}

        {typing && (
          <div className="flex items-end gap-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#17352d] text-[#f7f1e9]">
              <PawMark className="h-4 w-4" />
            </span>
            <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-[#f5efe9] px-4 py-4">
              <Dot delay="0s" />
              <Dot delay="0.15s" />
              <Dot delay="0.3s" />
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-[#e7ddcf] p-4">
        <div className="flex items-center gap-2 rounded-full border border-[#e3d0c0] bg-[#f9f3ee] py-2 pl-5 pr-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={complete}
            placeholder={complete ? "Care notes are ready 🐾" : "Tell us about your pet..."}
            aria-label="Tell us about your pet"
            className="flex-1 bg-transparent text-[#17352d] outline-none placeholder:text-[#7a8d86] disabled:cursor-not-allowed"
          />
          <button
            type="button"
            onClick={submit}
            disabled={complete || input.trim() === "" || typing}
            aria-label="Send message"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#cc6f47] text-[#fffaf5] transition-colors hover:bg-[#b85d3a] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <PawMark className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function Dot({ delay }: { delay: string }) {
  return (
    <span
      className="h-2 w-2 rounded-full bg-[#5d7069]"
      style={{ animation: "typing-bounce 1.1s ease-in-out infinite", animationDelay: delay }}
    />
  );
}
