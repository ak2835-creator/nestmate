"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const ALL_TABS = [
  { label: "Agreement", segment: "agreement", minSize: 0 },
  { label: "House Board", segment: "board", minSize: 3 },
  { label: "Expenses", segment: "expenses", minSize: 0 },
  { label: "Chores", segment: "chores", minSize: 0 },
];

export function TabNav({ houseId }: { houseId: string }) {
  const pathname = usePathname();
  const [houseSize, setHouseSize] = useState(3);

  useEffect(() => {
    const stored = localStorage.getItem("nm_house_size");
    if (stored) setHouseSize(parseInt(stored, 10));
  }, []);

  const tabs = ALL_TABS.filter((t) => houseSize >= t.minSize);

  return (
    <div className="flex overflow-x-auto" style={{ borderTop: "1px solid rgba(44,36,22,0.08)" }}>
      {tabs.map(({ label, segment }) => {
        const href = `/house/${houseId}/${segment}`;
        const active = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={segment}
            href={href}
            className="flex-shrink-0 px-4 py-3 text-[13px] whitespace-nowrap transition-colors"
            style={{
              color: active ? "#C4714A" : "#7A7165",
              fontWeight: active ? "500" : "400",
              borderBottom: active ? "2px solid #C4714A" : "2px solid transparent",
            }}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
