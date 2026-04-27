"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { label: "Agreement", segment: "agreement" },
  { label: "House Board", segment: "board" },
  { label: "Expenses", segment: "expenses" },
  { label: "Chores", segment: "chores" },
];

export function TabNav({ houseId }: { houseId: string }) {
  const pathname = usePathname();

  return (
    <div className="flex overflow-x-auto" style={{ borderTop: "1px solid rgba(44,36,22,0.08)" }}>
      {TABS.map(({ label, segment }) => {
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
