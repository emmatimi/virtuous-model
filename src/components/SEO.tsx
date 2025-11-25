import React, { useEffect } from 'react';
import { SEOProps } from '../types';

const SEO: React.FC<SEOProps> = ({ title, description, image, type = 'website', schema }) => {
  const siteTitle = "Virtuous Model | Portfolio";
  const fullTitle = title === "Home" ? siteTitle : `${title} | Virtuous Model`;
  const metaImage = image || "https://picsum.photos/1200/630?grayscale";
  const currentUrl = window.location.href;

  useEffect(() => {
    // Update Title
    document.title = fullTitle;

    // Helper function to update or create meta tags
    const updateMeta = (name: string, content: string, attribute: string = 'name') => {
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Standard Meta
    updateMeta('description', description);

    // Open Graph
    updateMeta('og:title', fullTitle, 'property');
    updateMeta('og:description', description, 'property');
    updateMeta('og:image', metaImage, 'property');
    updateMeta('og:url', currentUrl, 'property');
    updateMeta('og:type', type, 'property');
    
    // Twitter
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', fullTitle);
    updateMeta('twitter:description', description);
    updateMeta('twitter:image', metaImage);

    // Structured Data (JSON-LD)
    if (schema) {
      const scriptId = 'structured-data';
      let script = document.getElementById(scriptId);
      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.setAttribute('type', 'application/ld+json');
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(schema);
    }

    // Cleanup not strictly necessary for client-side nav in this context as we overwrite,
    // but good practice would be to revert to default on unmount if complex.

  }, [fullTitle, description, metaImage, currentUrl, type, schema]);

  return null;
};

export default SEO;