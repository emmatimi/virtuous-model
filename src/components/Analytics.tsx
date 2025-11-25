import React, { useEffect } from 'react';
import ReactGA from 'react-ga4';
import { Page } from '../types';

// NOTE: Replace with your actual Measurement ID
const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';

interface AnalyticsProps {
    page: Page;
}

const Analytics: React.FC<AnalyticsProps> = ({ page }) => {
    useEffect(() => {
        // Initialize GA only once
        if (!window.gaInitialized) {
            ReactGA.initialize(GA_MEASUREMENT_ID);
            window.gaInitialized = true;
        }

        // Track page view
        ReactGA.send({ 
            hitType: "pageview", 
            page: `/${page === 'home' ? '' : page}`, 
            title: page 
        });

    }, [page]);

    return null;
};

// Extend window interface to track initialization
declare global {
    interface Window {
        gaInitialized?: boolean;
    }
}

export default Analytics;