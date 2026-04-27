"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function HouseHeader({ houseId }: { houseId: string }) {
  const [houseName, setHouseName] = useState("312 Linden");
  const [houseSize, setHouseSize] = useState(3);
  const [pulseSubmitted, setPulseSubmitted] = useState(false);

  useEffect(() => {
    const name = localStorage.getItem("nm_house_name");
    if (name) setHouseName(name);

    const size = localStorage.getItem("nm_house_size");
    if (size) setHouseSize(parseInt(size, 10));

    setPulseSubmitted(localStorage.getItem("nm_pulse_submitted") === "true");
  }, []);

  return (
    <div className="flex items-start justify-between w-full">
      <div>
        <h1 className="font-serif text-[1.35rem] font-medium text-nm-ink leading-tight">
          {houseName}
        </h1>
        <p className="text-[12px] text-nm-muted mt-0.5">
          {houseSize} resident{houseSize !== 1 ? "s" : ""} · move-in Aug 2026
        </p>
      </div>

      <Link
        href={`/house/${houseId}/pulse`}
        className="text-[12px] font-medium px-2.5 py-1 rounded-full mt-0.5 transition-opacity hover:opacity-75 flex-shrink-0"
        style={{ background: "#D8EBE0", color: "#4A7C5F" }}
      >
        {pulseSubmitted ? "Pulse: In ✓" : "Pulse: Good"}
      </Link>
    </div>
  );
}
