import { NextRequest, NextResponse } from "next/server";
import { businessStore } from "@/lib/store/businessStore";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { loadBusinessData } from "@/lib/supabase/businessData";
import fs from "fs";
import path from "path";

const PERSISTENCE_FILE = path.join(process.cwd(), "src", "data", "persistedBusinesses.json");

function readPersistedBusinesses() {
  try {
    if (fs.existsSync(PERSISTENCE_FILE)) {
      const raw = fs.readFileSync(PERSISTENCE_FILE, "utf-8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error("Failed to read persisted businesses:", err);
  }
  return {};
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (isSupabaseConfigured()) {
    try {
      const business = await loadBusinessData(slug, businessStore.getBusiness(slug));
      return business
        ? NextResponse.json(business)
        : NextResponse.json({ error: "Business not found" }, { status: 404 });
    } catch {
      return NextResponse.json({ error: "Unable to load business data" }, { status: 503 });
    }
  }
  
  // Check disk persistence first
  const persisted = readPersistedBusinesses();
  if (persisted[slug]) {
    businessStore.updateBusiness(slug, persisted[slug]);
  }

  const business = businessStore.getBusiness(slug);
  if (!business) {
    return NextResponse.json({ error: "Business not found" }, { status: 404 });
  }

  return NextResponse.json(business);
}
