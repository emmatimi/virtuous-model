
import React, { useState, useEffect } from 'react';
import { getModelBio, updateModelBio, getPortfolioItems, addPortfolioItem, updatePortfolioItem, deletePortfolioItem, getServices, updateServices, getContactMessages, markMessageRead } from '../services/cms';
import { logout } from '../services/auth';
import { ModelBio, PortfolioItem, Service, Page, ContactMessage } from '../types';
import { LogOut, Save, Trash2, Plus, User, Briefcase, Image as ImageIcon, CheckCircle2, Server, Mail, RefreshCw } from 'lucide-react';

interface AdminDashboardProps {
    onNavigate: (page: Page) => void;
}

type Tab = 'bio' | 'portfolio' | 'services' | 'inbox';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
    const [activeTab, setActiveTab] = useState<Tab>('bio');
    const [saving, setSaving] = useState(false);
    const [notification, setNotification] = useState<string | null>(null);
    
    // Data States
    const [bio, setBio] = useState<ModelBio | null>(null);
    const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [messages, setMessages] = useState<ContactMessage[]>([]);

    // New Item States
    const [newPortfolioItem, setNewPortfolioItem] = useState<Partial<PortfolioItem>>({ category: 'editorial' });

    useEffect(() => {
        fetchData();
    }, []);

    // Re-fetch messages when switching to inbox
    useEffect(() => {
        if (activeTab === 'inbox') {
            fetchMessages();
        }
    }, [activeTab]);

    const fetchData = async () => {
        const bioData = await getModelBio();
        const portfolioData = await getPortfolioItems('all');
        const servicesData = await getServices();
        setBio(bioData);
        setPortfolio(portfolioData);
        setServices(servicesData);
        fetchMessages();
    };

    const fetchMessages = async () => {
        const msgs = await getContactMessages();
        setMessages(msgs);
    };

    const handleLogout = () => {
        logout();
        onNavigate('home');
    };

    const showNotification = (msg: string) => {
        setNotification(msg);
        setTimeout(() => setNotification(null), 3000);
    };

    // --- BIO HANDLERS ---
    const handleSaveBio = async () => {
        if (!bio) return;
        setSaving(true);
        await updateModelBio(bio);
        setSaving(false);
        showNotification("Biography Saved Successfully");
    };

    // --- PORTFOLIO HANDLERS ---
    const handleDeletePortfolio = async (id: number) => {
        if (confirm('Delete this image?')) {
            await deletePortfolioItem(id);
            setPortfolio(prev => prev.filter(i => i.id !== id));
            showNotification("Image Deleted");
        }
    };

    const handleAddPortfolio = async () => {
        if (!newPortfolioItem.src || !newPortfolioItem.title) return alert('Image URL and Title required');
        
        setSaving(true);
        const item: PortfolioItem = {
            id: 0, // handled by service
            src: newPortfolioItem.src,
            title: newPortfolioItem.title,
            category: newPortfolioItem.category as any,
            height: 800 // default mock height
        };
        await addPortfolioItem(item);
        await fetchData(); // Refresh
        setNewPortfolioItem({ category: 'editorial', src: '', title: '' });
        setSaving(false);
        showNotification("Portfolio Item Added");
    };

    const handleUpdatePortfolioState = (id: number, field: keyof PortfolioItem, value: any) => {
        setPortfolio(prev => prev.map(item => 
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    const handleSavePortfolio = async () => {
        setSaving(true);
        // In a more complex app we would track dirty states, but for now we update all to ensure consistency
        const promises = portfolio.map(item => updatePortfolioItem(item));
        await Promise.all(promises);
        setSaving(false);
        showNotification("Portfolio Changes Saved");
    };

    // --- SERVICES HANDLERS ---
    const handleUpdateService = (index: number, field: keyof Service, value: string) => {
        const updated = [...services];
        updated[index] = { ...updated[index], [field]: value };
        setServices(updated);
    };

    const handleSaveServices = async () => {
        setSaving(true);
        await updateServices(services);
        setSaving(false);
        showNotification("Services Updated");
    };

    // --- INBOX HANDLERS ---
    const handleMarkRead = async (id: string) => {
        await markMessageRead(id);
        setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
    };

    if (!bio) return <div className="min-h-screen flex items-center justify-center"><div className="w-1 h-12 bg-black animate-pulse"></div></div>;

    const unreadCount = messages.filter(m => !m.read).length;

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Admin Header */}
            <div className="bg-black text-white h-16 px-6 flex justify-between items-center shadow-md z-20 relative">
                <h1 className="font-serif text-xl tracking-wider flex items-center gap-2">
                    VIRTUOUS <span className="text-gray-500 text-[10px] uppercase tracking-widest border border-gray-700 px-2 py-0.5 rounded-full">CMS v1.0</span>
                </h1>
                <div className="flex items-center gap-6">
                    <button onClick={() => onNavigate('home')} className="text-xs uppercase tracking-widest hover:text-gray-300 transition-colors">View Site</button>
                    <button onClick={handleLogout} className="flex items-center gap-2 text-xs uppercase tracking-widest hover:text-red-400 transition-colors">
                        <LogOut size={14} /> Logout
                    </button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row h-[calc(100vh-64px)]">
                {/* Sidebar */}
                <div className="w-full md:w-64 bg-white border-r border-gray-200 flex flex-col justify-between z-10 shadow-sm">
                    <div>
                        <div className="p-6">
                            <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-4">Management</p>
                            <nav className="space-y-1">
                                <button 
                                    onClick={() => setActiveTab('bio')}
                                    className={`w-full p-3 text-left text-xs uppercase tracking-widest hover:bg-gray-50 flex items-center gap-3 rounded-md transition-all ${activeTab === 'bio' ? 'bg-black text-white shadow-lg' : 'text-gray-500'}`}
                                >
                                    <User size={16} /> Bio & Stats
                                </button>
                                <button 
                                    onClick={() => setActiveTab('portfolio')}
                                    className={`w-full p-3 text-left text-xs uppercase tracking-widest hover:bg-gray-50 flex items-center gap-3 rounded-md transition-all ${activeTab === 'portfolio' ? 'bg-black text-white shadow-lg' : 'text-gray-500'}`}
                                >
                                    <ImageIcon size={16} /> Portfolio
                                </button>
                                <button 
                                    onClick={() => setActiveTab('services')}
                                    className={`w-full p-3 text-left text-xs uppercase tracking-widest hover:bg-gray-50 flex items-center gap-3 rounded-md transition-all ${activeTab === 'services' ? 'bg-black text-white shadow-lg' : 'text-gray-500'}`}
                                >
                                    <Briefcase size={16} /> Services
                                </button>
                                <button 
                                    onClick={() => setActiveTab('inbox')}
                                    className={`w-full p-3 text-left text-xs uppercase tracking-widest hover:bg-gray-50 flex items-center gap-3 rounded-md transition-all ${activeTab === 'inbox' ? 'bg-black text-white shadow-lg' : 'text-gray-500'}`}
                                >
                                    <Mail size={16} /> Inbox 
                                    {unreadCount > 0 && (
                                        <span className={`ml-auto px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'inbox' ? 'bg-white text-black' : 'bg-black text-white'}`}>
                                            {unreadCount}
                                        </span>
                                    )}
                                </button>
                            </nav>
                        </div>
                    </div>
                    
                    <div className="p-6 bg-gray-50 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-green-600">
                            <Server size={12} />
                            <span>Cloud Storage Active</span>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto p-6 md:p-10 relative">
                    
                    {/* Notification Toast */}
                    {notification && (
                        <div className="fixed bottom-8 right-8 bg-black text-white px-6 py-4 shadow-2xl z-50 flex items-center gap-4 animate-[slideIn_0.5s_ease-out] border-l-4 border-green-500">
                            <CheckCircle2 size={20} className="text-green-500" />
                            <span className="text-xs uppercase tracking-[0.2em] font-medium">{notification}</span>
                        </div>
                    )}

                    {/* --- BIO TAB --- */}
                    {activeTab === 'bio' && (
                        <div className="max-w-3xl mx-auto bg-white p-10 shadow-sm border border-gray-100 fade-in-up">
                            <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
                                <h2 className="text-3xl font-serif">Biography</h2>
                                <button 
                                    onClick={handleSaveBio}
                                    disabled={saving}
                                    className="bg-black text-white px-8 py-3 uppercase text-xs tracking-widest hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center gap-2"
                                >
                                    {saving ? 'Saving...' : <><Save size={14} /> Save Changes</>}
                                </button>
                            </div>

                            <div className="space-y-8">
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2">Headline</label>
                                    <input type="text" className="w-full border-b border-gray-200 py-2 focus:border-black outline-none transition-colors font-serif text-lg" 
                                        value={bio.headline} onChange={(e) => setBio({...bio, headline: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2">Profile Image URL</label>
                                    <input type="text" className="w-full border-b border-gray-200 py-2 focus:border-black outline-none transition-colors text-sm" 
                                        value={bio.profileImage} onChange={(e) => setBio({...bio, profileImage: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2">Intro Blurb</label>
                                    <textarea className="w-full border border-gray-200 p-4 focus:border-black outline-none h-24 resize-none text-sm leading-relaxed" 
                                        value={bio.intro} onChange={(e) => setBio({...bio, intro: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2">Full Bio</label>
                                    <textarea className="w-full border border-gray-200 p-4 focus:border-black outline-none h-48 resize-none text-sm leading-relaxed" 
                                        value={bio.bio} onChange={(e) => setBio({...bio, bio: e.target.value})} />
                                </div>
                                <div className="pt-6 border-t border-gray-100">
                                    <h3 className="text-sm font-bold mb-6 uppercase tracking-widest">Measurements</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                        {bio.stats.map((stat, idx) => (
                                            <div key={idx}>
                                                <label className="text-[10px] text-gray-400 block mb-1 uppercase tracking-wide">{stat.label}</label>
                                                <input 
                                                    className="w-full border-b border-gray-200 py-1 focus:border-black outline-none text-sm"
                                                    value={stat.value}
                                                    onChange={(e) => {
                                                        const newStats = [...bio.stats];
                                                        newStats[idx] = { ...stat, value: e.target.value };
                                                        setBio({ ...bio, stats: newStats });
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- PORTFOLIO TAB --- */}
                    {activeTab === 'portfolio' && (
                        <div className="max-w-6xl mx-auto fade-in-up">
                            {/* NEW: Portfolio Header with Save Button */}
                            <div className="flex justify-between items-center mb-8 bg-white p-6 shadow-sm border border-gray-100">
                                <h2 className="text-3xl font-serif">Portfolio Manager</h2>
                                <button 
                                    onClick={handleSavePortfolio}
                                    disabled={saving}
                                    className="bg-black text-white px-8 py-3 uppercase text-xs tracking-widest hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center gap-2"
                                >
                                    {saving ? 'Saving...' : <><Save size={14} /> Save All Changes</>}
                                </button>
                            </div>

                             <div className="bg-white p-8 shadow-sm mb-10 border border-gray-100">
                                <h3 className="text-xl font-serif mb-6">Add New Work</h3>
                                <div className="flex flex-col md:flex-row gap-6 items-end">
                                    <div className="flex-1 w-full">
                                        <label className="text-[10px] uppercase tracking-widest text-gray-400 mb-2 block">Image Source URL</label>
                                        <input type="text" className="w-full border-b border-gray-200 py-2 focus:border-black outline-none text-sm" placeholder="https://..." 
                                            value={newPortfolioItem.src || ''} onChange={(e) => setNewPortfolioItem({...newPortfolioItem, src: e.target.value})} />
                                    </div>
                                    <div className="flex-1 w-full">
                                        <label className="text-[10px] uppercase tracking-widest text-gray-400 mb-2 block">Project Title</label>
                                        <input type="text" className="w-full border-b border-gray-200 py-2 focus:border-black outline-none text-sm" placeholder="e.g. Vogue Italia" 
                                            value={newPortfolioItem.title || ''} onChange={(e) => setNewPortfolioItem({...newPortfolioItem, title: e.target.value})} />
                                    </div>
                                    <div className="w-full md:w-48">
                                        <label className="text-[10px] uppercase tracking-widest text-gray-400 mb-2 block">Category</label>
                                        <select className="w-full border-b border-gray-200 py-2 bg-transparent focus:border-black outline-none text-sm"
                                            value={newPortfolioItem.category} onChange={(e) => setNewPortfolioItem({...newPortfolioItem, category: e.target.value as any})}>
                                            <option value="editorial">Editorial</option>
                                            <option value="commercial">Commercial</option>
                                            <option value="runway">Runway</option>
                                            <option value="digital">Digital</option>
                                        </select>
                                    </div>
                                    <button 
                                        onClick={handleAddPortfolio}
                                        disabled={saving}
                                        className="bg-black text-white p-3 rounded-full hover:bg-gray-800 disabled:opacity-50 transition-transform hover:scale-105 shadow-lg"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {portfolio.map(item => (
                                    <div key={item.id} className="relative group bg-white shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
                                        <div className="relative aspect-[3/4] overflow-hidden">
                                            <img src={item.src} alt={item.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                                        </div>
                                        <div className="p-4 space-y-2">
                                            {/* Editable Title */}
                                            <input 
                                                value={item.title} 
                                                onChange={(e) => handleUpdatePortfolioState(item.id, 'title', e.target.value)}
                                                className="w-full font-serif text-lg border-b border-transparent focus:border-black outline-none bg-transparent truncate" 
                                            />
                                            {/* Editable Category */}
                                            <select 
                                                value={item.category}
                                                onChange={(e) => handleUpdatePortfolioState(item.id, 'category', e.target.value)}
                                                className="text-[10px] uppercase tracking-widest text-gray-400 w-full bg-transparent outline-none cursor-pointer"
                                            >
                                                <option value="editorial">Editorial</option>
                                                <option value="commercial">Commercial</option>
                                                <option value="runway">Runway</option>
                                                <option value="digital">Digital</option>
                                            </select>
                                        </div>
                                        <button 
                                            onClick={() => handleDeletePortfolio(item.id)}
                                            className="absolute top-2 right-2 bg-white text-red-500 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-sm hover:bg-red-50"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* --- SERVICES TAB --- */}
                    {activeTab === 'services' && (
                        <div className="max-w-4xl mx-auto bg-white p-10 shadow-sm border border-gray-100 fade-in-up">
                            <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
                                <h2 className="text-3xl font-serif">Manage Services</h2>
                                <button onClick={handleSaveServices} className="bg-black text-white px-8 py-3 uppercase text-xs tracking-widest hover:bg-gray-800 flex gap-2 items-center transition-colors">
                                    <Save size={14} /> {saving ? 'Saving...' : 'Save All Changes'}
                                </button>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-8">
                                {services.map((service, idx) => (
                                    <div key={idx} className="border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 bg-gray-50/50">
                                        <div className="mb-4">
                                            <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-1">Service Title</label>
                                            <input 
                                                className="w-full font-serif text-2xl border-b border-gray-200 focus:border-black outline-none bg-transparent py-1"
                                                value={service.title}
                                                onChange={(e) => handleUpdateService(idx, 'title', e.target.value)}
                                            />
                                        </div>
                                        
                                        <div className="mb-6">
                                            <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-1">Description</label>
                                            <textarea 
                                                className="w-full text-sm text-gray-600 border border-gray-200 focus:border-black outline-none p-3 h-20 resize-none bg-white"
                                                value={service.description}
                                                onChange={(e) => handleUpdateService(idx, 'description', e.target.value)}
                                            />
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-1">Display Price</label>
                                                <input 
                                                    className="w-full text-xs font-bold uppercase tracking-wider text-gray-600 border-b border-gray-200 focus:border-black outline-none py-2 bg-transparent"
                                                    value={service.priceRange}
                                                    onChange={(e) => handleUpdateService(idx, 'priceRange', e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-1">Tooltip Details</label>
                                                <input 
                                                    className="w-full text-xs text-gray-500 border-b border-gray-200 focus:border-black outline-none py-2 bg-transparent"
                                                    placeholder="Hover details..."
                                                    value={service.priceDetails || ''}
                                                    onChange={(e) => handleUpdateService(idx, 'priceDetails', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* --- INBOX TAB --- */}
                    {activeTab === 'inbox' && (
                        <div className="max-w-4xl mx-auto bg-white shadow-sm border border-gray-100 fade-in-up min-h-[500px] flex flex-col">
                            <div className="flex justify-between items-center p-6 border-b border-gray-100">
                                <h2 className="text-3xl font-serif">Inbox</h2>
                                <button onClick={fetchMessages} className="text-gray-400 hover:text-black transition-colors p-2">
                                    <RefreshCw size={16} />
                                </button>
                            </div>

                            <div className="divide-y divide-gray-100">
                                {messages.length === 0 ? (
                                    <div className="p-10 text-center text-gray-400">
                                        <Mail size={48} className="mx-auto mb-4 opacity-20" />
                                        <p className="uppercase tracking-widest text-xs">No messages yet</p>
                                    </div>
                                ) : (
                                    messages.map((msg) => (
                                        <div 
                                            key={msg.id} 
                                            onClick={() => msg.id && !msg.read && handleMarkRead(msg.id)}
                                            className={`p-6 hover:bg-gray-50 transition-colors cursor-pointer ${!msg.read ? 'bg-blue-50/30' : ''}`}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center gap-2">
                                                    {!msg.read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                                                    <span className={`font-serif text-lg ${!msg.read ? 'font-bold' : ''}`}>{msg.name}</span>
                                                    <span className="text-xs text-gray-400 mx-2">•</span>
                                                    <span className="text-xs text-gray-500 uppercase tracking-wider">{msg.subject}</span>
                                                </div>
                                                <span className="text-[10px] text-gray-400 uppercase tracking-widest">
                                                    {msg.timestamp ? new Date(msg.timestamp).toLocaleDateString() : 'Unknown Date'}
                                                </span>
                                            </div>
                                            <div className="pl-4 border-l-2 border-gray-100 ml-1">
                                                <p className="text-sm text-gray-600 leading-relaxed mb-2">{msg.message}</p>
                                                <a href={`mailto:${msg.email}`} className="text-[10px] uppercase tracking-widest text-gray-400 hover:text-black border-b border-transparent hover:border-black transition-all inline-block pb-0.5">
                                                    Reply to {msg.email}
                                                </a>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
