/// <reference types="vite/client" />
import { auth } from "./firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

// We'll use a hardcoded email for the admin login flow to keep the UI simple (Password only)
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || "admin@virtuousmodel.com"; 

export const login = async (passcode: string): Promise<boolean> => {
    try {
        // We use the passcode as the password for the dedicated admin account
        await signInWithEmailAndPassword(auth, ADMIN_EMAIL, passcode);
        return true;
    } catch (error) {
        console.error("Auth failed", error);
        return false;
    }
};

export const logout = async () => {
    await signOut(auth);
};

export const isAuthenticated = (): boolean => {
    return !!auth.currentUser;
};