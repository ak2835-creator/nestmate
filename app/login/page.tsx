"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen bg-nm-cream flex flex-col">
      <div className="flex items-center gap-3 px-5 py-5">
        <Link href="/" className="text-nm-muted text-xl leading-none">←</Link>
        <span className="font-serif text-lg text-nm-terra italic">NestMate</span>
      </div>

      <div className="flex-1 px-6 py-2">
        <h1 className="font-serif text-[1.5rem] font-normal text-nm-ink mb-1">Welcome back</h1>
        <p className="text-[13px] text-nm-muted mb-8 leading-relaxed">Log in to your house.</p>

        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-medium text-nm-muted uppercase tracking-[0.07em] mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@cornell.edu"
              className="w-full bg-nm-white rounded-lg px-4 py-3 text-[15px] text-nm-ink placeholder:text-nm-muted/40 outline-none transition-colors"
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
              className="w-full bg-nm-white rounded-lg px-4 py-3 text-[15px] text-nm-ink placeholder:text-nm-muted/40 outline-none transition-colors"
              style={{ border: "1px solid rgba(44,36,22,0.12)" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#C4714A")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(44,36,22,0.12)")}
            />
          </div>
        </div>
      </div>

      <div className="px-6 pb-10 space-y-3">
        <button
          onClick={() => router.push("/house/demo")}
          className="w-full py-3.5 bg-nm-terra text-white rounded-xl font-medium text-[15px] hover:bg-nm-terra-dark transition-colors"
        >
          Log in
        </button>
        <button
          onClick={() => router.push("/house/demo")}
          className="w-full py-3.5 rounded-xl font-medium text-[15px] transition-colors"
          style={{ border: "1px solid rgba(44,36,22,0.15)", color: "#7A7165", background: "transparent" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#F5F0E8")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          → Jump to demo house
        </button>
        <div className="text-center">
          <Link
            href="/onboarding/create"
            className="text-[13px] text-nm-muted underline underline-offset-2"
          >
            No account? Create a house instead
          </Link>
        </div>
      </div>
    </div>
  );
}
