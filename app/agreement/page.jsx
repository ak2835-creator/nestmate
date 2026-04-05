/**
 * NestMate — House Agreement Wizard
 * Place at: app/agreement/page.jsx
 *
 * Flow:
 *   wizard → submitted (waiting for roommates) → results (conflict report) → live (ratified)
 *
 * SUPABASE SWAP-INS: search "// SUPABASE:" for every mock to replace.
 */

"use client";

import { useState, useEffect } from "react";

// ─── Brand ────────────────────────────────────────────────────────────────────
const T    = "#C55E30";
const T2   = "#B04E25";
const S    = "#4A7A6A";
const S2   = "#3D6559";
const CREAM = "#F5EDE0";
const TODAY  = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

// ─── Clause definitions ───────────────────────────────────────────────────────
const CLAUSES = {
  quietWeeknight: {
    label: "Weeknight quiet hours",
    icon: "🌙",
    question: "When does the house get quiet on weeknights?",
    options: [
      { value: "9pm",      label: "9 pm",     rank: 1 },
      { value: "10pm",     label: "10 pm",    rank: 2 },
      { value: "11pm",     label: "11 pm",    rank: 3 },
      { value: "midnight", label: "Midnight", rank: 4 },
      { value: "no-rule",  label: "No rule",  rank: 5 },
    ],
  },
  quietWeekend: {
    label: "Weekend quiet hours",
    icon: "🎉",
    question: "What about weekends?",
    options: [
      { value: "11pm",     label: "11 pm",    rank: 1 },
      { value: "midnight", label: "Midnight", rank: 2 },
      { value: "1am",      label: "1 am",     rank: 3 },
      { value: "no-rule",  label: "No rule",  rank: 4 },
    ],
  },
  dishes: {
    label: "Dishes",
    icon: "🍽️",
    question: "How quickly should dishes be done?",
    options: [
      { value: "same-day",    label: "Same day",        rank: 1 },
      { value: "24hrs",       label: "Within 24 hours", rank: 2 },
      { value: "48hrs",       label: "Within 48 hours", rank: 3 },
      { value: "best-effort", label: "Best effort",     rank: 4 },
    ],
  },
  food: {
    label: "Shared food",
    icon: "🥡",
    question: "How do you handle food in shared spaces?",
    options: [
      { value: "ask-before", label: "Ask before eating",  rank: 1 },
      { value: "label",      label: "Label your stuff",   rank: 2 },
      { value: "shared",     label: "Everything shared",  rank: 3 },
    ],
  },
  overnightGuests: {
    label: "Overnight guests",
    icon: "🛌",
    question: "What's the policy on overnight guests?",
    options: [
      { value: "discuss",     label: "Discuss each time",    rank: 1 },
      { value: "max-3",       label: "Max 3 nights/month",   rank: 2 },
      { value: "heads-up",    label: "Give 24hr heads-up",   rank: 3 },
      { value: "always-fine", label: "Always fine",          rank: 4 },
    ],
  },
  gatherings: {
    label: "Gatherings",
    icon: "🪩",
    question: "How should house gatherings work?",
    options: [
      { value: "majority-agrees", label: "Majority agrees first", rank: 1 },
      { value: "let-us-know",     label: "Just let us know",      rank: 2 },
    ],
  },
  commonArea: {
    label: "Common areas",
    icon: "🛋️",
    question: "What standard should common areas be kept to?",
    options: [
      { value: "spotless",  label: "Spotless always",   rank: 1 },
      { value: "tidy",      label: "Generally tidy",    rank: 2 },
      { value: "lived-in",  label: "Lived-in is fine",  rank: 3 },
      { value: "rotate",    label: "Rotate cleaning",   rank: 4 },
    ],
  },
};

const CLAUSE_ORDER = [
  "quietWeeknight", "quietWeekend",
  "dishes", "food",
  "overnightGuests", "gatherings",
  "commonArea",
];

const WIZARD_STEPS = [
  { title: "Quiet hours",   subtitle: "When does the house wind down?",          clauses: ["quietWeeknight", "quietWeekend"] },
  { title: "Kitchen",       subtitle: "How does the shared kitchen work?",        clauses: ["dishes", "food"]                 },
  { title: "Guests",        subtitle: "What are the house rules on visitors?",    clauses: ["overnightGuests", "gatherings"]  },
  { title: "Shared spaces", subtitle: "What standard do common areas need to meet?", clauses: ["commonArea"]                 },
];

