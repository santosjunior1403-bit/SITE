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
    <div id="inicio" className="bg-gradient-to-br from-[#081A3A] to-[#0D47A1] text-white min-h-[90vh] flex items-center pt-20">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center py-12">
        <div className="max-w-7xl mx-auto text-center md:text-left">
          <h2 className="text-[#00C853] font-bold mb-2 tracking-wider">PROTEÇÃO QUE</h2>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-white">
            VOCÊ PODE <span className="text-[#00C853]">CONFIAR!</span>
          </h1>
          <p className="text-xl mb-8 text-gray-300">
            {data.subtitle}
          </p>
          <div className="flex flex-col gap-4 mb-8 text-lg text-gray-100">
              <span className="flex items-center gap-3"><Zap className="text-[#00C853]" /> ELIMINAMOS <strong className="ml-1 text-[#00C853]">PRAGAS</strong></span>
              <span className="flex items-center gap-3"><Check className="text-[#00C853]" /> ATENDIMENTO <strong className="ml-1 text-[#00C853]">RÁPIDO</strong></span>
              <span className="flex items-center gap-3"><Award className="text-[#00C853]" /> GARANTIA <strong className="ml-1 text-[#00C853]">DE QUALIDADE</strong></span>
          </div>
          <div className="flex flex-wrap gap-4 mb-10">
            <a href={`https://wa.me/${data.whatsapp_number}`} className="bg-[#0D47A1] text-white px-8 py-4 rounded-full font-bold hover:bg-[#081A3A] border border-[#0D47A1] transition-all text-lg">
                Solicitar Orçamento
            </a>
            <a href={`https://wa.me/${data.whatsapp_number}`} className="bg-[#00C853] text-white px-8 py-4 rounded-full font-bold hover:bg-[#00a846] transition-all flex items-center gap-2 text-lg">
                <Users className="w-6 h-6" /> {data.button_text}
            </a>
          </div>
          
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center gap-4 backdrop-blur-md">
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
        <div className="w-full flex items-center justify-center p-4">
            {data.image_url ? (
                <img src={data.image_url} alt="Imagem principal" className="w-full h-auto object-contain max-w-[350px] md:max-w-[650px]" />
            ) : (
                <div className="bg-white/10 h-64 w-full max-w-[350px] md:max-w-[650px] flex items-center justify-center rounded-2xl">
                    <span className="text-gray-500">Imagem principal aqui</span>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
