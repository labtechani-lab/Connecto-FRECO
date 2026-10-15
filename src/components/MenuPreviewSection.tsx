"use client";

import React, { useState } from "react";
import { FreCoProfile, frecoCafeData, MenuItem } from "@/data/frecoData";
import { Coffee, IceCream, Sandwich, Sparkles, AlertCircle } from "lucide-react";

interface MenuPreviewProps {
  data?: Partial<FreCoProfile>;
}

export default function MenuPreviewSection({ data }: MenuPreviewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const menuItems = data?.menu || frecoCafeData.menu;

  const categories = [
    { id: "all", label: "All Offerings", icon: Sparkles },
    { id: "coffee", label: "Specialty Coffee", icon: Coffee },
    { id: "ice-cream", label: "Artisan Ice Cream", icon: IceCream },
    { id: "bites", label: "Japanese Bites", icon: Sandwich },
  ];

  const filteredItems =
    selectedCategory === "all"
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory);

  return (
    <section id="menu" className="relative bg-charcoal-950 py-20 border-b border-charcoal-800/80 bg-manga-dots">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-crimson-800/40 bg-crimson-950/30 px-3.5 py-1 text-xs font-semibold text-crimson-400">
            <span>献立 • MENU PREVIEW</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-cream-50">
            Artisanal Brews, Gelato & Comfort Food
          </h2>
          <p className="text-cream-300/80 text-base leading-relaxed">
            Every item is crafted to complement hours of reading and friendly gaming tournaments.
          </p>

          {/* Explicit Placeholder Notice */}
          <div className="mx-auto max-w-2xl rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200/90 flex items-center justify-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-400 shrink-0" />
            <span>
              <strong>Notice:</strong> Menu items and prices shown below are initial demo representations awaiting official cafe verification.
            </span>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-crimson-600 text-white shadow-md shadow-crimson-950"
                    : "border border-charcoal-800 bg-charcoal-900 text-cream-200 hover:border-charcoal-700 hover:text-white"
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? "text-white" : "text-crimson-400"}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Menu Items Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-2xl border border-charcoal-800 bg-charcoal-900/90 p-6 transition-all duration-200 hover:border-charcoal-700 hover:shadow-lg hover:shadow-black/40"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-lg font-bold text-cream-50 group-hover:text-crimson-400 transition-colors">
                      {item.name}
                    </h3>
                    {item.isPopular && (
                      <span className="rounded bg-crimson-950 px-2 py-0.5 text-[10px] font-semibold text-crimson-400 border border-crimson-800/40">
                        Popular
                      </span>
                    )}
                  </div>
                  {item.japaneseName && (
                    <p className="font-japanese text-xs font-medium text-cream-400/50">
                      {item.japaneseName}
                    </p>
                  )}
                </div>

                {/* Price pill with explicit placeholder indicator */}
                <div className="text-right shrink-0">
                  <span className="inline-block rounded-lg border border-charcoal-700 bg-charcoal-800 px-2.5 py-1 text-xs font-mono font-medium text-cream-200">
                    {item.priceFormatted}
                  </span>
                  {!item.isVerifiedPrice && (
                    <span className="block text-[9px] font-mono text-amber-400/80 mt-1">
                      Unverified
                    </span>
                  )}
                </div>
              </div>

              <p className="mt-3 text-xs sm:text-sm text-cream-300/70 leading-relaxed font-light">
                {item.description}
              </p>

              {/* Dietary tag */}
              {item.dietary && (
                <div className="mt-4 flex items-center gap-2">
                  <span className="rounded-md border border-charcoal-700 bg-charcoal-850 px-2 py-0.5 text-[10px] font-medium text-cream-300">
                    {item.dietary}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Menu Footnote */}
        <div className="mt-12 text-center text-xs text-cream-400/60 font-mono">
          <span>Seasonal specials & daily bakery selections rotated weekly at Kandivali East.</span>
        </div>

      </div>
    </section>
  );
}
