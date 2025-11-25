
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Portfolio from './components/Portfolio';
import About from './components/About';
import Services from './components/Services';
import Contact from './components/Contact';
import AIConcierge from './components/AIConcierge';
import Analytics from './components/Analytics';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import { Page } from './types';
import { isAuthenticated } from './services/auth';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check auth on mount and check URL for secret admin access
  useEffect(() => {
    setIsLoggedIn(isAuthenticated());

    // Check for secret admin URL param (?page=admin)
    const params = new URLSearchParams(window.location.search);
    if (params.get('page') === 'admin') {
      setCurrentPage('admin');
    }

    // Keyboard Shortcut: Ctrl+Shift+L (or Cmd+Shift+L) to toggle Admin
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'L') {
        e.preventDefault();
        setCurrentPage(prev => prev === 'admin' ? 'home' : 'admin');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setCurrentPage('admin');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Hero onNavigate={setCurrentPage} />;
      case 'about':
        return <About />;
      case 'portfolio':
        return <Portfolio />;
      case 'services':
        return <Services onNavigate={setCurrentPage} />;
      case 'contact':
        return <Contact />;
      case 'admin':
        return isLoggedIn ? (
            <AdminDashboard onNavigate={setCurrentPage} />
        ) : (
            <AdminLogin onLoginSuccess={handleLoginSuccess} />
        );
      default:
        return <Hero onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-black selection:bg-black selection:text-white">
      <Analytics page={currentPage} />
      
      {/* Hide Main Navbar on Admin pages for focus */}
      {currentPage !== 'admin' && (
        <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
      )}
      
      <main className="flex-grow">
        {renderPage()}
      </main>

      {/* Hide Footer and Chat on Admin pages */}
      {currentPage !== 'home' && currentPage !== 'admin' && <Footer />}
      
      {currentPage !== 'admin' && <AIConcierge />}
    </div>
  );
};

export default App;