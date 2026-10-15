export interface MenuItem {
  id: string;
  name: string;
  japaneseName?: string;
  description: string;
  category: "coffee" | "ice-cream" | "bites" | "specialty";
  price: number | null; // null if unverified placeholder
  priceFormatted: string; // "[Price TBD]" or actual
  isVerifiedPrice: boolean;
  isPopular?: boolean;
  dietary?: "Vegetarian" | "Egg" | "Vegan" | "Contains Dairy";
  image?: string;
}

export interface MangaHighlight {
  title: string;
  japaneseTitle?: string;
  volumesAvailable: string; // e.g. "Complete Set (Placeholder)"
  genre: string;
  isVerifiedStock: boolean;
}

export interface GameNightEvent {
  day: string;
  timeSlot: string;
  title: string;
  description: string;
  isVerifiedSchedule: boolean;
}

export interface CafeReview {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  isVerifiedReview: boolean; // Flagged false as placeholder
}

export interface FreCoProfile {
  name: string;
  tagline: string;
  badge: string;
  identity: string;
  address: {
    line1: string;
    line2: string;
    road: string;
    area: string;
    city: string;
    state: string;
    pincode: string;
    fullFormatted: string;
    googleMapsSearchQuery: string;
    googleMapsEmbedUrl?: string;
  };
  contact: {
    phonePlaceholder: string;
    isVerifiedPhone: boolean;
    emailPlaceholder: string;
    isVerifiedEmail: boolean;
    instagramHandle: string;
    instagramUrl: string;
    whatsappNumberPlaceholder: string;
    isVerifiedWhatsapp: boolean;
  };
    links: {
    googleReviewsUrl: string;
    zomatoUrl: string;
    swiggyUrl: string;
    whatsappUrl: string;
  };
  operatingHours: {
    days: string;
    timings: string;
    isVerifiedHours: boolean;
    statusNote: string;
  }[];
  themes: string[];
  mangaCountEstimate: string;
  boardGamesCountEstimate: string;
  menu: MenuItem[];
  mangaHighlights: MangaHighlight[];
  gameNights: GameNightEvent[];
  reviews: CafeReview[];
  gallery: {
    id: string;
    caption: string;
    alt: string;
    imageUrl: string;
    tag: string;
  }[];
}

