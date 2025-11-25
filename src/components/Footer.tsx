
import React from 'react';
import { Instagram, Mail, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-luxury-black text-white py-20 px-6 md:px-12 border-t border-gray-900">
      <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-12 md:space-y-0">
        
        {/* Brand Logo Lockup */}
        <div className="text-center md:text-left flex flex-col items-center md:items-start">
            <div className="mb-6 leading-none">
                <h2 className="text-3xl font-serif italic tracking-tight">Virtuous</h2>
                <span className="block text-[8px] font-sans uppercase tracking-[0.4em] text-gray-400 mt-1 text-center md:text-left ml-1">Model</span>
            </div>
            <p className="text-gray-500 text-[10px] uppercase tracking-widest">
                © {new Date().getFullYear()} All Rights Reserved.
            </p>
        </div>

        <div className="flex space-x-10">
            <a href="https://www.instagram.com/eniola__oj?igsh=dnE4ZzQwb2Rhd2Iz" className="hover:text-gray-400 transition-colors transform hover:-translate-y-1 duration-300"><Instagram size={20} strokeWidth={1} /></a>
            <a href="https://wa.me/+2349018209550" className="hover:text-gray-400 transition-colors transform hover:-translate-y-1 duration-300"><Phone size={20} strokeWidth={1} /></a>
            <a href="mailto:contact@virtuousmodel.com" className="hover:text-gray-400 transition-colors transform hover:-translate-y-1 duration-300"><Mail size={20} strokeWidth={1} /></a>
        </div>

        <div className="text-center md:text-right text-gray-500 text-[10px] uppercase tracking-[0.2em] leading-loose">
          <p>Nigeria • Lagos • Africa</p>
          <p className="mt-1">Represented by Virtuous Model Group</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;