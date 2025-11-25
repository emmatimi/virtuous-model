
// Simple client-side simulation for demonstration.
// In production, this should use a real auth provider (Firebase Auth, Auth0, etc.)

const AUTH_KEY = 'virtuous_auth_session';
const MOCK_PASSCODE = 'admin123';

export const login = (passcode: string): boolean => {
    if (passcode === MOCK_PASSCODE) {
        localStorage.setItem(AUTH_KEY, 'true');
        return true;
    }
    return false;
};

export const logout = () => {
    localStorage.removeItem(AUTH_KEY);
};

export const isAuthenticated = (): boolean => {
    return localStorage.getItem(AUTH_KEY) === 'true';
};