// SUPABASE: Replace with real roommate answers fetched from the database
//           once all members have submitted their wizard responses.
const ALEX = {
  quietWeeknight: "11pm",      quietWeekend: "midnight",
  dishes:         "same-day",  food:         "label",
  overnightGuests: "always-fine", gatherings: "let-us-know",
  commonArea:     "tidy",
};
const SAM = {
  quietWeeknight: "midnight",  quietWeekend: "midnight",
  dishes:         "24hrs",     food:         "ask-before",
  overnightGuests: "heads-up", gatherings:   "majority-agrees",
  commonArea:     "tidy",
};

// ─── Resolution logic ─────────────────────────────────────────────────────────

function resolveClause(id, userVote) {
  const clause = CLAUSES[id];
  const votes  = [userVote, ALEX[id], SAM[id]];
  const counts = {};
  votes.forEach((v) => { counts[v] = (counts[v] || 0) + 1; });

  const unique = Object.keys(counts);
  if (unique.length === 1) return { type: "auto", winner: unique[0], counts };

  const max     = Math.max(...Object.values(counts));
  const leaders = unique.filter((v) => counts[v] === max);
  if (leaders.length === 1) return { type: "majority", winner: leaders[0], counts };

  // Tie: most conservative (lowest rank number) wins
  const optMap = Object.fromEntries(clause.options.map((o) => [o.value, o]));
  const winner = leaders.reduce((a, b) =>
    (optMap[a]?.rank ?? 99) < (optMap[b]?.rank ?? 99) ? a : b
  );
  return { type: "conservative", winner, counts };
}

function computeAll(userAnswers) {
  return CLAUSE_ORDER.map((id) => ({
    id,
    ...resolveClause(id, userAnswers[id]),
  }));
}

function getLabel(id, value) {
  return CLAUSES[id]?.options.find((o) => o.value === value)?.label ?? value;
}

// ─── Shared primitives ────────────────────────────────────────────────────────

function Logo() {
  return (
    <span style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 600, color: "#1A1209" }}>
      Nest<span style={{ color: T }}>Mate</span>
    </span>
  );
}

function StepProgress({ current }) {
  const total = WIZARD_STEPS.length;
  return (
    <div style={{ display: "flex", gap: 6, marginTop: 28, marginBottom: 24 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            height: 4, borderRadius: 2,
            width:           i === current ? 24 : 8,
            backgroundColor: i <= current  ? T  : "#E7E0D5",
            transition: "all 0.25s ease",
          }}
        />
      ))}
    </div>
  );
}

function OptionPill({ label, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 16px", borderRadius: 12, fontSize: 13, fontWeight: 500,
        fontFamily: "'Plus Jakarta Sans', sans-serif", cursor: "pointer",
        border: `1.5px solid ${selected ? T : "#E7E0D5"}`,
        backgroundColor: selected ? T       : "#FAF6F1",
        color:           selected ? "#fff"  : "#4A3A2E",
        transition: "all 0.12s",
      }}
    >
      {label}
    </button>
  );
}

function ResolutionBadge({ type }) {
  const MAP = {
    auto:         { label: "Auto-ratified",       bg: "#C4D9D3", color: S           },
    majority:     { label: "Majority vote",        bg: "#F0D4C4", color: T           },
    conservative: { label: "Conservative default", bg: "#E7E3F4", color: "#5A4AB0"  },
  };
  const cfg = MAP[type] || MAP.majority;
  return (
    <span style={{
      fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 20,
      backgroundColor: cfg.bg, color: cfg.color,
      fontFamily: "'Plus Jakarta Sans', sans-serif", whiteSpace: "nowrap",
    }}>
      {cfg.label}
    </span>
  );
}

function PrimaryBtn({ children, onClick, color = "terra", disabled = false }) {
  const bg  = color === "sage" ? S  : T;
  const bg2 = color === "sage" ? S2 : T2;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%", padding: "14px", borderRadius: 16, border: "none",
        fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, fontWeight: 600,
        backgroundColor: disabled ? "#E7E0D5" : bg,
        color: disabled ? "#B0A090" : "#fff",
        cursor: disabled ? "not-allowed" : "pointer", transition: "background 0.14s",
      }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.backgroundColor = bg2; }}
      onMouseLeave={(e) => { if (!disabled) e.currentTarget.style.backgroundColor = disabled ? "#E7E0D5" : bg; }}
    >
      {children}
    </button>
  );
}

