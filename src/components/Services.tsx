
import React, { useEffect, useState } from 'react';
import { getServices } from '../services/cms';
import { Service } from '../types';
import SEO from './SEO';
import { Info } from 'lucide-react';

interface ServicesProps {
    onNavigate: (page: 'contact') => void;
}

const Services: React.FC<ServicesProps> = ({ onNavigate }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
        try {
            const data = await getServices();
            setServices(data);
        } catch (error) {
            console.error("Failed to fetch services", error);
        } finally {
            setLoading(false);
        }
    };
    fetchServices();
  }, []);

  // Structured data for Services
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Modeling",
    "provider": {
        "@type": "Person",
        "name": "Virtuous Model"
    },
    "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Modeling Services",
        "itemListElement": services.map(s => ({
            "@type": "Offer",
            "itemOffered": {
                "@type": "Service",
                "name": s.title,
                "description": s.description
            },
            "priceSpecification": {
                "@type": "PriceSpecification",
                "priceCurrency": "USD",
                "description": s.priceRange
            }
        }))
    }
  };

  if (loading) {
    return <div className="h-screen flex items-center justify-center"><div className="w-1 h-12 bg-black animate-pulse"></div></div>;
  }

  return (
    <>
      <SEO 
        title="Services" 
        description="Professional modeling services including Editorial, Runway, Commercial, and Brand Ambassadorship."
        schema={schemaData}
      />
      <section className="py-24 px-6 md:px-12 max-w-screen-xl mx-auto bg-luxury-gray">
        <div className="mb-20 text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-light mb-6">Expertise</h2>
          <p className="max-w-xl mx-auto text-gray-500 font-light">
            Professional modeling services tailored to luxury brands, artistic projects, and commercial campaigns.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          {services.map((service, idx) => (
            <div 
              key={idx} 
              className="bg-white p-10 md:p-14 shadow-sm hover:shadow-xl transition-shadow duration-500 flex flex-col justify-between group"
            >
              <div>
                <h3 className="text-2xl font-serif mb-4">{service.title}</h3>
                <p className="text-gray-600 font-light leading-relaxed mb-8 text-sm">
                  {service.description}
                </p>
              </div>
              <div className="border-t border-gray-100 pt-6 flex justify-between items-center relative">
                <div className="flex items-center gap-2 group/tooltip relative">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {service.priceRange}
                    </span>
                    <div className="relative">
                        <Info size={14} className="text-gray-300 hover:text-black cursor-help transition-colors" />
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 bg-black text-white p-4 opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-300 z-20 shadow-xl pointer-events-none md:pointer-events-auto">
                            <p className="text-[10px] leading-relaxed font-light tracking-wide mb-3 text-gray-200">
                                {service.priceDetails || "Contact for a bespoke quote tailored to your specific project requirements."}
                            </p>
                            <div 
                                onClick={(e) => { e.stopPropagation(); onNavigate('contact'); }}
                                className="text-[10px] uppercase tracking-widest border-b border-white/30 hover:border-white pb-0.5 inline-block cursor-pointer"
                            >
                                Request Quote
                            </div>
                            <div className="w-2 h-2 bg-black absolute -bottom-1 left-1/2 -translate-x-1/2 rotate-45"></div>
                        </div>
                    </div>
                </div>
                
                <button 
                  onClick={() => onNavigate('contact')}
                  className="text-xs uppercase tracking-widest border-b border-black pb-1 hover:text-gray-500 hover:border-gray-500 transition-all"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Services;