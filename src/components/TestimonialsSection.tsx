import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Testimonial } from '../types';
import { Star } from 'lucide-react';

const defaultTestimonials: Testimonial[] = [
  {
    id: 't1',
    client_name: 'Marcos Silva',
    text: 'Serviço espetacular! Resolveram um problema crônico de baratas no meu apartamento em Pinheiros. Altamente recomendado e muito profissionais.',
    photo_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
    rating: 5,
    google_review_url: 'https://g.page/r/nexo-dedetizadora',
    active: true,
    date: '10/06/2026'
  },
  {
    id: 't2',
    client_name: 'Fernanda Costa',
    text: 'Processo super profissional desde o atendimento no WhatsApp até a aplicação do produto. O técnico explicou tudo detalhadamente e resolveu as formigas.',
    photo_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
    rating: 5,
    google_review_url: 'https://g.page/r/nexo-dedetizadora',
    active: true,
    date: '08/06/2026'
  },
  {
    id: 't3',
    client_name: 'Roberto Oliveira',
    text: 'Excelente custo-benefício. Fizemos a desinsetização e a limpeza da caixa d\'água no condomínio inteiro e tudo correu perfeitamente com garantia total.',
    photo_url: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&q=80',
    rating: 5,
    google_review_url: 'https://g.page/r/nexo-dedetizadora',
    active: true,
    date: '05/06/2026'
  }
];

export default function TestimonialsSection() {
  const [data, setData] = useState<Testimonial[]>(defaultTestimonials);

  useEffect(() => {
    if (!supabase) {
      setData(defaultTestimonials);
      return;
    }
    const fetchTestimonials = async () => {
      try {
        const { data: queryData, error } = await supabase.from('testimonials').select('*').limit(3);
        if (error) {
          console.warn("Could not retrieve testimonials from Supabase, loading defaults.", error);
          setData(defaultTestimonials);
        } else if (queryData && queryData.length > 0) {
          setData(queryData);
        } else {
          setData(defaultTestimonials);
        }
      } catch (err) {
        console.warn("Error querying testimonials from Supabase:", err);
        setData(defaultTestimonials);
      }
    };
    fetchTestimonials();
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
