import React from "react";
import { FreCoProfile, frecoCafeData } from "@/data/frecoData";
import { Utensils, Gamepad2, BookMarked, RotateCw } from "lucide-react";

interface StorySectionProps {
  data?: Partial<FreCoProfile>;
}

export default function StorySection({ data }: StorySectionProps) {
  const cafe = { ...frecoCafeData, ...data };
  const pillars = [
    {
      icon: Utensils,
      title: "Eat",
      subtitle: "食 (Shoku)",
      desc: "From slow-dripped Kyoto cold brews to artisanal black sesame and yuzu gelato, every treat is crafted with precision and balance.",
    },
    {
      icon: Gamepad2,
      title: "Play",
      subtitle: "遊 (Asobi)",
      desc: "Gather friends for weekly tabletop sessions, Japanese strategy board games, and anime trivia nights in a warm, welcoming community space.",
    },
    {
      icon: BookMarked,
      title: "Read",
      subtitle: "読 (Doku)",
      desc: "Explore physical volumes of iconic and contemporary manga in comfortable, dedicated reading corners with cozy ambient lighting.",
    },
    {
      icon: RotateCw,
      title: "Repeat",
      subtitle: "巡 (Meguri)",
      desc: "Your neighbourhood sanctuary in Thakur Complex, Kandivali East — a place where you always find great coffee and kindred spirits.",
    },
  ];

  return (
    <section id="story" className="relative bg-charcoal-900 py-20 border-b border-charcoal-800/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-charcoal-700 bg-charcoal-800/80 px-3.5 py-1 text-xs font-semibold text-crimson-400">
            <span>物語 • THE STORY</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-cream-50">
            A Tranquil Anime Sanctuary in Kandivali East
          </h2>
          <p className="text-cream-300/80 text-base sm:text-lg leading-relaxed">
            {cafe.identity} Born from a deep appreciation for Japanese cafe culture, 
            thoughtfully designed with natural woods, charcoal tones, warm cream textures, and restrained crimson details.
          </p>
        </div>

        {/* 4 Pillars Grid (Eat. Play. Read. Repeat.) */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="group relative rounded-2xl border border-charcoal-800 bg-charcoal-850/80 p-6 transition-all duration-300 hover:border-crimson-600/50 hover:bg-charcoal-800/90 hover:shadow-xl hover:shadow-crimson-950/20"
              >
                {/* Number & Kanji watermark */}
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-charcoal-700 bg-charcoal-900 text-crimson-400 group-hover:border-crimson-500 group-hover:scale-105 transition-all">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="font-japanese text-sm font-bold text-cream-400/40 group-hover:text-crimson-400 transition-colors">
                    {pillar.subtitle}
                  </span>
                </div>

                <div className="mt-6 space-y-2">
                  <h3 className="font-display text-2xl font-bold text-cream-50 group-hover:text-crimson-300 transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-cream-300/70 leading-relaxed font-light">
                    {pillar.desc}
                  </p>
                </div>

                {/* Subtle border accent */}
                <div className="mt-6 h-0.5 w-8 bg-charcoal-700 group-hover:w-16 group-hover:bg-crimson-500 transition-all duration-300" />
              </div>
            );
          })}
        </div>

        {/* Cafe Philosophy Quote Banner */}
        <div className="mt-16 rounded-2xl border border-charcoal-800 bg-charcoal-950/70 p-8 sm:p-10 text-center relative overflow-hidden">
          <div className="pointer-events-none absolute -left-10 -bottom-10 w-40 h-40 bg-crimson-600/10 blur-3xl rounded-full" />
          <p className="font-serif italic text-lg sm:text-xl text-cream-100 max-w-3xl mx-auto leading-relaxed">
            &ldquo;We wanted to build something authentic for suburban Mumbai. Not an overwhelming theme park, 
            but an elegant neighborhood cafe where you can read your favorite manga in peace, sip incredible coffee, 
            and make lifelong friends over a board game.&rdquo;
          </p>
          <div className="mt-4 flex items-center justify-center gap-2 text-xs font-mono text-crimson-400 tracking-wider">
            <span>FRECO CAFE TEAM</span>
            <span>•</span>
            <span>THAKUR COMPLEX, KANDIVALI EAST</span>
          </div>
        </div>

      </div>
    </section>
  );
}
