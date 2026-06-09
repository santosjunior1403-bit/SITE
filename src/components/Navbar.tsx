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
    <nav className="fixed w-full z-50 bg-[#081A3A]/70 backdrop-blur-lg border-b border-[#0D47A1]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center h-16 w-48">
            {logo ? <img src={logo} alt="NEXO" className="h-full w-full object-contain p-1" /> : <span className="font-bold text-2xl text-white">NEXO</span>}
          </div>
          <div className="hidden md:flex space-x-6 items-center text-white font-medium">
            <a href="#inicio" className="hover:text-[#00C853] transition-colors">Início</a>
            <a href="#servicos" className="hover:text-[#00C853] transition-colors">Serviços</a>
            <a href="#quem-somos" className="hover:text-[#00C853] transition-colors">Quem Somos</a>
            <a href="#contato" className="bg-[#0D47A1] text-white px-5 py-2.5 rounded-full hover:bg-[#081A3A] transition-all">Fale Conosco</a>
            <a href="#contato" className="bg-[#00C853] text-white px-5 py-2.5 rounded-full hover:bg-[#00a846] transition-all">Agendar</a>
          </div>
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
