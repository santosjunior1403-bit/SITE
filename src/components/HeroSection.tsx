import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { HeroSection as HeroType } from '../types';

export default function HeroSection() {
  const [data, setData] = useState<HeroType | null>(null);

  useEffect(() => {
    supabase.from('hero_section').select('*').single().then(({ data }) => {
      if (data) setData(data);
    });
  }, []);

  if (!data) return null;

  return (
    <div id="inicio" className="bg-gray-950 text-white min-h-[600px] flex items-center pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-blue-400">
            {data.title}
          </h1>
          <p className="text-xl mb-8 text-gray-300">
            {data.subtitle}
          </p>
          <div className="flex flex-wrap gap-4 mb-8 text-sm text-gray-400">
              <span className="flex items-center gap-1">✅ Garantia</span>
              <span className="flex items-center gap-1">✅ Atendimento Rápido</span>
              <span className="flex items-center gap-1">✅ Orçamento Grátis</span>
          </div>
          <div className="flex gap-4">
            <a href={`https://wa.me/${data.whatsapp_number}`} className="bg-green-600 text-white px-8 py-4 rounded-full font-bold hover:bg-green-500">{data.button_text}</a>
          </div>
        </div>
        <div className="hidden md:block">
            {data.image_url ? (
                <img src={data.image_url} alt="Imagem principal" className="rounded-2xl shadow-2xl border-4 border-gray-800" />
            ) : (
                <div className="bg-gray-800 rounded-2xl h-80 flex items-center justify-center border-4 border-gray-700">
                    <span className="text-gray-500">Imagem principal aqui</span>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
