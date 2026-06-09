import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { HeroSection as HeroType } from '../types';
import { Check, Zap, Award, Star, Users } from 'lucide-react';

export default function HeroSection() {
  const [data, setData] = useState<HeroType | null>(null);

  useEffect(() => {
    supabase.from('hero_section').select('*').single().then(({ data }) => {
      if (data) setData(data);
    });
  }, []);

  if (!data) return null;

  return (
    <div 
      id="inicio" 
      className="relative w-full min-h-screen flex items-center pt-20 bg-cover bg-center hero"
      style={{ backgroundImage: data.image_url ? `url(${data.image_url})` : 'none', backgroundColor: '#081A3A' }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[#081A3A]/80 via-[#081A3A]/40 to-transparent" />
      
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 hero-content">
        <div className="max-w-2xl text-left">
          <h2 className="text-[#00C853] font-bold mb-2 tracking-wider uppercase text-sm md:text-base">PROTEÇÃO QUE</h2>
          <h1 className="text-4xl md:text-7xl font-bold mb-4 md:mb-6 leading-tight text-white">
            VOCÊ PODE <span className="text-[#00C853]">CONFIAR!</span>
          </h1>
          <p className="text-base md:text-xl mb-6 md:mb-8 text-gray-300">
            {data.subtitle}
          </p>
          
          <div className="hidden md:flex flex-col gap-4 mb-8 text-lg text-gray-100 hero-benefits">
              <span className="flex items-center gap-3 justify-start"><Zap className="text-[#00C853]" /> ELIMINAMOS <strong className="ml-1 text-[#00C853]">PRAGAS</strong></span>
              <span className="flex items-center gap-3 justify-start"><Check className="text-[#00C853]" /> ATENDIMENTO <strong className="ml-1 text-[#00C853]">RÁPIDO</strong></span>
              <span className="flex items-center gap-3 justify-start"><Award className="text-[#00C853]" /> GARANTIA <strong className="ml-1 text-[#00C853]">DE QUALIDADE</strong></span>
          </div>

          <div className="flex flex-wrap gap-4 mb-10 justify-start">
            <a href={`https://wa.me/${data.whatsapp_number}`} className="bg-[#00C853] text-white px-6 py-3 md:px-8 md:py-4 rounded-full font-bold hover:bg-[#00a846] transition-all flex items-center gap-2 text-base md:text-lg">
                <Users className="w-5 h-5 md:w-6 md:h-6" /> {data.button_text}
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
                <div className="text-sm text-gray-300">+500 clientes satisfeitos</div>
            </div>
            <div className="ml-auto text-right">
                <div className="font-bold text-2xl flex items-center gap-1">5.0</div>
                <div className="text-gray-400 text-xs">Avaliações</div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}
