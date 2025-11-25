import React, { useEffect, useState } from 'react';
import { getModelBio } from '../services/cms';
import { ModelBio } from '../types';
import SEO from './SEO';

const About: React.FC = () => {
  const [data, setData] = useState<ModelBio | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bioData = await getModelBio();
        setData(bioData);
      } catch (error) {
        console.error("Failed to fetch bio data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="h-screen flex items-center justify-center"><div className="w-1 h-12 bg-black animate-pulse"></div></div>;
  }

  if (!data) return null;

  // Schema.org structured data for a Person/Model
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Virtuous Model",
    "jobTitle": "Professional Model",
    "image": data.profileImage,
    "description": data.intro,
    "height": data.stats.find(s => s.label === 'Height')?.value,
    "url": window.location.href
  };

  return (
    <>
      <SEO 
        title="About" 
        description="Biography and statistics of Virtuous Model, professional fashion and editorial model based in New York."
        image={data.profileImage}
        schema={schemaData}
        type="profile"
      />
      <section className="py-24 px-6 md:px-12 max-w-screen-xl mx-auto">
        <div className="flex flex-col md:flex-row gap-16 items-start">
          
          {/* Image */}
          <div className="w-full md:w-1/2 fade-in-up">
            <img 
              src={data.profileImage} 
              alt="Virtuous Model Portrait" 
              className="w-full h-auto object-cover grayscale hover:grayscale-0 transition-all duration-700"
            />
          </div>

          {/* Content */}
          <div className="w-full md:w-1/2 flex flex-col justify-center pt-8 fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-4xl md:text-5xl font-serif mb-8 font-light">{data.headline}</h2>
            <div className="space-y-6 text-gray-600 font-light leading-relaxed mb-12">
              <p>{data.intro}</p>
              <p>{data.bio}</p>
            </div>

            <h3 className="text-xl font-serif mb-6 italic border-b border-gray-200 pb-2">Measurements</h3>
            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              {data.stats.map((stat, idx) => (
                <div key={idx} className="flex flex-col">
                  <span className="text-xs uppercase tracking-widest text-gray-400 mb-1">{stat.label}</span>
                  <span className="text-sm md:text-base font-medium">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;