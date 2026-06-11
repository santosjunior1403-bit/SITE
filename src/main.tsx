import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Safely inject Google Analytics without breaking the page or app
try {
  const gaId = (import.meta as any).env.VITE_GA_MEASUREMENT_ID || 'G-9JH5NXV3W9';
  if (gaId && typeof window !== 'undefined') {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(script);

    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).gtag = function (...args: any[]) {
      (window as any).dataLayer.push(args);
    };
    (window as any).gtag('js', new Date());
    (window as any).gtag('config', gaId);
  }
} catch (e) {
  console.warn("Failed to initialize Google Analytics safely:", e);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);


