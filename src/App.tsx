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
  // Helper to get the current page from the URL
  const getPageFromUrl = (): Page => {
    const params = new URLSearchParams(window.location.search);
    const page = params.get('page');
    const validPages: Page[] = ['home', 'about', 'portfolio', 'services', 'contact', 'admin'];
    
    if (page && validPages.includes(page as Page)) {
      return page as Page;
    }
    return 'home';
  };

  // Initialize state directly from the URL
  const [currentPage, setCurrentPage] = useState<Page>(getPageFromUrl);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 1. Handle Browser Back/Forward Buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(getPageFromUrl());
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // 2. Sync State Changes to the URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlPage = params.get('page') || 'home';

    if (currentPage !== urlPage) {
      if (currentPage === 'home') {
        // Clean URL for home page (remove ?page=home)
        const newUrl = window.location.pathname;
        window.history.pushState({}, '', newUrl);
      } else {
        // Set param for other pages
        params.set('page', currentPage);
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.pushState({}, '', newUrl);
      }
    }
    
    // Scroll to top on page change
    window.scrollTo(0, 0);
  }, [currentPage]);

  // 3. Check Auth & Shortcuts
  useEffect(() => {
    setIsLoggedIn(isAuthenticated());

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
    // We remain on the 'admin' page, but now the dashboard will render
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
