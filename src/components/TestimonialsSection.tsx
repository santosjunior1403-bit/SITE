import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Testimonial } from '../types';
import { Star } from 'lucide-react';

export default function TestimonialsSection() {
  const [data, setData] = useState<Testimonial[]>([]);

  useEffect(() => {
    if (!supabase) return;
    supabase.from('testimonials').select('*').limit(3).then(({ data }) => {
      if (data) setData(data);
    });
  }, []);

  return (
    <section className="py-24 bg-[#081A3A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-white mb-2 text-center">Avaliações</h2>
        <p className="text-gray-400 text-center mb-16 text-lg">O que nossos clientes dizem sobre a Nexo.</p>
        
        <div className="grid md:grid-cols-3 gap-8">
          {data.map(t => (
            <div key={t.id} className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10 hover:border-[#00C853]/50 transition-all duration-300">
              <div className="flex text-[#00C853] mb-6 gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} fill="currentColor" className="w-5 h-5" />)}
              </div>
              <p className="text-gray-300 mb-6 italic">"{t.text}"</p>
              <p className="font-bold text-white text-lg">{t.client_name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
