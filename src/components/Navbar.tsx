"use client";

import React, { useState } from "react";
import { FreCoProfile, frecoCafeData } from "@/data/frecoData";
import { Coffee, MapPin, Menu, X, Compass, Clock, Shield } from "lucide-react";

interface NavbarProps {
  data?: Partial<FreCoProfile>;
}

export default function Navbar({ data }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const cafe = { ...frecoCafeData, ...data };

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    cafe.address.fullFormatted
  )}`;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-charcoal-800/80 bg-charcoal-950/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand Logo & Kanji */}
        <a href="#" className="group flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-crimson-600/40 bg-crimson-950/40 text-crimson-500 shadow-inner group-hover:border-crimson-500 transition-colors">
            <Coffee className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-xl font-bold tracking-tight text-cream-50 group-hover:text-crimson-400 transition-colors">
                {cafe.name}
              </span>
              <span className="rounded bg-crimson-950/80 px-1.5 py-0.5 text-[10px] font-medium tracking-wide text-crimson-400 border border-crimson-800/40">
                フレコ
              </span>
            </div>
            <p className="text-[11px] text-cream-300/70 font-mono tracking-wider">
              KANDIVALI EAST • MUMBAI
            </p>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#story"
            className="text-sm font-medium text-cream-200/80 hover:text-crimson-400 transition-colors"
          >
            Story
          </a>
          <a
            href="#menu"
            className="text-sm font-medium text-cream-200/80 hover:text-crimson-400 transition-colors"
          >
            Menu Preview
          </a>
          <a
            href="#manga-games"
            className="text-sm font-medium text-cream-200/80 hover:text-crimson-400 transition-colors"
          >
            Manga & Games
          </a>
          <a
            href="#gallery"
            className="text-sm font-medium text-cream-200/80 hover:text-crimson-400 transition-colors"
          >
            Gallery
          </a>
          <a
            href="#location"
            className="text-sm font-medium text-cream-200/80 hover:text-crimson-400 transition-colors"
          >
            Location & Hours
          </a>
        </nav>

        {/* CTA Buttons */}
        <div className="hidden items-center gap-3 sm:flex">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-charcoal-700 bg-charcoal-850 px-3 py-1.5 text-xs font-medium text-cream-100 hover:border-crimson-600 hover:text-crimson-400 transition-all shadow-sm"
          >
            <Compass className="h-3.5 w-3.5 text-crimson-500" />
            <span>Find on Maps</span>
          </a>
          <a
            href="#location"
            className="inline-flex items-center gap-1.5 rounded-lg bg-crimson-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-crimson-500 transition-colors shadow-md shadow-crimson-950"
          >
            <Clock className="h-3.5 w-3.5" />
            <span>Hours & Visit</span>
          </a>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-cream-200 hover:bg-charcoal-850 hover:text-cream-50"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-charcoal-800 bg-charcoal-900 px-4 py-4 md:hidden">
          <div className="flex flex-col space-y-3">
            <a
              href="#story"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium text-cream-200 hover:text-crimson-400 hover:bg-charcoal-800 rounded-md"
            >
              Story & Culture
            </a>
            <a
              href="#menu"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium text-cream-200 hover:text-crimson-400 hover:bg-charcoal-800 rounded-md"
            >
              Menu Preview
            </a>
            <a
              href="#manga-games"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium text-cream-200 hover:text-crimson-400 hover:bg-charcoal-800 rounded-md"
            >
              Manga Library & Game Nights
            </a>
            <a
              href="#gallery"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium text-cream-200 hover:text-crimson-400 hover:bg-charcoal-800 rounded-md"
            >
              Atmosphere Gallery
            </a>
            <a
              href="#location"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium text-cream-200 hover:text-crimson-400 hover:bg-charcoal-800 rounded-md"
            >
              Address & Hours
            </a>
            <div className="pt-2 flex flex-col gap-2">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-lg border border-charcoal-700 bg-charcoal-800 py-2 text-xs font-medium text-cream-100"
              >
                <MapPin className="h-4 w-4 text-crimson-500" />
                <span>Open in Google Maps</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
