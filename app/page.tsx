import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-nm-cream flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm">
        {/* Wordmark */}
        <div className="text-center mb-10">
          <div className="font-serif text-[2rem] font-medium tracking-tight text-nm-ink">
            Nest<span className="text-nm-terra italic">Mate</span>
          </div>
          <div className="text-[12px] text-nm-muted mt-1 tracking-[0.08em] uppercase">
            for the house, not just the landlord
          </div>
        </div>

        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="font-serif text-[1.85rem] font-normal leading-snug text-nm-ink">
            Shared living,<br />without the awkward part.
          </h1>
          <p className="mt-3 text-[15px] text-nm-muted leading-relaxed">
            One place for your house agreement,<br />chores, expenses, and vibes.
          </p>
        </div>

        {/* Entry points */}
        <div className="flex flex-col gap-3">
          <Link
            href="/onboarding/create"
            className="flex items-center justify-between px-5 py-4 bg-nm-terra text-white rounded-xl hover:bg-nm-terra-dark transition-colors"
          >
            <div>
              <div className="text-[11px] font-normal opacity-70 mb-0.5">first time?</div>
              <div className="text-[15px] font-medium">Create a house</div>
            </div>
            <span className="text-lg opacity-50">›</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: "rgba(44,36,22,0.1)" }} />
            <span className="text-[11px] text-nm-muted">or</span>
            <div className="flex-1 h-px" style={{ background: "rgba(44,36,22,0.1)" }} />
          </div>

          <Link
            href="/onboarding/join"
            className="flex items-center justify-between px-5 py-4 bg-nm-white text-nm-ink rounded-xl hover:bg-nm-sand transition-colors"
            style={{ border: "1px solid rgba(44,36,22,0.12)" }}
          >
            <div>
              <div className="text-[11px] font-normal text-nm-muted mb-0.5">got an invite?</div>
              <div className="text-[15px]">Join with a link</div>
            </div>
            <span className="text-nm-muted">›</span>
          </Link>

          <Link
            href="/login"
            className="flex items-center justify-between px-5 py-4 bg-nm-white text-nm-ink rounded-xl hover:bg-nm-sand transition-colors"
            style={{ border: "1px solid rgba(44,36,22,0.12)" }}
          >
            <div>
              <div className="text-[11px] font-normal text-nm-muted mb-0.5">already set up?</div>
              <div className="text-[15px]">Log in</div>
            </div>
            <span className="text-nm-muted">›</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