export const frecoCafeData: FreCoProfile = {
  name: "FreCo Cafe",
  tagline: "Eat. Play. Read. Repeat.",
  badge: "Mumbai's Ultimate Anime Cafe",
  identity: "A sanctuary for anime enthusiasts, coffee lovers, and gamers in suburban Mumbai.",
  address: {
    line1: "Shop No. 4, 5, 6, A-1",
    line2: "Saraf Choudhary Nagar CHSL",
    road: "Mahatma Jyotiba Phule Road",
    area: "Thakur Complex, Kandivali East",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400101",
    fullFormatted:
      "Shop No. 4, 5, 6, A-1, Saraf Choudhary Nagar CHSL, Mahatma Jyotiba Phule Road, Thakur Complex, Kandivali East, Mumbai, Maharashtra 400101",
    googleMapsSearchQuery:
      "FreCo+Cafe+Thakur+Complex+Kandivali+East+Mumbai+400101",
  },
  contact: {
    phonePlaceholder: "+91 (Contact Number to be verified)",
    isVerifiedPhone: false,
    emailPlaceholder: "contact@frecocafe.placeholder.in",
    isVerifiedEmail: false,
    instagramHandle: "@frecocafe",
    instagramUrl: "https://instagram.com",
    whatsappNumberPlaceholder: "+91 (WhatsApp to be verified)",
    isVerifiedWhatsapp: false,
  },
  links: {
    googleReviewsUrl: "https://www.google.com/maps/place/FreCo+Cafe/@19.2090565,72.8605295,17z/data=!4m8!3m7!1s0x3be7b705c69e42ed:0x189e7a32610006c6!8m2!3d19.2090565!4d72.8631044!9m1!1b1!16s%2Fg%2F11m6znjrrr?entry=ttu&g_ep=EgoyMDI2MTAxMi4wIKXMDSoASAFQAw%3D%3D",
    zomatoUrl: "https://www.zomato.com/mumbai/freco-2-kandivali-east",
    swiggyUrl: "https://www.swiggy.com/city/mumbai/freco-malad-kan-east-rest1116058",
    whatsappUrl: "",
  },

  operatingHours: [
    {
      days: "Monday – Friday",
      timings: "11:00 AM – 11:00 PM (Unverified Placeholder)",
      isVerifiedHours: false,
      statusNote: "Hours subject to cafe confirmation",
    },
    {
      days: "Saturday – Sunday",
      timings: "11:00 AM – 11:30 PM (Unverified Placeholder)",
      isVerifiedHours: false,
      statusNote: "Weekend extended hours to be verified",
    },
  ],
  themes: [
    "Specialty Coffee",
    "Artisan Ice Cream",
    "Curated Manga Library",
    "Weekly Game Nights",
    "Anime Community Culture",
  ],
  mangaCountEstimate: "500+ Volumes (Estimated)",
  boardGamesCountEstimate: "35+ Board Games (Estimated)",
  menu: [
    {
      id: "c-1",
      name: "Kyoto Cold Brew",
      japaneseName: "京都水出し珈琲",
      description: "Slow-dripped single origin roast, steeped for 16 hours for a silky, zero-bitterness profile with subtle cocoa notes.",
      category: "coffee",
      price: null,
      priceFormatted: "₹ [Price TBD]",
      isVerifiedPrice: false,
      isPopular: true,
      dietary: "Vegan",
    },
    {
      id: "c-2",
      name: "Tokyo Charcoal Vanilla Latte",
      japaneseName: "活性炭ラテ",
      description: "Espresso pulled over activated charcoal, steamed oat milk, and Madagascar vanilla bean.",
      category: "coffee",
      price: null,
      priceFormatted: "₹ [Price TBD]",
      isVerifiedPrice: false,
      isPopular: true,
      dietary: "Vegetarian",
    },
    {
      id: "c-3",
      name: "Shibuya Matcha Espresso Cloud",
      japaneseName: "抹茶エスプレッソ",
      description: "Ceremonial Uji matcha layered over velvety cold foam and a rich double shot of dark espresso.",
      category: "coffee",
      price: null,
      priceFormatted: "₹ [Price TBD]",
      isVerifiedPrice: false,
      isPopular: false,
      dietary: "Contains Dairy",
    },
    {
      id: "i-1",
      name: "Black Sesame & Roasted Miso Gelato",
      japaneseName: "黒胡麻と味噌アイス",
      description: "Rich nutty kurogoma swirled with sweet salted white miso caramel.",
      category: "ice-cream",
      price: null,
      priceFormatted: "₹ [Price TBD]",
      isVerifiedPrice: false,
      isPopular: true,
      dietary: "Contains Dairy",
    },
    {
      id: "i-2",
      name: "Hokkaido Milk & Strawberry Compote",
      japaneseName: "北海道ミルク苺",
      description: "Creamy Hokkaido-style dairy churned fresh with Mahabaleshwar strawberry reduction.",
      category: "ice-cream",
      price: null,
      priceFormatted: "₹ [Price TBD]",
      isVerifiedPrice: false,
      isPopular: true,
      dietary: "Contains Dairy",
    },
    {
      id: "i-3",
      name: "Yuzu Sorbet with Shiso Mint",
      japaneseName: "柚子紫蘇シャーベット",
      description: "Tart Japanese citrus ice accented with crushed shiso herb for a vibrant, palate-cleansing finish.",
      category: "ice-cream",
      price: null,
      priceFormatted: "₹ [Price TBD]",
      isVerifiedPrice: false,
      isPopular: false,
      dietary: "Vegan",
    },
    {
      id: "b-1",
      name: "Crispy Furikake Fries",
      japaneseName: "ふりかけポテト",
      description: "Double-cooked crinkle fries tossed in roasted nori, toasted sesame seeds, and spicy kewpie dip.",
      category: "bites",
      price: null,
      priceFormatted: "₹ [Price TBD]",
      isVerifiedPrice: false,
      isPopular: true,
      dietary: "Vegetarian",
    },
    {
      id: "b-2",
      name: "Tamago Sando (Japanese Egg Sandwich)",
      japaneseName: "たまごサンド",
      description: "Whipped creamy seasoned egg salad cushioned between pillowy toasted milk bread slices.",
      category: "bites",
      price: null,
      priceFormatted: "₹ [Price TBD]",
      isVerifiedPrice: false,
      isPopular: true,
      dietary: "Egg",
    },
  ],
  mangaHighlights: [
    {
      title: "Jujutsu Kaisen",
      japaneseTitle: "呪術廻戦",
      volumesAvailable: "Volumes 1–24 (Demo Stock)",
      genre: "Supernatural / Action",
      isVerifiedStock: false,
    },
    {
      title: "One Piece",
      japaneseTitle: "ワンピース",
      volumesAvailable: "East Blue to Wano (Demo Stock)",
      genre: "Adventure / Shonen",
      isVerifiedStock: false,
    },
    {
      title: "Chainsaw Man",
      japaneseTitle: "チェンソーマン",
      volumesAvailable: "Part 1 & 2 (Demo Stock)",
      genre: "Dark Fantasy",
      isVerifiedStock: false,
    },
    {
      title: "Spy x Family",
      japaneseTitle: "スパイファミリー",
      volumesAvailable: "Volumes 1–12 (Demo Stock)",
      genre: "Comedy / Slice of Life",
      isVerifiedStock: false,
    },
  ],
  gameNights: [
    {
      day: "Every Wednesday",
      timeSlot: "7:00 PM – 10:00 PM (Unverified Demo)",
      title: "Trivia & Anime Quiz Night",
      description: "Assemble your squad, test your knowledge from classic 90s anime to latest seasonal hits, and win cafe treats.",
      isVerifiedSchedule: false,
    },
    {
      day: "Every Friday",
      timeSlot: "6:30 PM – 10:30 PM (Unverified Demo)",
      title: "Community Board Game Arena",
      description: "From Catan and Codenames to Japanese strategy games like Machi Koro and Hanabi. Open to solo players and groups.",
      isVerifiedSchedule: false,
    },
    {
      day: "Sunday Afternoons",
      timeSlot: "3:00 PM – 6:00 PM (Unverified Demo)",
      title: "Quiet Manga Reading Hour",
      description: "Soft lo-fi beats, complimentary brew refills on select orders, and cozy reading corners for bookworms.",
      isVerifiedSchedule: false,
    },
  ],
  reviews: [
    {
      id: "r-1",
      author: "Mumbai Otaku Community Member",
      rating: 5,
      comment: "A true gem in Kandivali East! Finding authentic Japanese manga volumes paired with solid coffee in the suburbs is incredible.",
      date: "Placeholder Review",
      isVerifiedReview: false,
    },
    {
      id: "r-2",
      author: "Local Cafe Explorer",
      rating: 5,
      comment: "The vibe is unmatched. It feels premium and calm, not gimmicky. The black sesame gelato is an absolute must-try.",
      date: "Placeholder Review",
      isVerifiedReview: false,
    },
  ],
  gallery: [
    {
      id: "g-1",
      caption: "Specialty brews poured with precision",
      alt: "Specialty coffee brewing at FreCo Cafe",
      imageUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1000&q=80",
      tag: "Coffee Bar",
    },
    {
      id: "g-2",
      caption: "Cozy reading nook with curated manga shelves",
      alt: "Manga library corner with comfortable seating",
      imageUrl: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1000&q=80",
      tag: "Manga Library",
    },
    {
      id: "g-3",
      caption: "Weekly tabletop and board gaming sessions",
      alt: "Friends playing tabletop games",
      imageUrl: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=1000&q=80",
      tag: "Game Nights",
    },
    {
      id: "g-4",
      caption: "Handcrafted artisan gelato & Japanese desserts",
      alt: "Artisan ice cream dessert presentation",
      imageUrl: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=1000&q=80",
      tag: "Desserts & Ice Cream",
    },
  ],
};
