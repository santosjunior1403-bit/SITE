import { ShieldCheck, Bug, Droplet, User, Building, Home as HomeIcon } from 'lucide-react';

const services = [
  { name: 'Dedetização de Baratas', icon: Bug },
  { name: 'Controle de Ratos', icon: ShieldCheck },
  { name: 'Descupinização', icon: Bug },
  { name: 'Limpeza de Caixa d’ Água', icon: Droplet },
];

export default function Services() {
  return (
    <section id="servicos" className="py-20 max-w-7xl mx-auto px-4">
      <h2 className="text-3xl font-bold text-center text-blue-900 mb-12">Nossos Serviços</h2>
      <div className="grid md:grid-cols-4 gap-6">
        {services.map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col items-center text-center">
            <s.icon className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="font-bold text-lg mb-2 text-blue-900">{s.name}</h3>
            <button className="mt-4 text-blue-600 font-semibold">Pedir orçamento</button>
          </div>
        ))}
      </div>
    </section>
  );
}
