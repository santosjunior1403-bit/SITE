import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackEvent } from './TrackingScripts';

export default function PageTracker() {
  const location = useLocation();

  useEffect(() => {
    trackEvent('page_view', {
      page_path: location.pathname,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [location]);

  return null;
}
