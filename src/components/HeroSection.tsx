import React from "react";
import { FreCoProfile, frecoCafeData } from "@/data/frecoData";
import { Coffee, BookOpen, Dice5, IceCream, MapPin, ArrowRight, Sparkles } from "lucide-react";

interface HeroSectionProps {
  data?: Partial<FreCoProfile>;
}

export default function HeroSection({ data }: HeroSectionProps) {
  const cafe = { ...frecoCafeData, ...data };
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    cafe.address.fullFormatted
  )}`;

  return (
    <section className="relative overflow-hidden bg-charcoal-950 pt-12 pb-20 md:pt-20 md:pb-32 bg-subtle-grid border-b border-charcoal-800/60">
      {/* Restrained crimson radial glow background effect */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-crimson-600/10 blur-[130px] rounded-full" />
      <div className="pointer-events-none absolute -right-20 top-40 w-[300px] h-[300px] bg-charcoal-700/20 blur-[100px] rounded-full" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Hero Copy (Col 7) */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-6">
            
            {/* Japanese badge & category pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-crimson-800/40 bg-charcoal-900/90 px-3.5 py-1 text-xs text-cream-200 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-crimson-500 animate-pulse" />
              <span className="font-semibold text-crimson-400">喫茶・漫画</span>
              <span className="text-charcoal-600">•</span>
              <span className="text-cream-300 font-medium">{cafe.address.area}</span>
            </div>

            {/* Main Headline & Tagline */}
            <div className="space-y-3">
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-cream-50 leading-[1.1]">
                {cafe.name.includes("FreCo") ? (
                  <>
                    Mumbai&apos;s Ultimate <br />
                    <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-cream-100 via-cream-50 to-crimson-400">
                      Anime Café
                    </span>
                  </>
                ) : (
                  <span>{cafe.name}</span>
                )}
              </h1>
              <p className="text-xl sm:text-2xl font-medium tracking-wide text-crimson-400 font-display">
                &ldquo;{cafe.tagline}&rdquo;
              </p>
            </div>

            {/* Description */}
            <p className="max-w-2xl text-base sm:text-lg text-cream-300/80 leading-relaxed font-light">
              {cafe.identity}
            </p>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2 w-full sm:w-auto">
              <a
                href="#menu"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-crimson-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-crimson-950/60 hover:bg-crimson-500 transition-all active:scale-[0.98]"
              >
                <span>Explore Menu Preview</span>
                <ArrowRight className="h-4 w-4" />
              </a>

              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-charcoal-700 bg-charcoal-850 px-6 py-3.5 text-sm font-medium text-cream-100 hover:border-crimson-600 hover:text-crimson-300 transition-all active:scale-[0.98]"
              >
                <MapPin className="h-4 w-4 text-crimson-500" />
                <span>Visit Us in Kandivali East</span>
              </a>
            </div>

            {/* Quick feature pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 w-full">
              <div className="flex items-center gap-2.5 rounded-lg border border-charcoal-800 bg-charcoal-900/60 p-2.5 text-xs">
                <Coffee className="h-4 w-4 text-crimson-400 shrink-0" />
                <span className="font-medium text-cream-200">Specialty Coffee</span>
              </div>
              <div className="flex items-center gap-2.5 rounded-lg border border-charcoal-800 bg-charcoal-900/60 p-2.5 text-xs">
                <IceCream className="h-4 w-4 text-crimson-400 shrink-0" />
                <span className="font-medium text-cream-200">Artisan Gelato</span>
              </div>
              <div className="flex items-center gap-2.5 rounded-lg border border-charcoal-800 bg-charcoal-900/60 p-2.5 text-xs">
                <BookOpen className="h-4 w-4 text-crimson-400 shrink-0" />
                <span className="font-medium text-cream-200">Manga Library</span>
              </div>
              <div className="flex items-center gap-2.5 rounded-lg border border-charcoal-800 bg-charcoal-900/60 p-2.5 text-xs">
                <Dice5 className="h-4 w-4 text-crimson-400 shrink-0" />
                <span className="font-medium text-cream-200">Game Nights</span>
              </div>
            </div>

          </div>

          {/* Aesthetic Hero Card / Manga Panel composition (Col 5) */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Outer decorative Japanese border frame */}
              <div className="relative rounded-2xl border-2 border-charcoal-700/80 bg-charcoal-900 p-3 shadow-2xl shadow-black/80">
                <div className="absolute -top-3 -right-3 rounded-md bg-crimson-600 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-md">
                  喫茶店 • FRECO
                </div>

                {/* Hero imagery card */}
                <div className="relative h-80 sm:h-96 w-full overflow-hidden rounded-xl bg-charcoal-950">
                  <img
                    src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80"
                    alt="FreCo Cafe Japanese Aesthetic Ambiance"
                    className="h-full w-full object-cover opacity-85 transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/40 to-transparent" />

                  {/* Overlay text on image */}
                  <div className="absolute bottom-4 left-4 right-4 space-y-2">
                    <div className="inline-flex items-center gap-1.5 rounded bg-charcoal-950/80 px-2.5 py-1 text-[11px] font-semibold text-crimson-400 border border-crimson-900/40 backdrop-blur-sm">
                      <Sparkles className="h-3 w-3" />
                      <span>Thakur Complex Community Hub</span>
                    </div>
                    <p className="text-sm font-medium text-cream-100">
                      Shop 4, 5, 6, A-1, Saraf Choudhary Nagar, Kandivali East
                    </p>
                  </div>
                </div>

                {/* Status notice */}
                <div className="mt-3 flex items-center justify-between px-2 text-xs text-cream-300/70">
                  <span className="flex items-center gap-1.5 font-mono">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Open for Community
                  </span>
                  <span className="text-[11px] font-mono text-charcoal-600">
                    CONNECTO PROFILE v1.0
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
