import { frecoCafeData, FreCoProfile, MenuItem, GameNightEvent } from "@/data/frecoData";

export interface BusinessAnalytics {
  totalViews: number;
  qrScans: number;
  organicViews: number;
  linkClicks: {
    googleMaps: number;
    instagram: number;
    phone: number;
    whatsapp: number;
  };
  hourlyTraffic: { hour: string; count: number }[];
  recentEvents: {
    id: string;
    type: "qr_scan" | "page_view" | "link_click";
    label: string;
    timestamp: string;
  }[];
}

export interface BusinessOffer {
  id: string;
  title: string;
  code: string;
  discount: string;
  validUntil: string;
  isActive: boolean;
}

export interface BusinessData extends FreCoProfile {
  id: string;
  slug: string;
  isPublished: boolean;
  offers: BusinessOffer[];
  analytics: BusinessAnalytics;
  loyaltyProgram: {
    enabled: boolean;
    name: string;
    pointsPerVisit: number;
    rewardThreshold: number;
    rewardDescription: string;
    duplicateSafeguardNote: string;
  };
}

// Initial registered businesses in CONNECTO Multi-Business Platform
const initialBusinesses: Record<string, BusinessData> = {
  "freco-cafe": {
    ...frecoCafeData,
    id: "biz-freco-001",
    slug: "freco-cafe",
    isPublished: true,
    offers: [
      {
        id: "off-1",
        title: "Cold Brew Community Welcome",
        code: "FRECOBREW",
        discount: "15% off first specialty cold brew with manga session",
        validUntil: "End of Month (Demo Offer)",
        isActive: true,
      },
      {
        id: "off-2",
        title: "Tabletop Friday Squad Pass",
        code: "SQUADGAME",
        discount: "Free artisan gelato scoop for teams of 4+ on Game Nights",
        validUntil: "Ongoing Fridays (Demo Offer)",
        isActive: true,
      },
    ],
    loyaltyProgram: {
      enabled: true,
      name: "FreCo Otaku Club",
      pointsPerVisit: 10,
      rewardThreshold: 100,
      rewardDescription: "Complimentary signature tasting flight or manga volume voucher",
      duplicateSafeguardNote:
        "Safeguard: 1 scan per verified bill transaction / 4-hour cooldown enforced to prevent duplicate claims.",
    },
    analytics: {
      totalViews: 342,
      qrScans: 118,
      organicViews: 224,
      linkClicks: {
        googleMaps: 64,
        instagram: 41,
        phone: 19,
        whatsapp: 12,
      },
      hourlyTraffic: [
        { hour: "11 AM", count: 8 },
        { hour: "1 PM", count: 24 },
        { hour: "3 PM", count: 18 },
        { hour: "5 PM", count: 42 },
        { hour: "7 PM", count: 68 },
        { hour: "9 PM", count: 54 },
        { hour: "10 PM", count: 28 },
      ],
      recentEvents: [
        {
          id: "ev-1",
          type: "qr_scan",
          label: "Table tent QR scan at FreCo Cafe (Kandivali East)",
          timestamp: "12 mins ago",
        },
        {
          id: "ev-2",
          type: "link_click",
          label: "Outbound directions click: Google Maps (Thakur Complex)",
          timestamp: "28 mins ago",
        },
        {
          id: "ev-3",
          type: "page_view",
          label: "Organic profile view from desktop search",
          timestamp: "45 mins ago",
        },
        {
          id: "ev-4",
          type: "link_click",
          label: "Instagram handle click: @frecocafe",
          timestamp: "1 hour ago",
        },
      ],
    },
  },
};

export class BusinessStore {
  private static instance: BusinessStore;
  private businesses: Record<string, BusinessData> = initialBusinesses;

  private constructor() {}

  public static getInstance(): BusinessStore {
    if (!BusinessStore.instance) {
      BusinessStore.instance = new BusinessStore();
    }
    return BusinessStore.instance;
  }

  public getBusiness(slug: string): BusinessData | null {
    return this.businesses[slug] || null;
  }

  public getAllBusinesses(): BusinessData[] {
    return Object.values(this.businesses);
  }

  public updateBusiness(slug: string, updates: Partial<BusinessData>): BusinessData | null {
    if (!this.businesses[slug]) return null;
    this.businesses[slug] = {
      ...this.businesses[slug],
      ...updates,
    };
    return this.businesses[slug];
  }

  public trackVisit(slug: string, source: "qr" | "organic"): void {
    const biz = this.businesses[slug];
    if (!biz) return;
    biz.analytics.totalViews += 1;
    if (source === "qr") {
      biz.analytics.qrScans += 1;
      biz.analytics.recentEvents.unshift({
        id: `ev-${Date.now()}`,
        type: "qr_scan",
        label: `Table tent QR scan at ${biz.name}`,
        timestamp: "Just now",
      });
    } else {
      biz.analytics.organicViews += 1;
      biz.analytics.recentEvents.unshift({
        id: `ev-${Date.now()}`,
        type: "page_view",
        label: `Organic profile view for ${biz.name}`,
        timestamp: "Just now",
      });
    }
    if (biz.analytics.recentEvents.length > 20) {
      biz.analytics.recentEvents.pop();
    }
  }

  public trackLinkClick(slug: string, type: "googleMaps" | "instagram" | "phone" | "whatsapp"): void {
    const biz = this.businesses[slug];
    if (!biz) return;
    biz.analytics.linkClicks[type] += 1;
    biz.analytics.recentEvents.unshift({
      id: `ev-${Date.now()}`,
      type: "link_click",
      label: `Outbound click: ${type}`,
      timestamp: "Just now",
    });
    if (biz.analytics.recentEvents.length > 20) {
      biz.analytics.recentEvents.pop();
    }
  }
}

export const businessStore = BusinessStore.getInstance();
