"use client";

import { useEffect, useState } from "react";

export default function HouseHeader() {
  const [houseName, setHouseName] = useState("312 Linden");

  useEffect(() => {
    const stored = localStorage.getItem("nm_house_name");
    if (stored) setHouseName(stored);
  }, []);

  return (
    <div>
      <h1 className="font-serif text-[1.35rem] font-medium text-nm-ink leading-tight">
        {houseName}
      </h1>
      <p className="text-[12px] text-nm-muted mt-0.5">3 residents · move-in Aug 2026</p>
    </div>
  );
}
