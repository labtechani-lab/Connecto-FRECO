`````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````import { BusinessData } from "@/lib/store/businessStore";
import { MenuItem } from "@/data/frecoData";
import { getSupabaseClient } from "@/lib/supabase/client";

type MenuRow = {
  id: string;
  source_key: string | null;
  name: string;
  japanese_name: string | null;
  description: string | null;`````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````
  category: MenuItem["category"];
  price: number | null;
  price_formatted: string | null;
  is_verified_price: boolean;
  is_popular: boolean;
  dietary: MenuItem["dietary"] | null;
  display_order: number;
};

function mapMenuItems(rows: MenuRow[], fallback: MenuItem[]): MenuItem[] {
  const fallbackByKey = new Map(fallback.map((item) => [item.id, item]));
  return rows.map((row) => {
    const fallbackItem = fallbackByKey.get(row.source_key ?? "");
    const price = row.price === null ? null : Number(row.price);
    return {
      ...fallbackItem,
      id: row.source_key ?? row.id,
      name: row.name,
      japaneseName: row.japanese_name ?? fallbackItem?.japaneseName,
      description: row.description ?? fallbackItem?.description ?? "",
      category: row.category,
      price,
      priceFormatted:
        price === null && row.price_formatted === "INR [Price TBD]"
          ? fallbackItem?.priceFormatted ?? "\u20B9 [Price TBD]"
          : row.price_formatted ?? (price === null ? "\u20B9 [Price TBD]" : `INR ${price}`),
      isVerifiedPrice: row.is_verified_price,
      isPopular: row.is_popular,
      dietary: row.dietary ?? fallbackItem?.dietary,
    };
  });
}

export async function loadBusinessData(
  slug: string,
  fallback: BusinessData | null,
  requireOwner = false
): Promise<BusinessData | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return fallback;

  const { data: row, error } = await supabase
    .from("businesses")
    .select("id, slug, name, tagline, identity, badge, address, contact, operating_hours, amenities, profile_data, is_published")
    .eq("slug", slug)
    .maybeSingle();


if (error) {
  console.error("SUPABASE_ERROR:", JSON.stringify(error));
console.error("SUPABASE_MESSAGE:", error.message);
  throw new Error("Unable to load business data from Supabase.");
}
  if (!row) return null;

  if (requireOwner) {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) throw new Error("Sign in with an assigned owner account.");

    const { data: canManage, error: accessError } = await supabase.rpc(
      "can_manage_business",
      { target_business_id: row.id }
    );
    if (accessError || canManage !== true) {
      throw new Error("This account is not assigned to manage this business.");
    }
  }

  const { data: menuRows, error: menuError } = await supabase
    .from("menu_items")
    .select("id, source_key, name, japanese_name, description, category, price, price_formatted, is_verified_price, is_popular, dietary, display_order")
    .eq("business_id", row.id)
    .order("display_order", { ascending: true });

  if (menuError) throw new Error("Unable to load menu items from Supabase.");

  const profileData = (row.profile_data ?? {}) as Partial<BusinessData>;
  const addressData = (row.address ?? {}) as Partial<BusinessData["address"]>;
  const contactData = (row.contact ?? {}) as Partial<BusinessData["contact"]>;
  const storedHours = Array.isArray(row.operating_hours) ? row.operating_hours : [];

  return {
    ...(fallback ?? ({} as BusinessData)),
    ...profileData,
    id: row.id,
    slug: row.slug,
    name: profileData.name ?? row.name,
    tagline: profileData.tagline ?? row.tagline ?? fallback?.tagline ?? "",
    identity: profileData.identity ?? row.identity ?? fallback?.identity ?? "",
    badge: profileData.badge ?? row.badge ?? fallback?.badge ?? "",
    address: {
      ...(fallback?.address ?? ({} as BusinessData["address"])),
      ...addressData,
      ...(profileData.address ?? {}),
    },
    contact: {
      ...(fallback?.contact ?? ({} as BusinessData["contact"])),
      ...contactData,
      ...(profileData.contact ?? {}),
    },
    operatingHours:
      profileData.operatingHours ??
      (storedHours.length ? storedHours : fallback?.operatingHours ?? []),
    menu: mapMenuItems((menuRows ?? []) as MenuRow[], fallback?.menu ?? []),
    isPublished: row.is_published,
    offers: profileData.offers ?? fallback?.offers ?? [],
    analytics: profileData.analytics ?? fallback?.analytics ?? {
      totalViews: 0,
      qrScans: 0,
      organicViews: 0,
      linkClicks: { googleMaps: 0, instagram: 0, phone: 0, whatsapp: 0 },
      hourlyTraffic: [],
      recentEvents: [],
    },
    loyaltyProgram: profileData.loyaltyProgram ?? fallback?.loyaltyProgram ?? {
      enabled: false,
      name: "Loyalty program not configured",
      pointsPerVisit: 0,
      rewardThreshold: 0,
      rewardDescription: "",
      duplicateSafeguardNote: "",
    },
  };
}

export async function saveBusinessProfileData(
  businessId: string,
  updates: Partial<BusinessData>
): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error("Supabase is not configured; changes were not saved.");

  const { data: current, error: readError } = await supabase
    .from("businesses")
    .select("profile_data")
    .eq("id", businessId)
    .single();
  if (readError) throw new Error("Unable to read the current business profile.");

  const { error } = await supabase
    .from("businesses")
    .update({ profile_data: { ...(current.profile_data ?? {}), ...updates } })
    .eq("id", businessId)
    .select("id")
    .single();
  if (error) throw new Error("Supabase rejected the business profile update.");
}

export async function saveMenuItem(
  businessId: string,
  item: MenuItem,
  displayOrder: number
): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error("Supabase is not configured; changes were not saved.");

  const { error } = await supabase.from("menu_items").upsert(
    {
      business_id: businessId,
      source_key: item.id,
      name: item.name,
      japanese_name: item.japaneseName ?? null,
      description: item.description,
      category: item.category,
      price: item.price,
      price_formatted: item.priceFormatted,
      is_verified_price: item.isVerifiedPrice,
      is_popular: Boolean(item.isPopular),
      dietary: item.dietary ?? null,
      display_order: displayOrder,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "business_id,source_key" }
  );

  if (error) throw new Error("Supabase rejected the menu item update.");
}