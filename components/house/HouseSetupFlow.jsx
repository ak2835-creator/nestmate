/**
 * NestMate — House Creation & Invite Link Flow
 *
 * FONT SETUP (one-time, in layout.jsx):
 *   import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
 *   const serif = Fraunces({ subsets: ["latin"], variable: "--font-serif" });
 *   const sans  = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-sans" });
 *   // Add variables to <html> className
 *
 * TAILWIND CONFIG (tailwind.config.js):
 *   theme: { extend: { fontFamily: { serif: ["var(--font-serif)"], sans: ["var(--font-sans)"] } } }
 *
 * SUPABASE SWAP-INS:
 *   Search for "// SUPABASE:" comments — each marks a mock that becomes a real call.
 *
 * ROUTING:
 *   - /house/create          → render with initialScreen="welcome"
 *   - /join/[code]           → render with initialScreen="invite-landing", pass inviteCode prop
 */

"use client";

import { useState, useCallback } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────

const BRAND_TERRA  = "#C55E30";
const BRAND_TERRA2 = "#B04E25";
const BRAND_SAGE   = "#4A7A6A";
const BRAND_SAGE2  = "#3D6559";
const BG_CREAM     = "#F5EDE0";

// SUPABASE: Replace with dynamic URL built from your house's invite code
const MOCK_INVITE_URL = "nestmate.app/join/loft-7x9k2";

// ─── Shared primitives ────────────────────────────────────────────────────────

function Logo() {
  return (
    <span className="font-serif text-xl font-semibold tracking-tight text-stone-900">
      Nest<span style={{ color: BRAND_TERRA }}>Mate</span>
    </span>
  );
}

const AVATAR_COLORS = {
  terra: { bg: "#F0D4C4", text: BRAND_TERRA },
  sage:  { bg: "#C4D9D3", text: BRAND_SAGE  },
  stone: { bg: "#E7E3DE", text: "#6B6560"   },
};

function Avatar({ initials, color = "terra", size = "md" }) {
  const { bg, text } = AVATAR_COLORS[color] || AVATAR_COLORS.terra;
  const dim = size === "lg" ? "48px" : "36px";
  const fs  = size === "lg" ? "15px" : "13px";
  return (
    <div
      style={{ width: dim, height: dim, minWidth: dim, backgroundColor: bg, color: text, fontSize: fs }}
      className="rounded-full flex items-center justify-center font-semibold"
    >
      {initials}
    </div>
  );
}

function MemberRow({ name, initials, isYou, color = "stone" }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-stone-50 rounded-xl">
      <Avatar initials={initials} color={color} />
      <div>
        <p className="text-sm font-medium text-stone-900">
          {name}
          {isYou && (
            <span className="ml-2 text-xs text-stone-400 font-normal">(you)</span>
          )}
        </p>
      </div>
    </div>
  );
}

function FieldLabel({ children }) {
  return (
    <label className="block text-xs font-semibold text-stone-500 uppercase tracking-widest mb-2">
      {children}
    </label>
  );
}

function TextInput({ autoFocus, placeholder, value, onChange, onEnter }) {
  return (
    <input
      autoFocus={autoFocus}
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && onEnter?.()}
      className="w-full px-4 py-3.5 bg-stone-50 border border-stone-200 rounded-xl
                 text-stone-900 text-[15px] placeholder:text-stone-300
                 outline-none transition-colors"
      style={{ "--tw-ring-color": BRAND_TERRA }}
      onFocus={(e) => (e.target.style.borderColor = BRAND_TERRA)}
      onBlur={(e)  => (e.target.style.borderColor = "")}
    />
  );
}

function PrimaryButton({ children, onClick, color = "terra", fullWidth = true }) {
  const bg  = color === "sage" ? BRAND_SAGE  : BRAND_TERRA;
  const bg2 = color === "sage" ? BRAND_SAGE2 : BRAND_TERRA2;
  return (
    <button
      onClick={onClick}
      className={`${fullWidth ? "w-full" : ""} py-3.5 text-white rounded-2xl font-medium text-[15px] transition-colors`}
      style={{ backgroundColor: bg }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = bg2)}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = bg)}
    >
      {children}
    </button>
  );
}

function GhostButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="mt-3 w-full py-2.5 text-sm text-stone-400 hover:text-stone-700 transition-colors"
    >
      {children}
    </button>
  );
}

