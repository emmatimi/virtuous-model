import { PortfolioItem, Service, Stat } from "./types";

export const MODEL_NAME = "VIRTUOUS MODEL";
export const MODEL_TAGLINE = "Elegance in Virtue";

export const MODEL_STATS: Stat[] = [
  { label: "Height", value: "5'11\" / 180cm" },
  { label: "Bust", value: "32\" / 81cm" },
  { label: "Waist", value: "24\" / 61cm" },
  { label: "Hips", value: "35\" / 89cm" },
  { label: "Shoes", value: "9 US / 40 EU" },
  { label: "Hair", value: "Dark Brown" },
  { label: "Eyes", value: "Hazel" },
];

export const SERVICES: Service[] = [
  {
    title: "Editorial & Print",
    description: "High-fashion editorials, magazine spreads, and lookbooks. Specialized in emotive and dynamic posing.",
    priceRange: "From $2,500 / day",
    priceDetails: "Includes 8-hour day rate. Travel and accommodation must be provided for locations outside NYC. Overtime billed at $350/hr."
  },
  {
    title: "Runway",
    description: "Fashion week presentations, trunk shows, and showroom modeling. Experienced with haute couture and ready-to-wear.",
    priceRange: "Inquire for rates",
    priceDetails: "Rates vary based on show scale, location, and exclusivity requirements. Please contact agency for a custom package."
  },
  {
    title: "Commercial & Lifestyle",
    description: "Advertising campaigns, e-commerce, and lifestyle imagery. Versatile looks for beauty, wellness, and tech brands.",
    priceRange: "From $1,500 / half-day",
    priceDetails: "Half-day (4 hours) or Full-day (8 hours) options available. Usage rights negotiated separately based on campaign scope and duration."
  },
  {
    title: "Brand Ambassadorship",
    description: "Long-term partnerships, social media content creation, and event appearances representing luxury brands.",
    priceRange: "Contract basis",
    priceDetails: "Includes 3-12 month exclusivity, social media deliverables, and 2 event appearances per quarter. Minimum 3-month commitment."
  }
];

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  { id: 1, src: "https://ik.imagekit.io/4lndq5ke52/eni/Editorial?random=1", category: 'editorial', title: "Vogue Italia", height: 900 },
  { id: 2, src: "https://ik.imagekit.io/4lndq5ke52/portfolio10?random=2", category: 'commercial', title: "Aesop Campaign", height: 800 },
  { id: 3, src: "https://ik.imagekit.io/4lndq5ke52/eni/runway?random=3", category: 'runway', title: "Paris Fashion Week", height: 900 },
  { id: 4, src: "https://ik.imagekit.io/4lndq5ke52/eni/digital?random=4", category: 'digital', title: "Polaroids 2024", height: 600 },
  { id: 5, src: "https://ik.imagekit.io/4lndq5ke52/portfolio11?random=5", category: 'editorial', title: "Numéro", height: 850 },
  { id: 6, src: "https://ik.imagekit.io/4lndq5ke52/eni/portfolio1?random=6", category: 'commercial', title: "Silk & Cashmere", height: 700 },
  { id: 7, src: "https://ik.imagekit.io/4lndq5ke52/eni/portfolio4?random=7", category: 'editorial', title: "Harper's Bazaar", height: 900 },
  { id: 8, src: "https://ik.imagekit.io/4lndq5ke52/eni/portfolio3", category: 'runway', title: "Milan Fashion Week", height: 800 },
  { id: 9, src: "https://ik.imagekit.io/4lndq5ke52/eni/portfolio2?random=9", category: 'digital', title: "Agency Digitals", height: 600 },
  { id: 10, src: "https://ik.imagekit.io/4lndq5ke52/eni/bg?random=10", category: 'editorial', title: "Indie Mag", height: 950 },
  { id: 11, src: "https://ik.imagekit.io/4lndq5ke52/eni/portfolio7?random=11", category: 'commercial', title: "Minimalist Watch", height: 750 },
  { id: 12, src: "https://ik.imagekit.io/4lndq5ke52/eni/commercialportolio?random=12", category: 'editorial', title: "Noir Series", height: 900 },
];