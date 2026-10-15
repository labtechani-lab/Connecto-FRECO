import { notFound } from "next/navigation";
import { businessStore } from "@/lib/store/businessStore";
import PublicProfileView from "@/components/PublicProfileView";
import { loadBusinessData } from "@/lib/supabase/businessData";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ src?: string }>;
}

export default async function BusinessProfilePage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { src } = await searchParams;

  const business = await loadBusinessData(slug, businessStore.getBusiness(slug));

  if (!business) {
    notFound();
  }

  const isQrVisit = src === "qr";

  return (
    <PublicProfileView
      initialBusiness={business}
      slug={slug}
      isQrVisit={isQrVisit}
    />
  );
}
