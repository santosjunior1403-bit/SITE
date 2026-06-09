import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Service } from '../types';

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    async function fetchServices() {
      const { data } = await supabase.from('services').select('*').eq('active', true).order('order');
      if (data) setServices(data);
    }
    fetchServices();
  }, []);

  return (
    <section id="servicos" className="py-20 max-w-7xl mx-auto px-4 bg-gray-900 text-white">
      <h2 className="text-3xl font-bold text-center mb-12">Nossos Serviços</h2>
      <div className="grid md:grid-cols-4 gap-6">
        {services.map((s) => (
          <div key={s.id} className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 flex flex-col items-center text-center">
            <img src={s.image_url} alt={s.name} className="w-12 h-12 mb-4" />
            <h3 className="font-bold text-lg mb-2">{s.name}</h3>
            <p className="text-gray-400 text-sm">{s.description}</p>
            <button className="mt-4 text-blue-400 font-semibold">Pedir orçamento</button>
          </div>
        ))}
      </div>
    </section>
  );
}
