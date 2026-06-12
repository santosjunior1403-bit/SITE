import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { MessageCircle } from 'lucide-react';
import { trackEvent } from './TrackingScripts';

export default function WhatsAppFloatingButton() {
  const [whatsapp, setWhatsapp] = useState('5511999999999');

  useEffect(() => {
    if (!supabase) return;
    const loadWhatsApp = async () => {
      try {
        const { data, error } = await supabase.from('hero_section').select('whatsapp_number').single();
        if (!error && data && data.whatsapp_number) {
          setWhatsapp(data.whatsapp_number);
        }
      } catch (err) {
        console.warn("Could not load WhatsApp number, using default of 5511999999999", err);
      }
    };
    loadWhatsApp();
  }, []);

  if (!whatsapp) return null;

  return (
    <a 
      href={`https://wa.me/${whatsapp}?text=Olá! Gostaria de solicitar um orçamento.`}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent('whatsapp_click', { button: 'floating' })}
      className="fixed bottom-6 right-6 bg-[#00C853] text-white p-4 rounded-full shadow-lg z-[100] hover:scale-110 hover:bg-[#00a846] transition duration-300"
    >
      <MessageCircle size={32} />
    </a>
  );
}
