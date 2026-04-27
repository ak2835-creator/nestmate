"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Answers = Record<string, string>;

const STEPS = [
  {
    num: 1,
    title: "Quiet hours",
    subtitle: "When does the house wind down?",
    hint: "This protects the Maya in every house — the one who cares most and is least likely to say it.",
    questions: [
      {
        id: "quiet_weeknight",
        label: "Weeknights",
        options: ["9 pm", "10 pm", "11 pm", "Midnight", "No rule"],
      },
      {
        id: "quiet_weekend",
        label: "Weekends",
        options: ["Same as weeknights", "1 am", "2 am", "No rule"],
      },
    ],
  },
  {
    num: 2,
    title: "Kitchen",
    subtitle: "The most common source of friction. Let's just name it.",
    hint: null,
    questions: [
      {
        id: "dishes",
        label: "Dishes in the sink for",
        options: ["Same day", "Within 24h", "Within 48h", "Best effort"],
      },
      {
        id: "food",
        label: "Food in the fridge",
        options: ["Label your stuff", "Ask before eating", "Everything shared"],
      },
    ],
  },
  {
    num: 3,
    title: "Guests",
    subtitle: "No surprises, no resentment.",
    hint: null,
    questions: [
      {
        id: "overnight",
        label: "Overnight guests",
        options: ["Always fine", "24hr heads-up", "Max 3 nights/month", "Discuss each time"],
      },
      {
        id: "gatherings",
        label: "Gatherings / parties",
        options: ["Just let us know", "Majority agrees first"],
      },
    ],
  },
  {
    num: 4,
    title: "Shared spaces",
    subtitle: "Everyone has a different definition of \"clean.\" This is yours.",
    hint: null,
    questions: [
      {
        id: "common_area",
        label: "Common area standard",
        options: ["Spotless always", "Generally tidy", "Lived-in is fine", "Rotate cleaning"],
      },
    ],
  },
];

const LABELS: Record<string, string> = {
  quiet_weeknight: "Weeknight quiet hours",
  quiet_weekend: "Weekend quiet hours",
  dishes: "Dishes",
  food: "Food",
  overnight: "Overnight guests",
  gatherings: "Gatherings",
  common_area: "Common area",
};

function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      <div className="flex gap-1.5 flex-1">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className="h-1 rounded-full flex-1 transition-all duration-500"
            style={{
              background:
                i < step ? "#C4714A" : i === step ? "rgba(196,113,74,0.35)" : "rgba(44,36,22,0.1)",
            }}
          />
        ))}
      </div>
      <span className="text-[12px] text-nm-muted flex-shrink-0">{step + 1} of {total}</span>
    </div>
  );
}

function PillOption({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2.5 rounded-xl text-[14px] transition-all duration-150 text-left"
      style={
        selected
          ? {
              background: "#F0DDD3",
              border: "1.5px solid #C4714A",
              color: "#8B4A2E",
              fontWeight: "500",
            }
          : {
              background: "#FFFDFB",
              border: "1px solid rgba(44,36,22,0.14)",
              color: "#2C2416",
            }
      }
    >
      <span className="mr-2 opacity-60">{selected ? "◉" : "○"}</span>
      {label}
    </button>
  );
}