function GhostBtn({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%", padding: "10px", marginTop: 8, background: "none", border: "none",
        fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13,
        color: "#9A8A7A", cursor: "pointer", transition: "color 0.14s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = "#1A1209")}
      onMouseLeave={(e) => (e.currentTarget.style.color = "#9A8A7A")}
    >
      {children}
    </button>
  );
}

function SectionLabel({ children }) {
  return (
    <p style={{
      fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
      color: "#9A8A7A", fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 10,
    }}>
      {children}
    </p>
  );
}

// ─── Phase: Wizard ────────────────────────────────────────────────────────────

function WizardPhase({ onSubmit }) {
  const [stepIdx,  setStepIdx]  = useState(0);
  const [answers,  setAnswers]  = useState({});
  const [visible,  setVisible]  = useState(true);

  const step     = WIZARD_STEPS[stepIdx];
  const isLast   = stepIdx === WIZARD_STEPS.length - 1;
  const complete  = step.clauses.every((id) => answers[id]);

  const nav = (next) => {
    setVisible(false);
    setTimeout(() => { setStepIdx(next); setVisible(true); }, 160);
  };

  const pick = (clauseId, value) =>
    setAnswers((prev) => ({ ...prev, [clauseId]: value }));

  const advance = () => {
    if (isLast) onSubmit(answers);
    else nav(stepIdx + 1);
  };

  return (
    <div style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(8px)", transition: "all .16s ease" }}>
      <Logo />
      <StepProgress current={stepIdx} />

      <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 600, color: "#1A1209", lineHeight: 1.2, marginBottom: 4 }}>
        {step.title}
      </h2>
      <p style={{ fontSize: 14, color: "#8A7A6E", fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 24 }}>
        {step.subtitle}
      </p>

      {step.clauses.map((id, ci) => {
        const clause = CLAUSES[id];
        return (
          <div key={id} style={{ marginBottom: ci < step.clauses.length - 1 ? 28 : 0 }}>
            <SectionLabel>{clause.icon} {clause.label}</SectionLabel>
            <p style={{ fontSize: 14, color: "#1A1209", fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 12 }}>
              {clause.question}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {clause.options.map((opt) => (
                <OptionPill
                  key={opt.value}
                  label={opt.label}
                  selected={answers[id] === opt.value}
                  onClick={() => pick(id, opt.value)}
                />
              ))}
            </div>
          </div>
        );
      })}

      <div style={{ marginTop: 28 }}>
        <PrimaryBtn disabled={!complete} onClick={advance}>
          {isLast ? "Submit my answers →" : "Continue →"}
        </PrimaryBtn>
        {stepIdx > 0
          ? <GhostBtn onClick={() => nav(stepIdx - 1)}>← Back</GhostBtn>
          : (
            <p style={{ textAlign: "center", marginTop: 14, fontSize: 12, color: "#B0A090", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Your answers are hidden from roommates until everyone submits.
            </p>
          )
        }
      </div>
    </div>
  );
}

// ─── Phase: Submitted (waiting for others) ────────────────────────────────────

