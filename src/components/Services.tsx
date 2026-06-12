import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Service } from '../types';
import { Bug, Droplet, Shield, ShieldAlert, Sparkles, AlertOctagon } from 'lucide-react';

const defaultServices: Service[] = [
  {
    id: 'serv-01',
    name: 'Controle de Baratas',
    short_description: 'Eliminação rápida e eficaz de infestações.',
    full_description: 'Eliminação de baratas em residências, empresas, condomínios, restaurantes e comércios. Aplicação segura e eficiente para prevenir novas infestações.',
    image_url: 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&q=80&w=600',
    icon_url: '🪳',
    category: 'Dedetização',
    whatsapp_message: 'Olá NEXO! Gostaria de um orçamento para o serviço de Controle de Baratas.',
    active: true,
    order: 1
  },
  {
    id: 'serv-02',
    name: 'Controle de Ratos',
    short_description: 'Proteção contra roedores e doenças.',
    full_description: 'Combate e monitoramento de ratos, camundongos e ratazanas. Utilização de iscas e técnicas profissionais para proteger sua saúde e patrimônio.',
    image_url: 'https://images.unsplash.com/photo-1473186578172-c141e6798cf4?auto=format&fit=crop&q=80&w=600',
    icon_url: '🐀',
    category: 'Desratização',
    whatsapp_message: 'Olá NEXO! Gostaria de um orçamento para o serviço de Controle de Ratos.',
    active: true,
    order: 2
  },
  {
    id: 'serv-03',
    name: 'Controle de Formigas',
    short_description: 'Combate definitivo às colônias.',
    full_description: 'Tratamento especializado para eliminar colônias de formigas domésticas e cortadeiras, evitando danos e contaminações.',
    image_url: 'https://images.unsplash.com/photo-1596742572447-91254297db6e?auto=format&fit=crop&q=80&w=600',
    icon_url: '🐜',
    category: 'Dedetização',
    whatsapp_message: 'Olá NEXO! Gostaria de um orçamento para o serviço de Controle de Formigas.',
    active: true,
    order: 3
  },
  {
    id: 'serv-04',
    name: 'Controle de Cupins',
    short_description: 'Proteja móveis e estruturas.',
    full_description: 'Identificação e eliminação de cupins de solo e madeira seca. Proteção para móveis, telhados, portas, pisos e estruturas.',
    image_url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=600',
    icon_url: '🪵',
    category: 'Descupinização',
    whatsapp_message: 'Olá NEXO! Gostaria de um orçamento para o serviço de Controle de Cupins.',
    active: true,
    order: 4
  },
  {
    id: 'serv-05',
    name: 'Controle de Mosquitos e Pernilongos',
    short_description: 'Mais conforto para sua família.',
    full_description: 'Redução da proliferação de mosquitos, pernilongos e focos de criadouros, proporcionando mais conforto e segurança.',
    image_url: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&q=80&w=600',
    icon_url: '🦟',
    category: 'Desinsetização',
    whatsapp_message: 'Olá NEXO! Gostaria de um orçamento para o serviço de Controle de Mosquitos e Pernilongos.',
    active: true,
    order: 5
  },
  {
    id: 'serv-06',
    name: "Limpeza e Higienização de Caixa d'Água",
    short_description: 'Água limpa e segura para todos.',
    full_description: 'Limpeza completa e desinfecção de caixas d\'água residenciais, comerciais e industriais, garantindo água limpa e segura para consumo.',
    image_url: 'https://images.unsplash.com/photo-1516841273335-e39b37888115?auto=format&fit=crop&q=80&w=600',
    icon_url: '🚰',
    category: 'Limpeza',
    whatsapp_message: 'Olá NEXO! Gostaria de um orçamento para o serviço de Limpeza e Higienização de Caixa d\'Água.',
    active: true,
    order: 6
  }
];

