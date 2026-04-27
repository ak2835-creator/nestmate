"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const ROOMMATE_COUNTS = ["2 total", "3 total", "4 total", "5+ total"];

function StepDots({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex gap-1.5 mb-7">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="h-1.5 rounded-full transition-all duration-300"
          style={{
            width: i === current ? "20px" : "6px",
            background: i < current ? "#4A7C5F" : i === current ? "#C4714A" : "rgba(44,36,22,0.15)",
          }}
        />
      ))}
    </div>
  );
}

export default function CreateHousePage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [yourName, setYourName] = useState("");
  const [houseName, setHouseName] = useState("");
  const [roommateCount, setRoommateCount] = useState("3 total");

  const canAdvanceStep0 = yourName.trim().length > 0 && houseName.trim().length > 0;

  function handleContinue() {
    if (step === 0 && canAdvanceStep0) {
      setStep(1);
    } else if (step === 1) {
      router.push("/onboarding/agreement");
    }
  }

  return (
    <div className="min-h-screen bg-nm-cream flex flex-col">
      <div className="flex items-center gap-3 px-5 py-5">
        {step === 0 ? (
          <Link href="/" className="text-nm-muted text-xl leading-none">←</Link>
        ) : (
          <button onClick={() => setStep(0)} className="text-nm-muted text-xl leading-none">←</button>
        )}
        <span className="font-serif text-lg text-nm-terra italic">NestMate</span>
      </div>

      <div className="flex-1 px-6 py-2">
        <StepDots total={2} current={step} />

        {step === 0 && (
          <>
            <h1 className="font-serif text-[1.5rem] font-normal text-nm-ink mb-1">
              Name your house
            </h1>
            <p className="text-[13px] text-nm-muted mb-8 leading-relaxed">
              Pick something your roommates will recognise.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-medium text-nm-muted uppercase tracking-[0.07em] mb-1.5">
                  Your name
                </label>
                <input
                  type="text"
                  autoFocus
                  value={yourName}
                  onChange={(e) => setYourName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && canAdvanceStep0 && handleContinue()}
                  placeholder="e.g. Aya"
                  className="w-full bg-nm-white rounded-lg px-4 py-3 text-[15px] text-nm-ink placeholder:text-nm-muted/40 outline-none transition-colors"
                  style={{ border: "1px solid rgba(44,36,22,0.12)" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#C4714A")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(44,36,22,0.12)")}
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-nm-muted uppercase tracking-[0.07em] mb-1.5">
                  House name
                </label>
                <input
                  type="text"
                  value={houseName}
                  onChange={(e) => setHouseName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && canAdvanceStep0 && handleContinue()}
                  placeholder="e.g. 312 Linden"
                  className="w-full bg-nm-white rounded-lg px-4 py-3 text-[15px] text-nm-ink placeholder:text-nm-muted/40 outline-none transition-colors"
                  style={{ border: "1px solid rgba(44,36,22,0.12)" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#C4714A")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(44,36,22,0.12)")}
                />
              </div>
            </div>

            <div
              className="mt-4 inline-block text-[12px] px-3 py-1 rounded-full"
              style={{ background: "#F0DDD3", color: "#8B4A2E" }}
            >
              Your invite link will be ready after setup
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <h1 className="font-serif text-[1.5rem] font-normal text-nm-ink mb-1">
              How many roommates?
            </h1>
            <p className="text-[13px] text-nm-muted mb-8 leading-relaxed">
              Including yourself. You can always adjust this later.
            </p>

            <div>
              <label className="block text-[11px] font-medium text-nm-muted uppercase tracking-[0.07em] mb-3">
                House size
              </label>
              <div className="flex flex-wrap gap-2">
                {ROOMMATE_COUNTS.map((count) => (
                  <button
                    key={count}
                    onClick={() => setRoommateCount(count)}
                    className="px-4 py-2 rounded-full text-[13px] transition-all"
                    style={
                      roommateCount === count
                        ? { background: "#F0DDD3", border: "1px solid #C4714A", color: "#8B4A2E" }
                        : { background: "#F5F0E8", border: "1px solid rgba(44,36,22,0.12)", color: "#7A7165" }
                    }
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 p-4 rounded-xl" style={{ background: "#F5F0E8", border: "1px dashed rgba(196,113,74,0.35)" }}>
              <p className="text-[12px] text-nm-muted leading-relaxed">
                <span className="font-medium text-nm-ink">Next:</span> Each roommate fills out the House Agreement independently — answers stay hidden until everyone submits.
              </p>
            </div>
          </>
        )}
      </div>

      <div className="px-6 pb-10">
        <button
          onClick={handleContinue}
          disabled={step === 0 && !canAdvanceStep0}
          className="w-full py-3.5 text-white rounded-xl font-medium text-[15px] transition-colors disabled:opacity-40"
          style={{ background: step === 0 && !canAdvanceStep0 ? "#C4714A" : "#C4714A" }}
          onMouseEnter={(e) => {
            if (!(step === 0 && !canAdvanceStep0))
              e.currentTarget.style.background = "#8B4A2E";
          }}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#C4714A")}
        >
          {step === 0 ? "Continue →" : "Create house & get invite link →"}
        </button>
      </div>
    </div>
  );
}
