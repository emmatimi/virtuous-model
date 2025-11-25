import { PortfolioItem, Service, ModelBio } from "../types";
import { MODEL_STATS, SERVICES, PORTFOLIO_ITEMS } from "../constants";
import { db } from "./firebase";
import { doc, getDoc, setDoc, collection, getDocs, addDoc, deleteDoc } from "firebase/firestore";

/**
 * CMS SERVICE - FIREBASE IMPLEMENTATION
 * 
 * Connects to Firestore for real-time, cloud-based content management.
 */

const COLLECTIONS = {
    BIO: 'bio',
    PORTFOLIO: 'portfolio',
    SERVICES: 'services'
};

// --- BIO & STATS ---

export const getModelBio = async (): Promise<ModelBio> => {
    try {
        const docRef = doc(db, COLLECTIONS.BIO, 'main');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data() as ModelBio;
        }
    } catch (e) {
        console.warn("Using fallback data (Firebase not configured or empty)");
    }

    // Fallback default
    return {
        headline: "Virtuous Model",
        intro: "Virtuous Model is a multifaceted talent whose presence transcends the lens. With a background in contemporary dance, she brings a fluid, dynamic quality to every frame, turning stillness into motion.",
        bio: "Based in Lagos, Nigeria. Her versatile look adapts effortlessly from high-concept editorial to clean commercial beauty.",
        stats: MODEL_STATS,
        profileImage: "https://ik.imagekit.io/4lndq5ke52/eni/aboutimg?grayscale"
    };
};

export const updateModelBio = async (data: ModelBio): Promise<void> => {
    await setDoc(doc(db, COLLECTIONS.BIO, 'main'), data);
};

// --- PORTFOLIO ---

export const getPortfolioItems = async (category?: string): Promise<PortfolioItem[]> => {
    try {
        const querySnapshot = await getDocs(collection(db, COLLECTIONS.PORTFOLIO));
        let items: PortfolioItem[] = [];
        
        querySnapshot.forEach((doc) => {
            // We use the 'id' field from the data, but fallback to doc.id if needed
            items.push({ ...doc.data(), id: doc.data().id || parseInt(doc.id) } as PortfolioItem);
        });

        if (items.length === 0) return PORTFOLIO_ITEMS; // Fallback

        // Sort by newest (using numeric ID as timestamp)
        items.sort((a, b) => Number(b.id) - Number(a.id));

        if (category && category !== 'all') {
            return items.filter(item => item.category === category);
        }
        return items;
    } catch (e) {
        console.warn("Using fallback portfolio data");
        return PORTFOLIO_ITEMS;
    }
};

export const addPortfolioItem = async (item: PortfolioItem): Promise<void> => {
    const numericId = Date.now();
    await addDoc(collection(db, COLLECTIONS.PORTFOLIO), { ...item, id: numericId });
};

export const deletePortfolioItem = async (numericId: number): Promise<void> => {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.PORTFOLIO));
    querySnapshot.forEach(async (d) => {
        if (d.data().id === numericId) {
            await deleteDoc(doc(db, COLLECTIONS.PORTFOLIO, d.id));
        }
    });
};

// --- SERVICES ---

export const getServices = async (): Promise<Service[]> => {
    try {
        const querySnapshot = await getDocs(collection(db, COLLECTIONS.SERVICES));
        let services: Service[] = [];
        querySnapshot.forEach((doc) => {
            services.push({ id: doc.id, ...doc.data() } as Service);
        });

        if (services.length > 0) return services;
    } catch(e) { 
        // ignore 
    }
    return SERVICES;
};

export const updateServices = async (services: Service[]): Promise<void> => {
    // Bulk update strategy: clear collection and repopulate
    // Note: For high traffic production, update individual docs instead.
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.SERVICES));
    
    // batching is better but keeping it simple for now
    const deletePromises = querySnapshot.docs.map(d => deleteDoc(doc(db, COLLECTIONS.SERVICES, d.id)));
    await Promise.all(deletePromises);

    const addPromises = services.map(service => addDoc(collection(db, COLLECTIONS.SERVICES), service));
    await Promise.all(addPromises);
};