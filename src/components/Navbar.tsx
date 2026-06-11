import { useState, useEffect } from 'react';
import { Menu, X, User } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [logo, setLogo] = useState('');

  useEffect(() => {
    if (!supabase) return;
    supabase.from('company_settings').select('logo_url').single().then(({ data }) => {
      if (data) setLogo(data.logo_url);
    });
  }, []);

  return (
    <nav className="fixed w-full z-50 bg-gradient-to-r from-white via-blue-100/85 to-blue-200/90 backdrop-blur-lg border-b border-blue-200/60 text-gray-900 font-medium shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center">
            <a href="#inicio" className="group flex items-center transition-transform hover:scale-[1.02] duration-300">
              {logo ? (
                <img 
                  src={logo} 
                  alt="NEXO" 
                  className="h-12 w-auto max-w-[280px] object-contain" 
                />
              ) : (
                <span className="font-bold text-2xl text-[#081A3A] tracking-wider flex items-center gap-2">
                  NEXO <span className="text-[10px] bg-[#00C853] text-white px-2 py-0.5 rounded-full font-bold">DEDETIZADORA</span>
                </span>
              )}
            </a>
          </div>
          <div className="hidden md:flex space-x-6 items-center">
            <a href="#inicio" className="hover:text-[#00C853] transition-colors font-semibold">Início</a>
            <a href="#servicos" className="hover:text-[#00C853] transition-colors font-semibold">Serviços</a>
            <a href="#quem-somos" className="hover:text-[#00C853] transition-colors font-semibold">Quem Somos</a>
            
            <span className="h-6 w-[1.5px] bg-gray-200" />
            
            <a href="#contato" className="bg-[#00C853] text-white px-6 py-2.5 rounded-full hover:bg-[#00a846] transition-all font-bold text-sm shadow-md hover:shadow-lg">Agendar</a>
          </div>
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-lg text-[#081A3A] hover:bg-gray-50 focus:outline-none">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 shadow-xl px-4 pt-2 pb-6 space-y-3 flex flex-col animate-in fade-in duration-200">
          <a 
            href="#inicio" 
            onClick={() => setIsOpen(false)} 
            className="px-3 py-2.5 rounded-xl hover:bg-gray-50 text-gray-800 transition-colors font-semibold text-base"
          >
            Início
          </a>
          <a 
            href="#servicos" 
            onClick={() => setIsOpen(false)} 
            className="px-3 py-2.5 rounded-xl hover:bg-gray-50 text-gray-800 transition-colors font-semibold text-base"
          >
            Serviços
          </a>
          <a 
            href="#quem-somos" 
            onClick={() => setIsOpen(false)} 
            className="px-3 py-2.5 rounded-xl hover:bg-gray-50 text-gray-800 transition-colors font-semibold text-base"
          >
            Quem Somos
          </a>
          <hr className="border-gray-100" />
          <a 
            href="#contato" 
            onClick={() => setIsOpen(false)} 
            className="bg-[#00C853] text-white text-center px-5 py-3 rounded-xl hover:bg-[#00a846] transition-all font-bold text-sm shadow-md"
          >
            Agendar Consulta
          </a>
        </div>
      )}
    </nav>
  );
}
