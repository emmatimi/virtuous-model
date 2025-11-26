
import React from 'react';
import { Page } from '../types';
import { MODEL_TAGLINE } from '../constants';

interface HeroProps {
  onNavigate: (page: Page) => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-[center_top] md:bg-center bg-no-repeat transition-transform duration-[20s] hover:scale-105"
        style={{ backgroundImage: 'url("https://ik.imagekit.io/4lndq5ke52/bg4.png?q=80&w=2940&auto=format&fit=crop")' }}
      >
         <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-center items-center text-center text-white px-6">
        
        {/* Editorial Logo Lockup */}
        <div className="animate-[fadeInUp_1s_ease-out] flex flex-col items-center mb-8">
          <h1 className="text-7xl md:text-9xl lg:text-[10rem] font-serif italic font-medium tracking-tight leading-none">
            Virtuous
          </h1>
          <span className="text-xs md:text-sm lg:text-base font-sans uppercase tracking-[0.6em] md:tracking-[0.8em] mt-2 md:mt-4 ml-3 text-gray-200">
            Model
          </span>
        </div>

        <div className="w-24 h-[1px] bg-white/60 mb-8 animate-[fadeInUp_1.2s_ease-out]"></div>
        
        <p className="text-xs md:text-sm font-sans uppercase tracking-[0.4em] mb-12 animate-[fadeInUp_1.3s_ease-out] text-gray-200">
          {MODEL_TAGLINE}
        </p>
        
        <div className="flex flex-col items-center gap-5 animate-[fadeInUp_1.5s_ease-out]">
          <button
            onClick={() => onNavigate('portfolio')}
            className="border border-white px-12 py-4 uppercase text-xs tracking-[0.25em] hover:bg-white hover:text-black transition-all duration-500 w-72"
          >
            View Portfolio
          </button>

          <button
            onClick={() => onNavigate('contact')}
            className="bg-white text-black px-12 py-4 uppercase text-xs tracking-[0.25em] hover:bg-transparent hover:text-white border border-white transition-all duration-500 w-72"
          >
            Book Now
          </button>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce opacity-70">
        <div className="w-[1px] h-20 bg-gradient-to-b from-white to-transparent"></div>
      </div>
    </div>
  );
};

export default Hero;
