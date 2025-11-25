
import { PortfolioItem, Service, ModelBio } from "../types";
import { MODEL_STATS, SERVICES, PORTFOLIO_ITEMS } from "../constants";

/**
 * CMS SERVICE - LOCAL STORAGE IMPLEMENTATION
 * 
 * Data Persistence:
 * This service automatically persists all changes to the browser's Local Storage.
 * This ensures that edits to Bio, Services, and Portfolio are saved across
 * page reloads and browser sessions.
 */

const STORAGE_KEYS = {
    BIO: 'virtuous_bio',
    PORTFOLIO: 'virtuous_portfolio',
    SERVICES: 'virtuous_services'
};

// Mock delay to simulate network request
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- BIO & STATS ---

export const getModelBio = async (): Promise<ModelBio> => {
    await delay(300);
    const stored = localStorage.getItem(STORAGE_KEYS.BIO);
    if (stored) return JSON.parse(stored);

    // Default / Initial State
    return {
        headline: "Virtuous Model",
        intro: "Virtuous Model is a multifaceted talent whose presence transcends the lens. With a background in contemporary dance, she brings a fluid, dynamic quality to every frame, turning stillness into motion.",
        bio: "Based in Lagos, Nigeria. Her versatile look adapts effortlessly from high-concept editorial to clean commercial beauty.",
        stats: MODEL_STATS,
        profileImage: "https://ik.imagekit.io/4lndq5ke52/eni/aboutimg?grayscale"
    };
};

export const updateModelBio = async (data: ModelBio): Promise<void> => {
    await delay(500);
    localStorage.setItem(STORAGE_KEYS.BIO, JSON.stringify(data));
};

// --- PORTFOLIO ---

export const getPortfolioItems = async (category?: string): Promise<PortfolioItem[]> => {
    await delay(500);
    let items: PortfolioItem[] = [];
    const stored = localStorage.getItem(STORAGE_KEYS.PORTFOLIO);
    
    if (stored) {
        items = JSON.parse(stored);
    } else {
        items = PORTFOLIO_ITEMS;
    }

    if (category && category !== 'all') {
        return items.filter(item => item.category === category);
    }
    return items;
};

export const addPortfolioItem = async (item: PortfolioItem): Promise<void> => {
    const current = await getPortfolioItems('all');
    const newItem = { ...item, id: Date.now() }; // Simple ID generation
    const updated = [newItem, ...current];
    localStorage.setItem(STORAGE_KEYS.PORTFOLIO, JSON.stringify(updated));
};

export const deletePortfolioItem = async (id: number): Promise<void> => {
    const current = await getPortfolioItems('all');
    const updated = current.filter(i => i.id !== id);
    localStorage.setItem(STORAGE_KEYS.PORTFOLIO, JSON.stringify(updated));
};

// --- SERVICES ---

export const getServices = async (): Promise<Service[]> => {
    await delay(200);
    const stored = localStorage.getItem(STORAGE_KEYS.SERVICES);
    if (stored) return JSON.parse(stored);
    return SERVICES.map(s => ({...s, id: Math.random().toString(36).substr(2, 9)}));
};

export const updateServices = async (services: Service[]): Promise<void> => {
    await delay(300);
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
};

export const getSiteMetadata = async () => {
    await delay(100);
    return {
        title: "Virtuous Model",
        baseUrl: "https://www.virtuousmodel.com",
        defaultImage: "https://picsum.photos/1200/630?grayscale"
    };
};
