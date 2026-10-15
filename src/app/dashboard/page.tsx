"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { businessStore, BusinessData, BusinessOffer } from "@/lib/store/businessStore";
import { MenuItem, GameNightEvent, CafeReview } from "@/data/frecoData";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { loadBusinessData, saveBusinessProfileData, saveMenuItem } from "@/lib/supabase/businessData";
import { QRCodeSVG, QRCodeCanvas } from "qrcode.react";
import {
  LayoutDashboard,
  Building2,
  UtensilsCrossed,
  Image as ImageIcon,
  Share2,
  Clock,
  Tag,
  CalendarDays,
  Star,
  QrCode,
  BarChart3,
  Award,
  ExternalLink,
  Save,
  Download,
  Copy,
  Check,
  AlertTriangle,
  Info,
  Database,
  ArrowLeft,
  Flame,
  MapPin,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  LogOut,
  Smartphone,
  Laptop,
  Globe,
  Plus,
  Trash2,
  Edit2,
  X,
  Phone,
  Mail,
  CheckSquare,
  Square,
  AlertCircle,
} from "lucide-react";

type TabId =
  | "overview"
  | "profile"
  | "menu"
  | "gallery"
  | "contact"
  | "hours"
  | "offers"
  | "events"
  | "reviews"
  | "qr"
  | "analytics"
  | "loyalty";

