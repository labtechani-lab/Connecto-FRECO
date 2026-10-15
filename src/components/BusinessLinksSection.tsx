
"use client";

import { ExternalLink, MessageCircle, Star, Utensils } from "lucide-react";

interface BusinessLinksSectionProps {
  links?: {
    googleReviewsUrl?: string;
    zomatoUrl?: string;
    swiggyUrl?: string;
    whatsappUrl?: string;
  };
}

export default function BusinessLinksSection({
  links,
}: BusinessLinksSectionProps) {
  const items = [
    {
      label: "Google Reviews",
      description: "Read reviews or share your experience",
      href: links?.googleReviewsUrl,
      icon: Star,
    },
    {
      label: "Order on Zomato",
      description: "Explore the menu and order online",
      href: links?.zomatoUrl,
      icon: Utensils,
    },
    {
      label: "Order on Swiggy",
      description: "Order your favourites online",
      href: links?.swiggyUrl,
      icon: Utensils,
    },
    {
      label: "Chat on WhatsApp",
      description: "Contact the business directly",
      href: links?.whatsappUrl,
      icon: MessageCircle,
    },
  ].filter((item) => Boolean(item.href?.trim()));

  if (items.length === 0) return null;

  return (
    <section className="bg-charcoal-950 px-5 py-12 text-cream-100 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-crimson-400">
          Stay Connected
        </p>
        <h2 className="text-2xl font-semibold sm:text-3xl">
          Reviews, Orders & Contact
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-cream-300/70">
          Find us online, explore ordering options, or get in touch.
        </p>

        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex min-h-28 items-center gap-4 rounded-xl border border-charcoal-700 bg-charcoal-900/70 p-4 transition-colors hover:border-crimson-500/60 hover:bg-charcoal-800"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-charcoal-800 text-crimson-400">
                  <Icon className="h-5 w-5" />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold">
                    {item.label}
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-cream-300/60">
                    {item.description}
                  </span>
                </span>

                <ExternalLink className="h-4 w-4 shrink-0 text-cream-300/40 transition-colors group-hover:text-crimson-400" />
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
