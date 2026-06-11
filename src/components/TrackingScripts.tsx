import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { GoogleAdsSettings } from '../types';

export function trackEvent(eventName: string, params?: Record<string, any>) {
    console.log(`Tracking event: ${eventName}`, params);
    // Implementation for GTM or GA would go here
    if (window.gtag) {
        window.gtag('event', eventName, params);
    }
}

export default function TrackingScripts() {
    const [settings, setSettings] = useState<GoogleAdsSettings | null>(null);

    useEffect(() => {
        supabase.from('google_ads_settings').select('*').single().then(({ data }) => {
            if (data && data.active) setSettings(data);
        });
    }, []);

    useEffect(() => {
        if (!settings) return;

        // Inject GTM
        if (settings.gtm_id) {
            const script = document.createElement('script');
            script.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${settings.gtm_id}');`;
            document.head.appendChild(script);

            const noscript = document.createElement('noscript');
            noscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${settings.gtm_id}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
            document.body.prepend(noscript);
        }

        // Add custom head/body codes
        if (settings.custom_head_code) {
           const headDiv = document.createElement('div');
           headDiv.innerHTML = settings.custom_head_code;
           while(headDiv.firstChild) document.head.appendChild(headDiv.firstChild);
        }

        if (settings.custom_body_code) {
            const bodyDiv = document.createElement('div');
            bodyDiv.innerHTML = settings.custom_body_code;
            while(bodyDiv.firstChild) document.body.appendChild(bodyDiv.firstChild);
        }

    }, [settings]);

    return null;
}
