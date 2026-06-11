import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID;

if (gaId) {
  // Inject Google Analytics
  const scriptTag = document.createElement("script");
  scriptTag.async = true;
  scriptTag.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
  document.head.appendChild(scriptTag);

  // Initialize dataLayer safely
  window.dataLayer = window.dataLayer || [];
  window.gtag = function(...args: any[]) {
    window.dataLayer.push(args);
  };
  
  window.gtag('js', new Date());
  window.gtag('config', gaId);
}
