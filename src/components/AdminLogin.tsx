import React, { useState } from 'react';
import { login } from '../services/auth';
import { Lock } from 'lucide-react';

interface AdminLoginProps {
    onLoginSuccess: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
    const [passcode, setPasscode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            const success = await login(passcode);
            if (success) {
                onLoginSuccess();
            } else {
                setError('Access Denied');
            }
        } catch (err) {
            setError('Connection failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-luxury-gray px-6">
            <div className="max-w-md w-full bg-white p-10 shadow-xl text-center">
                <Lock className="mx-auto mb-6 text-gray-400" size={32} />
                <h2 className="text-2xl font-serif mb-2">Admin Access</h2>
                <p className="text-xs uppercase tracking-widest text-gray-400 mb-8">Restricted Area</p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <input 
                            type="password" 
                            value={passcode}
                            onChange={(e) => setPasscode(e.target.value)}
                            className="w-full text-center border-b border-gray-300 py-2 focus:outline-none focus:border-black transition-colors rounded-none bg-transparent text-xl tracking-widest"
                            placeholder="ENTER PASSCODE"
                            autoFocus
                        />
                    </div>
                    {error && <p className="text-red-500 text-xs tracking-wider">{error}</p>}
                    
                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white py-3 uppercase text-xs tracking-[0.2em] hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Verifying...' : 'Unlock'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;