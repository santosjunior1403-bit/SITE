import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Phone, Mail, MessageSquare } from 'lucide-react';

export default function Footer() {
  const [companyData, setCompanyData] = useState({
    company_name: 'NEXO Dedetizadora',
    phone: '',
    whatsapp: '(11) 99999-9999',
    email: 'contato@nexodedetizadora.com.br'
  });

  useEffect(() => {
    supabase.from('company_settings').select('company_name, name, phone, whatsapp, email').single().then(({ data }) => {
      if (data) {
        setCompanyData({
          company_name: data.company_name || data.name || 'NEXO Dedetizadora',
          phone: data.phone || '',
          whatsapp: data.whatsapp || '(11) 99999-9999',
          email: data.email || 'contato@nexodedetizadora.com.br'
        });
      }
    });
  }, []);

  return (
    <footer className="bg-[#081A3A] text-gray-300 py-16 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
            <h3 className="text-white font-bold text-2xl mb-4">
              {companyData.company_name.split(' ')[0]} <span className="text-[#00C853]">{companyData.company_name.split(' ').slice(1).join(' ') || 'Dedetizadora'}</span>
            </h3>
            <p className="text-sm leading-relaxed max-w-sm">Soluções completas em dedetização e controle de pragas urbanas. Segurança, eficiência e garantia total de qualidade para sua residência ou empresa.</p>
        </div>
        <div>
            <h4 className="text-white font-semibold mb-4 text-lg">Links Rápidos</h4>
            <ul className="space-y-3">
                <li><a href="#inicio" className="hover:text-[#00C853] transition-colors">Início</a></li>
                <li><a href="#servicos" className="hover:text-[#00C853] transition-colors">Serviços</a></li>
                <li><a href="#contato" className="hover:text-[#00C853] transition-colors">Agendar</a></li>
            </ul>
        </div>
        <div>
            <h4 className="text-white font-semibold mb-4 text-lg">Contato</h4>
            <ul className="space-y-3 text-sm">
                {companyData.whatsapp && (
                  <li className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-[#00C853]" />
                    <span>WhatsApp: {companyData.whatsapp}</span>
                  </li>
                )}
                {companyData.phone && (
                  <li className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-blue-400" />
                    <span>Telefone: {companyData.phone}</span>
                  </li>
                )}
                {companyData.email && (
                  <li className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="break-all">{companyData.email}</span>
                  </li>
                )}
            </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
        <div>© 2026 {companyData.company_name}. Todos os direitos reservados.</div>
        <a 
          href="/admin" 
          className="text-gray-600/30 hover:text-gray-400 text-[11px] uppercase tracking-wider transition-colors duration-200"
        >
          Área de Membros
        </a>
      </div>
    </footer>
  );
}
