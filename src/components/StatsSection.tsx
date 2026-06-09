import { Users, Briefcase, Smile } from 'lucide-react';

export default function StatsSection() {
  const stats = [
    { icon: Users, label: 'Clientes Atendidos', value: '+500' },
    { icon: Briefcase, label: 'Serviços Realizados', value: '+1000' },
    { icon: Smile, label: 'Clientes Satisfeitos', value: '100%' },
  ];

  return (
    <section className="py-12 bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((s, i) => (
          <div key={i} className="flex items-center gap-4 bg-gray-900 p-6 rounded-2xl border border-gray-800">
            <s.icon className="w-12 h-12 text-blue-500" />
            <div>
              <div className="text-4xl font-bold text-white">{s.value}</div>
              <div className="text-gray-400">{s.label}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
