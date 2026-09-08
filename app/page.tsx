"use client";

import { useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type Profile = {
  identity: Record<string, string>;
  feeding: Record<string, string>;
  routine: Record<string, string>;
  behaviour: Record<string, string>;
  comfort: Record<string, string>;
  alerts: string[];
};

const emptyProfile: Profile = {
  identity: {},
  feeding: {},
  routine: {},
  behaviour: {},
  comfort: {},
  alerts: [],
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm PawPort 🐾 I'll help create a Care Passport for your pet. Let's start simple — what's your pet's name?",
    },
  ]);

  const [input, setInput] = useState("");
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: "user",
      content: input,
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedMessages,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: data.message,
        },
      ]);

      setProfile((previous) => ({
        identity: {
          ...previous.identity,
          ...(data.profileUpdate?.identity || {}),
        },
        feeding: {
          ...previous.feeding,
          ...(data.profileUpdate?.feeding || {}),
        },
        routine: {
          ...previous.routine,
          ...(data.profileUpdate?.routine || {}),
        },
        behaviour: {
          ...previous.behaviour,
          ...(data.profileUpdate?.behaviour || {}),
        },
        comfort: {
          ...previous.comfort,
          ...(data.profileUpdate?.comfort || {}),
        },
        alerts: [
          ...previous.alerts,
          ...(data.profileUpdate?.alerts || []),
        ],
      }));
    } catch (error) {
      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: "Sorry, I couldn't respond right now. Please try again.",
        },
      ]);

      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "40px",
        fontFamily: "Arial, sans-serif",
        background: "#f7f4ee",
      }}
    >
      <h1>PawPort 🐾</h1>
      <p>AI-powered Pet Care Handover</p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "30px",
          maxWidth: "1100px",
          margin: "40px auto",
        }}
      >
        {/* CHAT */}
        <section
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "24px",
            minHeight: "550px",
          }}
        >
          <h2>Tell me about your pet</h2>

          <div style={{ minHeight: "400px" }}>
            {messages.map((message, index) => (
              <div
                key={index}
                style={{
                  textAlign:
                    message.role === "user" ? "right" : "left",
                  marginBottom: "16px",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    padding: "12px 16px",
                    borderRadius: "14px",
                    maxWidth: "75%",
                    background:
                      message.role === "user" ? "#244238" : "#eee",
                    color:
                      message.role === "user" ? "white" : "#222",
                  }}
                >
                  {message.content}
                </span>
              </div>
            ))}

            {loading && <p>PawPort is thinking... 🐾</p>}
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
              placeholder="Tell PawPort about your pet..."
              style={{
                flex: 1,
                padding: "14px",
                borderRadius: "10px",
                border: "1px solid #ccc",
              }}
            />

            <button
              onClick={sendMessage}
              disabled={loading}
              style={{
                padding: "14px 24px",
                borderRadius: "10px",
                border: "none",
                background: "#c97b46",
                color: "white",
                cursor: "pointer",
              }}
            >
              Send
            </button>
          </div>
        </section>

        {/* CARE PASSPORT */}
        <aside
          style={{
            background: "#244238",
            color: "white",
            borderRadius: "16px",
            padding: "24px",
          }}
        >
          <h2>Care Passport 🐾</h2>

          <ProfileSection title="Identity" data={profile.identity} />
          <ProfileSection title="Feeding" data={profile.feeding} />
          <ProfileSection title="Routine" data={profile.routine} />
          <ProfileSection title="Behaviour" data={profile.behaviour} />
          <ProfileSection title="Comfort" data={profile.comfort} />

          {profile.alerts.length > 0 && (
            <div
              style={{
                marginTop: "20px",
                padding: "12px",
                border: "1px solid #d8a45d",
                borderRadius: "10px",
              }}
            >
              <strong>⚠ Care Alerts</strong>

              {profile.alerts.map((alert, index) => (
                <p key={index}>{alert}</p>
              ))}
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}

function ProfileSection({
  title,
  data,
}: {
  title: string;
  data: Record<string, string>;
}) {
  const entries = Object.entries(data);

  if (entries.length === 0) return null;

  return (
    <div style={{ marginTop: "20px" }}>
      <strong>{title}</strong>

      {entries.map(([key, value]) => (
        <p key={key} style={{ fontSize: "14px", opacity: 0.9 }}>
          {key}: {value}
        </p>
      ))}
    </div>
  );
}