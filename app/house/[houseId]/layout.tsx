import { TabNav } from "./TabNav";

export default async function HouseLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ houseId: string }>;
}) {
  const { houseId } = await params;

  return (
    <div className="min-h-screen bg-nm-sand flex flex-col">
      {/* House header */}
      <div className="bg-nm-white" style={{ borderBottom: "1px solid rgba(44,36,22,0.1)" }}>
        <div className="px-5 pt-4 pb-0 flex items-start justify-between">
          <div>
            <h1 className="font-serif text-[1.35rem] font-medium text-nm-ink leading-tight">
              312 Linden
            </h1>
            <p className="text-[12px] text-nm-muted mt-0.5">3 residents · move-in Aug 2026</p>
          </div>
          <div
            className="text-[12px] font-medium px-2.5 py-1 rounded-full mt-0.5"
            style={{ background: "#D8EBE0", color: "#4A7C5F" }}
          >
            Pulse: Good
          </div>
        </div>
        <TabNav houseId={houseId} />
      </div>

      {/* Page content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