export default function AgreementWizardPage() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [submitted, setSubmitted] = useState(false);
  const [visible, setVisible] = useState(true);

  const step = STEPS[stepIndex];
  const allAnswered = step.questions.every((q) => answers[q.id]);

  function navigate(to: number) {
    setVisible(false);
    setTimeout(() => {
      setStepIndex(to);
      setVisible(true);
      window.scrollTo(0, 0);
    }, 180);
  }

  function handleAnswer(questionId: string, value: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }

  function handleNext() {
    if (stepIndex < STEPS.length - 1) {
      navigate(stepIndex + 1);
    } else {
      // Final submit
      setVisible(false);
      setTimeout(() => {
        setSubmitted(true);
        setVisible(true);
      }, 180);
    }
  }

  function handleBack() {
    if (stepIndex > 0) navigate(stepIndex - 1);
  }

  // Submitted / waiting screen
  if (submitted) {
    return (
      <div
        className="min-h-screen bg-nm-cream flex flex-col transition-opacity duration-200"
        style={{ opacity: visible ? 1 : 0 }}
      >
        <div className="flex items-center gap-3 px-5 py-5">
          <span className="font-serif text-lg text-nm-terra italic">NestMate</span>
        </div>

        <div className="flex-1 px-6 py-4">
          {/* Success badge */}
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[13px] font-medium mb-6"
            style={{ background: "#D8EBE0", color: "#4A7C5F" }}
          >
            <span>✓</span> Submitted
          </div>

          <h1 className="font-serif text-[1.75rem] font-normal text-nm-ink leading-snug mb-2">
            Your answers<br />are sealed.
          </h1>
          <p className="text-[15px] text-nm-muted leading-relaxed mb-8">
            They stay hidden until everyone in the house submits. No anchoring, no pressure.
          </p>

          {/* Waiting status */}
          <div
            className="rounded-2xl p-4 mb-4"
            style={{ background: "#FFFDFB", border: "1px solid rgba(44,36,22,0.08)" }}
          >
            <div className="text-[11px] font-medium text-nm-muted uppercase tracking-[0.07em] mb-3">
              Submitted so far
            </div>
            {[
              { initials: "AY", name: "Aya (you)", bg: "#F0DDD3", color: "#8B4A2E", done: true },
              { initials: "JD", name: "Jordan", bg: "#D8EBE0", color: "#4A7C5F", done: false },
              { initials: "PR", name: "Priya", bg: "#E8E0F8", color: "#5534B7", done: false },
            ].map((m) => (
              <div
                key={m.initials}
                className="flex items-center gap-3 py-2.5"
                style={{ borderBottom: "1px solid rgba(44,36,22,0.06)" }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-semibold"
                  style={{ background: m.bg, color: m.color }}
                >
                  {m.initials}
                </div>
                <span className="flex-1 text-[15px] text-nm-ink">{m.name}</span>
                {m.done ? (
                  <span className="text-[12px] font-medium" style={{ color: "#4A7C5F" }}>✓ in</span>
                ) : (
                  <span className="flex items-center gap-1 text-[12px] text-nm-muted">
                    <span className="animate-pulse">•</span>
                    <span className="animate-pulse" style={{ animationDelay: "0.2s" }}>•</span>
                    <span className="animate-pulse" style={{ animationDelay: "0.4s" }}>•</span>
                  </span>
                )}
              </div>
            ))}
            <p className="text-[12px] text-nm-muted mt-3 leading-relaxed">
              Results and any conflicts will appear once all 3 have submitted.
            </p>
          </div>

          {/* Answers summary */}
          <div
            className="rounded-2xl p-4"
            style={{ background: "#FFFDFB", border: "1px solid rgba(44,36,22,0.08)" }}
          >
            <div className="text-[11px] font-medium text-nm-muted uppercase tracking-[0.07em] mb-3">
              Your answers
            </div>
            {Object.entries(answers).map(([key, value]) => (
              <div key={key} className="flex justify-between py-1.5" style={{ borderBottom: "1px solid rgba(44,36,22,0.05)" }}>
                <span className="text-[13px] text-nm-muted">{LABELS[key]}</span>
                <span className="text-[13px] font-medium text-nm-ink">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 pb-10 pt-4">
          <button
            onClick={() => router.push("/house/demo")}
            className="w-full py-4 bg-nm-terra text-white rounded-xl font-medium text-[16px] hover:bg-nm-terra-dark transition-colors"
          >
            Go to your house →
          </button>
          <p className="text-center text-[12px] text-nm-muted mt-3">
            We&apos;ll show you the results once everyone&apos;s in.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-nm-cream flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-5">
        <button
          onClick={handleBack}
          className="text-nm-muted text-xl leading-none"
          style={{ opacity: stepIndex === 0 ? 0.3 : 1 }}
          disabled={stepIndex === 0}
        >
          ←
        </button>
        <span className="font-serif text-lg text-nm-terra italic">NestMate</span>
        <span
          className="ml-auto text-[12px] px-2.5 py-1 rounded-full"
          style={{ background: "#F0DDD3", color: "#8B4A2E" }}
        >
          House Agreement
        </span>
      </div>

      {/* Body */}
      <div
        className="flex-1 px-6 py-2 transition-all duration-200"
        style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(8px)" }}
      >
        <ProgressBar step={stepIndex} total={STEPS.length} />

        <h1 className="font-serif text-[1.75rem] font-normal text-nm-ink leading-snug mb-1">
          {step.title}
        </h1>
        <p className="text-[14px] text-nm-muted mb-1 leading-relaxed">{step.subtitle}</p>
        {step.hint && (
          <p className="text-[12px] italic text-nm-muted/80 mb-6 leading-relaxed border-l-2 pl-3" style={{ borderColor: "rgba(196,113,74,0.3)" }}>
            {step.hint}
          </p>
        )}
        {!step.hint && <div className="mb-6" />}

        <div className="space-y-6">
          {step.questions.map((question) => (
            <div key={question.id}>
              <div className="text-[11px] font-medium text-nm-muted uppercase tracking-[0.07em] mb-2.5">
                {question.label}
              </div>
              <div className="flex flex-col gap-2">
                {question.options.map((option) => (
                  <PillOption
                    key={option}
                    label={option}
                    selected={answers[question.id] === option}
                    onClick={() => handleAnswer(question.id, option)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Privacy note */}
        <div
          className="mt-8 flex items-start gap-3 p-3.5 rounded-xl"
          style={{ background: "rgba(44,36,22,0.04)", border: "1px dashed rgba(44,36,22,0.12)" }}
        >
          <span className="text-nm-muted text-base mt-px">🔒</span>
          <p className="text-[12px] text-nm-muted leading-relaxed">
            Your answers are private until everyone in the house submits. No one can anchor to your choices.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 pb-10 pt-4">
        <button
          onClick={handleNext}
          disabled={!allAnswered}
          className="w-full py-4 text-white rounded-xl font-medium text-[16px] transition-all"
          style={{
            background: allAnswered ? "#C4714A" : "rgba(196,113,74,0.35)",
            cursor: allAnswered ? "pointer" : "not-allowed",
          }}
        >
          {stepIndex < STEPS.length - 1 ? "Continue →" : "Submit to house →"}
        </button>
        {!allAnswered && (
          <p className="text-center text-[12px] text-nm-muted mt-2">
            Select an option for each question above
          </p>
        )}
      </div>
    </div>
  );
}
