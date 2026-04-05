"use client";

import { useState } from "react";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const ROOMMATES = [
  { id: "r1", name: "You", avatar: "Y", color: "#C55E30" },
  { id: "r2", name: "Jordan", avatar: "J", color: "#4A7A6A" },
  { id: "r3", name: "Maya", avatar: "M", color: "#8B6914" },
  { id: "r4", name: "Chris", avatar: "C", color: "#6B4E8A" },
];
const ME = ROOMMATES[0];

const PAYMENT_METHODS = ["Venmo", "Zelle", "Cash", "Bank Transfer", "Other"];

const CATEGORY_META = {
  Groceries:     { color: "#4A7A6A", bg: "#4A7A6A1A" },
  Utilities:     { color: "#C55E30", bg: "#C55E301A" },
  Rent:          { color: "#8B6914", bg: "#8B69141A" },
  Cleaning:      { color: "#6B4E8A", bg: "#6B4E8A1A" },
  "Dining Out":  { color: "#C55E30", bg: "#C55E301A" },
  Entertainment: { color: "#4A7A6A", bg: "#4A7A6A1A" },
  Other:         { color: "#8B7355", bg: "#8B73551A" },
};

const CATEGORY_SVGS = {
  Groceries: (c) => (
    <svg viewBox="0 0 20 20" fill="none" width="18" height="18">
      <path d="M2 3h1.5l2.1 8.4a1 1 0 0 0 .97.76h7.3a1 1 0 0 0 .96-.72L16.5 6H5" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="8" cy="16" r="1.2" fill={c}/>
      <circle cx="14" cy="16" r="1.2" fill={c}/>
    </svg>
  ),
  Utilities: (c) => (
    <svg viewBox="0 0 20 20" fill="none" width="18" height="18">
      <path d="M11 2 7 11h5l-3 7 7-9h-5l3-7z" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Rent: (c) => (
    <svg viewBox="0 0 20 20" fill="none" width="18" height="18">
      <path d="M3 9.5 10 3l7 6.5V17a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 18v-5h4v5" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Cleaning: (c) => (
    <svg viewBox="0 0 20 20" fill="none" width="18" height="18">
      <path d="M6 2v9a4 4 0 0 0 8 0V2" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M4 2h12" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M10 15v3" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  "Dining Out": (c) => (
    <svg viewBox="0 0 20 20" fill="none" width="18" height="18">
      <path d="M5 2v5a3 3 0 0 0 3 3v8" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5 2h0M8 2v5M11 2v5" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M14 2c0 0 2 1.5 2 5v.5a2 2 0 0 1-2 2V18" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Entertainment: (c) => (
    <svg viewBox="0 0 20 20" fill="none" width="18" height="18">
      <rect x="2" y="4" width="16" height="11" rx="2" stroke={c} strokeWidth="1.5"/>
      <path d="M7 18h6M10 15v3" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M8 8.5l5 3-5 3v-6z" fill={c}/>
    </svg>
  ),
  Other: (c) => (
    <svg viewBox="0 0 20 20" fill="none" width="18" height="18">
      <rect x="3" y="5" width="14" height="12" rx="2" stroke={c} strokeWidth="1.5"/>
      <path d="M7 5V4a3 3 0 0 1 6 0v1" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="10" cy="11" r="1.5" fill={c}/>
    </svg>
  ),
};

function CategoryIcon({ category }) {
  const meta = CATEGORY_META[category] || CATEGORY_META.Other;
  const svg = CATEGORY_SVGS[category] || CATEGORY_SVGS.Other;
  return (
    <div style={{
      width: 40,
      height: 40,
      borderRadius: 10,
      background: meta.bg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}>
      {svg(meta.color)}
    </div>
  );
}

const INITIAL_EXPENSES = [
  {
    id: "e1",
    description: "Dish soap + sponges",
    category: "Cleaning",
    amount: 8.5,
    paidBy: "r2",
    splitBetween: ["r1", "r2", "r3", "r4"],
    date: "2025-01-28",
    flagged: false,
    flagNote: "",
    settlements: [],
    status: "active",
  },
  {
    id: "e2",
    description: "Whole Foods run",
    category: "Groceries",
    amount: 94.3,
    paidBy: "r1",
    splitBetween: ["r1", "r2", "r3"],
    date: "2025-01-27",
    flagged: false,
    flagNote: "",
    settlements: [
      {
        id: "s1",
        fromId: "r3",
        toId: "r1",
        amount: 31.43,
        method: "Venmo",
        confirmedBy: "r1",
        date: "2025-01-28",
        status: "confirmed",
      },
    ],
    status: "active",
  },
  {
    id: "e3",
    description: "Netflix split",
    category: "Entertainment",
    amount: 22.99,
    paidBy: "r3",
    splitBetween: ["r1", "r2", "r3", "r4"],
    date: "2025-01-25",
    flagged: true,
    flagNote: "I thought we were dropping Netflix?",
    flaggedBy: "r4",
    settlements: [],
    status: "flagged",
  },
  {
    id: "e4",
    description: "Electric bill January",
    category: "Utilities",
    amount: 124.0,
    paidBy: "r1",
    splitBetween: ["r1", "r2", "r3", "r4"],
    date: "2025-01-20",
    flagged: false,
    flagNote: "",
    settlements: [
      {
        id: "s2",
        fromId: "r2",
        toId: "r1",
        amount: 31.0,
        method: "Venmo",
        confirmedBy: "r1",
        date: "2025-01-21",
        status: "confirmed",
      },
      {
        id: "s3",
        fromId: "r3",
        toId: "r1",
        amount: 31.0,
        method: "Cash",
        confirmedBy: "r1",
        date: "2025-01-22",
        status: "confirmed",
      },
      {
        id: "s4",
        fromId: "r4",
        toId: "r1",
        amount: 31.0,
        method: "Zelle",
        confirmedBy: "r1",
        date: "2025-01-22",
        status: "confirmed",
      },
    ],
    status: "settled",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function calcBalances(expenses) {
  const balances = {};
  ROOMMATES.forEach((r) => {
    ROOMMATES.forEach((r2) => {
      if (r.id !== r2.id) {
        const key = `${r.id}→${r2.id}`;
        balances[key] = 0;
      }
    });
  });

  expenses.forEach((exp) => {
    if (exp.flagged) return; // flagged don't affect balances
    const share = exp.amount / exp.splitBetween.length;
    const confirmedSettlements = exp.settlements.filter(
      (s) => s.status === "confirmed"
    );

    exp.splitBetween.forEach((rid) => {
      if (rid === exp.paidBy) return;
      const settled = confirmedSettlements
        .filter((s) => s.fromId === rid && s.toId === exp.paidBy)
        .reduce((sum, s) => sum + s.amount, 0);
      const remaining = share - settled;
      if (remaining > 0.005) {
        const key = `${rid}→${exp.paidBy}`;
        balances[key] = (balances[key] || 0) + remaining;
      }
    });
  });
  return balances;
}

function getRoommate(id) {
  return ROOMMATES.find((r) => r.id === id);
}

function fmt(n) {
  return n.toFixed(2);
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function Avatar({ roommate, size = 32 }) {
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: roommate.color,
        color: "#fff",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.42,
        fontWeight: 700,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        flexShrink: 0,
      }}
    >
      {roommate.avatar}
    </span>
  );
}

function Pill({ children, color = "#C55E30", bg }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "2px 10px",
        borderRadius: 100,
        fontSize: 11,
        fontWeight: 600,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        background: bg || color + "18",
        color: color,
        letterSpacing: "0.03em",
        textTransform: "uppercase",
      }}
    >
      {children}
    </span>
  );
}

// ─── Log Expense Modal ────────────────────────────────────────────────────────
function LogExpenseModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    description: "",
    category: "Groceries",
    amount: "",
    paidBy: ME.id,
    splitBetween: ROOMMATES.map((r) => r.id),
  });

  function toggle(id) {
    setForm((f) => ({
      ...f,
      splitBetween: f.splitBetween.includes(id)
        ? f.splitBetween.filter((x) => x !== id)
        : [...f.splitBetween, id],
    }));
  }

  function submit() {
    if (!form.description || !form.amount || form.splitBetween.length === 0)
      return;
    onAdd({
      id: "e" + Date.now(),
      ...form,
      amount: parseFloat(form.amount),
      date: new Date().toISOString().slice(0, 10),
      flagged: false,
      flagNote: "",
      settlements: [],
      status: "active",
    });
    onClose();
  }

  const perPerson =
    form.amount && form.splitBetween.length
      ? (parseFloat(form.amount) / form.splitBetween.length).toFixed(2)
      : null;

  return (
    <div style={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={styles.modal}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>Log an Expense</h2>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Description</label>
          <input
            style={styles.input}
            placeholder="e.g. Dish soap, Toilet paper…"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={styles.field}>
            <label style={styles.label}>Amount ($)</label>
            <input
              style={styles.input}
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Category</label>
            <select
              style={styles.input}
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {Object.keys(CATEGORY_META).map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Paid by</label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {ROOMMATES.map((r) => (
              <button
                key={r.id}
                style={{
                  ...styles.toggleChip,
                  background: form.paidBy === r.id ? r.color : "#F5EDE0",
                  color: form.paidBy === r.id ? "#fff" : "#3D2B1A",
                  borderColor: form.paidBy === r.id ? r.color : "#E0D4C4",
                }}
                onClick={() => setForm({ ...form, paidBy: r.id })}
              >
                {r.name}
              </button>
            ))}
          </div>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Split between</label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {ROOMMATES.map((r) => {
              const on = form.splitBetween.includes(r.id);
              return (
                <button
                  key={r.id}
                  style={{
                    ...styles.toggleChip,
                    background: on ? r.color + "22" : "#F5EDE0",
                    color: on ? r.color : "#3D2B1A",
                    borderColor: on ? r.color : "#E0D4C4",
                  }}
                  onClick={() => toggle(r.id)}
                >
                  {r.name}
                </button>
              );
            })}
          </div>
          {perPerson && (
            <p style={{ fontSize: 12, color: "#4A7A6A", marginTop: 6, fontWeight: 600 }}>
              ${perPerson} per person · {form.splitBetween.length} people
            </p>
          )}
        </div>

        <button
          style={{
            ...styles.primaryBtn,
            opacity: !form.description || !form.amount || !form.splitBetween.length ? 0.5 : 1,
          }}
          onClick={submit}
        >
          Add Expense
        </button>
      </div>
    </div>
  );
}

// ─── Settle Modal ─────────────────────────────────────────────────────────────
function SettleModal({ debt, onClose, onSettle }) {
  const [method, setMethod] = useState("Venmo");
  const [amount, setAmount] = useState(fmt(debt.amount));
  const from = getRoommate(debt.fromId);
  const to = getRoommate(debt.toId);

  return (
    <div style={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{ ...styles.modal, maxWidth: 380 }}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>Mark as Settled</h2>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>
        <div style={{
          background: "#F5EDE0",
          borderRadius: 12,
          padding: "14px 16px",
          marginBottom: 20,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}>
          <Avatar roommate={from} size={36} />
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 13, color: "#8B7355", margin: 0 }}>
              {from.id === ME.id ? "You owe" : `${from.name} owes`}
            </p>
            <p style={{ fontSize: 20, fontWeight: 700, color: "#C55E30", margin: 0, fontFamily: "'Fraunces', serif" }}>
              ${fmt(debt.amount)}
            </p>
            <p style={{ fontSize: 12, color: "#8B7355", margin: 0 }}>to {to.name}</p>
          </div>
          <Avatar roommate={to} size={36} />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Payment method</label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {PAYMENT_METHODS.map((m) => (
              <button
                key={m}
                style={{
                  ...styles.toggleChip,
                  background: method === m ? "#C55E30" : "#F5EDE0",
                  color: method === m ? "#fff" : "#3D2B1A",
                  borderColor: method === m ? "#C55E30" : "#E0D4C4",
                }}
                onClick={() => setMethod(m)}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Amount sent ($)</label>
          <input
            style={styles.input}
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <p style={{ fontSize: 12, color: "#8B7355", marginBottom: 16, lineHeight: 1.5 }}>
          <strong>{to.name}</strong> will be asked to confirm receipt before this clears your balance.
        </p>

        <button style={styles.primaryBtn} onClick={() => {
          onSettle({ method, amount: parseFloat(amount) });
          onClose();
        }}>
          Send Confirmation Request
        </button>
      </div>
    </div>
  );
}

// ─── Flag Modal ───────────────────────────────────────────────────────────────
function FlagModal({ expense, onClose, onFlag }) {
  const [note, setNote] = useState("");
  return (
    <div style={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{ ...styles.modal, maxWidth: 380 }}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>Flag This Expense</h2>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>
        <p style={{ fontSize: 13, color: "#8B7355", marginBottom: 16 }}>
          Flagged expenses won't affect balances until resolved. Your housemates will see your note.
        </p>
        <div style={styles.field}>
          <label style={styles.label}>Reason (optional)</label>
          <textarea
            style={{ ...styles.input, height: 80, resize: "vertical" }}
            placeholder="e.g. I didn't agree to this purchase…"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
        <button style={{ ...styles.primaryBtn, background: "#B84D25" }} onClick={() => {
          onFlag(note);
          onClose();
        }}>
          Flag Expense
        </button>
      </div>
    </div>
  );
}

// ─── Expense Card ─────────────────────────────────────────────────────────────
function ExpenseCard({ expense, onFlag, onSettle, onUnflag, onConfirmSettlement }) {
  const [expanded, setExpanded] = useState(false);
  const payer = getRoommate(expense.paidBy);
  const share = expense.amount / expense.splitBetween.length;
  const mySettled = expense.settlements
    .filter((s) => s.fromId === ME.id && s.toId === expense.paidBy && s.status === "confirmed")
    .reduce((sum, s) => sum + s.amount, 0);
  const myOwed = expense.splitBetween.includes(ME.id) && ME.id !== expense.paidBy
    ? Math.max(0, share - mySettled)
    : 0;

  const pendingSettlements = expense.settlements.filter((s) => s.status === "pending");
  const confirmedSettlements = expense.settlements.filter((s) => s.status === "confirmed");

  const totalConfirmed = confirmedSettlements.reduce((sum, s) => sum + s.amount, 0);
  const owedTotal = expense.amount - (expense.amount / expense.splitBetween.length) * (expense.splitBetween.includes(expense.paidBy) ? 1 : 0);
  const isFullySettled = expense.status === "settled" || totalConfirmed >= owedTotal - 0.005;

  return (
    <div style={{
      ...styles.card,
      borderLeft: expense.flagged
        ? "3px solid #E07B25"
        : isFullySettled
        ? "3px solid #4A7A6A"
        : "3px solid transparent",
      opacity: isFullySettled ? 0.75 : 1,
    }}>
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <CategoryIcon category={expense.category} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontFamily: "'Fraunces', serif", fontSize: 16, fontWeight: 600, color: "#2D1A0E" }}>
              {expense.description}
            </span>
            {expense.flagged && <Pill color="#E07B25">⚑ Flagged</Pill>}
            {isFullySettled && <Pill color="#4A7A6A">✓ Settled</Pill>}
          </div>
          <div style={{ fontSize: 12, color: "#8B7355", marginTop: 2 }}>
            {expense.date} · {expense.category} · paid by{" "}
            <strong>{payer.id === ME.id ? "you" : payer.name}</strong>
          </div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 700, color: "#2D1A0E" }}>
            ${fmt(expense.amount)}
          </div>
          <div style={{ fontSize: 11, color: "#8B7355" }}>
            ${fmt(share)} each
          </div>
        </div>
      </div>

      {/* Flag note */}
      {expense.flagged && (
        <div style={{
          marginTop: 10,
          padding: "8px 12px",
          background: "#FFF3E8",
          borderRadius: 8,
          fontSize: 13,
          color: "#7A4010",
          border: "1px solid #F5C49A",
        }}>
          ⚑ {getRoommate(expense.flaggedBy)?.name || "Someone"}: "{expense.flagNote || "Flagged for review"}"
        </div>
      )}

      {/* My balance row */}
      {myOwed > 0.005 && !expense.flagged && (
        <div style={{
          marginTop: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#FEF5EE",
          borderRadius: 8,
          padding: "8px 12px",
        }}>
          <span style={{ fontSize: 13, color: "#8B7355" }}>
            You owe <strong style={{ color: "#C55E30" }}>${fmt(myOwed)}</strong>
          </span>
          <button
            style={styles.smallBtn}
            onClick={() => onSettle({ fromId: ME.id, toId: expense.paidBy, amount: myOwed, expenseId: expense.id })}
          >
            Mark Settled
          </button>
        </div>
      )}

      {/* Pending confirmations (if you are the payer) */}
      {pendingSettlements.filter((s) => s.toId === ME.id).map((s) => (
        <div key={s.id} style={{
          marginTop: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#EDF5F2",
          borderRadius: 8,
          padding: "8px 12px",
        }}>
          <span style={{ fontSize: 13, color: "#2D4A3E" }}>
            <strong>{getRoommate(s.fromId)?.name}</strong> says they paid ${fmt(s.amount)} via {s.method}
          </span>
          <button
            style={{ ...styles.smallBtn, background: "#4A7A6A", color: "#fff" }}
            onClick={() => onConfirmSettlement(expense.id, s.id)}
          >
            Confirm ✓
          </button>
        </div>
      ))}

      {/* Expand toggle */}
      <button
        style={{ ...styles.ghostBtn, marginTop: 10 }}
        onClick={() => setExpanded((v) => !v)}
      >
        {expanded ? "▲ Hide details" : `▼ Details · ${expense.splitBetween.length} people`}
      </button>

      {expanded && (
        <div style={{ marginTop: 10, borderTop: "1px solid #EDE0D0", paddingTop: 10 }}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
            {expense.splitBetween.map((rid) => {
              const r = getRoommate(rid);
              const isSettled = rid === expense.paidBy ||
                expense.settlements.filter((s) => s.fromId === rid && s.status === "confirmed")
                  .reduce((sum, s) => sum + s.amount, 0) >= share - 0.005;
              return (
                <div key={rid} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
                  <Avatar roommate={r} size={22} />
                  <span style={{ color: isSettled ? "#4A7A6A" : "#8B7355" }}>
                    {r.name}{rid === expense.paidBy ? " (paid)" : isSettled ? " ✓" : ` owes $${fmt(share)}`}
                  </span>
                </div>
              );
            })}
          </div>

          {confirmedSettlements.length > 0 && (
            <div style={{ fontSize: 12, color: "#4A7A6A" }}>
              {confirmedSettlements.map((s) => (
                <div key={s.id}>
                  ✓ {getRoommate(s.fromId)?.name} → {getRoommate(s.toId)?.name}: ${fmt(s.amount)} via {s.method}
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            {!expense.flagged && !isFullySettled && (
              <button
                style={{ ...styles.ghostBtn, color: "#E07B25", borderColor: "#F5C49A" }}
                onClick={() => onFlag(expense.id)}
              >
                ⚑ Flag
              </button>
            )}
            {expense.flagged && (
              <button
                style={{ ...styles.ghostBtn, color: "#4A7A6A", borderColor: "#4A7A6A44" }}
                onClick={() => onUnflag(expense.id)}
              >
                ✓ Resolve Flag
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Balance Card ─────────────────────────────────────────────────────────────
function BalanceSummary({ expenses, onSettle }) {
  const balances = calcBalances(expenses);
  const myDebts = Object.entries(balances)
    .filter(([key, amt]) => key.startsWith(ME.id + "→") && amt > 0.005)
    .map(([key, amt]) => ({ toId: key.split("→")[1], amount: amt }));
  const owedToMe = Object.entries(balances)
    .filter(([key, amt]) => key.endsWith("→" + ME.id) && amt > 0.005)
    .map(([key, amt]) => ({ fromId: key.split("→")[0], amount: amt }));

  const netOwed = owedToMe.reduce((s, d) => s + d.amount, 0);
  const netOwe = myDebts.reduce((s, d) => s + d.amount, 0);

  return (
    <div style={{ ...styles.card, background: "linear-gradient(135deg, #2D1A0E 0%, #4A2800 100%)", color: "#fff" }}>
      <h3 style={{ ...styles.sectionTitle, color: "#F5EDE0", marginBottom: 16 }}>Your Balance</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 10, padding: 12 }}>
          <p style={{ fontSize: 11, color: "#C9A98A", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>You're owed</p>
          <p style={{ fontFamily: "'Fraunces', serif", fontSize: 24, fontWeight: 700, color: "#7EC8A8", margin: 0 }}>
            ${fmt(netOwed)}
          </p>
        </div>
        <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 10, padding: 12 }}>
          <p style={{ fontSize: 11, color: "#C9A98A", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>You owe</p>
          <p style={{ fontFamily: "'Fraunces', serif", fontSize: 24, fontWeight: 700, color: "#F5A878", margin: 0 }}>
            ${fmt(netOwe)}
          </p>
        </div>
      </div>

      {myDebts.length > 0 && (
        <div style={{ marginBottom: 10 }}>
          {myDebts.map((d) => {
            const to = getRoommate(d.toId);
            return (
              <div key={d.toId} style={{
                display: "flex", alignItems: "center", gap: 8, marginBottom: 6,
                background: "rgba(255,255,255,0.06)", borderRadius: 8, padding: "8px 10px",
              }}>
                <Avatar roommate={to} size={28} />
                <div style={{ flex: 1, fontSize: 13 }}>
                  <span style={{ color: "#F5C49A" }}>You → {to.name}</span>
                </div>
                <span style={{ color: "#F5A878", fontWeight: 700 }}>${fmt(d.amount)}</span>
                <button
                  style={{ ...styles.smallBtn, background: "#C55E30", color: "#fff", padding: "4px 10px" }}
                  onClick={() => onSettle({ fromId: ME.id, toId: d.toId, amount: d.amount, expenseId: null })}
                >
                  Settle
                </button>
              </div>
            );
          })}
        </div>
      )}

      {owedToMe.length > 0 && (
        <div>
          {owedToMe.map((d) => {
            const from = getRoommate(d.fromId);
            return (
              <div key={d.fromId} style={{
                display: "flex", alignItems: "center", gap: 8,
                marginBottom: 6, background: "rgba(255,255,255,0.06)",
                borderRadius: 8, padding: "8px 10px",
              }}>
                <Avatar roommate={from} size={28} />
                <div style={{ flex: 1, fontSize: 13 }}>
                  <span style={{ color: "#A8D5C2" }}>{from.name} → You</span>
                </div>
                <span style={{ color: "#7EC8A8", fontWeight: 700 }}>${fmt(d.amount)}</span>
                <span style={{ fontSize: 11, color: "#6CA090" }}>awaiting</span>
              </div>
            );
          })}
        </div>
      )}

      {myDebts.length === 0 && owedToMe.length === 0 && (
        <p style={{ color: "#8B6B50", fontSize: 13, textAlign: "center" }}>
          All settled up! 🎉
        </p>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ExpensePage() {
  const [expenses, setExpenses] = useState(INITIAL_EXPENSES);
  const [showLog, setShowLog] = useState(false);
  const [settleTarget, setSettleTarget] = useState(null);
  const [flagTarget, setFlagTarget] = useState(null);
  const [filter, setFilter] = useState("all"); // all | active | settled | flagged

  function addExpense(exp) {
    setExpenses((prev) => [exp, ...prev]);
  }

  function flagExpense(id, note) {
    setExpenses((prev) =>
      prev.map((e) =>
        e.id === id
          ? { ...e, flagged: true, flagNote: note, flaggedBy: ME.id, status: "flagged" }
          : e
      )
    );
  }

  function unflagExpense(id) {
    setExpenses((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, flagged: false, flagNote: "", flaggedBy: null, status: "active" } : e
      )
    );
  }

  function handleSettle(debt) {
    setSettleTarget(debt);
  }

  function confirmSettle({ method, amount }) {
    if (!settleTarget) return;
    const { fromId, toId, expenseId } = settleTarget;
    const settlement = {
      id: "s" + Date.now(),
      fromId,
      toId,
      amount,
      method,
      date: new Date().toISOString().slice(0, 10),
      status: toId === ME.id ? "confirmed" : "pending",
      confirmedBy: toId === ME.id ? ME.id : null,
    };

    if (expenseId) {
      setExpenses((prev) =>
        prev.map((e) =>
          e.id === expenseId
            ? { ...e, settlements: [...e.settlements, settlement] }
            : e
        )
      );
    } else {
      // General balance settlement — find all relevant expenses
      setExpenses((prev) =>
        prev.map((e) => {
          if (e.paidBy !== toId || !e.splitBetween.includes(fromId)) return e;
          return { ...e, settlements: [...e.settlements, { ...settlement, id: "s" + Date.now() + e.id }] };
        })
      );
    }
    setSettleTarget(null);
  }

  function confirmSettlement(expenseId, settlementId) {
    setExpenses((prev) =>
      prev.map((e) =>
        e.id === expenseId
          ? {
              ...e,
              settlements: e.settlements.map((s) =>
                s.id === settlementId ? { ...s, status: "confirmed", confirmedBy: ME.id } : s
              ),
            }
          : e
      )
    );
  }

  const filtered = expenses.filter((e) => {
    if (filter === "all") return true;
    if (filter === "active") return !e.flagged && e.status !== "settled";
    if (filter === "settled") return e.status === "settled";
    if (filter === "flagged") return e.flagged;
    return true;
  });

  const flaggedCount = expenses.filter((e) => e.flagged).length;

  return (
    <div style={styles.page}>
      {/* Decorative blob */}
      <div style={styles.blob} />

      <div style={styles.container}>
        {/* Page header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div>
              <p style={styles.eyebrow}>The Watershed · Apt 4B</p>
              <h1 style={styles.pageTitle}>Debt Log</h1>
            </div>
            <button style={styles.primaryBtn} onClick={() => setShowLog(true)}>
              + Log Expense
            </button>
          </div>
          {flaggedCount > 0 && (
            <div style={{
              marginTop: 12,
              padding: "8px 14px",
              background: "#FFF3E8",
              border: "1px solid #F5C49A",
              borderRadius: 10,
              fontSize: 13,
              color: "#7A4010",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}>
              ⚑ {flaggedCount} expense{flaggedCount > 1 ? "s" : ""} flagged — balances paused until resolved
            </div>
          )}
        </div>

        {/* Two-column layout */}
        <div style={styles.twoCol}>
          {/* Left: balance summary */}
          <div style={{ position: "sticky", top: 20, alignSelf: "start" }}>
            <BalanceSummary expenses={expenses} onSettle={handleSettle} />

            {/* Roommate summary */}
            <div style={{ ...styles.card, marginTop: 16 }}>
              <h3 style={{ ...styles.sectionTitle, marginBottom: 12 }}>House Balances</h3>
              {ROOMMATES.filter((r) => r.id !== ME.id).map((r) => {
                const balances = calcBalances(expenses);
                const iOwe = balances[`${ME.id}→${r.id}`] || 0;
                const theyOwe = balances[`${r.id}→${ME.id}`] || 0;
                const net = theyOwe - iOwe;
                return (
                  <div key={r.id} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "8px 0",
                    borderBottom: "1px solid #EDE0D0",
                  }}>
                    <Avatar roommate={r} size={30} />
                    <span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{r.name}</span>
                    <span style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: net > 0.005 ? "#4A7A6A" : net < -0.005 ? "#C55E30" : "#8B7355",
                    }}>
                      {Math.abs(net) < 0.005
                        ? "Even"
                        : net > 0
                        ? `+$${fmt(net)}`
                        : `-$${fmt(Math.abs(net))}`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: expense list */}
          <div>
            {/* Filter tabs */}
            <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
              {[
                { key: "all", label: "All" },
                { key: "active", label: "Active" },
                { key: "settled", label: "Settled" },
                { key: "flagged", label: `Flagged${flaggedCount ? ` · ${flaggedCount}` : ""}` },
              ].map((t) => (
                <button
                  key={t.key}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 100,
                    border: "1px solid",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.15s",
                    background: filter === t.key ? "#C55E30" : "#F5EDE0",
                    color: filter === t.key ? "#fff" : "#8B7355",
                    borderColor: filter === t.key ? "#C55E30" : "#E0D4C4",
                  }}
                  onClick={() => setFilter(t.key)}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {filtered.length === 0 && (
              <div style={{ ...styles.card, textAlign: "center", color: "#8B7355", padding: "40px 20px" }}>
                <p style={{ fontSize: 32, marginBottom: 8 }}>📭</p>
                <p style={{ fontFamily: "'Fraunces', serif", fontSize: 18 }}>Nothing here yet</p>
                <p style={{ fontSize: 13 }}>Log your first shared expense above.</p>
              </div>
            )}

            {filtered.map((exp) => (
              <ExpenseCard
                key={exp.id}
                expense={exp}
                onFlag={(id) => setFlagTarget(id)}
                onSettle={handleSettle}
                onUnflag={unflagExpense}
                onConfirmSettlement={confirmSettlement}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showLog && <LogExpenseModal onClose={() => setShowLog(false)} onAdd={addExpense} />}
      {settleTarget && (
        <SettleModal
          debt={settleTarget}
          onClose={() => setSettleTarget(null)}
          onSettle={confirmSettle}
        />
      )}
      {flagTarget && (
        <FlagModal
          expense={expenses.find((e) => e.id === flagTarget)}
          onClose={() => setFlagTarget(null)}
          onFlag={(note) => flagExpense(flagTarget, note)}
        />
      )}
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = {
  page: {
    minHeight: "100vh",
    background: "#F5EDE0",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    position: "relative",
    overflow: "hidden",
  },
  blob: {
    position: "fixed",
    top: -200,
    right: -200,
    width: 600,
    height: 600,
    borderRadius: "50%",
    background: "radial-gradient(circle, #C55E3018 0%, transparent 70%)",
    pointerEvents: "none",
    zIndex: 0,
  },
  container: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "40px 24px",
    position: "relative",
    zIndex: 1,
  },
  twoCol: {
    display: "grid",
    gridTemplateColumns: "300px 1fr",
    gap: 24,
    alignItems: "start",
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: 700,
    color: "#4A7A6A",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    margin: 0,
    marginBottom: 4,
  },
  pageTitle: {
    fontFamily: "'Fraunces', serif",
    fontSize: 36,
    fontWeight: 700,
    color: "#2D1A0E",
    margin: 0,
  },
  sectionTitle: {
    fontFamily: "'Fraunces', serif",
    fontSize: 16,
    fontWeight: 600,
    color: "#2D1A0E",
    margin: 0,
  },
  card: {
    background: "#FFFAF5",
    border: "1px solid #EDE0D0",
    borderRadius: 16,
    padding: "16px",
    marginBottom: 12,
    boxShadow: "0 2px 8px rgba(45,26,14,0.06)",
  },
  primaryBtn: {
    background: "#C55E30",
    color: "#fff",
    border: "none",
    borderRadius: 100,
    padding: "12px 24px",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    letterSpacing: "0.02em",
  },
  smallBtn: {
    background: "#F5EDE0",
    color: "#C55E30",
    border: "1px solid #E0C4AE",
    borderRadius: 100,
    padding: "4px 12px",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
  },
  ghostBtn: {
    background: "transparent",
    color: "#8B7355",
    border: "1px solid #E0D4C4",
    borderRadius: 100,
    padding: "5px 12px",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(45,26,14,0.5)",
    backdropFilter: "blur(4px)",
    zIndex: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  modal: {
    background: "#FFFAF5",
    borderRadius: 20,
    padding: "28px 24px",
    width: "100%",
    maxWidth: 480,
    maxHeight: "90vh",
    overflowY: "auto",
    boxShadow: "0 24px 60px rgba(45,26,14,0.25)",
    border: "1px solid #EDE0D0",
  },
  modalHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  modalTitle: {
    fontFamily: "'Fraunces', serif",
    fontSize: 22,
    fontWeight: 700,
    color: "#2D1A0E",
    margin: 0,
  },
  closeBtn: {
    background: "#F5EDE0",
    border: "none",
    borderRadius: "50%",
    width: 32,
    height: 32,
    fontSize: 14,
    cursor: "pointer",
    color: "#8B7355",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  field: {
    marginBottom: 18,
  },
  label: {
    display: "block",
    fontSize: 12,
    fontWeight: 700,
    color: "#8B7355",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    marginBottom: 8,
  },
  input: {
    width: "100%",
    padding: "10px 14px",
    background: "#F5EDE0",
    border: "1px solid #E0D4C4",
    borderRadius: 10,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 14,
    color: "#2D1A0E",
    outline: "none",
    boxSizing: "border-box",
  },
  toggleChip: {
    padding: "6px 14px",
    borderRadius: 100,
    border: "1px solid",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.12s",
  },
};