function Divider({ label = "or" }) {
  return (
    <div className="flex items-center gap-3 my-4">
      <div className="flex-1 h-px bg-stone-100" />
      <span className="text-xs text-stone-400">{label}</span>
      <div className="flex-1 h-px bg-stone-100" />
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <p className="text-xs font-semibold text-stone-500 uppercase tracking-widest mb-3">
      {children}
    </p>
  );
}

function StepDots({ total, current }) {
  return (
    <div className="flex gap-1.5 mt-8 mb-6">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="h-1 rounded-full transition-all duration-300"
          style={{
            width:           i === current - 1 ? "24px" : "8px",
            backgroundColor: i < current       ? BRAND_TERRA : "#E7E3DE",
          }}
        />
      ))}
    </div>
  );
}

// ─── Screen: Welcome ─────────────────────────────────────────────────────────

function WelcomeScreen({ onCreateHouse, onHaveInviteLink }) {
  return (
    <>
      <Logo />
      <h1 className="mt-8 font-serif text-[2rem] font-semibold text-stone-900 leading-[1.15]">
        Your house,<br />one place.
      </h1>
      <p className="mt-3 text-stone-500 text-[15px] leading-relaxed">
        Chores, expenses, and communication — without the awkwardness.
      </p>
      <div className="mt-8">
        <PrimaryButton onClick={onCreateHouse}>Create a house</PrimaryButton>
        <Divider />
        <button
          onClick={onHaveInviteLink}
          className="w-full py-3 text-[15px] text-stone-500 hover:text-stone-900 transition-colors"
        >
          I have an invite link →
        </button>
      </div>
    </>
  );
}

// ─── Screen: Create House (2-step) ───────────────────────────────────────────

function CreateHouseScreen({ onBack, onComplete }) {
  const [step,      setStep]      = useState(1);
  const [houseName, setHouseName] = useState("");
  const [yourName,  setYourName]  = useState("");

  const advance = () => {
    if (step === 1 && houseName.trim()) {
      setStep(2);
      return;
    }
    if (step === 2 && yourName.trim()) {
      const initials = yourName
        .trim()
        .split(" ")
        .filter(Boolean)
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
      // SUPABASE: supabase.from("houses").insert({ name: houseName })
      //           then supabase.from("members").insert({ house_id, name: yourName, initials })
      onComplete({ houseName: houseName.trim(), yourName: yourName.trim(), initials });
    }
  };

  return (
    <>
      <Logo />
      <StepDots total={2} current={step} />
      {step === 1 ? (
        <>
          <h2 className="font-serif text-2xl font-semibold text-stone-900 leading-snug">
            What's your house called?
          </h2>
          <p className="mt-2 text-stone-500 text-[15px]">
            Give it a name your roommates will recognise.
          </p>
          <div className="mt-6">
            <FieldLabel>House name</FieldLabel>
            <TextInput
              autoFocus
              placeholder="e.g. The Loft on Eddy"
              value={houseName}
              onChange={setHouseName}
              onEnter={advance}
            />
          </div>
        </>
      ) : (
        <>
          <h2 className="font-serif text-2xl font-semibold text-stone-900 leading-snug">
            And you are?
          </h2>
          <p className="mt-2 text-stone-500 text-[15px]">
            This is how your roommates will see you.
          </p>
          <div className="mt-6">
            <FieldLabel>Your name</FieldLabel>
            <TextInput
              autoFocus
              placeholder="e.g. Maya Chen"
              value={yourName}
              onChange={setYourName}
              onEnter={advance}
            />
          </div>
        </>
      )}
      <div className="mt-6">
        <PrimaryButton onClick={advance}>
          {step === 1 ? "Continue →" : "Create house"}
        </PrimaryButton>
        <GhostButton onClick={step === 1 ? onBack : () => setStep(1)}>
          ← Back
        </GhostButton>
      </div>
    </>
  );
}

// ─── Screen: House Dashboard (creator lands here) ────────────────────────────

