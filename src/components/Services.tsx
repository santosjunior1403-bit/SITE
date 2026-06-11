import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Service } from '../types';

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    async function fetchServices() {
        if (!supabase) return;
        const { data } = await supabase.from('services').select('*').eq('active', true).order('order');
        if (data) setServices(data);
    }
    fetchServices();
  }, []);

  return (
    <section id="servicos" className="py-24 bg-[#081A3A] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 tracking-tight">Nossos <span className="text-[#00C853]">Serviços</span></h2>
        <p className="text-gray-400 text-center mb-16 text-xl max-w-2xl mx-auto">Soluções especializadas para proteger seu ambiente com eficácia e segurança.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((s) => (
            <div key={s.id} className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10 flex flex-col items-center text-center hover:border-[#00C853]/50 transition-all duration-300 group">
              <img src={s.image_url} alt={s.name} className="w-16 h-16 mb-6 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="font-bold text-2xl mb-4">{s.name}</h3>
              <p className="text-gray-300 mb-8 flex-grow">{s.description}</p>
              <a href="#contato" className="bg-[#0D47A1] hover:bg-[#00C853] text-white px-6 py-3 rounded-full font-semibold transition-all">Solicitar Orçamento</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
