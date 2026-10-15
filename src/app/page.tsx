import { businessStore } from "@/lib/store/businessStore";
import PublicProfileView from "@/components/PublicProfileView";
import { loadBusinessData } from "@/lib/supabase/businessData";

export const dynamic = "force-dynamic";

export default async function Home() {
  const business = await loadBusinessData("freco-cafe", businessStore.getBusiness("freco-cafe"));
  if (!business) return null;

  return (
    <PublicProfileView
      initialBusiness={business}
      slug="freco-cafe"
      isQrVisit={false}
    />
  );
}
