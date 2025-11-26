
import { PortfolioItem, Service, ModelBio, ContactMessage } from "../types";
import { MODEL_STATS, SERVICES, PORTFOLIO_ITEMS } from "@/constants";
import { db } from "./firebase";
import { doc, getDoc, setDoc, collection, getDocs, addDoc, deleteDoc, query, where, updateDoc } from "firebase/firestore";

/**
 * CMS SERVICE - FIREBASE IMPLEMENTATION
 * 
 * Connects to Firestore for real-time, cloud-based content management.
 */

const COLLECTIONS = {
    BIO: 'bio',
    PORTFOLIO: 'portfolio',
    SERVICES: 'services',
    MESSAGES: 'messages'
};

// --- HELPER: MIGRATION ---

const ensurePortfolioInitialized = async () => {
    const coll = collection(db, COLLECTIONS.PORTFOLIO);
    const snapshot = await getDocs(coll);
    
    // If DB is empty, populate it with the hardcoded demo data
    if (snapshot.empty) {
        console.log("Initializing Portfolio DB with demo data...");
        const promises = PORTFOLIO_ITEMS.map(item => {
             const cleanItem = {
                id: item.id,
                src: item.src || '',
                category: item.category || 'editorial',
                title: item.title || 'Untitled',
                client: item.client || '',
                height: item.height || 800
            };
            return addDoc(coll, cleanItem);
        });
        await Promise.all(promises);
    }
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
    // Helper to remove undefined fields which crash Firestore
    const cleanStats = data.stats.map(s => ({
        label: s.label || '',
        value: s.value || ''
    }));
    
    const cleanData = {
        headline: data.headline || '',
        intro: data.intro || '',
        bio: data.bio || '',
        profileImage: data.profileImage || '',
        stats: cleanStats
    };

    await setDoc(doc(db, COLLECTIONS.BIO, 'main'), cleanData);
};

// --- PORTFOLIO ---

export const getPortfolioItems = async (category?: string): Promise<PortfolioItem[]> => {
    try {
        const querySnapshot = await getDocs(collection(db, COLLECTIONS.PORTFOLIO));
        
        // Use a Map to ensure uniqueness based on the 'id' property
        const uniqueItems = new Map<number, PortfolioItem>();
        
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            // Handle legacy or numeric IDs. If data.id exists use it, otherwise parse doc.id
            // Ensuring we have a numeric ID as expected by the type definition
            const rawId = data.id !== undefined ? data.id : doc.id;
            const id = Number(rawId);
            
            // Only add if we haven't seen this ID before and it's a valid number
            if (!isNaN(id) && !uniqueItems.has(id)) {
                uniqueItems.set(id, { ...data, id } as PortfolioItem);
            }
        });

        let items = Array.from(uniqueItems.values());

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
    // Ensure demo data exists in DB before adding new item
    await ensurePortfolioInitialized();

    const numericId = Date.now();
    // Ensure no undefined values
    const cleanItem = {
        id: numericId,
        src: item.src || '',
        category: item.category || 'editorial',
        title: item.title || 'Untitled',
        client: item.client || '',
        height: item.height || 800
    };
    await addDoc(collection(db, COLLECTIONS.PORTFOLIO), cleanItem);
};

export const updatePortfolioItem = async (item: PortfolioItem): Promise<void> => {
    // Ensure demo data exists in DB before updating
    await ensurePortfolioInitialized();

    // Find document by the custom 'id' field
    const q = query(collection(db, COLLECTIONS.PORTFOLIO), where("id", "==", item.id));
    const querySnapshot = await getDocs(q);
    
    const updatePromises = querySnapshot.docs.map(d => {
        const cleanItem = {
            id: item.id,
            src: item.src || '',
            category: item.category || 'editorial',
            title: item.title || 'Untitled',
            client: item.client || '',
            height: item.height || 800
        };
        return setDoc(doc(db, COLLECTIONS.PORTFOLIO, d.id), cleanItem, { merge: true });
    });
    
    await Promise.all(updatePromises);
};

export const deletePortfolioItem = async (numericId: number): Promise<void> => {
    // Ensure demo data exists in DB before deleting (so we don't end up with an empty list)
    await ensurePortfolioInitialized();

    const q = query(collection(db, COLLECTIONS.PORTFOLIO), where("id", "==", numericId));
    const querySnapshot = await getDocs(q);
    const deletePromises = querySnapshot.docs.map(d => deleteDoc(doc(db, COLLECTIONS.PORTFOLIO, d.id)));
    await Promise.all(deletePromises);
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

    const addPromises = services.map(service => {
        const cleanService = {
            title: service.title || '',
            description: service.description || '',
            priceRange: service.priceRange || '',
            priceDetails: service.priceDetails || ''
        };
        return addDoc(collection(db, COLLECTIONS.SERVICES), cleanService);
    });
    await Promise.all(addPromises);
};

// --- CONTACT MESSAGES ---

export const submitContactMessage = async (data: ContactMessage): Promise<void> => {
    try {
        await addDoc(collection(db, COLLECTIONS.MESSAGES), {
            ...data,
            timestamp: new Date().toISOString(),
            read: false
        });
    } catch (e) {
        console.error("Error submitting contact message", e);
        throw e;
    }
};

export const getContactMessages = async (): Promise<ContactMessage[]> => {
    try {
        const querySnapshot = await getDocs(collection(db, COLLECTIONS.MESSAGES));
        let messages: ContactMessage[] = [];
        querySnapshot.forEach((doc) => {
            messages.push({ id: doc.id, ...doc.data() } as ContactMessage);
        });
        
        // Sort by timestamp descending (newest first)
        messages.sort((a, b) => {
            return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        });
        
        return messages;
    } catch (e) {
        console.error("Error getting messages", e);
        return [];
    }
};

export const markMessageRead = async (id: string): Promise<void> => {
    const docRef = doc(db, COLLECTIONS.MESSAGES, id);
    await updateDoc(docRef, { read: true });
};
export const deleteContactMessage = async (id: string): Promise<void> => {
    await deleteDoc(doc(db, COLLECTIONS.MESSAGES, id));
};

