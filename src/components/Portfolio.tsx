import React, { useState, useEffect, useMemo } from 'react';
import { getPortfolioItems } from '../services/cms';
import { PortfolioItem } from '../types';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import SEO from './SEO';

const Portfolio: React.FC = () => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  const filters = ['all', 'editorial', 'commercial', 'runway', 'digital'];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // In a real CMS scenario, we might fetch filtered data directly from the API
        const data = await getPortfolioItems(); 
        setItems(data);
      } catch (error) {
        console.error("Failed to fetch portfolio", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredItems = useMemo(() => {
    return filter === 'all' 
      ? items 
      : items.filter(item => item.category === filter);
  }, [filter, items]);

  const openLightbox = (item: PortfolioItem) => setSelectedItem(item);
  const closeLightbox = () => setSelectedItem(null);

  const navigateLightbox = (direction: 'next' | 'prev') => {
    if (!selectedItem) return;
    const currentIndex = filteredItems.findIndex(i => i.id === selectedItem.id);
    if (currentIndex === -1) return;

    let newIndex;
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % filteredItems.length;
    } else {
      newIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
    }
    setSelectedItem(filteredItems[newIndex]);
  };

  if (loading) {
    return <div className="h-screen flex items-center justify-center"><div className="w-1 h-12 bg-black animate-pulse"></div></div>;
  }

  return (
    <>
      <SEO 
        title="Portfolio" 
        description="Browse the selected works of Elara Vance, including editorial spreads, runway shows, and commercial campaigns."
      />
      <section className="py-24 px-4 md:px-12 bg-white min-h-screen">
        <div className="max-w-screen-2xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-20 fade-in-up">
            <h2 className="text-4xl md:text-5xl font-serif font-light mb-8">Selected Works</h2>
            
            {/* Filters */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-8">
              {filters.map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`text-xs uppercase tracking-[0.2em] py-2 border-b transition-colors duration-300 ${
                    filter === f 
                      ? 'border-black text-black' 
                      : 'border-transparent text-gray-400 hover:text-black'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Masonry Grid */}
          <div className="columns-1 md:columns-2 lg:columns-3 gap-8">
            {filteredItems.map((item) => (
              <div 
                key={item.id}
                className="break-inside-avoid group cursor-zoom-in mb-16 block"
                onClick={() => openLightbox(item)}
              >
                <div className="relative overflow-hidden mb-4">
                  <img 
                    src={item.src} 
                    alt={item.title} 
                    className="w-full h-auto object-cover transition-transform duration-1000 ease-out group-hover:scale-105 filter md:grayscale-[20%] group-hover:grayscale-0"
                    loading="lazy"
                  />
                </div>
                
                <div className="flex flex-col items-start px-1">
                  <span className="font-serif text-xl text-black italic">{item.title}</span>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-gray-400 mt-2 group-hover:text-black transition-colors">{item.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lightbox */}
        {selectedItem && (
          <div className="fixed inset-0 z-[60] bg-white/95 backdrop-blur-md flex justify-center items-center p-4 md:p-10">
            <button 
              onClick={closeLightbox} 
              className="absolute top-6 right-6 text-black hover:opacity-50 transition-opacity p-2"
            >
              <X size={32} />
            </button>

            <button 
              onClick={(e) => { e.stopPropagation(); navigateLightbox('prev'); }}
              className="absolute left-4 md:left-10 p-2 hover:bg-gray-100 rounded-full transition-colors hidden md:block"
            >
              <ChevronLeft size={32} />
            </button>

            <div className="max-h-full max-w-full flex flex-col items-center">
              <img 
                src={selectedItem.src} 
                alt={selectedItem.title} 
                className="max-h-[80vh] max-w-full object-contain shadow-2xl" 
              />
              <div className="mt-6 text-center">
                <h3 className="text-2xl font-serif font-light">{selectedItem.title}</h3>
                <p className="text-xs uppercase tracking-widest text-gray-500 mt-2">{selectedItem.category}</p>
              </div>
            </div>

            <button 
              onClick={(e) => { e.stopPropagation(); navigateLightbox('next'); }}
              className="absolute right-4 md:right-10 p-2 hover:bg-gray-100 rounded-full transition-colors hidden md:block"
            >
              <ChevronRight size={32} />
            </button>
          </div>
        )}
      </section>
    </>
  );
};

export default Portfolio;