export default function OwnerDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [slug, setSlug] = useState<string>("freco-cafe");
  const [business, setBusiness] = useState<BusinessData | null>(null);
  const [origin, setOrigin] = useState<string>("http://localhost:3000");
  const [hasCopied, setHasCopied] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<string>("");
  const [errorStatus, setErrorStatus] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [showSupabaseGuide, setShowSupabaseGuide] = useState<boolean>(false);
  const qrCanvasRef = useRef<HTMLDivElement>(null);

  // Profile Form State
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [identity, setIdentity] = useState("");

  // Contact Form State
  const [phone, setPhone] = useState("");
  const [isVerifiedPhone, setIsVerifiedPhone] = useState(false);
  const [email, setEmail] = useState("");
  const [isVerifiedEmail, setIsVerifiedEmail] = useState(false);
  const [instagramHandle, setInstagramHandle] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [isVerifiedWhatsapp, setIsVerifiedWhatsapp] = useState(false);

  // QR Code Host Targeting
  const [networkHost, setNetworkHost] = useState<string>("http://10.106.125.194:3000");
  const [qrHostMode, setQrHostMode] = useState<"wifi" | "local" | "custom">("wifi");
  const [customHost, setCustomHost] = useState<string>("https://frecocafe.connecto.in");

  // Menu Modal / Inline Form State
  const [showAddMenuModal, setShowAddMenuModal] = useState(false);
  const [editingMenuItemId, setEditingMenuItemId] = useState<string | null>(null);
  const [menuForm, setMenuForm] = useState<{
    name: string;
    japaneseName: string;
    description: string;
    category: "coffee" | "ice-cream" | "bites" | "specialty";
    price: string;
    priceFormatted: string;
    isVerifiedPrice: boolean;
    isPopular: boolean;
    dietary: "Vegetarian" | "Egg" | "Vegan" | "Contains Dairy";
  }>({
    name: "",
    japaneseName: "",
    description: "",
    category: "coffee",
    price: "",
    priceFormatted: "",
    isVerifiedPrice: true,
    isPopular: false,
    dietary: "Vegetarian",
  });

  // Events Form State
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [eventForm, setEventForm] = useState({
    day: "Every Friday",
    timeSlot: "6:30 PM – 10:30 PM",
    title: "",
    description: "",
    isVerifiedSchedule: true,
  });

  // Offers Form State
  const [showAddOfferModal, setShowAddOfferModal] = useState(false);
  const [offerForm, setOfferForm] = useState({
    title: "",
    code: "",
    discount: "",
    validUntil: "Ongoing Promo",
    isActive: true,
  });

  // Gallery Form State
  const [showAddGalleryModal, setShowAddGalleryModal] = useState(false);
  const [galleryForm, setGalleryForm] = useState({
    caption: "",
    tag: "Coffee Bar",
    alt: "",
    imageUrl: "",
  });

  // Opening Hours Form State
  const [operatingHours, setOperatingHours] = useState<
    { days: string; timings: string; isVerifiedHours: boolean; statusNote: string }[]
  >([]);

  // Amenities
  const [amenities, setAmenities] = useState<string[]>([
    "Free High-Speed Wi-Fi",
    "Air Conditioned Seating",
    "Curated Physical Manga Library",
    "Tabletop Board Games Available",
    "UPI & Credit/Debit Cards Accepted",
  ]);

  useEffect(() => {
    let isActive = true;
    const initialize = async () => {
      if (!isSupabaseConfigured()) {
        setErrorStatus("Supabase is not configured. Owner dashboard access is disabled.");
        router.replace("/login");
        return;
      }

      const supabase = getSupabaseClient();
      if (!supabase) {
        router.replace("/login");
        return;
      }

      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData.user) {
        router.replace("/login");
        return;
      }

      try {
        const data = await loadBusinessData(slug, businessStore.getBusiness(slug), true);
        if (!data) throw new Error("The requested business was not found.");
        if (isActive) populateState(data);
      } catch (error) {
        setErrorStatus(error instanceof Error ? error.message : "Unable to load the owner dashboard.");
        router.replace("/login");
      }
    };

    if (typeof window !== "undefined") setOrigin(window.location.origin);
    void initialize();
    return () => {
      isActive = false;
    };
  }, [slug, router]);

  const populateState = (data: BusinessData) => {
    setBusiness({ ...data });
    setName(data.name);
    setTagline(data.tagline);
    setIdentity(data.identity);
    setPhone(data.contact.phonePlaceholder);
    setIsVerifiedPhone(data.contact.isVerifiedPhone);
    setEmail(data.contact.emailPlaceholder);
    setIsVerifiedEmail(data.contact.isVerifiedEmail);
    setInstagramHandle(data.contact.instagramHandle);
    setInstagramUrl(data.contact.instagramUrl);
    setWhatsapp(data.contact.whatsappNumberPlaceholder);
    setIsVerifiedWhatsapp(data.contact.isVerifiedWhatsapp);
    setOperatingHours([...data.operatingHours]);
  };

  if (!business) {
    return (
      <div className="min-h-screen bg-charcoal-950 text-cream-100 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <p className="text-lg font-bold">Loading FreCo Cafe Dashboard...</p>
        </div>
      </div>
    );
  }

  // QR Target URL based on mode
  const effectiveHost =
    qrHostMode === "wifi"
      ? networkHost
      : qrHostMode === "local"
      ? origin
      : customHost;

  const qrTargetUrl = `${effectiveHost}/b/${business.slug}?src=qr`;

  // Store dashboard-only fields as profile data until each module has a normalized editor.
  const persistUpdates = async (updates: Partial<BusinessData>, successMsg: string) => {
    setIsSaving(true);
    setSaveStatus("");
    setErrorStatus("");

    try {
      await saveBusinessProfileData(business.id, updates);
      const updated = await loadBusinessData(business.slug, businessStore.getBusiness(business.slug), true);
      if (!updated) throw new Error("The business could not be reloaded after saving.");
      populateState(updated);
      setSaveStatus(successMsg);
      setTimeout(() => setSaveStatus(""), 4500);
    } catch (error) {
      setErrorStatus(`Error saving changes: ${error instanceof Error ? error.message : "Unknown error"} Changes not committed.`);
    } finally {
      setIsSaving(false);
    }
  };

  // --- Profile Save ---
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await persistUpdates(
      { name, tagline, identity },
      "Profile changes saved to Supabase."
    );
  };

  // --- Contact Save ---
  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    const contact = {
      phonePlaceholder: phone,
      isVerifiedPhone,
      emailPlaceholder: email,
      isVerifiedEmail,
      instagramHandle,
      instagramUrl,
      whatsappNumberPlaceholder: whatsapp,
      isVerifiedWhatsapp,
    };
    await persistUpdates({ contact }, "Contact & social links updated successfully!");
  };

  // --- Hours & Amenities Save ---
  const handleSaveHours = async () => {
    await persistUpdates(
      { operatingHours },
      "Opening hours and status notes updated successfully!"
    );
  };

  // --- MENU CRUD ---
  const handleSaveMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = menuForm.price.trim() ? Number(menuForm.price) : null;
    if (priceNum !== null && (!Number.isFinite(priceNum) || priceNum < 0)) {
      setErrorStatus("Enter a valid non-negative menu price.");
      return;
    }
    const formatted = priceNum === null ? "\u20B9 [Price TBD]" : `\u20B9 ${priceNum}`;

    let itemToSave: MenuItem;
    if (editingMenuItemId) {
      const existingItem = business.menu.find((item) => item.id === editingMenuItemId);
      if (!existingItem) {
        setErrorStatus("This menu item is no longer available. Refresh and try again.");
        return;
      }
      itemToSave = {
        ...existingItem,
        name: menuForm.name,
        japaneseName: menuForm.japaneseName || undefined,
        description: menuForm.description,
        category: menuForm.category,
        price: priceNum,
        priceFormatted: formatted,
        isVerifiedPrice: menuForm.isVerifiedPrice,
        isPopular: menuForm.isPopular,
        dietary: menuForm.dietary,
      };
    } else {
      itemToSave = {
        id: `m-${Date.now()}`,
        name: menuForm.name,
        japaneseName: menuForm.japaneseName || undefined,
        description: menuForm.description,
        category: menuForm.category,
        price: priceNum,
        priceFormatted: formatted,
        isVerifiedPrice: menuForm.isVerifiedPrice,
        isPopular: menuForm.isPopular,
        dietary: menuForm.dietary,
      };
    }

    setIsSaving(true);
    setSaveStatus("");
    setErrorStatus("");
    try {
      const oldOrder = business.menu.findIndex((item) => item.id === itemToSave.id);
      await saveMenuItem(business.id, itemToSave, oldOrder < 0 ? 0 : oldOrder);
      const updated = await loadBusinessData(business.slug, businessStore.getBusiness(business.slug), true);
      if (!updated) throw new Error("The business could not be reloaded after saving.");
      populateState(updated);
      setSaveStatus("Menu item saved to Supabase.");
      setTimeout(() => setSaveStatus(""), 4500);
      setShowAddMenuModal(false);
      setEditingMenuItemId(null);
    } catch (error) {
      setErrorStatus(`Error saving menu item: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditMenuItem = (item: MenuItem) => {
    setEditingMenuItemId(item.id);
    setMenuForm({
      name: item.name,
      japaneseName: item.japaneseName || "",
      description: item.description,
      category: item.category,
      price: item.price !== null ? item.price.toString() : "",
      priceFormatted: item.priceFormatted,
      isVerifiedPrice: item.isVerifiedPrice,
      isPopular: !!item.isPopular,
      dietary: item.dietary || "Vegetarian",
    });
    setShowAddMenuModal(true);
  };

  const handleDeleteMenuItem = async (id: string) => {
    if (!confirm("Are you sure you want to remove this menu item?")) return;
    const supabase = getSupabaseClient();
    if (!supabase) return;
    setIsSaving(true);
    setErrorStatus("");
    try {
      const { error } = await supabase
        .from("menu_items")
        .delete()
        .eq("business_id", business.id)
        .eq("source_key", id);
      if (error) throw new Error("Supabase rejected the menu item deletion.");
      const updated = await loadBusinessData(business.slug, businessStore.getBusiness(business.slug), true);
      if (!updated) throw new Error("The business could not be reloaded after deleting.");
      populateState(updated);
      setSaveStatus("Menu item deleted from Supabase.");
    } catch (error) {
      setErrorStatus(`Error deleting menu item: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsSaving(false);
    }
  };

  // --- EVENTS CRUD ---
  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    const newEvent: GameNightEvent = { ...eventForm };
    const updatedEvents = [newEvent, ...business.gameNights];
    await persistUpdates({ gameNights: updatedEvents }, "New event scheduled successfully!");
    setShowAddEventModal(false);
    setEventForm({
      day: "Every Friday",
      timeSlot: "6:30 PM – 10:30 PM",
      title: "",
      description: "",
      isVerifiedSchedule: true,
    });
  };

  const handleDeleteEvent = async (idx: number) => {
    if (!confirm("Remove this event?")) return;
    const updatedEvents = business.gameNights.filter((_, i) => i !== idx);
    await persistUpdates({ gameNights: updatedEvents }, "Event removed successfully.");
  };

  // --- OFFERS CRUD ---
  const handleAddOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    const newOffer: BusinessOffer = {
      id: `off-${Date.now()}`,
      ...offerForm,
    };
    const updatedOffers = [newOffer, ...business.offers];
    await persistUpdates({ offers: updatedOffers }, "Offer created successfully!");
    setShowAddOfferModal(false);
    setOfferForm({
      title: "",
      code: "",
      discount: "",
      validUntil: "Ongoing Promo",
      isActive: true,
    });
  };

  const handleDeleteOffer = async (id: string) => {
    if (!confirm("Remove this offer?")) return;
    const updatedOffers = business.offers.filter((o) => o.id !== id);
    await persistUpdates({ offers: updatedOffers }, "Offer removed successfully.");
  };

  // --- GALLERY CRUD ---
  const handleAddGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const newItem = {
      id: `g-${Date.now()}`,
      caption: galleryForm.caption,
      tag: galleryForm.tag,
      alt: galleryForm.alt || galleryForm.caption,
      imageUrl:
        galleryForm.imageUrl ||
        "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1000&q=80",
    };
    const updatedGallery = [newItem, ...business.gallery];
    await persistUpdates({ gallery: updatedGallery }, "Image added to gallery!");
    setShowAddGalleryModal(false);
    setGalleryForm({ caption: "", tag: "Coffee Bar", alt: "", imageUrl: "" });
  };

  const handleDeleteGalleryItem = async (id: string) => {
    if (!confirm("Remove this image?")) return;
    const updatedGallery = business.gallery.filter((g) => g.id !== id);
    await persistUpdates({ gallery: updatedGallery }, "Image removed from gallery.");
  };

  // Logout
  const handleLogout = async () => {
    await getSupabaseClient()?.auth.signOut();
    router.push("/login");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  const downloadQrCodePng = () => {
    const canvas = qrCanvasRef.current?.querySelector("canvas");
    if (!canvas) return;
    const pngUrl = canvas.toDataURL("image/png");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `${business.slug}-table-qr.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const navItems: { id: TabId; label: string; icon: React.ElementType }[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "profile", label: "Business Profile Editor", icon: Building2 },
    { id: "menu", label: "Menu & Products", icon: UtensilsCrossed },
    { id: "hours", label: "Opening Hours & Amenities", icon: Clock },
    { id: "contact", label: "Social & Contact Links", icon: Share2 },
    { id: "events", label: "Events & Schedules", icon: CalendarDays },
    { id: "offers", label: "Offers & Coupons", icon: Tag },
    { id: "gallery", label: "Gallery Management", icon: ImageIcon },
    { id: "reviews", label: "Reviews & Feedback", icon: Star },
    { id: "qr", label: "QR Code Generator", icon: QrCode },
    { id: "analytics", label: "Analytics & Scans", icon: BarChart3 },
    { id: "loyalty", label: "Loyalty Management", icon: Award },
  ];

  return (
    <div className="min-h-screen bg-charcoal-950 text-cream-100 flex flex-col">
      {/* Top Header */}
      <header className="border-b border-charcoal-800 bg-charcoal-900 sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a
              href={`/b/${business.slug}`}
              className="inline-flex items-center gap-1.5 text-xs text-cream-300 hover:text-crimson-400 rounded-lg border border-charcoal-700 bg-charcoal-850 px-2.5 py-1.5 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Public Profile</span>
            </a>
            <div className="h-4 w-px bg-charcoal-700 hidden sm:block" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-sm text-cream-50">
                  {business.name}
                </span>
                <span className="rounded bg-crimson-950 px-1.5 py-0.5 text-[10px] font-mono text-crimson-400 border border-crimson-800/40">
                  Owner Dashboard
                </span>
              </div>
              <p className="text-[11px] text-cream-400/60 font-mono">
                Multi-Tenant Slug: /b/{business.slug}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowSupabaseGuide(!showSupabaseGuide)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 transition-colors hidden sm:inline-flex"
            >
              <Database className="h-3.5 w-3.5 text-amber-400" />
              <span>{isSupabaseConfigured() ? "Database: Connected" : "Backend Setup (Disk Active)"}</span>
            </button>

            <a
              href={`/b/${business.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-crimson-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-crimson-500 transition-colors"
            >
              <span>View Live Profile</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>

            <button
              type="button"
              onClick={handleLogout}
              title="Sign Out"
              className="inline-flex items-center gap-1.5 rounded-lg border border-charcoal-700 bg-charcoal-850 px-3 py-1.5 text-xs font-medium text-cream-300 hover:text-crimson-400 hover:border-crimson-800/50 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5 text-crimson-400" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Supabase Notice Drawer */}
      {showSupabaseGuide && (
        <div className="bg-charcoal-900 border-b border-amber-500/30 p-4 sm:p-6">
          <div className="mx-auto max-w-4xl space-y-3 bg-charcoal-850 p-5 rounded-xl border border-charcoal-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-400">
                <Database className="h-5 w-5" />
                <h3 className="font-display font-bold text-base text-cream-50">
                  Backend Storage Status: Local Persistent Storage Active
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSupabaseGuide(false)}
                className="text-xs text-cream-400 hover:text-cream-100"
              >
                Close ✕
              </button>
            </div>
            <p className="text-xs text-cream-300/80 leading-relaxed">
              Every add, edit, and delete operation is saved directly to <code>src/data/persistedBusinesses.json</code> and instantly synced across all open tabs.
              To connect a live cloud database on Supabase:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="rounded-lg border border-charcoal-700 bg-charcoal-900 p-3">
                <span className="font-bold text-cream-200 block mb-1">1. Create Project</span>
                <span className="text-cream-400/80 text-[11px]">
                  Sign up free at supabase.com and create a project in Mumbai / Singapore.
                </span>
              </div>
              <div className="rounded-lg border border-charcoal-700 bg-charcoal-900 p-3">
                <span className="font-bold text-cream-200 block mb-1">2. Run Migration</span>
                <span className="text-cream-400/80 text-[11px]">
                  Execute <code>supabase/migrations/001_initial_schema.sql</code> in the SQL editor.
                </span>
              </div>
              <div className="rounded-lg border border-charcoal-700 bg-charcoal-900 p-3">
                <span className="font-bold text-cream-200 block mb-1">3. Put Keys in .env.local</span>
                <span className="text-cream-400/80 text-[11px]">
                  Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Dashboard Layout */}
      <div className="flex-1 mx-auto max-w-7xl w-full grid grid-cols-1 md:grid-cols-12 gap-6 p-4 sm:p-6 lg:p-8">
        
        {/* Left Sidebar (Col 3) */}
        <aside className="md:col-span-3 space-y-1">
          <div className="rounded-2xl border border-charcoal-800 bg-charcoal-900/90 p-2 space-y-1">
            <div className="px-3 py-2 text-[11px] font-mono uppercase tracking-wider text-cream-400/60">
              Platform Modules
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id);
                    setSaveStatus("");
                    setErrorStatus("");
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? "bg-crimson-600 text-white font-semibold shadow-md shadow-crimson-950"
                      : "text-cream-300 hover:bg-charcoal-800 hover:text-cream-50"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-crimson-400"}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="rounded-2xl border border-charcoal-800 bg-charcoal-900/40 p-4 space-y-2 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Full CRUD Enabled</span>
            </div>
            <p className="text-[11px] text-cream-400/70 leading-relaxed font-light">
              Add, edit, and delete items with instant persistence and real-time reflection on the public site.
            </p>
          </div>
        </aside>

        {/* Right Main Content Area (Col 9) */}
        <main className="md:col-span-9 space-y-6">
          
          {/* Notifications */}
          {saveStatus && (
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3.5 text-xs text-emerald-300 flex items-center gap-2.5 shadow-sm">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>{saveStatus}</span>
            </div>
          )}

          {errorStatus && (
            <div className="rounded-xl border border-crimson-500/40 bg-crimson-950/40 p-3.5 text-xs text-crimson-300 flex items-center gap-2.5 shadow-sm">
              <AlertCircle className="h-4 w-4 text-crimson-400 shrink-0" />
              <span>{errorStatus}</span>
            </div>
          )}

          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div>
                <h1 className="font-display text-2xl font-bold text-cream-50">
                  Business Overview: {business.name}
                </h1>
                <p className="text-xs text-cream-300/70">
                  Thakur Complex, Kandivali East, Mumbai • Slug: <code>/b/{business.slug}</code>
                </p>
              </div>

              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="rounded-xl border border-charcoal-800 bg-charcoal-900 p-4">
                  <span className="text-[11px] font-mono text-cream-400/60 block">Total Profile Views</span>
                  <span className="font-display text-2xl font-bold text-cream-50">
                    {business.analytics.totalViews}
                  </span>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1 font-mono">
                    <TrendingUp className="h-3 w-3" />
                    <span>Organic + Scans</span>
                  </span>
                </div>

                <div className="rounded-xl border border-charcoal-800 bg-charcoal-900 p-4">
                  <span className="text-[11px] font-mono text-cream-400/60 block">Table QR Scans</span>
                  <span className="font-display text-2xl font-bold text-crimson-400">
                    {business.analytics.qrScans}
                  </span>
                  <span className="text-[10px] text-cream-400/60 block mt-1 font-mono">
                    Direct Table Origin
                  </span>
                </div>

                <div className="rounded-xl border border-charcoal-800 bg-charcoal-900 p-4">
                  <span className="text-[11px] font-mono text-cream-400/60 block">Directions Clicks</span>
                  <span className="font-display text-2xl font-bold text-cream-50">
                    {business.analytics.linkClicks.googleMaps}
                  </span>
                  <span className="text-[10px] text-cream-400/60 block mt-1 font-mono">
                    Google Maps Intent
                  </span>
                </div>

                <div className="rounded-xl border border-charcoal-800 bg-charcoal-900 p-4">
                  <span className="text-[11px] font-mono text-cream-400/60 block">Instagram Visits</span>
                  <span className="font-display text-2xl font-bold text-cream-50">
                    {business.analytics.linkClicks.instagram}
                  </span>
                  <span className="text-[10px] text-cream-400/60 block mt-1 font-mono">
                    Social Outbound
                  </span>
                </div>
              </div>

              {/* Quick Actions & Recent Activity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-2xl border border-charcoal-800 bg-charcoal-900 p-6 space-y-4">
                  <h3 className="font-display text-base font-bold text-cream-50">
                    Quick Operations
                  </h3>
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab("menu")}
                      className="w-full flex items-center justify-between p-3 rounded-xl border border-charcoal-800 bg-charcoal-850 hover:border-crimson-600/50 text-xs transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <UtensilsCrossed className="h-4 w-4 text-crimson-400" />
                        <span className="font-medium text-cream-100">Add or Edit Menu Items</span>
                      </div>
                      <span className="text-[11px] text-crimson-400 font-mono">Manage →</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab("hours")}
                      className="w-full flex items-center justify-between p-3 rounded-xl border border-charcoal-800 bg-charcoal-850 hover:border-crimson-600/50 text-xs transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Clock className="h-4 w-4 text-crimson-400" />
                        <span className="font-medium text-cream-100">Update Opening Hours &amp; Timings</span>
                      </div>
                      <span className="text-[11px] text-crimson-400 font-mono">Edit →</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab("qr")}
                      className="w-full flex items-center justify-between p-3 rounded-xl border border-charcoal-800 bg-charcoal-850 hover:border-crimson-600/50 text-xs transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <QrCode className="h-4 w-4 text-crimson-400" />
                        <span className="font-medium text-cream-100">Download Wi-Fi Phone QR Code</span>
                      </div>
                      <span className="text-[11px] text-crimson-400 font-mono">Download →</span>
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl border border-charcoal-800 bg-charcoal-900 p-6 space-y-4">
                  <h3 className="font-display text-base font-bold text-cream-50">
                    Recent Activity Log
                  </h3>
                  <div className="space-y-3">
                    {business.analytics.recentEvents.slice(0, 4).map((event) => (
                      <div
                        key={event.id}
                        className="flex items-center justify-between text-xs border-b border-charcoal-800 pb-2.5 last:border-0 last:pb-0"
                      >
                        <div className="space-y-0.5">
                          <p className="text-cream-200 font-medium">{event.label}</p>
                          <span className="text-[10px] font-mono text-crimson-400">
                            {event.type.toUpperCase()}
                          </span>
                        </div>
                        <span className="text-[11px] font-mono text-cream-400/60">
                          {event.timestamp}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROFILE EDITOR */}
          {activeTab === "profile" && (
            <div className="rounded-2xl border border-charcoal-800 bg-charcoal-900 p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="font-display text-xl font-bold text-cream-50">
                  Business Profile Editor
                </h2>
                <p className="text-xs text-cream-300/70">
                  Update your public business identity. Changes are synchronized to disk and live public views immediately.
                </p>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase text-cream-300">
                      Business Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border border-charcoal-700 bg-charcoal-850 px-3.5 py-2.5 text-xs text-cream-100 focus:border-crimson-500 focus:outline-none font-medium"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase text-cream-300">
                      Tagline
                    </label>
                    <input
                      type="text"
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      className="w-full rounded-xl border border-charcoal-700 bg-charcoal-850 px-3.5 py-2.5 text-xs text-cream-100 focus:border-crimson-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase text-cream-300">
                    Business Identity &amp; Mission
                  </label>
                  <textarea
                    rows={3}
                    value={identity}
                    onChange={(e) => setIdentity(e.target.value)}
                    className="w-full rounded-xl border border-charcoal-700 bg-charcoal-850 px-3.5 py-2.5 text-xs text-cream-100 focus:border-crimson-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase text-cream-300">
                    Registered Physical Address (Thakur Complex, Kandivali East)
                  </label>
                  <div className="rounded-xl border border-charcoal-800 bg-charcoal-950/60 p-3 text-xs text-cream-300/80 font-mono">
                    {business.address.fullFormatted}
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 rounded-xl bg-crimson-600 px-6 py-2.5 text-xs font-semibold text-white hover:bg-crimson-500 transition-colors shadow-md shadow-crimson-950 disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    <span>{isSaving ? "Saving..." : "Save Profile Changes"}</span>
                  </button>

                  <a
                    href={`/b/${business.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-crimson-400 hover:underline flex items-center gap-1"
                  >
                    <span>Check Public View</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: MENU / PRODUCTS (FULL CRUD: ADD, EDIT, DELETE) */}
          {activeTab === "menu" && (
            <div className="rounded-2xl border border-charcoal-800 bg-charcoal-900 p-6 sm:p-8 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="font-display text-xl font-bold text-cream-50">
                    Menu &amp; Offerings Management
                  </h2>
                  <p className="text-xs text-cream-300/70">
                    Add new items, update prices, change descriptions, or delete offerings.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingMenuItemId(null);
                    setMenuForm({
                      name: "",
                      japaneseName: "",
                      description: "",
                      category: "coffee",
                      price: "220",
                      priceFormatted: "₹ 220",
                      isVerifiedPrice: true,
                      isPopular: false,
                      dietary: "Vegetarian",
                    });
                    setShowAddMenuModal(true);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-crimson-600 px-4 py-2 text-xs font-semibold text-white hover:bg-crimson-500 transition-colors shadow-md shadow-crimson-950"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add New Menu Item</span>
                </button>
              </div>

              {/* Add / Edit Menu Item Modal */}
              {showAddMenuModal && (
                <div className="rounded-xl border border-crimson-800/60 bg-charcoal-850 p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-charcoal-700 pb-3">
                    <h3 className="font-display font-bold text-sm text-cream-50">
                      {editingMenuItemId ? "Edit Menu Item" : "Create New Menu Item"}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowAddMenuModal(false)}
                      className="text-cream-400 hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveMenuItem} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-mono uppercase text-cream-300">Item Name</label>
                        <input
                          type="text"
                          required
                          value={menuForm.name}
                          onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })}
                          placeholder="e.g. Kyoto Cold Brew"
                          className="w-full rounded-xl border border-charcoal-700 bg-charcoal-900 px-3 py-2 text-xs text-cream-100 focus:border-crimson-500 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-mono uppercase text-cream-300">Japanese Name (Optional)</label>
                        <input
                          type="text"
                          value={menuForm.japaneseName}
                          onChange={(e) => setMenuForm({ ...menuForm, japaneseName: e.target.value })}
                          placeholder="e.g. 京都水出し珈琲"
                          className="w-full rounded-xl border border-charcoal-700 bg-charcoal-900 px-3 py-2 text-xs text-cream-100 focus:border-crimson-500 focus:outline-none font-japanese"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-mono uppercase text-cream-300">Category</label>
                        <select
                          value={menuForm.category}
                          onChange={(e) => setMenuForm({ ...menuForm, category: e.target.value as any })}
                          className="w-full rounded-xl border border-charcoal-700 bg-charcoal-900 px-3 py-2 text-xs text-cream-100 focus:border-crimson-500 focus:outline-none"
                        >
                          <option value="coffee">Specialty Coffee</option>
                          <option value="ice-cream">Artisan Ice Cream</option>
                          <option value="bites">Japanese Bites</option>
                          <option value="specialty">Specialty Beverages</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-mono uppercase text-cream-300">Price in ₹ (INR)</label>
                        <input
                          type="number"
                          value={menuForm.price}
                          onChange={(e) =>
                            setMenuForm({
                              ...menuForm,
                              price: e.target.value,
                              priceFormatted: e.target.value ? `\u20B9 ${e.target.value}` : "\u20B9 [Price TBD]",
                            })
                          }
                          placeholder="e.g. 220"
                          className="w-full rounded-xl border border-charcoal-700 bg-charcoal-900 px-3 py-2 text-xs text-cream-100 focus:border-crimson-500 focus:outline-none font-mono"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-mono uppercase text-cream-300">Dietary</label>
                        <select
                          value={menuForm.dietary}
                          onChange={(e) => setMenuForm({ ...menuForm, dietary: e.target.value as any })}
                          className="w-full rounded-xl border border-charcoal-700 bg-charcoal-900 px-3 py-2 text-xs text-cream-100 focus:border-crimson-500 focus:outline-none"
                        >
                          <option value="Vegetarian">Vegetarian</option>
                          <option value="Vegan">Vegan</option>
                          <option value="Contains Dairy">Contains Dairy</option>
                          <option value="Egg">Egg</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-mono uppercase text-cream-300">Description</label>
                      <textarea
                        rows={2}
                        required
                        value={menuForm.description}
                        onChange={(e) => setMenuForm({ ...menuForm, description: e.target.value })}
                        placeholder="Detailed flavor notes and ingredients..."
                        className="w-full rounded-xl border border-charcoal-700 bg-charcoal-900 px-3 py-2 text-xs text-cream-100 focus:border-crimson-500 focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-6 text-xs">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={menuForm.isVerifiedPrice}
                          onChange={(e) => setMenuForm({ ...menuForm, isVerifiedPrice: e.target.checked })}
                          className="rounded border-charcoal-700 bg-charcoal-900 text-crimson-600"
                        />
                        <span className="text-cream-200">Verified Live Price (Removes &ldquo;Price TBD&rdquo; badge)</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={menuForm.isPopular}
                          onChange={(e) => setMenuForm({ ...menuForm, isPopular: e.target.checked })}
                          className="rounded border-charcoal-700 bg-charcoal-900 text-crimson-600"
                        />
                        <span className="text-cream-200">Featured / Popular Badge</span>
                      </label>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-charcoal-750">
                      <button
                        type="button"
                        onClick={() => setShowAddMenuModal(false)}
                        className="rounded-xl border border-charcoal-700 px-4 py-2 text-xs text-cream-300 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-crimson-600 px-5 py-2 text-xs font-semibold text-white hover:bg-crimson-500 shadow-md shadow-crimson-950"
                      >
                        <Save className="h-3.5 w-3.5" />
                        <span>{editingMenuItemId ? "Save Changes" : "Create Item"}</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Menu Items List with Edit & Delete */}
              <div className="space-y-3">
                {business.menu.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-charcoal-800 bg-charcoal-850 p-4 hover:border-charcoal-700 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-display text-sm font-bold text-cream-100">
                          {item.name}
                        </span>
                        {item.japaneseName && (
                          <span className="font-japanese text-[11px] text-cream-400/50">
                            {item.japaneseName}
                          </span>
                        )}
                        <span className="rounded bg-charcoal-800 px-2 py-0.5 text-[10px] font-mono text-crimson-400 uppercase">
                          {item.category}
                        </span>
                        {item.isPopular && (
                          <span className="rounded bg-crimson-950 px-1.5 py-0.5 text-[9px] font-mono text-crimson-400 border border-crimson-800/40">
                            POPULAR
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-cream-300/70 font-light max-w-xl">
                        {item.description}
                      </p>
                      <div className="flex items-center gap-2 pt-1 text-[11px] font-mono text-cream-400/60">
                        <span>Dietary: {item.dietary || "Standard"}</span>
                        <span>•</span>
                        <span className={item.isVerifiedPrice ? "text-emerald-400" : "text-amber-400"}>
                          {item.isVerifiedPrice ? "Verified Price" : "Demo Price"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                      <div className="text-right">
                        <span className="inline-block rounded-lg border border-charcoal-700 bg-charcoal-900 px-2.5 py-1 text-xs font-mono font-bold text-cream-100">
                          {item.priceFormatted}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleEditMenuItem(item)}
                        title="Edit Item"
                        className="rounded-lg border border-charcoal-700 bg-charcoal-800 p-2 text-cream-300 hover:text-white hover:border-crimson-600 transition-colors"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteMenuItem(item.id)}
                        title="Delete Item"
                        className="rounded-lg border border-charcoal-700 bg-charcoal-800 p-2 text-crimson-400 hover:bg-crimson-950/60 hover:border-crimson-800 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: OPENING HOURS & AMENITIES */}
          {activeTab === "hours" && (
            <div className="rounded-2xl border border-charcoal-800 bg-charcoal-900 p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-xl font-bold text-cream-50">
                    Opening Hours &amp; Amenities
                  </h2>
                  <p className="text-xs text-cream-300/70">
                    Update operating schedules and available cafe features.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setOperatingHours([
                      ...operatingHours,
                      {
                        days: "Holiday Special",
                        timings: "12:00 PM – 10:00 PM",
                        isVerifiedHours: true,
                        statusNote: "Holiday hours",
                      },
                    ]);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-charcoal-700 bg-charcoal-850 px-3 py-1.5 text-xs text-cream-200 hover:border-crimson-600"
                >
                  <Plus className="h-3.5 w-3.5 text-crimson-400" />
                  <span>Add Time Slot</span>
                </button>
              </div>

              {/* Hours Schedule */}
              <div className="space-y-3">
                {operatingHours.map((slot, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row items-center gap-3 rounded-xl border border-charcoal-800 bg-charcoal-850 p-4"
                  >
                    <div className="w-full sm:w-1/3">
                      <label className="text-[10px] font-mono uppercase text-cream-400 block mb-1">Days</label>
                      <input
                        type="text"
                        value={slot.days}
                        onChange={(e) => {
                          const updated = [...operatingHours];
                          updated[idx].days = e.target.value;
                          setOperatingHours(updated);
                        }}
                        className="w-full rounded-lg border border-charcoal-700 bg-charcoal-900 px-3 py-1.5 text-xs text-cream-100"
                      />
                    </div>

                    <div className="w-full sm:w-1/3">
                      <label className="text-[10px] font-mono uppercase text-cream-400 block mb-1">Timings</label>
                      <input
                        type="text"
                        value={slot.timings}
                        onChange={(e) => {
                          const updated = [...operatingHours];
                          updated[idx].timings = e.target.value;
                          setOperatingHours(updated);
                        }}
                        className="w-full rounded-lg border border-charcoal-700 bg-charcoal-900 px-3 py-1.5 text-xs text-cream-100 font-mono"
                      />
                    </div>

                    <div className="w-full sm:w-1/4">
                      <label className="text-[10px] font-mono uppercase text-cream-400 block mb-1">Status Note</label>
                      <input
                        type="text"
                        value={slot.statusNote}
                        onChange={(e) => {
                          const updated = [...operatingHours];
                          updated[idx].statusNote = e.target.value;
                          setOperatingHours(updated);
                        }}
                        className="w-full rounded-lg border border-charcoal-700 bg-charcoal-900 px-3 py-1.5 text-xs text-cream-100"
                      />
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center pt-4 sm:pt-0">
                      <button
                        type="button"
                        onClick={() => {
                          const updated = operatingHours.filter((_, i) => i !== idx);
                          setOperatingHours(updated);
                        }}
                        className="rounded-lg border border-charcoal-700 p-2 text-crimson-400 hover:bg-crimson-950/60"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Amenities Checklist */}
              <div className="pt-4 border-t border-charcoal-800 space-y-3">
                <h3 className="font-display font-bold text-sm text-cream-100">
                  Cafe Amenities
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {[
                    "Free High-Speed Wi-Fi",
                    "Air Conditioned Seating",
                    "Curated Physical Manga Library",
                    "Tabletop Board Games Available",
                    "UPI & Credit/Debit Cards Accepted",
                    "Dedicated Quiet Reading Nooks",
                  ].map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-3 bg-charcoal-850 rounded-lg border border-charcoal-800">
                      <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span className="text-cream-200">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveHours}
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 rounded-xl bg-crimson-600 px-6 py-2.5 text-xs font-semibold text-white hover:bg-crimson-500 shadow-md shadow-crimson-950"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Hours &amp; Amenities</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: CONTACT & SOCIAL LINKS */}
          {activeTab === "contact" && (
            <div className="rounded-2xl border border-charcoal-800 bg-charcoal-900 p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="font-display text-xl font-bold text-cream-50">
                  Social &amp; Contact Links
                </h2>
                <p className="text-xs text-cream-300/70">
                  Manage phone, WhatsApp, Instagram, and maps routing.
                </p>
              </div>

              <form onSubmit={handleSaveContact} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase text-cream-300 flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-crimson-400" />
                      <span>Phone Number</span>
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full rounded-xl border border-charcoal-700 bg-charcoal-850 px-3.5 py-2.5 text-xs text-cream-100 font-mono"
                    />
                    <label className="flex items-center gap-2 text-[11px] text-cream-400 pt-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isVerifiedPhone}
                        onChange={(e) => setIsVerifiedPhone(e.target.checked)}
                      />
                      <span>Mark phone number as verified (Removes placeholder notice)</span>
                    </label>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase text-cream-300 flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-crimson-400" />
                      <span>Public Email</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="hello@frecocafe.in"
                      className="w-full rounded-xl border border-charcoal-700 bg-charcoal-850 px-3.5 py-2.5 text-xs text-cream-100 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase text-cream-300">
                      Instagram Handle
                    </label>
                    <input
                      type="text"
                      value={instagramHandle}
                      onChange={(e) => setInstagramHandle(e.target.value)}
                      placeholder="@frecocafe"
                      className="w-full rounded-xl border border-charcoal-700 bg-charcoal-850 px-3.5 py-2.5 text-xs text-cream-100 font-mono text-crimson-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase text-cream-300">
                      WhatsApp Number / Link
                    </label>
                    <input
                      type="text"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full rounded-xl border border-charcoal-700 bg-charcoal-850 px-3.5 py-2.5 text-xs text-cream-100 font-mono"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 rounded-xl bg-crimson-600 px-6 py-2.5 text-xs font-semibold text-white hover:bg-crimson-500 shadow-md shadow-crimson-950"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save Contact Links</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 8: EVENTS & GAME NIGHTS */}
          {activeTab === "events" && (
            <div className="rounded-2xl border border-charcoal-800 bg-charcoal-900 p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-xl font-bold text-cream-50">
                    Community Events &amp; Game Nights
                  </h2>
                  <p className="text-xs text-cream-300/70">
                    Schedule trivia, tabletop board game tournaments, and reading hours.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddEventModal(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-crimson-600 px-4 py-2 text-xs font-semibold text-white hover:bg-crimson-500 shadow-md shadow-crimson-950"
                >
                  <Plus className="h-4 w-4" />
                  <span>Schedule Event</span>
                </button>
              </div>

              {/* Add Event Modal */}
              {showAddEventModal && (
                <div className="rounded-xl border border-crimson-800/60 bg-charcoal-850 p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-charcoal-700 pb-2">
                    <h3 className="font-display font-bold text-sm text-cream-50">Schedule New Community Event</h3>
                    <button type="button" onClick={() => setShowAddEventModal(false)} className="text-cream-400">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <form onSubmit={handleAddEvent} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-mono uppercase text-cream-400 block mb-1">Day / Recurrence</label>
                        <input
                          type="text"
                          required
                          value={eventForm.day}
                          onChange={(e) => setEventForm({ ...eventForm, day: e.target.value })}
                          placeholder="e.g. Every Friday"
                          className="w-full rounded-lg border border-charcoal-700 bg-charcoal-900 px-3 py-1.5 text-xs text-cream-100"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-mono uppercase text-cream-400 block mb-1">Time Slot</label>
                        <input
                          type="text"
                          required
                          value={eventForm.timeSlot}
                          onChange={(e) => setEventForm({ ...eventForm, timeSlot: e.target.value })}
                          placeholder="e.g. 7:00 PM – 10:00 PM"
                          className="w-full rounded-lg border border-charcoal-700 bg-charcoal-900 px-3 py-1.5 text-xs text-cream-100"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-mono uppercase text-cream-400 block mb-1">Event Title</label>
                      <input
                        type="text"
                        required
                        value={eventForm.title}
                        onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                        placeholder="e.g. Catan & Machi Koro Tournament"
                        className="w-full rounded-lg border border-charcoal-700 bg-charcoal-900 px-3 py-1.5 text-xs text-cream-100"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono uppercase text-cream-400 block mb-1">Description</label>
                      <textarea
                        rows={2}
                        required
                        value={eventForm.description}
                        onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                        placeholder="Explain tournament rules, squad sizes, or treats..."
                        className="w-full rounded-lg border border-charcoal-700 bg-charcoal-900 px-3 py-1.5 text-xs text-cream-100"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddEventModal(false)}
                        className="rounded-lg border border-charcoal-700 px-3 py-1.5 text-xs text-cream-300"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="rounded-lg bg-crimson-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-crimson-500"
                      >
                        Publish Event
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Event Cards */}
              <div className="space-y-3">
                {business.gameNights.map((event, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-xl border border-charcoal-800 bg-charcoal-850 p-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Flame className="h-4 w-4 text-crimson-400" />
                        <span className="font-display text-sm font-bold text-cream-100">{event.title}</span>
                        <span className="rounded bg-charcoal-800 px-2 py-0.5 text-[10px] font-mono text-cream-300">
                          {event.day}
                        </span>
                      </div>
                      <p className="text-xs text-cream-300/70 font-light max-w-xl">{event.description}</p>
                      <span className="text-[11px] font-mono text-crimson-400 block">{event.timeSlot}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteEvent(idx)}
                      className="rounded-lg border border-charcoal-700 p-2 text-crimson-400 hover:bg-crimson-950/60"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: OFFERS & COUPONS */}
          {activeTab === "offers" && (
            <div className="rounded-2xl border border-charcoal-800 bg-charcoal-900 p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-xl font-bold text-cream-50">
                    Active Offers &amp; Promo Codes
                  </h2>
                  <p className="text-xs text-cream-300/70">
                    Manage digital promo codes displayed to customers.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddOfferModal(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-crimson-600 px-4 py-2 text-xs font-semibold text-white hover:bg-crimson-500 shadow-md shadow-crimson-950"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create New Offer</span>
                </button>
              </div>

              {/* Add Offer Modal */}
              {showAddOfferModal && (
                <div className="rounded-xl border border-crimson-800/60 bg-charcoal-850 p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-charcoal-700 pb-2">
                    <h3 className="font-display font-bold text-sm text-cream-50">Create Promo Offer</h3>
                    <button type="button" onClick={() => setShowAddOfferModal(false)} className="text-cream-400">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <form onSubmit={handleAddOffer} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-mono uppercase text-cream-400 block mb-1">Offer Title</label>
                        <input
                          type="text"
                          required
                          value={offerForm.title}
                          onChange={(e) => setOfferForm({ ...offerForm, title: e.target.value })}
                          placeholder="e.g. Manga Reading Welcome"
                          className="w-full rounded-lg border border-charcoal-700 bg-charcoal-900 px-3 py-1.5 text-xs text-cream-100"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-mono uppercase text-cream-400 block mb-1">Promo Code</label>
                        <input
                          type="text"
                          required
                          value={offerForm.code}
                          onChange={(e) => setOfferForm({ ...offerForm, code: e.target.value.toUpperCase() })}
                          placeholder="e.g. OTAKU15"
                          className="w-full rounded-lg border border-charcoal-700 bg-charcoal-900 px-3 py-1.5 text-xs text-crimson-400 font-mono font-bold"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-mono uppercase text-cream-400 block mb-1">Discount Description</label>
                      <input
                        type="text"
                        required
                        value={offerForm.discount}
                        onChange={(e) => setOfferForm({ ...offerForm, discount: e.target.value })}
                        placeholder="e.g. 15% off first Kyoto Cold Brew with 1 hour reading"
                        className="w-full rounded-lg border border-charcoal-700 bg-charcoal-900 px-3 py-1.5 text-xs text-cream-100"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddOfferModal(false)}
                        className="rounded-lg border border-charcoal-700 px-3 py-1.5 text-xs text-cream-300"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="rounded-lg bg-crimson-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-crimson-500"
                      >
                        Save Offer
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Offers List */}
              <div className="space-y-3">
                {business.offers.map((offer) => (
                  <div
                    key={offer.id}
                    className="flex items-center justify-between rounded-xl border border-charcoal-800 bg-charcoal-850 p-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-display text-sm font-bold text-cream-100">{offer.title}</span>
                        <span className="rounded bg-crimson-950 px-2 py-0.5 text-xs font-mono font-bold text-crimson-400 border border-crimson-800/40">
                          {offer.code}
                        </span>
                      </div>
                      <p className="text-xs text-cream-300/70 font-light">{offer.discount}</p>
                      <span className="text-[10px] font-mono text-cream-400/60 block">{offer.validUntil}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteOffer(offer.id)}
                      className="rounded-lg border border-charcoal-700 p-2 text-crimson-400 hover:bg-crimson-950/60"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: GALLERY MANAGEMENT */}
          {activeTab === "gallery" && (
            <div className="rounded-2xl border border-charcoal-800 bg-charcoal-900 p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-xl font-bold text-cream-50">
                    Atmosphere Gallery Management
                  </h2>
                  <p className="text-xs text-cream-300/70">
                    Manage photography displayed in the customer gallery.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddGalleryModal(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-crimson-600 px-4 py-2 text-xs font-semibold text-white hover:bg-crimson-500 shadow-md shadow-crimson-950"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Image</span>
                </button>
              </div>

              {/* Add Gallery Item Modal */}
              {showAddGalleryModal && (
                <div className="rounded-xl border border-crimson-800/60 bg-charcoal-850 p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-charcoal-700 pb-2">
                    <h3 className="font-display font-bold text-sm text-cream-50">Add Image to Gallery</h3>
                    <button type="button" onClick={() => setShowAddGalleryModal(false)} className="text-cream-400">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <form onSubmit={handleAddGalleryItem} className="space-y-3">
                    <div>
                      <label className="text-[10px] font-mono uppercase text-cream-400 block mb-1">Image URL</label>
                      <input
                        type="url"
                        required
                        value={galleryForm.imageUrl}
                        onChange={(e) => setGalleryForm({ ...galleryForm, imageUrl: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full rounded-lg border border-charcoal-700 bg-charcoal-900 px-3 py-1.5 text-xs text-cream-100 font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-mono uppercase text-cream-400 block mb-1">Category Tag</label>
                        <select
                          value={galleryForm.tag}
                          onChange={(e) => setGalleryForm({ ...galleryForm, tag: e.target.value })}
                          className="w-full rounded-lg border border-charcoal-700 bg-charcoal-900 px-3 py-1.5 text-xs text-cream-100"
                        >
                          <option value="Coffee Bar">Coffee Bar</option>
                          <option value="Manga Library">Manga Library</option>
                          <option value="Game Nights">Game Nights</option>
                          <option value="Desserts & Ice Cream">Desserts &amp; Ice Cream</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-mono uppercase text-cream-400 block mb-1">Caption</label>
                        <input
                          type="text"
                          required
                          value={galleryForm.caption}
                          onChange={(e) => setGalleryForm({ ...galleryForm, caption: e.target.value })}
                          placeholder="e.g. Specialty brews poured with precision"
                          className="w-full rounded-lg border border-charcoal-700 bg-charcoal-900 px-3 py-1.5 text-xs text-cream-100"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddGalleryModal(false)}
                        className="rounded-lg border border-charcoal-700 px-3 py-1.5 text-xs text-cream-300"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="rounded-lg bg-crimson-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-crimson-500"
                      >
                        Add Image
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Gallery Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {business.gallery.map((item) => (
                  <div
                    key={item.id}
                    className="relative rounded-xl border border-charcoal-800 bg-charcoal-850 p-3 flex gap-3 items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.imageUrl}
                        alt={item.alt}
                        className="h-16 w-16 object-cover rounded-lg border border-charcoal-700 shrink-0"
                      />
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-crimson-400 uppercase">{item.tag}</span>
                        <p className="text-xs text-cream-200 font-medium line-clamp-1">{item.caption}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteGalleryItem(item.id)}
                      className="rounded-lg border border-charcoal-700 p-2 text-crimson-400 hover:bg-crimson-950/60 shrink-0"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 9: REVIEWS */}
          {activeTab === "reviews" && (
            <div className="rounded-2xl border border-charcoal-800 bg-charcoal-900 p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="font-display text-xl font-bold text-cream-50">
                  Customer Reviews &amp; Testimonials
                </h2>
                <p className="text-xs text-cream-300/70">
                  Featured community feedback and Google Reviews.
                </p>
              </div>

              <div className="space-y-3">
                {business.reviews.map((rev) => (
                  <div key={rev.id} className="rounded-xl border border-charcoal-800 bg-charcoal-850 p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-display font-bold text-sm text-cream-100">{rev.author}</span>
                      <div className="flex text-amber-400 text-xs">
                        {"★".repeat(rev.rating)}
                      </div>
                    </div>
                    <p className="text-xs text-cream-300/80 font-light italic">&ldquo;{rev.comment}&rdquo;</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 10: QR CODE GENERATOR */}
          {activeTab === "qr" && (
            <div className="rounded-2xl border border-charcoal-800 bg-charcoal-900 p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="font-display text-xl font-bold text-cream-50">
                  Stable Table QR Code Generator
                </h2>
                <p className="text-xs text-cream-300/70">
                  Generate print-ready QR codes for table tent cards with direct Wi-Fi mobile scanning support.
                </p>
              </div>

              {/* Target Mode Selector Tabs */}
              <div className="rounded-xl border border-charcoal-800 bg-charcoal-850 p-4 space-y-3">
                <span className="text-xs font-mono uppercase text-cream-300 block">
                  Select Target Environment for QR Code:
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setQrHostMode("wifi")}
                    className={`flex items-center gap-2.5 p-3 rounded-lg border text-left transition-all ${
                      qrHostMode === "wifi"
                        ? "border-crimson-500 bg-crimson-950/40 text-cream-50 shadow-md"
                        : "border-charcoal-700 bg-charcoal-900 text-cream-300 hover:border-charcoal-600"
                    }`}
                  >
                    <Smartphone className="h-4 w-4 text-crimson-400 shrink-0" />
                    <div>
                      <span className="block text-xs font-semibold">Mobile Phone (Wi-Fi)</span>
                      <span className="text-[10px] text-cream-400/70 font-mono">10.106.125.194:3000</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setQrHostMode("local")}
                    className={`flex items-center gap-2.5 p-3 rounded-lg border text-left transition-all ${
                      qrHostMode === "local"
                        ? "border-crimson-500 bg-crimson-950/40 text-cream-50 shadow-md"
                        : "border-charcoal-700 bg-charcoal-900 text-cream-300 hover:border-charcoal-600"
                    }`}
                  >
                    <Laptop className="h-4 w-4 text-crimson-400 shrink-0" />
                    <div>
                      <span className="block text-xs font-semibold">Localhost (Laptop Only)</span>
                      <span className="text-[10px] text-cream-400/70 font-mono">localhost:3000</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setQrHostMode("custom")}
                    className={`flex items-center gap-2.5 p-3 rounded-lg border text-left transition-all ${
                      qrHostMode === "custom"
                        ? "border-crimson-500 bg-crimson-950/40 text-cream-50 shadow-md"
                        : "border-charcoal-700 bg-charcoal-900 text-cream-300 hover:border-charcoal-600"
                    }`}
                  >
                    <Globe className="h-4 w-4 text-crimson-400 shrink-0" />
                    <div>
                      <span className="block text-xs font-semibold">Custom / Production URL</span>
                      <span className="text-[10px] text-cream-400/70 font-mono">Domain Name</span>
                    </div>
                  </button>
                </div>

                {qrHostMode === "wifi" && (
                  <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>
                      <strong>Phone Scan Ready:</strong> Scan with your phone camera while connected to the same Wi-Fi. It will open immediately!
                    </span>
                  </div>
                )}
              </div>

              {/* QR Display Frame & Details */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pt-2">
                
                {/* QR Display Frame (Col 5) */}
                <div className="md:col-span-5 flex flex-col items-center">
                  <div
                    ref={qrCanvasRef}
                    className="rounded-2xl border-4 border-charcoal-700 bg-white p-5 shadow-2xl flex flex-col items-center justify-center"
                  >
                    <QRCodeCanvas
                      value={qrTargetUrl}
                      size={220}
                      level="H"
                      includeMargin={true}
                    />
                    <div className="mt-3 text-center">
                      <span className="font-display text-xs font-bold text-charcoal-950 block">
                        {business.name}
                      </span>
                      <span className="text-[10px] font-mono text-charcoal-600 block">
                        Kandivali East • Scan for Menu
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions & Target Details (Col 7) */}
                <div className="md:col-span-7 space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase text-cream-300">
                      Active QR Code Target URL
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={qrTargetUrl}
                        className="w-full rounded-xl border border-charcoal-700 bg-charcoal-950 px-3.5 py-2.5 text-xs text-crimson-300 font-mono focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => copyToClipboard(qrTargetUrl)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-charcoal-700 bg-charcoal-850 px-4 py-2.5 text-xs font-semibold text-cream-100 hover:border-crimson-600 transition-colors shrink-0"
                      >
                        {hasCopied ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5 text-crimson-400" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={downloadQrCodePng}
                      className="inline-flex items-center gap-2 rounded-xl bg-crimson-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-crimson-500 transition-colors shadow-md shadow-crimson-950"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download Print PNG</span>
                    </button>

                    <a
                      href={qrTargetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-charcoal-700 bg-charcoal-850 px-5 py-2.5 text-xs font-medium text-cream-100 hover:border-crimson-600 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4 text-crimson-400" />
                      <span>Test Target Link</span>
                    </a>
                  </div>

                  <p className="text-[11px] text-cream-400/60 font-light">
                    Recommended print size: 3 x 3 inches or 4 x 4 inches on matte acrylic tent cards.
                  </p>
                </div>

              </div>
            </div>
          )}

          {/* TAB 11: ANALYTICS & SCANS */}
          {activeTab === "analytics" && (
            <div className="rounded-2xl border border-charcoal-800 bg-charcoal-900 p-6 sm:p-8 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="font-display text-xl font-bold text-cream-50">
                    Private Engagement Analytics
                  </h2>
                  <p className="text-xs text-cream-300/70">
                    Live scan counts, outbound direction intent, and hourly traffic.
                  </p>
                </div>

                <div className="flex items-center gap-1.5 rounded-lg border border-charcoal-700 bg-charcoal-850 p-1 text-xs">
                  <button type="button" className="rounded-md bg-crimson-600 px-3 py-1 font-semibold text-white">
                    Last 7 Days
                  </button>
                  <button type="button" className="rounded-md px-3 py-1 text-cream-300 hover:text-white">
                    Last 30 Days
                  </button>
                  <button type="button" className="rounded-md px-3 py-1 text-cream-300 hover:text-white">
                    Today
                  </button>
                </div>
              </div>

              {/* Strict Integrity Disclaimer */}
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-200/90 flex items-center gap-2.5">
                <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
                <span>
                  <strong>Data Integrity Rule:</strong> QR scans and online pageviews measure digital engagements, not verified unique customers or proof of physical footfall.
                </span>
              </div>

              {/* KPI Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-xl border border-charcoal-800 bg-charcoal-850 p-4 space-y-1">
                  <span className="text-[11px] font-mono text-cream-400/60 block">Organic Profile Visits</span>
                  <span className="font-display text-3xl font-bold text-cream-50">
                    {business.analytics.organicViews}
                  </span>
                  <span className="text-[11px] text-cream-400/60 font-mono">Web / Search Link</span>
                </div>

                <div className="rounded-xl border border-charcoal-800 bg-charcoal-850 p-4 space-y-1">
                  <span className="text-[11px] font-mono text-cream-400/60 block">Table QR Code Scans</span>
                  <span className="font-display text-3xl font-bold text-crimson-400">
                    {business.analytics.qrScans}
                  </span>
                  <span className="text-[11px] text-crimson-300/80 font-mono">Attributed via ?src=qr</span>
                </div>

                <div className="rounded-xl border border-charcoal-800 bg-charcoal-850 p-4 space-y-1">
                  <span className="text-[11px] font-mono text-cream-400/60 block">Google Maps Directions</span>
                  <span className="font-display text-3xl font-bold text-cream-50">
                    {business.analytics.linkClicks.googleMaps}
                  </span>
                  <span className="text-[11px] text-emerald-400 font-mono">High Purchase Intent</span>
                </div>
              </div>

              {/* Peak Hours Visual Chart */}
              <div className="rounded-xl border border-charcoal-800 bg-charcoal-850 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-sm font-bold text-cream-50">
                    Estimated Peak Engagement Hours (Cafe Rhythm)
                  </h3>
                  <span className="text-[11px] font-mono text-cream-400/60">
                    11:00 AM – 11:00 PM
                  </span>
                </div>

                <div className="grid grid-cols-7 gap-2 items-end h-36 pt-4 border-b border-charcoal-750 pb-2">
                  {business.analytics.hourlyTraffic.map((hourSlot, idx) => {
                    const maxHeight = 68;
                    const heightPercent = Math.round((hourSlot.count / maxHeight) * 100);
                    return (
                      <div key={idx} className="flex flex-col items-center gap-1.5 h-full justify-end">
                        <span className="text-[10px] font-mono text-cream-400/70">{hourSlot.count}</span>
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className="w-full rounded-t-md bg-gradient-to-t from-crimson-700 to-crimson-500 hover:to-crimson-400 transition-all cursor-pointer"
                        />
                        <span className="text-[10px] font-mono text-cream-300">{hourSlot.hour}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 12: LOYALTY */}
          {activeTab === "loyalty" && (
            <div className="rounded-2xl border border-charcoal-800 bg-charcoal-900 p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="font-display text-xl font-bold text-cream-50">
                  Loyalty &amp; Repeat Customer Program
                </h2>
                <p className="text-xs text-cream-300/70">
                  Configure points, rewards, and duplicate transaction protection.
                </p>
              </div>

              <div className="rounded-xl border border-charcoal-800 bg-charcoal-850 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="font-display text-base font-bold text-cream-50">
                      {business.loyaltyProgram.name}
                    </span>
                    <p className="text-xs text-cream-300/70">
                      {business.loyaltyProgram.rewardDescription}
                    </p>
                  </div>
                  <span className="rounded bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-xs font-mono text-emerald-400">
                    Active Program
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                  <div className="p-3 bg-charcoal-900 rounded-lg border border-charcoal-800">
                    <span className="text-cream-400 block mb-1">Points Per Visit / Scan:</span>
                    <span className="font-bold font-mono text-crimson-400 text-sm">
                      +{business.loyaltyProgram.pointsPerVisit} pts
                    </span>
                  </div>

                  <div className="p-3 bg-charcoal-900 rounded-lg border border-charcoal-800">
                    <span className="text-cream-400 block mb-1">Reward Unlock Threshold:</span>
                    <span className="font-bold font-mono text-cream-100 text-sm">
                      {business.loyaltyProgram.rewardThreshold} pts
                    </span>
                  </div>
                </div>

                <div className="rounded-lg border border-charcoal-800 bg-charcoal-950 p-3.5 text-xs text-amber-200/80 font-mono">
                  {business.loyaltyProgram.duplicateSafeguardNote}
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
