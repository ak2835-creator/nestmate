"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const MOCK_HOUSE = {
  name: "312 Linden",
  members: [
    { initials: "AY", name: "Aya", bg: "#F0DDD3", color: "#8B4A2E" },
    { initials: "JD", name: "Jordan", bg: "#D8EBE0", color: "#4A7C5F" },
  ],
};

export default function JoinPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const canJoin = name.trim().length > 0 && email.trim().length > 0 && password.trim().length > 0;

  return (
    <div className="min-h-screen bg-nm-cream flex flex-col">
      <div className="flex items-center gap-3 px-5 py-5">
        <Link href="/" className="text-nm-muted text-xl leading-none">←</Link>
        <span className="font-serif text-lg text-nm-terra italic">NestMate</span>
      </div>

      <div className="flex-1 px-6 py-2">
        <h1 className="font-serif text-[1.5rem] font-normal text-nm-ink mb-1">Join a house</h1>
        <p className="text-[13px] text-nm-muted mb-7 leading-relaxed">
          Your roommate should have sent you a link — paste it below, or enter the house code.
        </p>

        {/* Invite code */}
        <div className="mb-5">
          <label className="block text-[11px] font-medium text-nm-muted uppercase tracking-[0.07em] mb-1.5">
            Invite link or code
          </label>
          <input
            type="text"
            autoFocus
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="nestmate.app/join/xxxxxx"
            className="w-full bg-nm-white rounded-lg px-4 py-3 text-[15px] text-nm-ink placeholder:text-nm-muted/40 outline-none font-mono"
            style={{ border: "1px solid rgba(44,36,22,0.12)" }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#C4714A")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(44,36,22,0.12)")}
          />
        </div>

        {/* Mock house preview */}
        <div className="mb-5 p-4 rounded-xl bg-nm-white" style={{ border: "1px solid rgba(44,36,22,0.12)" }}>
          <div className="text-[11px] font-medium text-nm-muted uppercase tracking-[0.07em] mb-2">Joining</div>
          <div className="font-serif text-[17px] text-nm-ink mb-3">{MOCK_HOUSE.name}</div>
          <div className="flex gap-2">
            {MOCK_HOUSE.members.map((m) => (
              <div key={m.initials} className="flex items-center gap-1.5">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold"
                  style={{ background: m.bg, color: m.color }}
                >
                  {m.initials}
                </div>
                <span className="text-[12px] text-nm-muted">{m.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px" style={{ background: "rgba(44,36,22,0.1)" }} />
          <span className="text-[11px] text-nm-muted">then create your account</span>
          <div className="flex-1 h-px" style={{ background: "rgba(44,36,22,0.1)" }} />
        </div>

        {/* Account fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-medium text-nm-muted uppercase tracking-[0.07em] mb-1.5">
              Your name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Priya"
              className="w-full bg-nm-white rounded-lg px-4 py-3 text-[15px] text-nm-ink placeholder:text-nm-muted/40 outline-none"
              style={{ border: "1px solid rgba(44,36,22,0.12)" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#C4714A")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(44,36,22,0.12)")}
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-nm-muted uppercase tracking-[0.07em] mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@cornell.edu"
              className="w-full bg-nm-white rounded-lg px-4 py-3 text-[15px] text-nm-ink placeholder:text-nm-muted/40 outline-none"
              style={{ border: "1px solid rgba(44,36,22,0.12)" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#C4714A")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(44,36,22,0.12)")}
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-nm-muted uppercase tracking-[0.07em] mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-nm-white rounded-lg px-4 py-3 text-[15px] text-nm-ink placeholder:text-nm-muted/40 outline-none"
              style={{ border: "1px solid rgba(44,36,22,0.12)" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#C4714A")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(44,36,22,0.12)")}
            />
          </div>
        </div>
      </div>

      <div className="px-6 pb-10 pt-4">
        <button
          onClick={() => router.push("/onboarding/agreement")}
          disabled={!canJoin}
          className="w-full py-3.5 bg-nm-terra text-white rounded-xl font-medium text-[15px] hover:bg-nm-terra-dark transition-colors disabled:opacity-40"
        >
          Join {MOCK_HOUSE.name}
        </button>
      </div>
    </div>
  );
}
