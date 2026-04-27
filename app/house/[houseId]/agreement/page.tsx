import Link from "next/link";

const MEMBERS = [
  { initials: "AY", name: "Aya (you)", bg: "#F0DDD3", color: "#8B4A2E", submitted: true },
  { initials: "JD", name: "Jordan", bg: "#D8EBE0", color: "#4A7C5F", submitted: true },
  { initials: "PR", name: "Priya", bg: "#E8E0F8", color: "#5534B7", submitted: false },
];

const RATIFIED_CLAUSES = [
  { topic: "Quiet hours (weeknights)", value: "11:00 pm", status: "agreed" },
  { topic: "Kitchen: dishes", value: "Within 24 hours", status: "agreed" },
  { topic: "Overnight guests", value: "Discuss each time", status: "conflict" },
  { topic: "Common area standard", value: "Generally tidy", status: "agreed" },
  { topic: "Food in fridge", value: "Label your stuff", status: "agreed" },
  { topic: "Quiet hours (weekends)", value: "1 am", status: "agreed" },
];

export default function AgreementPage() {
  const submitted = MEMBERS.filter((m) => m.submitted).length;
  const total = MEMBERS.length;
  const pct = Math.round((submitted / total) * 100);

  return (
    <div className="p-4 pb-24 space-y-3">
      {/* Status card */}
      <div
        className="bg-nm-white rounded-2xl p-5"
        style={{ border: "1px solid rgba(44,36,22,0.08)" }}
      >
        <div className="text-[11px] font-medium text-nm-muted uppercase tracking-[0.07em] mb-2">
          Agreement status
        </div>
        <div className="font-serif text-[1.5rem] text-nm-ink mb-3">
          {submitted} of {total} submitted
        </div>

        {/* Progress bar */}
        <div className="h-2 rounded-full mb-4 overflow-hidden" style={{ background: "#F5F0E8" }}>
          <div
            className="h-2 rounded-full transition-all"
            style={{ width: `${pct}%`, background: "#C4714A" }}
          />
        </div>

        {/* Member rows */}
        <div>
          {MEMBERS.map((m, i) => (
            <div
              key={m.initials}
              className="flex items-center gap-3 py-3"
              style={i < MEMBERS.length - 1 ? { borderBottom: "1px solid rgba(44,36,22,0.06)" } : undefined}
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-semibold flex-shrink-0"
                style={{ background: m.bg, color: m.color }}
              >
                {m.initials}
              </div>
              <span className="flex-1 text-[15px] text-nm-ink">{m.name}</span>
              {m.submitted ? (
                <span className="text-[12px] font-medium" style={{ color: "#4A7C5F" }}>✓ submitted</span>
              ) : (
                <span className="flex items-center gap-0.5 text-nm-muted text-[12px]">
                  <span className="animate-pulse">•</span>
                  <span className="animate-pulse" style={{ animationDelay: "0.2s" }}>•</span>
                  <span className="animate-pulse" style={{ animationDelay: "0.4s" }}>•</span>
                  <span className="ml-1">waiting</span>
                </span>
              )}
            </div>
          ))}
        </div>

        <div
          className="mt-3 flex items-start gap-2 p-3 rounded-xl"
          style={{ background: "#F5F0E8" }}
        >
          <span className="text-base">🔒</span>
          <p className="text-[13px] text-nm-muted leading-relaxed">
            Results and conflicts will appear once all {total} have submitted. Answers stay hidden to prevent anchoring.
          </p>
        </div>
      </div>

      {/* Haven't submitted yet CTA */}
      <Link
        href="/onboarding/agreement"
        className="flex items-center justify-between px-5 py-4 rounded-2xl transition-colors"
        style={{ background: "#C4714A", color: "white" }}
      >
        <div>
          <div className="text-[12px] opacity-70 mb-0.5">your answers are needed</div>
          <div className="text-[15px] font-medium">Fill out your portion →</div>
        </div>
        <span className="text-xl opacity-60">›</span>
      </Link>

      {/* Ratified clauses */}
      <div
        className="bg-nm-white rounded-2xl p-5"
        style={{ border: "1px solid rgba(44,36,22,0.08)" }}
      >
        <div className="text-[11px] font-medium text-nm-muted uppercase tracking-[0.07em] mb-1">
          Ratified clauses
        </div>
        <p className="text-[12px] text-nm-muted mb-4">Agreed by the house on Aug 19, 2026</p>

        {RATIFIED_CLAUSES.map((clause, i) => (
          <div
            key={clause.topic}
            className="flex items-center justify-between py-3.5"
            style={i < RATIFIED_CLAUSES.length - 1 ? { borderBottom: "1px solid rgba(44,36,22,0.06)" } : undefined}
          >
            <div>
              <div className="text-[12px] text-nm-muted mb-0.5">{clause.topic}</div>
              <div className="text-[16px] text-nm-ink">{clause.value}</div>
            </div>
            {clause.status === "agreed" ? (
              <span
                className="text-[11px] font-medium px-2.5 py-1 rounded-full flex-shrink-0 ml-3"
                style={{ background: "#D8EBE0", color: "#4A7C5F" }}
              >
                agreed
              </span>
            ) : (
              <span
                className="text-[11px] font-medium px-2.5 py-1 rounded-full flex-shrink-0 ml-3"
                style={{ background: "#F0DDD3", color: "#8B4A2E" }}
              >
                needs vote
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Equal admin note */}
      <div
        className="rounded-2xl p-4"
        style={{ background: "#F5F0E8", border: "1px dashed rgba(44,36,22,0.15)" }}
      >
        <p className="text-[13px] text-nm-muted leading-relaxed">
          <span className="font-medium text-nm-ink">Equal house.</span> Editing any clause, removing a roommate, or resetting chores requires a majority vote. No one holds the keys.
        </p>
      </div>
    </div>
  );
}
