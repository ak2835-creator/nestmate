"use client";

import { useEffect, useState } from "react";

interface Expense {
  id: number;
  desc: string;
  paidBy: string;
  split: string;
  amount: number;
  flagged?: boolean;
  settled?: boolean;
  note?: string;
}

const INITIAL_EXPENSES: Expense[] = [
  { id: 1, desc: "Dish soap + sponges", paidBy: "Jordan", split: "split 3 ways", amount: -3.67 },
  { id: 2, desc: "Laundry detergent", paidBy: "You", split: "split 3 ways", amount: 14.0 },
  { id: 3, desc: "Internet deposit", paidBy: "Priya", split: "split 3 ways", amount: -33.33 },
  { id: 4, desc: "Paper towels", paidBy: "Jordan", split: "split 3 ways", amount: -4.17 },
  { id: 5, desc: "Dish rack", paidBy: "You", split: "split 3 ways", amount: 8.0 },
];

function AddExpenseModal({
  userName,
  onClose,
  onAdd,
}: {
  userName: string;
  onClose: () => void;
  onAdd: (e: Expense) => void;
}) {
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState(userName);
  const [split, setSplit] = useState("split 3 ways");

  const isCredit = paidBy === userName;
  const parsedAmount = parseFloat(amount) || 0;
  const perPerson = split === "split 3 ways" ? parsedAmount / 3 : split === "split 2 ways" ? parsedAmount / 2 : parsedAmount;

  function handleAdd() {
    if (!desc.trim() || !amount || parsedAmount <= 0) return;
    const finalAmount = isCredit ? perPerson * (split === "split 3 ways" ? 2 : 1) : -perPerson;
    onAdd({ id: Date.now(), desc: desc.trim(), paidBy, split, amount: isCredit ? parseFloat(amount) - perPerson : finalAmount });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end" style={{ background: "rgba(44,36,22,0.4)" }}>
      <div
        className="w-full bg-nm-cream rounded-t-3xl"
        style={{ border: "1px solid rgba(44,36,22,0.1)" }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full" style={{ background: "rgba(44,36,22,0.15)" }} />
        </div>

        <div className="px-6 pb-2 pt-2 flex items-center justify-between">
          <h2 className="font-serif text-[1.25rem] text-nm-ink">Log an expense</h2>
          <button onClick={onClose} className="text-nm-muted text-2xl leading-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-nm-sand transition-colors">×</button>
        </div>

        <div className="px-6 pb-8 space-y-4">
          {/* Description */}
          <div>
            <label className="block text-[12px] font-medium text-nm-muted uppercase tracking-[0.07em] mb-2">
              What was it?
            </label>
            <input
              type="text"
              autoFocus
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              placeholder="e.g. dish soap, toilet paper, wifi bill…"
              className="w-full bg-nm-white rounded-xl px-4 py-3.5 text-[16px] text-nm-ink placeholder:text-nm-muted/40 outline-none"
              style={{ border: "1px solid rgba(44,36,22,0.12)" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#C4714A")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(44,36,22,0.12)")}
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-[12px] font-medium text-nm-muted uppercase tracking-[0.07em] mb-2">
              Total amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[18px] font-medium text-nm-muted">$</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="w-full bg-nm-white rounded-xl pl-9 pr-4 py-3.5 text-[18px] font-medium text-nm-ink placeholder:text-nm-muted/40 outline-none"
                style={{ border: "1px solid rgba(44,36,22,0.12)" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#C4714A")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(44,36,22,0.12)")}
              />
            </div>
          </div>

          {/* Who paid */}
          <div>
            <label className="block text-[12px] font-medium text-nm-muted uppercase tracking-[0.07em] mb-2">
              Who paid?
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[userName, "Jordan", "Priya"].map((p) => (
                <button
                  key={p}
                  onClick={() => setPaidBy(p)}
                  className="py-3 rounded-xl text-[14px] transition-all"
                  style={
                    paidBy === p
                      ? { background: "#F0DDD3", border: "1.5px solid #C4714A", color: "#8B4A2E", fontWeight: "500" }
                      : { background: "#FFFDFB", border: "1px solid rgba(44,36,22,0.12)", color: "#2C2416" }
                  }
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Split */}
          <div>
            <label className="block text-[12px] font-medium text-nm-muted uppercase tracking-[0.07em] mb-2">
              Split
            </label>
            <div className="grid grid-cols-3 gap-2">
              {["split 2 ways", "split 3 ways", "just me"].map((s) => (
                <button
                  key={s}
                  onClick={() => setSplit(s)}
                  className="py-3 rounded-xl text-[13px] transition-all"
                  style={
                    split === s
                      ? { background: "#F0DDD3", border: "1.5px solid #C4714A", color: "#8B4A2E", fontWeight: "500" }
                      : { background: "#FFFDFB", border: "1px solid rgba(44,36,22,0.12)", color: "#2C2416" }
                  }
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          {parsedAmount > 0 && (
            <div className="rounded-xl p-3.5" style={{ background: "#F5F0E8" }}>
              <p className="text-[13px] text-nm-muted">
                {isCredit
                  ? `${userName} paid $${parsedAmount.toFixed(2)}. Each of the other ${split === "split 3 ways" ? "2 people owes" : "person owes"} you $${perPerson.toFixed(2)}.`
                  : `${paidBy} paid. You owe $${Math.abs(perPerson).toFixed(2)}.`}
              </p>
            </div>
          )}

          <button
            onClick={handleAdd}
            disabled={!desc.trim() || !amount || parsedAmount <= 0}
            className="w-full py-4 text-white rounded-xl font-medium text-[16px] transition-all"
            style={{
              background: desc.trim() && parsedAmount > 0 ? "#C4714A" : "rgba(196,113,74,0.4)",
              cursor: desc.trim() && parsedAmount > 0 ? "pointer" : "not-allowed",
            }}
          >
            Log expense
          </button>
        </div>
      </div>
    </div>
  );
}

function ExpenseCard({
  expense,
  onFlag,
  onSettle,
}: {
  expense: Expense;
  onFlag: (id: number) => void;
  onSettle: (id: number) => void;
}) {
  const isCredit = expense.amount > 0;

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all"
      style={{
        background: "#FFFDFB",
        border: "1px solid rgba(44,36,22,0.08)",
        opacity: expense.settled ? 0.55 : 1,
      }}
    >
      {/* Main row */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[16px] font-medium text-nm-ink">{expense.desc}</span>
              {expense.flagged && !expense.settled && (
                <span
                  className="text-[11px] px-2 py-0.5 rounded-full font-medium"
                  style={{ background: "#FEF3C0", color: "#92620D" }}
                >
                  flagged
                </span>
              )}
              {expense.settled && (
                <span
                  className="text-[11px] px-2 py-0.5 rounded-full font-medium"
                  style={{ background: "#D8EBE0", color: "#4A7C5F" }}
                >
                  settled
                </span>
              )}
            </div>
            <div className="text-[13px] text-nm-muted mt-1">
              {expense.paidBy} paid · {expense.split}
            </div>
          </div>

          {/* Amount block */}
          <div className="text-right flex-shrink-0">
            <div
              className="font-serif text-[1.35rem] leading-none"
              style={{ color: isCredit ? "#4A7C5F" : "#C4714A" }}
            >
              {isCredit ? "+" : "−"}${Math.abs(expense.amount).toFixed(2)}
            </div>
            <div
              className="text-[11px] mt-1"
              style={{ color: isCredit ? "#4A7C5F" : "#C4714A" }}
            >
              {isCredit ? "owed to you" : "you owe"}
            </div>
          </div>
        </div>
      </div>

      {/* Action row */}
      {!expense.settled && (
        <div
          className="grid grid-cols-2"
          style={{ borderTop: "1px solid rgba(44,36,22,0.06)" }}
        >
          <button
            onClick={() => onFlag(expense.id)}
            className="py-3.5 text-[14px] font-medium transition-colors flex items-center justify-center gap-2 hover:bg-nm-sand"
            style={{
              color: expense.flagged ? "#92620D" : "#7A7165",
              background: expense.flagged ? "#FEF3C0" : "transparent",
              borderRight: "1px solid rgba(44,36,22,0.06)",
            }}
          >
            <span>{expense.flagged ? "⚑" : "⚐"}</span>
            {expense.flagged ? "Flagged" : "Flag"}
          </button>
          {isCredit ? (
            <div className="py-3.5 text-[13px] text-nm-muted flex items-center justify-center">
              waiting…
            </div>
          ) : (
            <button
              onClick={() => onSettle(expense.id)}
              className="py-3.5 text-[14px] font-medium transition-colors flex items-center justify-center gap-2 hover:bg-nm-green-light"
              style={{ color: "#4A7C5F" }}
            >
              <span>✓</span> Mark settled
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>(INITIAL_EXPENSES);
  const [showModal, setShowModal] = useState(false);
  const [userName, setUserName] = useState("Aya");

  useEffect(() => {
    const stored = localStorage.getItem("nm_user_name") || "Aya";
    setUserName(stored);
    if (stored !== "Aya") {
      setExpenses((prev) =>
        prev.map((e) => (e.paidBy === "You" ? { ...e, paidBy: stored } : e))
      );
    }
  }, []);

  const active = expenses.filter((e) => !e.settled);
  const settled = expenses.filter((e) => e.settled);

  const totalOwe = active
    .filter((e) => e.amount < 0)
    .reduce((sum, e) => sum + Math.abs(e.amount), 0);
  const totalOwed = active
    .filter((e) => e.amount > 0)
    .reduce((sum, e) => sum + e.amount, 0);
  const net = totalOwed - totalOwe;

  function addExpense(e: Expense) {
    setExpenses((prev) => [e, ...prev]);
  }

  function toggleFlag(id: number) {
    setExpenses((prev) => prev.map((e) => (e.id === id ? { ...e, flagged: !e.flagged } : e)));
  }

  function settle(id: number) {
    setExpenses((prev) => prev.map((e) => (e.id === id ? { ...e, settled: true } : e)));
  }

  return (
    <div className="p-4 pb-24 space-y-4">
      {/* Balance overview */}
      <div
        className="rounded-2xl p-5"
        style={{ background: "#FFFDFB", border: "1px solid rgba(44,36,22,0.08)" }}
      >
        <div className="text-[11px] font-medium text-nm-muted uppercase tracking-[0.07em] mb-4">
          Your balance
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div
            className="rounded-xl p-4 text-center"
            style={{ background: totalOwe > 0 ? "#FFF5F1" : "#F5F0E8" }}
          >
            <div className="font-serif text-[1.75rem]" style={{ color: "#C4714A" }}>
              ${totalOwe.toFixed(2)}
            </div>
            <div className="text-[12px] text-nm-muted mt-1">you owe</div>
          </div>
          <div
            className="rounded-xl p-4 text-center"
            style={{ background: totalOwed > 0 ? "#F0FAF5" : "#F5F0E8" }}
          >
            <div className="font-serif text-[1.75rem]" style={{ color: "#4A7C5F" }}>
              ${totalOwed.toFixed(2)}
            </div>
            <div className="text-[12px] text-nm-muted mt-1">owed to you</div>
          </div>
        </div>
        {/* Net line */}
        <div
          className="rounded-lg px-4 py-2.5 flex items-center justify-between"
          style={{ background: "#F5F0E8" }}
        >
          <span className="text-[13px] text-nm-muted">Net position</span>
          <span
            className="text-[14px] font-medium"
            style={{ color: net >= 0 ? "#4A7C5F" : "#C4714A" }}
          >
            {net >= 0 ? "+" : "−"}${Math.abs(net).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Add expense CTA */}
      <button
        onClick={() => setShowModal(true)}
        className="w-full py-4 rounded-xl font-medium text-[16px] transition-colors flex items-center justify-center gap-2"
        style={{ background: "#C4714A", color: "white" }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#8B4A2E")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "#C4714A")}
      >
        <span className="text-xl leading-none">+</span> Log an expense
      </button>

      {/* Active expenses */}
      {active.length > 0 && (
        <div className="space-y-2.5">
          <div className="text-[11px] font-medium text-nm-muted uppercase tracking-[0.07em] px-1">
            Outstanding
          </div>
          {active.map((expense) => (
            <ExpenseCard
              key={expense.id}
              expense={expense}
              onFlag={toggleFlag}
              onSettle={settle}
            />
          ))}
        </div>
      )}

      {/* Settled */}
      {settled.length > 0 && (
        <div className="space-y-2.5">
          <div className="text-[11px] font-medium text-nm-muted uppercase tracking-[0.07em] px-1">
            Settled
          </div>
          {settled.map((expense) => (
            <ExpenseCard
              key={expense.id}
              expense={expense}
              onFlag={toggleFlag}
              onSettle={settle}
            />
          ))}
        </div>
      )}

      {active.length === 0 && (
        <div className="text-center py-8">
          <div className="text-3xl mb-2">🎉</div>
          <p className="text-[15px] font-medium text-nm-ink">All settled up</p>
          <p className="text-[13px] text-nm-muted mt-1">No outstanding balances in the house.</p>
        </div>
      )}

      <p className="text-center text-[12px] text-nm-muted pb-2">
        NestMate tracks balances. Settle via Venmo, cash, or however — then mark it done.
      </p>

      {showModal && (
        <AddExpenseModal userName={userName} onClose={() => setShowModal(false)} onAdd={addExpense} />
      )}
    </div>
  );
}
