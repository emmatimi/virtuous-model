export type Page = 'home' | 'about' | 'portfolio' | 'services' | 'contact' | 'admin';

export interface PortfolioItem {
  id: number;
  src: string;
  category: 'editorial' | 'commercial' | 'runway' | 'digital';
  title: string;
  client?: string;
  width?: number; // Aspect ratio helper
  height?: number;
  description?: string; // For SEO
  date?: string; // For sorting/metadata
}

export interface Stat {
  label: string;
  value: string;
}

export interface Service {
  id?: string; // Added ID for management
  title: string;
  description: string;
  priceRange: string;
  priceDetails?: string; // Detailed explanation for tooltip
}

export interface ModelBio {
    headline: string;
    intro: string;
    bio: string;
    stats: Stat[];
    profileImage: string;
}

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp?: any; // Firestore timestamp or Date
  read?: boolean;
}

export enum MessageRole {
  USER = 'user',
  MODEL = 'model'
}

export interface ChatMessage {
  role: MessageRole;
  text: string;
  isThinking?: boolean;
}

export interface SEOProps {
    title: string;
    description: string;
    image?: string;
    type?: 'website' | 'article' | 'profile';
    schema?: Record<string, any>;
    keywords?: string[];
    canonical?: string;
}
