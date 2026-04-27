import { redirect } from "next/navigation";

export default async function HousePage({
  params,
}: {
  params: Promise<{ houseId: string }>;
}) {
  const { houseId } = await params;
  redirect(`/house/${houseId}/agreement`);
}
