import React from "react";
import { FreCoProfile, frecoCafeData } from "@/data/frecoData";
import { Coffee, Heart, ArrowUp } from "lucide-react";

interface FooterProps {
  data?: Partial<FreCoProfile>;
}

export default function Footer({ data }: FooterProps) {
  const cafe = { ...frecoCafeData, ...data };

  return (
    <footer className="bg-charcoal-950 border-t border-charcoal-800 text-cream-300 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-charcoal-850">
          
          {/* Brand Info (Col 5) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-crimson-600/40 bg-crimson-950/40 text-crimson-500">
                <Coffee className="h-4 w-4" />
              </div>
              <span className="font-display text-xl font-bold text-cream-50">
                {cafe.name}
              </span>
              <span className="font-japanese text-xs text-crimson-400 font-medium">
                フレコ カフェ
              </span>
            </div>

            <p className="text-xs sm:text-sm text-cream-400/80 leading-relaxed max-w-sm">
              {cafe.identity} Tagline: &ldquo;{cafe.tagline}&rdquo;
            </p>

            <p className="text-xs font-mono text-cream-400/50">
              Thakur Complex, Kandivali East, Mumbai 400101
            </p>
          </div>

          {/* Quick Links (Col 4) */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-cream-200">
              Profile Navigation
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <a href="#story" className="hover:text-crimson-400 transition-colors">
                  Our Story & Philosophy
                </a>
              </li>
              <li>
                <a href="#menu" className="hover:text-crimson-400 transition-colors">
                  Menu Offerings & Cold Brews
                </a>
              </li>
              <li>
                <a href="#manga-games" className="hover:text-crimson-400 transition-colors">
                  Manga Library & Board Games
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-crimson-400 transition-colors">
                  Cafe Atmosphere
                </a>
              </li>
              <li>
                <a href="#location" className="hover:text-crimson-400 transition-colors">
                  Address & Operating Hours
                </a>
              </li>
            </ul>
          </div>

          {/* Connecto Ecosystem & Disclaimer (Col 3) */}
          <div className="md:col-span-3 space-y-3">
            <div className="rounded-xl border border-charcoal-800 bg-charcoal-900/60 p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-crimson-500" />
                <span className="text-xs font-bold text-cream-50 font-display">
                  CONNECTO PLATFORM
                </span>
              </div>
              <p className="text-[11px] text-cream-400/70 leading-relaxed">
                Phase 1: Digital Business Profile. Future phases include Supabase auth, owner dashboard & dynamic QR generation.
              </p>
            </div>

            <a
              href="#"
              className="inline-flex items-center gap-1.5 text-xs text-cream-400/60 hover:text-crimson-400 transition-colors"
            >
              <ArrowUp className="h-3.5 w-3.5" />
              <span>Back to top</span>
            </a>
          </div>

        </div>

        {/* Bottom Disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-cream-400/50">
          <p>
            © {new Date().getFullYear()} {frecoCafeData.name}. All rights reserved. Powered by CONNECTO.
          </p>
          <div className="flex items-center gap-1 text-[11px]">
            <span>Crafted with</span>
            <Heart className="h-3 w-3 text-crimson-500 fill-crimson-500 inline" />
            <span>for Mumbai&apos;s Otaku & Coffee Community</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
