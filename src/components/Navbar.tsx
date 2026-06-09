import { useState } from 'react';
import { Phone, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center font-bold text-2xl text-blue-900">
            NEXO
          </div>
          <div className="hidden md:flex space-x-8 items-center text-gray-700 font-medium">
            <a href="#inicio" className="hover:text-blue-600">Início</a>
            <a href="#servicos" className="hover:text-blue-600">Serviços</a>
            <a href="#quem-somos" className="hover:text-blue-600">Quem Somos</a>
            <a href="#contato" className="bg-blue-600 text-white px-5 py-2.5 rounded-full hover:bg-blue-700">Agendar pelo WhatsApp</a>
          </div>
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="text-blue-900" /> : <Menu className="text-blue-900" />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
