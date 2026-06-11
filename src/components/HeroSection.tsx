import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { HeroSection as HeroType } from '../types';
import { Check, Zap, Award, Star, Users, MessageCircle } from 'lucide-react';
import { trackEvent } from './TrackingScripts';

const defaultHero: HeroType = {
  id: 'default',
  logo_url: '',
  title: 'NEXO Dedetizadora | Dedetização Profissional em São Paulo',
  subtitle: 'Controle altamente qualificado de baratas, ratos, cupins e formigas com garantia por escrito e limpeza especializada de caixas d\'água.',
  image_url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1920&q=80',
  secondary_banner_url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
  button_text: 'Chamar no WhatsApp',
  whatsapp_number: '5511999999999',
  phone: '(11) 4003-9128',
  email: 'contato@nexodedetizadora.com.br',
  whatsapp_message: 'Olá NEXO! Gostaria de um orçamento para dedetização de pragas.',
  banner_url: '',
  primary_color: '#081A3A',
  secondary_color: '#00C853'
};

export default function HeroSection() {
  const [data, setData] = useState<HeroType>(defaultHero);
  const [satisfiedCount, setSatisfiedCount] = useState('+500');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (!supabase) {
        setData(defaultHero);
        return;
    }
    
    supabase.from('hero_section').select('*').single().then(({ data: queryData, error }) => {
      if (!error && queryData) {
        setData(queryData);
      } else {
        console.warn("Could not retrieve hero settings, loading defaults.", error);
        setData(defaultHero);
      }
    }).catch(err => {
      console.warn("Error loading hero from Supabase:", err);
      setData(defaultHero);
    });

    supabase.from('company_settings').select('institutional_text').single().then(({ data: statsData, error }) => {
      if (!error && statsData && statsData.institutional_text) {
        try {
          const parsed = JSON.parse(statsData.institutional_text);
          if (parsed && typeof parsed === 'object') {
            setSatisfiedCount(parsed.clientes_atendidos || '+500');
          }
        } catch (e) {
          console.error("Error parsing stats", e);
        }
      }
    }).catch(err => {
      console.warn("Error loading stats from Supabase:", err);
    });

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!data) return null;

  const activeBanner = isMobile && data.secondary_banner_url ? data.secondary_banner_url : data.image_url;

  return (
    <div 
      id="inicio" 
      className="relative w-full min-h-screen flex items-center pt-20 bg-cover bg-center hero"
      style={{ backgroundImage: activeBanner ? `url(${activeBanner})` : 'none', backgroundColor: '#081A3A' }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[#081A3A]/90 via-[#081A3A]/60 to-transparent" />
      
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 hero-content">
        <div className="max-w-2xl text-left">
          <h2 className="text-[#00C853] font-bold mb-2 tracking-wider uppercase text-sm md:text-base">PROTEÇÃO QUE</h2>
          <h1 className="text-4xl md:text-7xl font-bold mb-4 md:mb-6 leading-tight text-white">
            VOCÊ PODE <span className="text-[#00C853]">CONFIAR!</span>
          </h1>
          <p className="text-base md:text-xl mb-6 md:mb-8 text-gray-300">
            {data.subtitle || 'Controle de pragas em São Paulo. Dedetização de baratas, ratos, cupins, formigas e limpeza de caixa d\'água. Atendimento rápido e garantia.'}
          </p>
          
          <div className="hidden md:flex flex-col gap-4 mb-8 text-lg text-gray-100 hero-benefits">
              <span className="flex items-center gap-3 justify-start"><Zap className="text-[#00C853]" /> ELIMINAMOS <strong className="ml-1 text-[#00C853]">PRAGAS</strong></span>
              <span className="flex items-center gap-3 justify-start"><Check className="text-[#00C853]" /> ATENDIMENTO <strong className="ml-1 text-[#00C853]">RÁPIDO</strong></span>
              <span className="flex items-center gap-3 justify-start"><Award className="text-[#00C853]" /> GARANTIA <strong className="ml-1 text-[#00C853]">DE QUALIDADE</strong></span>
          </div>

          <div className="flex mb-10 justify-start w-full sm:w-auto">
            <a href={`https://wa.me/${data.whatsapp_number.replace(/\D/g, '')}?text=${encodeURIComponent(data.whatsapp_message || '')}`} 
               onClick={() => trackEvent('whatsapp_click', { button: 'hero' })} 
               className="bg-[#00C853] text-white px-10 py-5 rounded-full font-black hover:bg-[#00a846] transition-all flex items-center justify-center gap-3 text-lg md:text-xl shadow-xl shadow-[#00C853]/35 group w-full sm:w-auto transform hover:scale-[1.02] duration-300">
                <MessageCircle className="w-6 h-6 md:w-7 md:h-7 group-hover:scale-110 transition-transform" /> {data.button_text || 'Chamar no WhatsApp'}
            </a>
          </div>
          
          <div className="hidden md:flex bg-white/5 p-4 rounded-2xl border border-white/10 items-center gap-4 backdrop-blur-md max-w-sm mx-auto md:mx-0 hero-stats">
            <div className="flex -space-x-4">
                {[1,2,3].map(i => <div key={i} className="w-10 h-10 rounded-full bg-gray-700 border-2 border-[#0D47A1] overflow-hidden"><img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" /></div>)}
            </div>
            <div>
                <div className="flex gap-1 text-[#00C853]">
                    {[1,2,3,4,5].map(i => <Star key={i} fill="currentColor" className="w-4 h-4" />)}
                </div>
                <div className="text-sm text-gray-300">{satisfiedCount} clientes satisfeitos</div>
            </div>
            <div className="ml-auto text-right">
                <div className="font-bold text-2xl flex items-center gap-1">5.0</div>
                <div className="text-gray-400 text-xs text-white">Avaliações</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
