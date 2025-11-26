
import React, { useState, useEffect } from 'react';
import { Menu, X, Instagram, Linkedin, Twitter, Mail } from 'lucide-react';
import { Page } from '../types';

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when menu is open to prevent background scrolling
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const navLinks: { label: string; value: Page }[] = [
    { label: 'Home', value: 'home' },
    { label: 'About', value: 'about' },
    { label: 'Portfolio', value: 'portfolio' },
    { label: 'Services', value: 'services' },
    { label: 'Contact', value: 'contact' },
  ];

  const handleNav = (page: Page) => {
    onNavigate(page);
    setIsOpen(false);
    window.scrollTo(0, 0);
  };

  // Determine styles based on state
  const isScrolledOrNotHome = scrolled || currentPage !== 'home';
  
  // Text Color: Black if menu is open OR if we are on a solid nav state
  const textColorClass = isOpen || isScrolledOrNotHome ? 'text-black' : 'text-white';
  
  // Background: 
  // - Transparent if Open (let the overlay handle the glass effect)
  // - White Glass if Scrolled/Not Home
  // - Transparent if Home Top
  const navBackgroundClass = isOpen 
    ? 'bg-transparent py-4'
    : isScrolledOrNotHome 
      ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20 py-2' 
      : 'bg-transparent py-6';

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${navBackgroundClass}`}
    >
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12 flex justify-between items-center">
        {/* Logo Lockup */}
        <button 
          onClick={() => handleNav('home')} 
          className={`flex flex-col items-center leading-none group z-50 transition-colors duration-300 ${textColorClass}`}
        >
          <span className="font-serif italic text-3xl md:text-4xl tracking-tight">Virtuous</span>
          <span className={`font-sans text-[8px] md:text-[10px] uppercase tracking-[0.4em] mt-1 opacity-80 group-hover:tracking-[0.5em] transition-all duration-500 ${textColorClass === 'text-white' ? 'text-gray-200' : 'text-black'}`}>
            Model
          </span>
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-12 items-center">
          {navLinks.map((link) => (
            <button
              key={link.value}
              onClick={() => handleNav(link.value)}
              className={`text-xs uppercase tracking-[0.2em] relative group overflow-hidden py-1 ${
                currentPage === link.value 
                  ? 'font-bold' 
                  : 'opacity-80'
              } ${textColorClass}`}
            >
              <span className={`inline-block transition-transform duration-300 group-hover:-translate-y-full`}>
                {link.label}
              </span>
              <span className={`absolute top-0 left-0 w-full h-full flex items-center justify-center transition-transform duration-300 translate-y-full group-hover:translate-y-0`}>
                {link.label}
              </span>
            </button>
          ))}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden z-50">
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className={`p-2 hover:opacity-70 transition-opacity focus:outline-none ${textColorClass}`}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={28} strokeWidth={1.5} /> : <Menu size={28} strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay - Frosted Glass Effect */}
      <div
        className={`fixed inset-0 bg-white/30 backdrop-blur-2xl z-40 flex flex-col justify-between transition-all duration-700 ease-in-out ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        <div className="h-20"></div> {/* Spacer for header */}

        {/* Links */}
        <div className="flex flex-col items-center justify-center flex-grow space-y-6">
          {navLinks.map((link, idx) => (
            <button
              key={link.value}
              onClick={() => handleNav(link.value)}
              style={{ transitionDelay: `${isOpen ? 100 + (idx * 50) : 0}ms` }}
              className={`text-5xl font-serif italic tracking-wide hover:text-gray-500 transition-all duration-700 transform text-black ${
                isOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>
        
        {/* Professional Footer Info */}
        <div 
          className={`w-full px-8 pb-12 grid grid-cols-1 gap-8 text-center transition-all duration-700 delay-300 transform ${
            isOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
            <div className="w-12 h-[1px] bg-black/10 mx-auto mb-4"></div>

            <div className="space-y-6">
                <div>
                    <p className="text-[10px] uppercase tracking-[0.25em] text-gray-500 mb-2">Representation</p>
                    <p className="font-serif text-2xl text-black">Virtuous Model Mgmt</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Nigeria • Lagos • Africa</p>
                </div>

                <div className="flex justify-center gap-6 text-black pt-2">
                   <a a href="https://www.instagram.com/eniola__oj?igsh=dnE4ZzQwb2Rhd2Iz" className="p-3 border border-black/5 bg-white/50 rounded-full hover:bg-black hover:text-white transition-all duration-300"><Instagram size={18} strokeWidth={1.5} /></a>
                   <a href="https://wa.me/+2349018209550" className="p-3 border border-black/5 bg-white/50 rounded-full hover:bg-black hover:text-white transition-all duration-300"><Twitter size={18} strokeWidth={1.5} /></a>
                   <a href="mailto:timiemma2024@gmail.com" className="p-3 border border-black/5 bg-white/50 rounded-full hover:bg-black hover:text-white transition-all duration-300"><Mail size={18} strokeWidth={1.5} /></a>
                </div>
            </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
