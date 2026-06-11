import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Users, Briefcase, Smile } from 'lucide-react';

export default function StatsSection() {
  const [statsData, setStatsData] = useState({
    clientes_atendidos: '+500',
    servicos_realizados: '+1000',
    clientes_satisfeitos: '100%'
  });

  useEffect(() => {
    if (!supabase) return;
    supabase.from('company_settings').select('institutional_text').single().then(({ data }) => {
      if (data && data.institutional_text) {
        try {
          const parsed = JSON.parse(data.institutional_text);
          if (parsed && typeof parsed === 'object') {
            setStatsData({
              clientes_atendidos: parsed.clientes_atendidos || '+500',
              servicos_realizados: parsed.servicos_realizados || '+1000',
              clientes_satisfeitos: parsed.clientes_satisfeitos || '100%'
            });
          }
        } catch (e) {
          console.error("Error parsing stats data", e);
        }
      }
    });
  }, []);

  const stats = [
    { icon: Users, label: 'Clientes Atendidos', value: statsData.clientes_atendidos },
    { icon: Briefcase, label: 'Serviços Realizados', value: statsData.servicos_realizados },
    { icon: Smile, label: 'Clientes Satisfeitos', value: statsData.clientes_satisfeitos },
  ];

  return (
    <section className="py-12 bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((s, i) => (
          <div key={i} className="flex items-center gap-4 bg-gray-900 p-6 rounded-2xl border border-gray-800">
            <s.icon className="w-12 h-12 text-[#00C853]" />
            <div>
              <div className="text-4xl font-bold text-white">{s.value}</div>
              <div className="text-gray-400 font-medium">{s.label}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
