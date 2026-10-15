import React from "react";
import { FreCoProfile, frecoCafeData } from "@/data/frecoData";
import { Camera } from "lucide-react";

interface GallerySectionProps {
  data?: Partial<FreCoProfile>;
}

export default function GallerySection({ data }: GallerySectionProps) {
  const cafe = { ...frecoCafeData, ...data };
  return (
    <section id="gallery" className="relative bg-charcoal-950 py-20 border-b border-charcoal-800/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-charcoal-700 bg-charcoal-850 px-3.5 py-1 text-xs font-semibold text-crimson-400">
            <Camera className="h-3.5 w-3.5" />
            <span>写真 • ATMOSPHERE</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-cream-50">
            The FreCo Experience
          </h2>
          <p className="text-cream-300/80 text-base leading-relaxed">
            A glimpse into the everyday rhythm of coffee craftsmanship, page-turning calm, and community laughter.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cafe.gallery.map((item) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-2xl border border-charcoal-800 bg-charcoal-900 shadow-lg hover:border-crimson-600/40 transition-all duration-300"
            >
              <div className="relative h-72 w-full overflow-hidden bg-charcoal-950">
                <img
                  src={item.imageUrl}
                  alt={item.alt}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-85 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/20 to-transparent" />
                
                {/* Category tag */}
                <div className="absolute top-3 left-3">
                  <span className="rounded-md bg-charcoal-950/80 border border-charcoal-700 px-2.5 py-1 text-[11px] font-semibold text-cream-100 backdrop-blur-sm">
                    {item.tag}
                  </span>
                </div>

                {/* Caption on hover/bottom */}
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-xs font-medium text-cream-200/90 leading-snug">
                    {item.caption}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
