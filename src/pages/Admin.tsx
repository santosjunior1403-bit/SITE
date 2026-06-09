import { Link } from 'react-router-dom';
import { Building, Home, Settings, Wrench, Newspaper, Star, Users } from 'lucide-react';

const sections = [
  { name: 'Dados da Empresa', path: '/admin/company', icon: Building },
  { name: 'Página Inicial', path: '/admin/home', icon: Home },
  { name: 'Serviços', path: '/admin/services', icon: Wrench },
  { name: 'Blog', path: '/admin/blog', icon: Newspaper },
  { name: 'Avaliações', path: '/admin/testimonials', icon: Star },
  { name: 'Clientes/Parceiros', path: '/admin/clients', icon: Users },
];

export default function Admin() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-blue-900">Dashboard Administrativo</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {sections.map((section) => (
          <Link key={section.name} to={section.path} className="bg-white p-6 rounded-xl shadow-md border hover:border-blue-500 transition-all flex items-center space-x-4">
            <section.icon className="w-8 h-8 text-blue-600" />
            <span className="font-semibold text-gray-800">{section.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

