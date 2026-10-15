
"use client";

import React, { useState, useEffect } from "react";
import { BusinessData } from "@/lib/store/businessStore";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StorySection from "@/components/StorySection";
import MenuPreviewSection from "@/components/MenuPreviewSection";
import MangaGamingSection from "@/components/MangaGamingSection";
import GallerySection from "@/components/GallerySection";
import BusinessLinksSection from "@/components/BusinessLinksSection";
import LocationHoursSection from "@/components/LocationHoursSection";
import Footer from "@/components/Footer";
import { QrCode, Shield, ExternalLink, Sparkles } from "lucide-react";

interface PublicProfileViewProps {
  initialBusiness: BusinessData;
  slug: string;
  isQrVisit: boolean;
}

export default function PublicProfileView({
  initialBusiness,
  slug,
  isQrVisit,
}: PublicProfileViewProps) {
  const [business, setBusiness] = useState<BusinessData>(initialBusiness);

  // Refresh persisted data after server rendering.
  useEffect(() => {
    let isActive = true;

    fetch(`/api/business/${slug}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isActive && data) {
          setBusiness(data);
        }
      })
      .catch(() => {});

    return () => {
      isActive = false;
    };
  }, [slug]);

  return (
    <main className="min-h-screen bg-charcoal-950 text-cream-100 flex flex-col">
      {/* CONNECTO Platform Header */}
      <div className="bg-charcoal-900 border-b border-charcoal-800 text-xs text-cream-300/80 px-4 py-2">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-crimson-500" />

            <span className="font-semibold text-cream-100">
              CONNECTO Platform
            </span>

            <span className="text-charcoal-600">•</span>

            <span className="font-mono text-[11px] text-cream-400">
              /b/{business.slug}
            </span>

            {isQrVisit && (
              <span className="inline-flex items-center gap-1 rounded bg-crimson-950 px-2 py-0.5 text-[10px] font-mono text-crimson-400 border border-crimson-800/40">
                <QrCode className="h-3 w-3" />
                <span>QR Table Scan Detected</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <a
              href={`/dashboard?biz=${business.slug}`}
              className="inline-flex items-center gap-1 text-[11px] text-crimson-400 hover:text-crimson-300 font-medium transition-colors"
            >
              <Shield className="h-3 w-3" />
              <span>Owner Dashboard</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>

      {/* QR Visitor Welcome Message */}
      {isQrVisit && (
        <div className="bg-crimson-950/60 border-b border-crimson-800/50 px-4 py-2.5 text-center text-xs text-cream-100 flex items-center justify-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-crimson-400" />
          <span>
            Welcome to <strong>{business.name}</strong>! You scanned our table
            QR code in Kandivali East. Enjoy your visit!
          </span>
        </div>
      )}

      {/* Existing Business Profile Sections */}
      <Navbar data={business} />
      <HeroSection data={business} />
      <StorySection data={business} />
      <MenuPreviewSection data={business} />
      <MangaGamingSection data={business} />
      <GallerySection data={business} />

      {/* Google Reviews, Ordering and WhatsApp Links */}
      <BusinessLinksSection links={business.links} />

      <LocationHoursSection data={business} />
      <Footer data={business} />
    </main>
  );
}