function DashboardScreen({ house, onReset }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(MOCK_INVITE_URL); } catch (_) {}
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Logo />

      {/* House hero */}
      <div className="mt-8 text-center">
        <span className="text-5xl select-none" role="img" aria-label="house">🏠</span>
        <h2 className="mt-3 font-serif text-2xl font-semibold text-stone-900">{house.name}</h2>
        <span
          className="mt-2 inline-block px-3 py-1 text-xs font-semibold rounded-full"
          style={{ backgroundColor: "#F0D4C4", color: BRAND_TERRA }}
        >
          House created ✓
        </span>
      </div>

      {/* Invite link */}
      <div className="mt-8">
        <SectionLabel>Invite your roommates</SectionLabel>
        <div className="p-4 bg-stone-50 border border-dashed border-stone-200 rounded-2xl">
          <div className="flex items-center gap-3">
            <p className="flex-1 text-sm text-stone-700 font-mono break-all leading-snug">
              {MOCK_INVITE_URL}
            </p>
            <button
              onClick={handleCopy}
              className="flex-shrink-0 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
              style={{
                backgroundColor: copied ? "#C4D9D3" : BRAND_TERRA,
                color:           copied ? BRAND_SAGE : "white",
              }}
            >
              {copied ? "Copied ✓" : "Copy"}
            </button>
          </div>
          <p className="mt-2.5 text-xs text-stone-400">
            Anyone with this link can join your house.
          </p>
        </div>
      </div>

      {/* Waiting pulse */}
      <div className="mt-5 flex items-center gap-2">
        {[0, 0.15, 0.3].map((delay, i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-stone-300 animate-pulse"
            style={{ animationDelay: `${delay}s` }}
          />
        ))}
        <span className="text-sm text-stone-400 ml-1">Waiting for roommates to join…</span>
      </div>

      {/* Members */}
      <div className="mt-6">
        <SectionLabel>Members</SectionLabel>
        <div className="space-y-2">
          {house.members.map((m) => (
            <MemberRow key={m.id} {...m} />
          ))}
        </div>
      </div>
      {/* House features nav */}
    <div className="mt-6 space-y-2">
      <SectionLabel>Your house</SectionLabel>
      <PrimaryButton color="sage" onClick={() => window.location.href = "/agreement"}>
        Start House Agreement →
      </PrimaryButton>
      <div className="mt-2">
      <PrimaryButton color="terra" onClick={() => window.location.href = "/board"}>
        House Board →
      </PrimaryButton>
    </div>
    <div className="mt-2">
      <PrimaryButton color="terra" onClick={() => window.location.href = "/expenses"}>
        Debt Log →
      </PrimaryButton>
    </div>
      <PrimaryButton color="terra" onClick={() => window.location.href = "/board"}>
        House Board →
      </PrimaryButton>
      <PrimaryButton color="terra" onClick={() => window.location.href = "/expenses"}>
        Debt Log →
      </PrimaryButton>
      <PrimaryButton color="sage" onClick={() => window.location.href = "/chores"}>
          Chore Wheel →
      </PrimaryButton>

    </div>
      <button
        onClick={onReset}
        className="mt-8 w-full pt-4 text-xs text-stone-300 hover:text-stone-500 transition-colors border-t border-stone-100"
      >
        ↺ Reset demo
      </button>
    </>
  );
}

// ─── Screen: Invite Landing (joiner arrives here via link) ───────────────────

function InviteLandingScreen({ inviteCode, onBack, onJoin }) {
  const [name, setName] = useState("");

  // SUPABASE: const { data: house } = await supabase
  //             .from("houses").select("*, members(*)")
  //             .eq("invite_code", inviteCode).single();
  const mockHouse = {
    id: "house_abc",
    name: "The Loft on Eddy",
    members: [
      { id: "m1", name: "Alex M.", initials: "AM", color: "terra" },
      { id: "m2", name: "Sam K.",  initials: "SK", color: "sage"  },
    ],
  };

  const handleJoin = () => {
    if (!name.trim()) return;
    const initials = name
      .trim()
      .split(" ")
      .filter(Boolean)
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    // SUPABASE: supabase.auth.signUp({ email, password })
    //           then supabase.from("members").insert({ house_id: house.id, name, initials })
    onJoin({
      name:    name.trim(),
      initials,
      house:   mockHouse,
    });
  };

  return (
    <>
      <Logo />

      {/* House hero */}
      <div className="mt-8 text-center">
        <span className="text-5xl select-none" role="img" aria-label="house">🏠</span>
        <h2 className="mt-3 font-serif text-2xl font-semibold text-stone-900">
          {mockHouse.name}
        </h2>
        <p className="mt-1 text-stone-500 text-sm">
          {mockHouse.members.length} people already live here
        </p>
      </div>

      {/* Existing members */}
      <div className="mt-6 space-y-2">
        {mockHouse.members.map((m) => (
          <MemberRow key={m.id} {...m} />
        ))}
      </div>

      {/* Join form */}
      <div className="mt-6">
        <FieldLabel>Your name</FieldLabel>
        <TextInput
          autoFocus
          placeholder="e.g. Jordan Lee"
          value={name}
          onChange={setName}
          onEnter={handleJoin}
        />
      </div>

      <div className="mt-4">
        <PrimaryButton onClick={handleJoin}>
          Join {mockHouse.name}
        </PrimaryButton>
        <GhostButton onClick={onBack}>← Back</GhostButton>
      </div>
    </>
  );
}

