import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Phone, Mail, MessageSquare, MapPin, Clock, Facebook, Instagram } from 'lucide-react';
import { trackEvent } from './TrackingScripts';

export default function Footer() {
  const [companyData, setCompanyData] = useState({
    company_name: 'NEXO Dedetizadora',
    phone: '',
    whatsapp: '(11) 99999-9999',
    email: 'contato@nexodedetizadora.com.br',
    address: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: '',
    business_hours: '',
    google_business_url: '',
    instagram: '',
    facebook: ''
  });

  useEffect(() => {
    if (!supabase) return;
    supabase.from('company_settings').select('*').single().then(({ data }) => {
      if (data) {
        setCompanyData({
          company_name: data.company_name || data.name || 'NEXO Dedetizadora',
          phone: data.phone || '',
          whatsapp: data.whatsapp || '(11) 99999-9999',
          email: data.email || 'contato@nexodedetizadora.com.br',
          address: data.address || '',
          bairro: data.bairro || data.neighborhood || '',
          cidade: data.cidade || data.city || '',
          estado: data.estado || data.state || '',
          cep: data.cep || data.zip || '',
          business_hours: data.business_hours || data.opening_hours || '',
          google_business_url: data.google_business_url || data.google_business_link || '',
          instagram: data.instagram || '',
          facebook: data.facebook || ''
        });
      }
    });
  }, []);

  // Format full address for display
  const addressParts = [
    companyData.address,
    companyData.bairro,
    companyData.cidade ? `${companyData.cidade}${companyData.estado ? ` - ${companyData.estado}` : ''}` : '',
    companyData.cep ? `CEP: ${companyData.cep}` : ''
  ].filter(Boolean);

  const fullAddress = addressParts.join(', ');

  return (
    <footer className="bg-[#081A3A] text-gray-300 py-16 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
            <h3 className="text-white font-bold text-2xl mb-4">
              {companyData.company_name.split(' ')[0]} <span className="text-[#00C853]">{companyData.company_name.split(' ').slice(1).join(' ') || 'Dedetizadora'}</span>
            </h3>
            <p className="text-sm leading-relaxed max-w-sm mb-6">Soluções completas em dedetização e controle de pragas urbanas. Segurança, eficiência e garantia total de qualidade para sua residência ou empresa.</p>
            
            {/* Redes Sociais */}
            <div className="flex gap-4">
              {companyData.instagram && (
                <a href={companyData.instagram.startsWith('http') ? companyData.instagram : `https://instagram.com/${companyData.instagram}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#00C853] transition-colors p-2 bg-white/5 rounded-full hover:bg-white/10" aria-label="Instagram">
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {companyData.facebook && (
                <a href={companyData.facebook.startsWith('http') ? companyData.facebook : `https://facebook.com/${companyData.facebook}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#00C853] transition-colors p-2 bg-white/5 rounded-full hover:bg-white/10" aria-label="Facebook">
                  <Facebook className="w-5 h-5" />
                </a>
              )}
            </div>
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
            <h4 className="text-white font-semibold mb-4 text-lg">Fale Conosco</h4>
            <ul className="space-y-4 text-sm">
                {companyData.whatsapp && (
                  <li className="flex items-start gap-2">
                    <MessageSquare className="w-4 h-4 text-[#00C853] mt-1 shrink-0" />
                    <div>
                      <span className="font-semibold block text-white text-xs">WhatsApp</span>
                      <a href={`https://wa.me/${companyData.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#00C853] transition-colors" onClick={() => trackEvent('whatsapp_click', { button: 'footer' })}>
                        {companyData.whatsapp}
                      </a>
                    </div>
                  </li>
                )}
                {companyData.phone && (
                  <li className="flex items-start gap-2">
                    <Phone className="w-4 h-4 text-blue-400 mt-1 shrink-0" />
                    <div>
                      <span className="font-semibold block text-white text-xs">Telefone</span>
                      <a href={`tel:${companyData.phone.replace(/\D/g, '')}`} className="hover:text-blue-400 transition-colors" onClick={() => trackEvent('phone_click', { button: 'footer' })}>
                        {companyData.phone}
                      </a>
                    </div>
                  </li>
                )}
                {companyData.email && (
                  <li className="flex items-start gap-2">
                    <Mail className="w-4 h-4 text-gray-400 mt-1 shrink-0" />
                    <div className="break-all">
                      <span className="font-semibold block text-white text-xs">E-mail</span>
                      <span>{companyData.email}</span>
                    </div>
                  </li>
                )}
                {companyData.business_hours && (
                  <li className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-yellow-400 mt-1 shrink-0" />
                    <div>
                      <span className="font-semibold block text-white text-xs">Atendimento</span>
                      <span>{companyData.business_hours}</span>
                    </div>
                  </li>
                )}
                {fullAddress && (
                  <li className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-red-400 mt-1 shrink-0" />
                    <div>
                      <span className="font-semibold block text-white text-xs">Endereço</span>
                      {companyData.google_business_url ? (
                        <a href={companyData.google_business_url} target="_blank" rel="noopener noreferrer" className="hover:text-[#00C853] underline transition-colors">
                          {fullAddress}
                        </a>
                      ) : (
                        <span>{fullAddress}</span>
                      )}
                    </div>
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
