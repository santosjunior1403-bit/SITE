import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Service } from '../types';
import { Bug, Droplet, Shield, ShieldAlert, Sparkles, AlertOctagon } from 'lucide-react';

const defaultServices: Service[] = [
  {
    id: 's1',
    name: 'Controle de Baratas',
    short_description: 'Eliminação e prevenção de baratas em cozinhas, redes de esgoto e frestas, usando gel inodoro e micro-pulverização segura.',
    full_description: 'Eliminação e prevenção de baratas em cozinhas, redes de esgoto e frestas, usando gel inodoro e micro-pulverização segura.',
    image_url: 'bug',
    icon_url: 'bug',
    category: 'Dedetização',
    whatsapp_message: 'Olá Nexo! Gostaria de um orçamento para Controle de Baratas.',
    active: true,
    order: 1
  },
  {
    id: 's2',
    name: 'Controle de Ratos (Desratização)',
    short_description: 'Localização de focos, iscagem sem cheiro de alta atratividade e barreiras físicas para eliminação de ratos e ratazanas.',
    full_description: 'Localização de focos, iscagem sem cheiro de alta atratividade e barreiras físicas para eliminação de ratos e ratazanas.',
    image_url: 'shieldalert',
    icon_url: 'shieldalert',
    category: 'Desratização',
    whatsapp_message: 'Olá Nexo! Gostaria de um orçamento para Desratização (Controle de Ratos).',
    active: true,
    order: 2
  },
  {
    id: 's3',
    name: 'Controle de Cupins (Descupinização)',
    short_description: 'Eliminação completa de colônias de cupins de madeira seca ou cupins de solo com barreira química protetora de longo prazo.',
    full_description: 'Eliminação completa de colônias de cupins de madeira seca ou cupins de solo com barreira química protetora de longo prazo.',
    image_url: 'shield',
    icon_url: 'shield',
    category: 'Descupinização',
    whatsapp_message: 'Olá Nexo! Gostaria de um orçamento para Descupinização (Controle de Cupins).',
    active: true,
    order: 3
  },
  {
    id: 's4',
    name: 'Controle de Formigas',
    short_description: 'Identificação e controle de formigas doceiras, cortadeiras e outras espécies invasivas residenciais com iscas biológicas.',
    full_description: 'Identificação e controle de formigas doceiras, cortadeiras e outras espécies invasivas residenciais com iscas biológicas.',
    image_url: 'bug',
    icon_url: 'bug',
    category: 'Dedetização',
    whatsapp_message: 'Olá Nexo! Gostaria de um orçamento para Controle de Formigas.',
    active: true,
    order: 4
  },
  {
    id: 's5',
    name: 'Limpeza de Caixa d\'Água',
    short_description: 'Higienização e desinfecção rigorosa de reservatórios de água, assegurando a potabilidade e a saúde de toda a família.',
    full_description: 'Higienização e desinfecção rigorosa de reservatórios de água, assegurando a potabilidade e a saúde de toda a família.',
    image_url: 'droplet',
    icon_url: 'droplet',
    category: 'Limpeza',
    whatsapp_message: 'Olá Nexo! Gostaria de solicitar limpeza de caixa d\'água.',
    active: true,
    order: 5
  },
  {
    id: 's6',
    name: 'Sanitização de Ambientes',
    short_description: 'Desinfecção de alto nível contra vírus, bactérias, ácaros e fungos, ideal para escritórios, clínicas e lares com alérgicos.',
    full_description: 'Desinfecção de alto nível contra vírus, bactérias, ácaros e fungos, ideal para escritórios, clínicas e lares com alérgicos.',
    image_url: 'sparkles',
    icon_url: 'sparkles',
    category: 'Sanitização',
    whatsapp_message: 'Olá Nexo! Gostaria de saber mais sobre a Sanitização de Ambientes.',
    active: true,
    order: 6
  }
];

export default function Services() {
  const [services, setServices] = useState<Service[]>(defaultServices);

  useEffect(() => {
    async function fetchServices() {
        if (!supabase) {
          setServices(defaultServices);
          return;
        }
        try {
          const { data, error } = await supabase.from('services').select('*').eq('active', true).order('order');
          if (error) {
            console.warn("Could not load services from Supabase, operating with safe local defaults.", error);
            setServices(defaultServices);
          } else if (data && data.length > 0) {
            setServices(data);
          } else {
            setServices(defaultServices);
          }
        } catch (e) {
          console.warn("Error loading services from Supabase:", e);
          setServices(defaultServices);
        }
    }
    fetchServices();
  }, []);

  const renderIcon = (name: string) => {
    const iconClass = "w-12 h-12 text-[#00C853] mb-4 group-hover:scale-110 transition-transform duration-300";
    switch (name?.toLowerCase()) {
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
            <div key={s.id} className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10 flex flex-col items-center text-center hover:border-[#00C853]/50 transition-all duration-300 group">
              {s.image_url && (s.image_url.startsWith('http') || s.image_url.startsWith('/')) ? (
                <img src={s.image_url} alt={s.name} className="w-16 h-16 mb-6 group-hover:scale-110 transition-transform duration-300 object-contain" />
              ) : (
                renderIcon(s.image_url)
              )}
              <h3 className="font-bold text-2xl mb-4">{s.name}</h3>
              <p className="text-gray-300 mb-8 flex-grow">{s.short_description || s.full_description}</p>
              <a href="#contato" className="bg-[#0D47A1] hover:bg-[#00C853] text-white px-6 py-3 rounded-full font-semibold transition-all">Solicitar Orçamento</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
