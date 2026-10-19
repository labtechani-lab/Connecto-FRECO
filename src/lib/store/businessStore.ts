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
    offers: [],
    loyaltyProgram: {
      enabled: false,
      name: "",
      pointsPerVisit: 0,
      rewardThreshold: 0,
      rewardDescription: "",
      duplicateSafeguardNote: "",
    },
    analytics: {
      totalViews: 0,
      qrScans: 0,
      organicViews: 0,
      linkClicks: { googleMaps: 0, instagram: 0, phone: 0, whatsapp: 0 },
      hourlyTraffic: [],
      recentEvents: [],
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
