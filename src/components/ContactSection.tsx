import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Mail, Phone, Clock, Send, MessageCircle } from 'lucide-react';
import { trackEvent } from './TrackingScripts';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    nome: '',
    phone: '',
    servico: 'Controle de Baratas',
    mensagem: ''
  });
  
  const [whatsappNum, setWhatsappNum] = useState('5511999999999');
  const [success, setSuccess] = useState(false);
  const [companySettings, setCompanySettings] = useState({
    phone: '(11) 4003-9128',
    email: 'contato@nexodedetizadora.com.br',
    business_hours: 'Segunda a Sábado — 08:00 às 18:00',
    free_quote_label: 'Orçamento Gratuito',
    free_quote_subtitle: 'Nossa equipe técnica comercial está pronta para atender o seu chamado com agilidade e total eficiência.',
    contact_center_label: 'Central de Atendimento'
  });

  useEffect(() => {
    if (!supabase) return;
    
    const loadContactData = async () => {
      try {
        const { data, error } = await supabase.from('hero_section').select('whatsapp_number').maybeSingle();
        if (!error && data && data.whatsapp_number) {
          setWhatsappNum(data.whatsapp_number.replace(/\D/g, ''));
        }
      } catch (err) {
        console.warn("Could not query custom contact WhatsApp number:", err);
      }

      try {
        const { data, error } = await supabase.from('company_settings').select('*').maybeSingle();
        if (!error && data) {
          setCompanySettings({
            phone: data.phone || '(11) 4003-9128',
            email: data.email || 'contato@nexodedetizadora.com.br',
            business_hours: data.business_hours || 'Segunda a Sábado — 08:00 às 18:00',
            free_quote_label: data.free_quote_label || 'Orçamento Gratuito',
            free_quote_subtitle: data.free_quote_subtitle || 'Nossa equipe técnica comercial está pronta para atender o seu chamado com agilidade e total eficiência.',
            contact_center_label: data.contact_center_label || 'Central de Atendimento'
          });
          if (data.whatsapp_number) {
            setWhatsappNum(data.whatsapp_number.replace(/\D/g, ''));
          }
        }
      } catch (err) {
        console.warn("Could not query company settings in ContactSection:", err);
      }
    };

    loadContactData();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    trackEvent('contact_form_submit', { service: formData.servico });
    
    // Build whatsapp text message
    const textMessage = `Olá NEXO! Me chamo ${formData.nome}. Gostaria de solicitar um orçamento para o serviço de *${formData.servico}*.\n\n*Contato:* ${formData.phone}\n*Detalhes:* ${formData.mensagem || 'Sem detalhes informados.'}`;
    const whatsappUrl = `https://wa.me/${whatsappNum}?text=${encodeURIComponent(textMessage)}`;
    
    setSuccess(true);
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
      setSuccess(false);
    }, 1500);
  };

  return (
    <section id="contato" className="py-24 bg-[#081A3A]/5 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-extrabold text-[#081A3A] tracking-tight mb-4">
            Solicite um <span className="text-[#00C853]">{companySettings.free_quote_label || 'Orçamento Gratuito'}</span>
          </h2>
          <p className="text-gray-600 text-lg">
            {companySettings.free_quote_subtitle || 'Nossa equipe técnica comercial está pronta para atender o seu chamado com agilidade e total eficiência.'}
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100">
          
          {/* Info Card Block */}
          <div className="lg:col-span-5 bg-[#081A3A] text-white p-8 sm:p-12 flex flex-col justify-between">
            <div>
              <h3 className="text-3xl font-bold mb-4 tracking-tight">Canais de Contato</h3>
              <p className="text-gray-300 text-sm mb-12">Estamos disponíveis 24 horas para chamados em condomínios comerciais e serviços preventivos contratados.</p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/5 rounded-xl text-[#00C853] shrink-0">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#00C853] text-sm">WhatsApp de Vendas</h4>
                    <a href={`https://wa.me/${whatsappNum}`} target="_blank" rel="noopener noreferrer" className="text-white hover:underline transition font-bold block mt-1">
                      Instante: Enviar Mensagem
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/5 rounded-xl text-blue-400 shrink-0">
                     <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-400 text-sm">{companySettings.contact_center_label || 'Central de Atendimento'}</h4>
                    <p className="text-white font-medium block mt-1">{companySettings.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/5 rounded-xl text-gray-300 shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-300 text-sm">E-mail Corporativo</h4>
                    <p className="text-white font-medium block mt-1 leading-snug">{companySettings.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/5 rounded-xl text-yellow-400 shrink-0">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-yellow-500 text-sm">Horários Operacionais</h4>
                    <p className="text-white font-medium block mt-1 text-sm">{companySettings.business_hours}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-12 text-xs text-gray-400 italic">
              *Atendimento autorizado sujeito à disponibilidade operacional da região de São Paulo.
            </div>
          </div>

          {/* Form Block */}
          <div className="lg:col-span-7 p-8 sm:p-12 relative flex flex-col justify-center">
            {success ? (
              <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-center p-6 animate-in fade-in duration-300">
                <div className="w-16 h-16 bg-[#00C853]/10 text-[#00C853] rounded-full flex items-center justify-center mb-4">
                  <Send className="w-8 h-8 animate-bounce" />
                </div>
                <h4 className="font-black text-2xl text-[#081A3A] mb-2">Quase lá!</h4>
                <p className="text-gray-600 max-w-sm mb-1 text-sm">Estamos direcionando você com segurança para o WhatsApp oficial com seus dados preenchidos.</p>
                <span className="text-[#00C853] text-[11px] font-bold uppercase tracking-widest block mt-4">Redirecionando...</span>
              </div>
            ) : null}

            <h3 className="text-2xl font-bold text-[#081A3A] mb-8">Diga o que você precisa</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="nome" className="text-xs font-bold text-gray-700 uppercase tracking-widest">Nome Completo</label>
                  <input 
                    type="text" 
                    id="nome" 
                    required 
                    value={formData.nome}
                    onChange={e => setFormData({...formData, nome: e.target.value})}
                    placeholder="Seu nome" 
                    className="w-full bg-gray-50 border border-gray-200 focus:border-[#00C853] focus:bg-white p-3.5 rounded-xl text-gray-900 transition-colors focus:ring-0 outline-none text-sm placeholder-gray-400"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="phone" className="text-xs font-bold text-gray-700 uppercase tracking-widest">WhatsApp / Telefone</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    required 
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    placeholder="(11) 99999-9999" 
                    className="w-full bg-gray-50 border border-gray-200 focus:border-[#00C853] focus:bg-white p-3.5 rounded-xl text-gray-900 transition-colors focus:ring-0 outline-none text-sm placeholder-gray-400"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="servico" className="text-xs font-bold text-gray-700 uppercase tracking-widest">Serviço Desejado</label>
                <select 
                  id="servico" 
                  value={formData.servico}
                  onChange={e => setFormData({...formData, servico: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 focus:border-[#00C853] focus:bg-white p-3.5 rounded-xl text-gray-900 font-medium transition-colors outline-none text-sm"
                >
                  <option value="Controle de Baratas">Controle de Baratas</option>
                  <option value="Controle de Ratos (Desratização)">Controle de Ratos (Desratização)</option>
                  <option value="Controle de Cupins (Descupinização)">Controle de Cupins (Descupinização)</option>
                  <option value="Controle de Formigas">Controle de Formigas</option>
                  <option value="Limpeza de Caixa d'Água">Limpeza de Caixa d'Água</option>
                  <option value="Sanitização de Ambientes">Sanitização de Ambientes</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="mensagem" className="text-xs font-bold text-gray-700 uppercase tracking-widest">Mensagem ou Detalhes (Opcional)</label>
                <textarea 
                  id="mensagem" 
                  rows={4}
                  value={formData.mensagem}
                  onChange={e => setFormData({...formData, mensagem: e.target.value})}
                  placeholder="Se possível, descreva o problema, tamanho do imóvel ou local da infestação." 
                  className="w-full bg-gray-50 border border-gray-200 focus:border-[#00C853] focus:bg-white p-3.5 rounded-xl text-gray-900 transition-colors focus:ring-0 outline-none text-sm placeholder-gray-400"
                />
              </div>

              <button 
                type="submit" 
                className="w-full bg-[#00C853] hover:bg-[#00a846] text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 transition duration-300 shadow-md hover:shadow-lg cursor-pointer text-base uppercase tracking-wider"
              >
                <Send className="w-5 h-5" /> Enviar para WhatsApp comercial
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