// ─── Screen: Joined Dashboard ────────────────────────────────────────────────

function JoinedScreen({ house, onReset }) {
  const COLORS = ["sage", "stone", "terra", "sage", "stone"];

  return (
    <>
      <Logo />

      {/* Success banner */}
      <div
        className="mt-8 flex items-center gap-3 px-4 py-4 rounded-2xl text-white"
        style={{ backgroundColor: BRAND_SAGE }}
      >
        <span className="text-2xl select-none" role="img" aria-label="party">🎉</span>
        <div>
          <p className="font-medium text-sm">You're in!</p>
          <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.75)" }}>
            Welcome to {house.name}.
          </p>
        </div>
      </div>

      {/* All members */}
      <div className="mt-6">
        <SectionLabel>Your housemates</SectionLabel>
        <div className="space-y-2">
          {house.members.map((m, i) => (
            <MemberRow
              key={m.id}
              {...m}
              color={m.isYou ? "terra" : COLORS[i % COLORS.length]}
            />
          ))}
        </div>
      </div>

      {/* Next step CTA */}
      <p className="mt-6 text-sm text-stone-500 text-center">
        Next up: set up your House Agreement together.
      </p>
      <div className="mt-3">
        {/* SUPABASE: href={`/house/${house.id}/agreement`} */}
        <PrimaryButton color="sage" onClick={() => window.location.href = "/agreement"}>
          Start House Agreement →
        </PrimaryButton>
      </div>

      <button
        onClick={onReset}
        className="mt-8 w-full pt-4 text-xs text-stone-300 hover:text-stone-500 transition-colors border-t border-stone-100"
      >
        ↺ Reset demo
      </button>
    </>
  );
}

// ─── Root Flow ────────────────────────────────────────────────────────────────

/**
 * HouseSetupFlow
 *
 * Props:
 *   initialScreen  "welcome" | "invite-landing"
 *   inviteCode     string  (required when initialScreen === "invite-landing")
 *
 * Usage (create house):
 *   <HouseSetupFlow />
 *
 * Usage (join via invite link, in /join/[code]/page.jsx):
 *   <HouseSetupFlow initialScreen="invite-landing" inviteCode={params.code} />
 */
export default function HouseSetupFlow({
  initialScreen = "welcome",
  inviteCode    = null,
}) {
  const [screen,  setScreen]  = useState(initialScreen);
  const [visible, setVisible] = useState(true);
  const [house,   setHouse]   = useState(null);

  const nav = useCallback((to) => {
    setVisible(false);
    setTimeout(() => {
      setScreen(to);
      setVisible(true);
    }, 180);
  }, []);

  const reset = () => {
    setHouse(null);
    nav("welcome");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: BG_CREAM }}
    >
      <div
        className="w-full max-w-sm bg-white rounded-3xl px-8 pt-8 pb-6 border border-stone-100 transition-all duration-200"
        style={{
          opacity:   visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(8px)",
          boxShadow: "0 2px 16px rgba(28,18,10,0.07)",
        }}
      >
        {screen === "welcome" && (
          <WelcomeScreen
            onCreateHouse={() => nav("create")}
            onHaveInviteLink={() => nav("invite-landing")}
          />
        )}

        {screen === "create" && (
          <CreateHouseScreen
            onBack={() => nav("welcome")}
            onComplete={({ houseName, yourName, initials }) => {
              setHouse({
                name: houseName,
                members: [{ id: "m0", name: yourName, initials, isYou: true, color: "terra" }],
              });
              nav("dashboard");
            }}
          />
        )}

        {screen === "dashboard" && house && (
          <DashboardScreen house={house} onReset={reset} />
        )}

        {screen === "invite-landing" && (
          <InviteLandingScreen
            inviteCode={inviteCode}
            onBack={() => nav("welcome")}
            onJoin={({ name, initials, house: h }) => {
              const newMember = { id: `m${Date.now()}`, name, initials, isYou: true };
              setHouse({ ...h, members: [...h.members, newMember] });
              nav("joined");
            }}
          />
        )}

        {screen === "joined" && house && (
          <JoinedScreen house={house} onReset={reset} />
        )}
      </div>
    </div>
  );
}
