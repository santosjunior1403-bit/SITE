import { useState, useEffect } from 'react';
import { Phone, Menu, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [logo, setLogo] = useState('');

  useEffect(() => {
    supabase.from('company_settings').select('logo_url').single().then(({ data }) => {
      if (data) setLogo(data.logo_url);
    });
  }, []);

  return (
    <nav className="fixed w-full z-50 bg-gradient-to-r from-blue-950 to-green-950 shadow-lg border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center">
            {logo ? <img src={logo} alt="NEXO" className="h-12" /> : <span className="font-bold text-2xl text-blue-400">NEXO</span>}
          </div>
          <div className="hidden md:flex space-x-8 items-center text-gray-300 font-medium">
            <a href="#inicio" className="hover:text-blue-400">Início</a>
            <a href="#servicos" className="hover:text-blue-400">Serviços</a>
            <a href="#quem-somos" className="hover:text-blue-400">Quem Somos</a>
            <a href="#contato" className="bg-blue-600 text-white px-5 py-2.5 rounded-full hover:bg-blue-700">Agendar</a>
          </div>
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="text-blue-400" /> : <Menu className="text-blue-400" />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