export default function Services() {
  const [services, setServices] = useState<Service[]>(defaultServices);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [whatsappNum, setWhatsappNum] = useState('551140039128');

  useEffect(() => {
    if (supabase) {
      // Load WhatsApp route from company settings
      supabase.from('company_settings').select('whatsapp_number, phone').single().then(({ data }) => {
        if (data) {
          const num = data.whatsapp_number || data.phone || '';
          if (num) {
            setWhatsappNum(num.replace(/\D/g, ''));
          }
        }
      }).catch(err => console.warn("Error fetching whatsapp number:", err));
    }
  }, []);

  useEffect(() => {
    async function fetchServices() {
        if (!supabase) {
          setServices(defaultServices);
          return;
        }
        try {
          const { data, error } = await supabase.from('services').select('*').order('order');
          if (error) {
            console.warn("Could not load services from Supabase, operating with safe local defaults.", error);
            setServices(defaultServices);
          } else if (data && data.length > 0) {
            // Success loaded from Supabase - filter active items
            const activeServices = data.filter((s: Service) => s.active !== false);
            setServices(activeServices);
          } else {
            // Table exists but has NO records. Let's auto-seed the 6 default services!
            console.log("Seeding default services into Supabase...");
            const seedPromises = defaultServices.map(async (s) => {
              const seedPayload = {
                name: s.name,
                short_description: s.short_description,
                full_description: s.full_description,
                category: s.category,
                active: s.active,
                order: s.order,
                image_url: s.image_url,
                icon_url: s.icon_url,
                whatsapp_message: s.whatsapp_message
              };
              return supabase.from('services').insert(seedPayload);
            });
            await Promise.all(seedPromises);

            // Re-fetch now that we successfully seeded
            const { data: refetchedData } = await supabase.from('services').select('*').order('order');
            if (refetchedData && refetchedData.length > 0) {
              setServices(refetchedData.filter((s: Service) => s.active !== false));
            } else {
              setServices(defaultServices);
            }
          }
        } catch (e) {
          console.warn("Error loading services from Supabase:", e);
          setServices(defaultServices);
        }
    }
    fetchServices();
  }, []);

  const renderIcon = (iconStr: string) => {
    const iconClass = "w-12 h-12 text-[#00C853] mb-4 group-hover:scale-110 transition-transform duration-300";
    if (!iconStr) {
      return <Bug className={iconClass} />;
    }

    // Check if the string has a Unicode emoji or any non-ascii character
    const isEmoji = /\p{Emoji}/u.test(iconStr);
    if (isEmoji && iconStr.length <= 8) {
      return (
        <span className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300 block select-none h-12 w-12 flex items-center justify-center">
          {iconStr}
        </span>
      );
    }

    switch (iconStr.toLowerCase()) {
      case 'bug': return <Bug className={iconClass} />;
      case 'droplet': return <Droplet className={iconClass} />;
      case 'shield': return <Shield className={iconClass} />;
      case 'shieldalert': return <ShieldAlert className={iconClass} />;
      case 'sparkles': return <Sparkles className={iconClass} />;
      case 'alertoctagon': return <AlertOctagon className={iconClass} />;
      default: return <Bug className={iconClass} />;
    }
  };

  return (
    <section id="servicos" className="py-24 bg-[#081A3A] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 tracking-tight">Nossos <span className="text-[#00C853]">Serviços</span></h2>
        <p className="text-gray-400 text-center mb-16 text-xl max-w-2xl mx-auto">Soluções especializadas para proteger seu ambiente com eficácia e segurança.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((s) => (
            <div key={s.id} id={`service-card-${s.id}`} className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 flex flex-col hover:border-[#00C853]/50 transition-all duration-300 group overflow-hidden shadow-lg hover:shadow-xl">
              {/* Cover Image or Icon Wrapper */}
              {s.image_url && (s.image_url.startsWith('http') || s.image_url.startsWith('/')) ? (
                <div className="h-48 w-full overflow-hidden relative shrink-0">
                  <img src={s.image_url} alt={s.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" referrerPolicy="no-referrer" />
                  <div className="absolute top-3 left-3 bg-[#081A3A]/80 backdrop-blur text-xs font-semibold px-2.5 py-1 rounded-full text-[#00C853]">
                    {s.category || 'Serviço'}
                  </div>
                  {/* Floating badge for emoji/icon */}
                  {s.icon_url && (
                    <div className="absolute bottom-3 right-3 w-12 h-12 rounded-full bg-[#081A3A]/90 backdrop-blur border border-white/15 flex items-center justify-center text-3xl shadow-lg transition-transform duration-300 group-hover:scale-110">
                      {renderIcon(s.icon_url)}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 pb-0 flex flex-col items-center justify-center bg-white/3 h-48 relative shrink-0">
                  <div className="absolute top-3 left-3 bg-[#081A3A]/80 backdrop-blur text-xs font-semibold px-2.5 py-1 rounded-full text-[#00C853]">
                    {s.category || 'Serviço'}
                  </div>
                  {renderIcon(s.icon_url || s.image_url)}
                </div>
              )}
              
              <div className="p-8 flex flex-col flex-grow text-center items-center">
                <h3 className="font-bold text-2xl mb-3 group-hover:text-[#00C853] transition-colors">{s.name}</h3>
                <p className="text-gray-300 mb-6 flex-grow text-sm leading-relaxed line-clamp-3">{s.short_description || s.full_description}</p>
                
                <div className="flex flex-col gap-3 mt-auto w-full">
                  <button 
                    id={`btn-saiba-mais-${s.id}`}
                    onClick={() => {
                      setSelectedService(s);
                      setIsModalOpen(true);
                    }}
                    className="w-full bg-white/5 hover:bg-white/10 text-white hover:text-[#00C853] transition-all px-6 py-3 rounded-full font-semibold text-sm uppercase tracking-wider border border-white/10 hover:border-[#00C853]/50 text-center cursor-pointer"
                  >
                    Saiba Mais
                  </button>
                  
                  <a 
                    id={`btn-budget-${s.id}`}
                    href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent(s.whatsapp_message || `Olá NEXO! Gostaria de um orçamento para o serviço de *${s.name}*.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#0D47A1] hover:bg-[#00C853] text-white px-6 py-3 rounded-full font-semibold transition-all shadow-md hover:shadow-lg inline-block text-sm uppercase tracking-wider text-center cursor-pointer hover:scale-[1.02]"
                  >
                    Solicitar Orçamento
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Accessible high-contrast details modal for "Saiba Mais" */}
      {isModalOpen && selectedService && (
        <div 
          id="service-details-modal"
          className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-all duration-300 overflow-y-auto"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="bg-[#0B1E3F] border border-white/15 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header image/color */}
            {selectedService.image_url && (selectedService.image_url.startsWith('http') || selectedService.image_url.startsWith('/')) ? (
              <div className="h-56 w-full overflow-hidden relative shrink-0">
                <img src={selectedService.image_url} alt={selectedService.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1E3F] via-transparent to-transparent"></div>
                <div className="absolute top-4 left-4 bg-[#00C853] text-[#081A3A] font-extrabold text-xs px-3 py-1.5 rounded-full uppercase tracking-wider">
                  {selectedService.category}
                </div>
              </div>
            ) : (
              <div className="p-8 pb-4 bg-white/3 flex items-center gap-4 border-b border-white/5">
                <div className="w-16 h-16 rounded-2xl bg-[#00C853]/10 flex items-center justify-center text-3xl">
                  {renderIcon(selectedService.icon_url || selectedService.image_url)}
                </div>
                <div>
                  <span className="text-xs uppercase font-extrabold tracking-widest text-[#00C853] block">
                    {selectedService.category}
                  </span>
                  <h3 className="text-2xl font-black text-white">{selectedService.name}</h3>
                </div>
              </div>
            )}

            {/* Modal Content Column */}
            <div className="p-8">
              {/* Title with icon if cover was shown */}
              {selectedService.image_url && (selectedService.image_url.startsWith('http') || selectedService.image_url.startsWith('/')) && (
                <div className="flex items-center gap-3 mb-6">
                  {selectedService.icon_url && (
                    <div className="w-10 h-10 rounded-xl bg-[#00C853]/10 flex items-center justify-center text-2xl shrink-0">
                      {renderIcon(selectedService.icon_url)}
                    </div>
                  )}
                  <h3 className="text-2xl font-black text-white">{selectedService.name}</h3>
                </div>
              )}
              
              <div className="space-y-5">
                <div>
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Resumo</h4>
                  <p className="text-[#00C853] text-sm font-semibold leading-relaxed">
                    {selectedService.short_description}
                  </p>
                </div>
                
                <div className="border-t border-white/5 pt-4">
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Descrição Técnica</h4>
                  <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line font-normal">
                    {selectedService.full_description}
                  </p>
                </div>
              </div>

              {/* Close and Order/Quote actions */}
              <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-white/5">
                <button 
                  id="modal-close-btn"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-white/5 hover:bg-white/10 text-white px-6 py-3.5 rounded-xl font-bold transition duration-200 text-xs uppercase tracking-wider text-center cursor-pointer order-2 sm:order-1 flex-1 h-12 flex items-center justify-center"
                >
                  Fechar
                </button>
                <a 
                  id="modal-quote-btn"
                  href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent(selectedService.whatsapp_message || `Olá NEXO! Gostaria de um orçamento para o serviço de *${selectedService.name}*.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#00C853] hover:bg-[#00a846] text-[#081A3A] font-extrabold px-6 py-3.5 rounded-xl transition duration-200 text-xs uppercase tracking-wider text-center hover:scale-[1.02] order-1 sm:order-2 flex-1 h-12 flex items-center justify-center"
                >
                  Falar no WhatsApp
                </a>
              </div>
            </div>
            
            {/* Close button top right */}
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center font-bold text-xs transition-colors border border-white/10 cursor-pointer z-10"
              aria-label="Fechar modal"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