function SubmittedPhase({ onReveal }) {
  const [alexDone, setAlexDone] = useState(false);
  const [samDone,  setSamDone]  = useState(false);

  useEffect(() => {
    // SUPABASE: Replace timeouts with a realtime subscription:
    //   supabase.channel('agreement').on('postgres_changes', ...).subscribe()
    const t1 = setTimeout(() => setAlexDone(true), 1800);
    const t2 = setTimeout(() => setSamDone(true),  3400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const allDone = alexDone && samDone;

  function SubmitRow({ name, done }) {
    return (
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 14px", borderRadius: 12,
        backgroundColor: done ? "#C4D9D3" : "#FAF6F1",
        transition: "background 0.3s",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%", display: "flex",
            alignItems: "center", justifyContent: "center",
            backgroundColor: done ? S : "#E7E0D5",
            color: done ? "#fff" : "#9A8A7A",
            fontSize: 12, fontWeight: 600,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            transition: "all 0.3s",
          }}>
            {name[0]}
          </div>
          <span style={{ fontSize: 14, fontWeight: 500, color: "#1A1209", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {name}
          </span>
        </div>
        <span style={{
          fontSize: 12, fontWeight: done ? 600 : 400,
          color: done ? S : "#B0A090",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          transition: "all 0.3s",
        }}>
          {done ? "Submitted ✓" : "Filling in…"}
        </span>
      </div>
    );
  }

  return (
    <div>
      <Logo />
      <div style={{ textAlign: "center", marginTop: 28, marginBottom: 24 }}>
        <div style={{ fontSize: 44 }}>🔒</div>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 600, color: "#1A1209", marginTop: 12, marginBottom: 6 }}>
          Your answers are locked in
        </h2>
        <p style={{ fontSize: 14, color: "#8A7A6E", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Results reveal once everyone has submitted — no peeking.
        </p>
      </div>

      <SectionLabel>Submissions</SectionLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 24 }}>
        <SubmitRow name="You"    done={true}    />
        <SubmitRow name="Alex M." done={alexDone} />
        <SubmitRow name="Sam K."  done={samDone}  />
      </div>

      {allDone ? (
        <div>
          <div style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "14px 16px", borderRadius: 14,
            backgroundColor: "#C4D9D3", marginBottom: 16,
          }}>
            <span style={{ fontSize: 20 }}>🎉</span>
            <span style={{ fontSize: 14, fontWeight: 500, color: S, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              All roommates have submitted!
            </span>
          </div>
          <PrimaryBtn color="sage" onClick={onReveal}>See how your answers compare →</PrimaryBtn>
        </div>
      ) : (
        <p style={{ textAlign: "center", fontSize: 12, color: "#B0A090", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          This prevents anyone from anchoring to others' answers before submitting their own.
        </p>
      )}
    </div>
  );
}

// ─── Phase: Results (conflict report) ────────────────────────────────────────

function ResultsPhase({ resolutions, onConfirm }) {
  const autoCount     = resolutions.filter((r) => r.type === "auto").length;
  const conflictCount = resolutions.length - autoCount;

  return (
    <div>
      <Logo />
      <div style={{ marginTop: 24, marginBottom: 20 }}>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 600, color: "#1A1209", marginBottom: 4 }}>
          Here's how it shook out
        </h2>
        <p style={{ fontSize: 13, color: "#8A7A6E", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {autoCount} auto-ratified · {conflictCount} resolved by vote
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
        {resolutions.map((r) => {
          const clause      = CLAUSES[r.id];
          const winnerLabel = getLabel(r.id, r.winner);
          const voteDist    = Object.entries(r.counts)
            .map(([v, c]) => `${getLabel(r.id, v)} × ${c}`)
            .join(", ");
          const borderColor = r.type === "auto" ? S : r.type === "conservative" ? "#7B6DC0" : T;

          return (
            <div
              key={r.id}
              style={{
                background: "#fff", borderRadius: 14, padding: "14px 16px",
                border: "1px solid #F0EBE3",
                borderLeft: `3px solid ${borderColor}`,
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#1A1209", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {clause.icon} {clause.label}
                </span>
                <ResolutionBadge type={r.type} />
              </div>

              <p style={{ fontSize: 11, color: "#9A8A7A", fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 8, lineHeight: 1.5 }}>
                {r.type === "auto"
                  ? "All three agreed"
                  : r.type === "conservative"
                  ? `Tied vote — conservative default applied · ${voteDist}`
                  : `Majority decided · ${voteDist}`}
              </p>

              <p style={{ fontSize: 14, fontWeight: 600, color: "#1A1209", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                ✓ {winnerLabel}
              </p>
            </div>
          );
        })}
      </div>

      <PrimaryBtn color="sage" onClick={onConfirm}>Confirm & go live →</PrimaryBtn>
    </div>
  );
}

// ─── Phase: Live agreement ────────────────────────────────────────────────────

const CATEGORY_GROUPS = [
  { title: "🌙 Quiet Hours",   clauses: ["quietWeeknight", "quietWeekend"]  },
  { title: "🍽️ Kitchen",       clauses: ["dishes", "food"]                  },
  { title: "🛌 Guests",        clauses: ["overnightGuests", "gatherings"]   },
  { title: "🛋️ Shared Spaces", clauses: ["commonArea"]                      },
];

function LivePhase({ resolutions }) {
  const map = Object.fromEntries(resolutions.map((r) => [r.id, r]));

  return (
    <div>
      <Logo />
      <div style={{ textAlign: "center", marginTop: 24, marginBottom: 24 }}>
        <div style={{ fontSize: 44 }}>📋</div>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 600, color: "#1A1209", marginTop: 10, marginBottom: 8 }}>
          The Loft on Eddy Agreement
        </h2>
        <span style={{
          display: "inline-block", padding: "4px 12px", borderRadius: 20,
          backgroundColor: "#C4D9D3", color: S,
          fontSize: 11, fontWeight: 600,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}>
          Agreed by house · {TODAY}
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 24 }}>
        {CATEGORY_GROUPS.map((group) => (
          <div key={group.title}>
            <SectionLabel>{group.title}</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {group.clauses.map((id, i) => {
                const isFirst = i === 0;
                const isLast  = i === group.clauses.length - 1;
                const r = map[id];
                return (
                  <div
                    key={id}
                    style={{
                      background: "#fff",
                      border: "1px solid #F0EBE3",
                      borderRadius:
                        isFirst && isLast ? 14
                        : isFirst         ? "14px 14px 4px 4px"
                        : isLast          ? "4px 4px 14px 14px"
                        : 4,
                      padding: "12px 16px",
                      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
                    }}
                  >
                    <span style={{ fontSize: 13, color: "#8A7A6E", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {CLAUSES[id].label}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#1A1209", fontFamily: "'Plus Jakarta Sans', sans-serif", textAlign: "right" }}>
                      {getLabel(id, r.winner)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        background: "#FAF6F1", border: "1px solid #EDE6D8",
        borderRadius: 14, padding: "14px 16px", marginBottom: 20,
      }}>
        <p style={{ fontSize: 12, color: "#8A7A6E", fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1.6, margin: 0 }}>
          This is a shared reference, not a legal contract. Amendments require a majority house vote and cannot be re-proposed for 30 days if rejected.
        </p>
      </div>

      {/* SUPABASE: href={`/house/${houseId}`} */}
      <PrimaryBtn color="terra" onClick={() => (window.location.href = "/")}>
        Go to house dashboard →
      </PrimaryBtn>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function AgreementPage() {
  const [phase,       setPhase]       = useState("wizard");
  const [userAnswers, setUserAnswers] = useState(null);
  const [resolutions, setResolutions] = useState(null);
  const [visible,     setVisible]     = useState(true);

  const nav = (next) => {
    setVisible(false);
    setTimeout(() => { setPhase(next); setVisible(true); }, 180);
  };

  return (
    <div
      style={{ minHeight: "100vh", backgroundColor: CREAM, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
    >
      <div
        style={{
          width: "100%", maxWidth: 400,
          backgroundColor: "#fff", borderRadius: 28,
          padding: "32px 32px 24px",
          border: "1px solid #F0EBE3",
          boxShadow: "0 2px 16px rgba(28,18,10,0.07)",
          opacity:   visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(8px)",
          transition: "opacity 0.18s ease, transform 0.18s ease",
        }}
      >
        {phase === "wizard" && (
          <WizardPhase
            onSubmit={(answers) => {
              // SUPABASE: supabase.from("agreement_responses")
              //   .insert({ house_id, member_id, answers })
              setUserAnswers(answers);
              nav("submitted");
            }}
          />
        )}

        {phase === "submitted" && (
          <SubmittedPhase
            onReveal={() => {
              setResolutions(computeAll(userAnswers));
              nav("results");
            }}
          />
        )}

        {phase === "results" && resolutions && (
          <ResultsPhase
            resolutions={resolutions}
            onConfirm={() => {
              // SUPABASE: supabase.from("agreements")
              //   .insert({ house_id, clauses: resolutions, ratified_at: new Date() })
              nav("live");
            }}
          />
        )}

        {phase === "live" && resolutions && (
          <LivePhase resolutions={resolutions} />
        )}
      </div>
    </div>
  );
}
