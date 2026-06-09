import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppFloatingButton() {
  const [whatsapp, setWhatsapp] = useState('');

  useEffect(() => {
    supabase.from('hero_section').select('whatsapp_number').single().then(({ data }) => {
      if (data) setWhatsapp(data.whatsapp_number);
    });
  }, []);

  if (!whatsapp) return null;

  return (
    <a 
      href={`https://wa.me/${whatsapp}?text=Olá! Gostaria de solicitar um orçamento.`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg z-[100] hover:scale-110 transition"
    >
      <MessageCircle size={32} />
    </a>
  );
}
