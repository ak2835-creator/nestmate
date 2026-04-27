"use client";

import { useEffect, useState } from "react";

interface Chore {
  id: number;
  name: string;
  assignee: string;
  done: boolean;
}

const OTHER_MEMBERS = ["Jordan", "Priya"] as const;

const BASE_STYLES: Record<string, { bg: string; color: string; initials: string }> = {
  Jordan: { bg: "#D8EBE0", color: "#4A7C5F", initials: "JD" },
  Priya:  { bg: "#E8E0F8", color: "#5534B7", initials: "PR" },
};

const INITIAL_CHORES: Chore[] = [
  { id: 1, name: "Kitchen cleaning", assignee: "Aya (you)", done: true },
  { id: 2, name: "Take out trash",    assignee: "Jordan",    done: true },
  { id: 3, name: "Bathroom",          assignee: "Priya",     done: false },
  { id: 4, name: "Vacuuming",         assignee: "Aya (you)", done: false },
  { id: 5, name: "Common area tidy",  assignee: "Jordan",    done: false },
];

function AddChoreModal({
  youKey,
  memberStyles,
  onClose,
  onAdd,
}: {
  youKey: string;
  memberStyles: Record<string, { bg: string; color: string; initials: string }>;
  onClose: () => void;
  onAdd: (chore: Chore) => void;
}) {
  const [name, setName] = useState("");
  const [assignee, setAssignee] = useState(youKey);
  const members = [youKey, ...OTHER_MEMBERS];

  function handleAdd() {
    if (!name.trim()) return;
    onAdd({ id: Date.now(), name: name.trim(), assignee, done: false });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end" style={{ background: "rgba(44,36,22,0.4)" }}>
      <div className="w-full bg-nm-cream rounded-t-3xl" style={{ border: "1px solid rgba(44,36,22,0.1)" }}>
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full" style={{ background: "rgba(44,36,22,0.15)" }} />
        </div>

        <div className="px-6 pb-2 pt-2 flex items-center justify-between">
          <h2 className="font-serif text-[1.25rem] text-nm-ink">Add a chore</h2>
          <button
            onClick={onClose}
            className="text-nm-muted text-2xl leading-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-nm-sand transition-colors"
          >
            ×
          </button>
        </div>

        <div className="px-6 pb-8 space-y-5">
          <div>
            <label className="block text-[12px] font-medium text-nm-muted uppercase tracking-[0.07em] mb-2">
              Chore name
            </label>
            <input
              type="text"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              placeholder="e.g. Mop the floors"
              className="w-full bg-nm-white rounded-xl px-4 py-3.5 text-[16px] text-nm-ink placeholder:text-nm-muted/40 outline-none"
              style={{ border: "1px solid rgba(44,36,22,0.12)" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#C4714A")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(44,36,22,0.12)")}
            />
          </div>

          <div>
            <label className="block text-[12px] font-medium text-nm-muted uppercase tracking-[0.07em] mb-2">
              Assign to
            </label>
            <div className="grid grid-cols-3 gap-2">
              {members.map((m) => {
                const s = memberStyles[m] ?? { bg: "#E7E3DE", color: "#6B6560", initials: m.slice(0, 2).toUpperCase() };
                return (
                  <button
                    key={m}
                    onClick={() => setAssignee(m)}
                    className="py-3.5 rounded-xl text-[14px] transition-all flex flex-col items-center gap-1.5"
                    style={
                      assignee === m
                        ? { background: s.bg, border: `1.5px solid ${s.color}`, color: s.color }
                        : { background: "#FFFDFB", border: "1px solid rgba(44,36,22,0.12)", color: "#2C2416" }
                    }
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-semibold"
                      style={assignee === m ? { background: s.color, color: "white" } : { background: s.bg, color: s.color }}
                    >
                      {s.initials}
                    </div>
                    <span className="text-[12px]">{m.replace(" (you)", "")}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={handleAdd}
            disabled={!name.trim()}
            className="w-full py-4 text-white rounded-xl font-medium text-[16px] transition-all"
            style={{
              background: name.trim() ? "#C4714A" : "rgba(196,113,74,0.4)",
              cursor: name.trim() ? "pointer" : "not-allowed",
            }}
          >
            Add to this week
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ChoresPage() {
  const [chores, setChores] = useState<Chore[]>(INITIAL_CHORES);
  const [showAddModal, setShowAddModal] = useState(false);
  const [manageMode, setManageMode] = useState(false);
  const [userName, setUserName] = useState("Aya");

  useEffect(() => {
    const stored = localStorage.getItem("nm_user_name") || "Aya";
    setUserName(stored);
    if (stored !== "Aya") {
      setChores((prev) =>
        prev.map((c) =>
          c.assignee === "Aya (you)" ? { ...c, assignee: `${stored} (you)` } : c
        )
      );
    }
  }, []);

  const youKey = `${userName} (you)`;
  const memberStyles: Record<string, { bg: string; color: string; initials: string }> = {
    [youKey]: {
      bg: "#F0DDD3",
      color: "#8B4A2E",
      initials: userName.slice(0, 2).toUpperCase(),
    },
    ...BASE_STYLES,
  };

  const done = chores.filter((c) => c.done).length;
  const total = chores.length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  function toggle(id: number) {
    setChores((prev) => prev.map((c) => (c.id === id ? { ...c, done: !c.done } : c)));
  }

  function removeChore(id: number) {
    setChores((prev) => prev.filter((c) => c.id !== id));
  }

  function addChore(chore: Chore) {
    setChores((prev) => [...prev, chore]);
  }

  return (
    <div className="p-4 pb-24 space-y-4">
      {/* Week summary */}
      <div
        className="rounded-2xl p-5"
        style={{ background: "#FFFDFB", border: "1px solid rgba(44,36,22,0.08)" }}
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-[11px] font-medium text-nm-muted uppercase tracking-[0.07em]">
              This week
            </div>
            <div className="font-serif text-[1.5rem] text-nm-ink mt-0.5">
              {done} <span className="text-nm-muted font-sans text-[1rem]">of {total} done</span>
            </div>
          </div>
          <div className="text-right text-[12px] text-nm-muted" style={{ lineHeight: "1.5" }}>
            <div>Resets Monday</div>
            <div style={{ color: "#4A7C5F" }}>in 4 days</div>
          </div>
        </div>

        <div className="h-2 rounded-full overflow-hidden" style={{ background: "#F5F0E8" }}>
          <div
            className="h-2 rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, background: pct === 100 ? "#4A7C5F" : "#C4714A" }}
          />
        </div>
        {pct === 100 && (
          <p className="text-[13px] font-medium mt-2" style={{ color: "#4A7C5F" }}>
            All done this week 🎉
          </p>
        )}
      </div>

      {/* Chore list header */}
      <div className="flex items-center justify-between px-1">
        <div className="text-[11px] font-medium text-nm-muted uppercase tracking-[0.07em]">
          Rotation
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setManageMode((v) => !v)}
            className="text-[13px] px-3 py-1.5 rounded-lg transition-colors"
            style={
              manageMode
                ? { background: "#F0DDD3", color: "#8B4A2E" }
                : { background: "#F5F0E8", color: "#7A7165" }
            }
          >
            {manageMode ? "Done" : "Manage"}
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="text-[13px] px-3 py-1.5 rounded-lg font-medium transition-colors"
            style={{ background: "#C4714A", color: "white" }}
          >
            + Add
          </button>
        </div>
      </div>

      {/* Chore cards */}
      <div className="space-y-2.5">
        {chores.map((chore) => {
          const isYours = chore.assignee === youKey;
          const s = memberStyles[chore.assignee] ?? {
            bg: "#E7E3DE",
            color: "#6B6560",
            initials: chore.assignee.slice(0, 2).toUpperCase(),
          };

          return (
            <div
              key={chore.id}
              className="rounded-2xl flex items-center gap-4 px-4 py-4 transition-all"
              style={{
                background: "#FFFDFB",
                border: "1px solid rgba(44,36,22,0.08)",
                opacity: chore.done ? 0.7 : 1,
              }}
            >
              <button
                onClick={() => toggle(chore.id)}
                disabled={!isYours}
                className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all"
                style={{
                  border: chore.done ? "none" : isYours ? "2px solid #C4714A" : "2px solid rgba(44,36,22,0.15)",
                  background: chore.done ? "#4A7C5F" : "transparent",
                  cursor: isYours ? "pointer" : "default",
                }}
                aria-label={isYours ? `Toggle ${chore.name}` : undefined}
              >
                {chore.done && (
                  <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                    <path d="M1.5 4.5L4.5 7.5L10.5 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>

              <div className="flex-1 min-w-0">
                <span
                  className="text-[16px]"
                  style={{
                    color: chore.done ? "#7A7165" : "#2C2416",
                    textDecoration: chore.done ? "line-through" : "none",
                  }}
                >
                  {chore.name}
                </span>
                {isYours && !chore.done && (
                  <div className="text-[11px] mt-0.5" style={{ color: "#C4714A" }}>
                    yours to do
                  </div>
                )}
              </div>

              {!manageMode ? (
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-semibold"
                    style={{ background: s.bg, color: s.color }}
                  >
                    {s.initials}
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => removeChore(chore.id)}
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[16px] transition-colors hover:bg-red-50"
                  style={{ color: "#C4714A" }}
                  aria-label={`Remove ${chore.name}`}
                >
                  −
                </button>
              )}
            </div>
          );
        })}

        {chores.length === 0 && (
          <div
            className="rounded-2xl p-8 text-center"
            style={{ background: "#FFFDFB", border: "1px dashed rgba(44,36,22,0.15)" }}
          >
            <p className="text-[15px] text-nm-muted mb-1">No chores yet</p>
            <p className="text-[13px] text-nm-muted">Tap + Add to build your rotation.</p>
          </div>
        )}
      </div>

      {/* Rotation info */}
      <div
        className="rounded-2xl p-4"
        style={{ background: "#F5F0E8", border: "1px dashed rgba(44,36,22,0.15)" }}
      >
        <div className="text-[12px] font-medium text-nm-ink mb-1">Fair rotation · auto</div>
        <p className="text-[13px] text-nm-muted leading-relaxed">
          Chores rotate each Monday so everyone carries the load equally. Tap your own chores to check them off — your housemates can see the board.
        </p>
      </div>

      {showAddModal && (
        <AddChoreModal
          youKey={youKey}
          memberStyles={memberStyles}
          onClose={() => setShowAddModal(false)}
          onAdd={addChore}
        />
      )}
    </div>
  );
}
