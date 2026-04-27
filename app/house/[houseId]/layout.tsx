import { TabNav } from "./TabNav";
import HouseHeader from "./HouseHeader";
import ResetDemo from "./ResetDemo";

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
        <div className="px-5 pt-4 pb-0">
          <HouseHeader houseId={houseId} />
        </div>
        <TabNav houseId={houseId} />
      </div>

      {/* Page content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>

      <div className="flex justify-center py-4">
        <ResetDemo />
      </div>
    </div>
  );
}
