import React from "react";
import { FreCoProfile, frecoCafeData } from "@/data/frecoData";
import { BookOpen, Dice5, Calendar, ShieldCheck, Flame, Users } from "lucide-react";

interface MangaGamingProps {
  data?: Partial<FreCoProfile>;
}

export default function MangaGamingSection({ data }: MangaGamingProps) {
  const cafe = { ...frecoCafeData, ...data };
  return (
    <section id="manga-games" className="relative bg-charcoal-900 py-20 border-b border-charcoal-800/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-charcoal-700 bg-charcoal-800 px-3.5 py-1 text-xs font-semibold text-crimson-400">
            <span>漫画 & 競技 • MANGA & GAMES</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-cream-50">
            Where Otaku Culture Meets Mumbai Community
          </h2>
          <p className="text-cream-300/80 text-base leading-relaxed">
            Whether you want a quiet solo corner with legendary manga or an energetic Friday board game night with friends.
          </p>
        </div>

        {/* 2-Column Split: Left Manga, Right Game Nights */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* Left Column: Curated Manga Library */}
          <div className="rounded-2xl border border-charcoal-800 bg-charcoal-850/80 p-8 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-charcoal-700">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-crimson-950/60 border border-crimson-800/40 text-crimson-400">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold text-cream-50">
                      Curated Manga Vault
                    </h3>
                    <p className="text-xs text-cream-400/60 font-mono">
                      {cafe.mangaCountEstimate}
                    </p>
                  </div>
                </div>
                <span className="rounded-md bg-charcoal-800 px-2.5 py-1 text-[11px] font-mono text-cream-300 border border-charcoal-700">
                  Physical Editions
                </span>
              </div>

              <p className="mt-5 text-sm text-cream-300/80 leading-relaxed font-light">
                Browse through high-quality tankōbon and omnibus volumes spanning shonen epics, 
                gripping dark fantasies, and heartwarming slice-of-life tales. Free for all cafe patrons to read on-site.
              </p>

              {/* Sample Manga Shelf Cards */}
              <div className="mt-6 space-y-3">
                {cafe.mangaHighlights.map((manga, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-xl border border-charcoal-800 bg-charcoal-900/90 px-4 py-3 hover:border-charcoal-700 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display text-sm font-semibold text-cream-100">
                          {manga.title}
                        </span>
                        {manga.japaneseTitle && (
                          <span className="font-japanese text-[11px] text-cream-400/40">
                            {manga.japaneseTitle}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-crimson-400 font-mono">
                        {manga.genre}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-mono text-cream-300/80">
                        {manga.volumesAvailable}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 rounded-xl border border-charcoal-800 bg-charcoal-900/60 p-4 text-xs text-cream-300/70 flex items-center gap-2.5">
              <ShieldCheck className="h-4 w-4 text-crimson-400 shrink-0" />
              <span>Library policy: Read responsibly, keep food away from pages, and return to shelf after reading.</span>
            </div>
          </div>

          {/* Right Column: Weekly Game Nights & Events */}
          <div className="rounded-2xl border border-charcoal-800 bg-charcoal-850/80 p-8 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-charcoal-700">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-crimson-950/60 border border-crimson-800/40 text-crimson-400">
                    <Dice5 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold text-cream-50">
                      Community Game Nights
                    </h3>
                    <p className="text-xs text-cream-400/60 font-mono">
                      {cafe.boardGamesCountEstimate}
                    </p>
                  </div>
                </div>
                <span className="rounded-md bg-charcoal-800 px-2.5 py-1 text-[11px] font-mono text-crimson-400 border border-charcoal-700">
                  Weekly Schedule
                </span>
              </div>

              <p className="mt-5 text-sm text-cream-300/80 leading-relaxed font-light">
                Bring your tabletop group or drop in solo! FreCo hosts scheduled community showdowns, 
                beginner-friendly strategy sessions, and intense anime trivia battles.
              </p>

              {/* Event Cards */}
              <div className="mt-6 space-y-3">
                {cafe.gameNights.map((event, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-charcoal-800 bg-charcoal-900/90 p-4 space-y-1.5 hover:border-charcoal-700 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Flame className="h-3.5 w-3.5 text-crimson-400" />
                        <span className="font-display text-sm font-semibold text-cream-100">
                          {event.title}
                        </span>
                      </div>
                      <span className="rounded bg-charcoal-800 px-2 py-0.5 text-[10px] font-mono text-cream-200">
                        {event.day}
                      </span>
                    </div>

                    <p className="text-xs text-cream-300/70 font-light leading-relaxed">
                      {event.description}
                    </p>

                    <div className="pt-1 flex items-center justify-between text-[11px] text-cream-400/60 font-mono">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-crimson-400" />
                        {event.timeSlot}
                      </span>
                      <span className="text-amber-400/80">Demo Schedule</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 rounded-xl border border-charcoal-800 bg-charcoal-900/60 p-4 text-xs text-cream-300/70 flex items-center gap-2.5">
              <Users className="h-4 w-4 text-crimson-400 shrink-0" />
              <span>Free entry with any beverage order. Walk-ins welcome, group tables subject to seating.</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
