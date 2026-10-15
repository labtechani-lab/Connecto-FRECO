import React from "react";
import { FreCoProfile, frecoCafeData } from "@/data/frecoData";
import { MapPin, Clock, Phone, Mail, ExternalLink, Navigation, AlertTriangle } from "lucide-react";

interface LocationHoursProps {
  data?: Partial<FreCoProfile>;
}

export default function LocationHoursSection({ data }: LocationHoursProps) {
  const cafe = { ...frecoCafeData, ...data };
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    cafe.address.fullFormatted
  )}`;

  return (
    <section id="location" className="relative bg-charcoal-900 py-20 border-b border-charcoal-800/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-charcoal-700 bg-charcoal-800 px-3.5 py-1 text-xs font-semibold text-crimson-400">
            <MapPin className="h-3.5 w-3.5" />
            <span>所在地 • LOCATION & HOURS</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-cream-50">
            Visit FreCo Cafe in Kandivali East
          </h2>
          <p className="text-cream-300/80 text-base leading-relaxed">
            Conveniently located in Thakur Complex, close to Western Express Highway and local transit.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Address, Hours, Contact (Col 6) */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Address Card */}
            <div className="rounded-2xl border border-charcoal-800 bg-charcoal-850 p-6 sm:p-8 space-y-4 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-crimson-950/60 border border-crimson-800/40 text-crimson-400">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-cream-50">
                    Full Physical Address
                  </h3>
                  <p className="text-xs text-cream-400/60 font-mono">
                    Thakur Complex, Kandivali East
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-charcoal-800 bg-charcoal-900/80 p-4 space-y-1">
                <p className="text-sm font-semibold text-cream-100">
                  {cafe.address.line1}, {cafe.address.line2}
                </p>
                <p className="text-sm text-cream-200">
                  {cafe.address.road}
                </p>
                <p className="text-sm text-cream-200">
                  {cafe.address.area}
                </p>
                <p className="text-xs font-mono text-crimson-400 pt-1">
                  {cafe.address.city}, {cafe.address.state} — {cafe.address.pincode}
                </p>
              </div>

              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-crimson-600 px-5 py-3 text-sm font-semibold text-white hover:bg-crimson-500 transition-colors shadow-md shadow-crimson-950"
              >
                <Navigation className="h-4 w-4" />
                <span>Open in Google Maps App</span>
                <ExternalLink className="h-3.5 w-3.5 ml-1" />
              </a>
            </div>

            {/* Operating Hours Card */}
            <div className="rounded-2xl border border-charcoal-800 bg-charcoal-850 p-6 sm:p-8 space-y-4 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-crimson-950/60 border border-crimson-800/40 text-crimson-400">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-cream-50">
                      Operating Hours
                    </h3>
                    <p className="text-xs text-amber-400/80 font-mono">
                      Placeholder Timings
                    </p>
                  </div>
                </div>

                <span className="rounded bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[10px] font-mono text-amber-300">
                  To Be Verified
                </span>
              </div>

              <div className="space-y-3">
                {cafe.operatingHours.map((slot, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-xl border border-charcoal-800 bg-charcoal-900/80 p-3.5 text-xs"
                  >
                    <span className="font-medium text-cream-200">
                      {slot.days}
                    </span>
                    <span className="font-mono text-crimson-300">
                      {slot.timings}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 text-[11px] text-cream-400/60">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                <span>Please confirm hours directly with cafe management on holiday weekends.</span>
              </div>
            </div>

            {/* Contact Placeholders Card */}
            <div className="rounded-2xl border border-charcoal-800 bg-charcoal-850 p-6 space-y-3 shadow-lg">
              <h4 className="text-xs font-mono uppercase tracking-wider text-cream-400/70">
                Contact & Social Handles
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2.5 rounded-lg border border-charcoal-800 bg-charcoal-900 p-3">
                  <Phone className="h-4 w-4 text-crimson-400 shrink-0" />
                  <div>
                    <span className="block text-[10px] text-cream-400/50">Phone (Demo)</span>
                    <span className="font-mono text-cream-200">{cafe.contact.phonePlaceholder}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 rounded-lg border border-charcoal-800 bg-charcoal-900 p-3">
                  <svg
                    className="h-4 w-4 text-crimson-400 shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                  <div>
                    <span className="block text-[10px] text-cream-400/50">Instagram</span>
                    <span className="font-mono text-crimson-400 font-semibold">{cafe.contact.instagramHandle}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Google Maps Interactive Embed & Directions helper (Col 6) */}
          <div className="lg:col-span-6 flex flex-col h-full space-y-6">
            <div className="relative rounded-2xl border border-charcoal-800 bg-charcoal-850 p-3 overflow-hidden shadow-xl flex-1 flex flex-col min-h-[380px]">
              <div className="flex items-center justify-between pb-3 px-2">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-mono font-medium text-cream-200">
                    Live Map Location: Thakur Complex
                  </span>
                </div>
                <span className="text-[11px] font-mono text-cream-400/60">
                  400101 MUMBAI
                </span>
              </div>

              {/* Responsive Google Maps Iframe */}
              <div className="relative w-full flex-1 rounded-xl overflow-hidden border border-charcoal-800 bg-charcoal-950">
                <iframe
                  title="FreCo Cafe Kandivali East Location"
                  src="https://maps.google.com/maps?q=Shop%20No.%204,%205,%206,%20A-1,%20Saraf%20Choudhary%20Nagar%20CHSL,%20Mahatma%20Jyotiba%20Phule%20Road,%20Thakur%20Complex,%20Kandivali%20East,%20Mumbai,%20Maharashtra%20400101&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  className="h-full w-full min-h-[360px] border-0 filter grayscale contrast-125 invert-[0.9]"
                  loading="lazy"
                  allowFullScreen
                />
              </div>

              {/* Transit hint */}
              <div className="mt-3 p-2 bg-charcoal-900 rounded-lg text-xs text-cream-300/70 font-light flex items-center justify-between">
                <span>Nearest Landmark: Saraf Choudhary Nagar, Thakur Complex</span>
                <span className="font-mono text-crimson-400 text-[11px]">Kandivali East</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
