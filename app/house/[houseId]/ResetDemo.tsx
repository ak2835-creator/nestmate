"use client";

import { useRouter } from "next/navigation";

export default function ResetDemo() {
  const router = useRouter();

  function handleReset() {
    const keys = Object.keys(localStorage).filter((k) => k.startsWith("nm_"));
    keys.forEach((k) => localStorage.removeItem(k));
    router.push("/");
  }

  return (
    <button
      onClick={handleReset}
      className="text-[12px] text-nm-muted hover:text-nm-ink transition-colors"
    >
      ↺ Reset demo
    </button>
  );
}
