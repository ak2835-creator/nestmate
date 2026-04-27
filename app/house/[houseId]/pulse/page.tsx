"use client";

import { useEffect, useState } from "react";

const DIMENSIONS = [
  {
    id: "noise",
    label: "Noise levels",
    emojis: ["😴", "😌", "😐", "😤", "😡"],
  },
  {
    id: "cleanliness",
    label: "Cleanliness",
    emojis: ["✨", "👍", "😐", "😒", "🤢"],
  },
  {
    id: "vibe",
    label: "Overall vibe",
    emojis: ["🥰", "😊", "😐", "😕", "😞"],
  },
  {
    id: "heard",
    label: "Feeling heard",
    emojis: ["💬", "👌", "😐", "🤐", "😔"],
  },
];

const LAST_WEEK_RESULTS = [
  { label: "Noise levels", result: "Good", style: { background: "#D8EBE0", color: "#4A7C5F" } },
  { label: "Cleanliness", result: "Needs attention", style: { background: "#F0DDD3", color: "#8B4A2E" } },
  { label: "Overall vibe", result: "Good", style: { background: "#D8EBE0", color: "#4A7C5F" } },
  { label: "Feeling heard", result: "Okay", style: { background: "#F5F0E8", color: "#7A7165" } },
];

export default function PulsePage() {
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setSubmitted(localStorage.getItem("nm_pulse_submitted") === "true");
  }, []);

  const allRated = DIMENSIONS.every((d) => ratings[d.id] !== undefined);

  function handleSubmit() {
    if (!allRated) return;
    localStorage.setItem("nm_pulse_submitted", "true");
    setSubmitted(true);
  }

  // STATE B — already submitted
  if (submitted) {
    return (
      <div className="p-4 pb-24 space-y-3">
        {/* Progress indicator */}
        <div
          className="rounded-2xl p-4"
          style={{ background: "#FFFDFB", border: "1px solid rgba(44,36,22,0.08)" }}
        >
          <div className="text-[11px] font-medium text-nm-muted uppercase tracking-[0.07em] mb-2">
            This week
          </div>
          <div className="flex items-center gap-3">
            {[
              { initials: "AY", bg: "#F0DDD3", color: "#8B4A2E", done: true },
              { initials: "JD", bg: "#D8EBE0", color: "#4A7C5F", done: true },
              { initials: "PR", bg: "#E8E0F8", color: "#5534B7", done: false },
            ].map((m) => (
              <div key={m.initials} className="flex items-center gap-1.5">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold"
                  style={{ background: m.bg, color: m.color }}
                >
                  {m.initials}
                </div>
                {m.done ? (
                  <span className="text-[11px]" style={{ color: "#4A7C5F" }}>✓</span>
                ) : (
                  <span className="text-nm-muted text-[11px] animate-pulse">•••</span>
                )}
              </div>
            ))}
            <span className="ml-auto text-[12px] text-nm-muted">2 of 3 submitted</span>
          </div>
        </div>

        {/* Sealed state */}
        <div
          className="rounded-2xl p-5"
          style={{ background: "#FFFDFB", border: "1px solid rgba(44,36,22,0.08)" }}
        >
          <div className="font-serif text-[1.35rem] text-nm-ink mb-1">Your Pulse is in 🔒</div>
          <p className="text-[14px] text-nm-muted leading-relaxed">
            Waiting on 1 more roommate before results are shown.
          </p>
        </div>

        {/* Last week results */}
        <div
          className="rounded-2xl p-5"
          style={{ background: "#FFFDFB", border: "1px solid rgba(44,36,22,0.08)" }}
        >
          <div className="text-[11px] font-medium text-nm-muted uppercase tracking-[0.07em] mb-1">
            House results — last week
          </div>
          <div className="space-y-0">
            {LAST_WEEK_RESULTS.map((row, i) => (
              <div
                key={row.label}
                className="flex items-center justify-between py-3"
                style={i < LAST_WEEK_RESULTS.length - 1 ? { borderBottom: "1px solid rgba(44,36,22,0.06)" } : undefined}
              >
                <span className="text-[15px] text-nm-ink">{row.label}</span>
                <span
                  className="text-[12px] font-medium px-2.5 py-1 rounded-full"
                  style={row.style}
                >
                  {row.result}
                </span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[12px] text-nm-muted text-center px-4 leading-relaxed">
          Results shown once all members submit. Individual ratings are never stored.
        </p>
      </div>
    );
  }

  // STATE A — not yet submitted
  return (
    <div className="p-4 pb-24 space-y-3">
      {/* Header */}
      <div
        className="rounded-2xl p-5"
        style={{ background: "#FFFDFB", border: "1px solid rgba(44,36,22,0.08)" }}
      >
        <div className="font-serif text-[1.35rem] text-nm-ink mb-1">Weekly Pulse</div>
        <p className="text-[14px] text-nm-muted leading-relaxed mb-4">
          How&apos;s the house feeling? Answers are anonymous — results show as house averages only.
        </p>

        {/* Progress indicator */}
        <div className="text-[11px] font-medium text-nm-muted uppercase tracking-[0.07em] mb-2">
          This week
        </div>
        <div className="flex items-center gap-3">
          {[
            { initials: "AY", bg: "#F0DDD3", color: "#8B4A2E", done: false },
            { initials: "JD", bg: "#D8EBE0", color: "#4A7C5F", done: true },
            { initials: "PR", bg: "#E8E0F8", color: "#5534B7", done: true },
          ].map((m) => (
            <div key={m.initials} className="flex items-center gap-1.5">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold"
                style={{ background: m.bg, color: m.color }}
              >
                {m.initials}
              </div>
              {m.done ? (
                <span className="text-[11px]" style={{ color: "#4A7C5F" }}>✓</span>
              ) : (
                <span className="text-nm-muted text-[11px] animate-pulse">•••</span>
              )}
            </div>
          ))}
          <span className="ml-auto text-[12px] text-nm-muted">2 of 3 submitted</span>
        </div>
      </div>

      {/* Rating dimensions */}
      {DIMENSIONS.map((dim) => (
        <div
          key={dim.id}
          className="rounded-2xl p-5"
          style={{ background: "#FFFDFB", border: "1px solid rgba(44,36,22,0.08)" }}
        >
          <div className="text-[13px] font-medium text-nm-ink mb-3">{dim.label}</div>
          <div className="flex gap-3 justify-between">
            {dim.emojis.map((emoji, idx) => {
              const selected = ratings[dim.id] === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setRatings((prev) => ({ ...prev, [dim.id]: idx }))}
                  className="flex-1 flex flex-col items-center gap-1.5 py-2 rounded-xl transition-all text-[22px]"
                  style={
                    selected
                      ? { background: "#F0DDD3", border: "1.5px solid #C4714A" }
                      : { background: "#F5F0E8", border: "1.5px solid transparent" }
                  }
                >
                  {emoji}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Privacy note */}
      <div
        className="flex items-start gap-2 p-3.5 rounded-xl"
        style={{ background: "#F5F0E8", border: "1px dashed rgba(44,36,22,0.15)" }}
      >
        <span className="text-base">🔒</span>
        <p className="text-[13px] text-nm-muted leading-relaxed">
          Your individual ratings are never shown. Only house averages appear.
        </p>
      </div>

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        disabled={!allRated}
        className="w-full py-4 text-white rounded-xl font-medium text-[16px] transition-all"
        style={{
          background: allRated ? "#C4714A" : "rgba(196,113,74,0.35)",
          cursor: allRated ? "pointer" : "not-allowed",
        }}
      >
        Submit this week&apos;s Pulse →
      </button>
      {!allRated && (
        <p className="text-center text-[12px] text-nm-muted">
          Rate all 4 dimensions to submit
        </p>
      )}
    </div>
  );
}
