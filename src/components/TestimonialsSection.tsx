import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Testimonial } from '../types';
import { Star } from 'lucide-react';

export default function TestimonialsSection() {
  const [data, setData] = useState<Testimonial[]>([]);

  useEffect(() => {
    supabase.from('testimonials').select('*').limit(3).then(({ data }) => {
      if (data) setData(data);
    });
  }, []);

  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-white mb-12 text-center">Avaliações</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {data.map(t => (
            <div key={t.id} className="bg-gray-950 p-6 rounded-2xl border border-gray-800">
              <div className="flex text-blue-500 mb-4">{[...Array(5)].map((_, i) => <Star key={i} />)}</div>
              <p className="text-gray-300 mb-4">"{t.text}"</p>
              <p className="font-bold text-white">{t.client_name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
