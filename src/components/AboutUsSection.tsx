import { useState, useEffect } from 'react';
import { Shield, Award, Sparkles, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function AboutUsSection() {
  const [bannerUrl, setBannerUrl] = useState('https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80');

  useEffect(() => {
    if (!supabase) return;
    supabase.from('site_banners').select('*').then(({ data }) => {
      if (data && Array.isArray(data)) {
        const aboutBanner = data.find((b: any) => b.banner_type === 'about_banner' && b.active !== false);
        if (aboutBanner && aboutBanner.image_url) {
          setBannerUrl(aboutBanner.image_url);
          return;
        }
      }
      // cascade fallback
      supabase.from('company_settings').select('about_banner_url').single().then(({ data: compData }) => {
        if (compData && compData.about_banner_url) {
          setBannerUrl(compData.about_banner_url);
        }
      });
    }).catch(err => {
      console.warn("Could not load about banner, using fallback.", err);
    });
  }, []);

  return (
    <section id="quem-somos" className="py-24 bg-white text-gray-900 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Image visual with professional technicians */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#081A3A] to-[#00C853] rounded-3xl blur opacity-25 group-hover:opacity-45 transition duration-1000"></div>
            <div className="relative bg-white rounded-3xl overflow-hidden aspect-[4/3] shadow-2xl">
              <img 
                src={bannerUrl} 
                alt="Técnico Dedetização NEXO" 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              {/* Floating Badge */}
              <div className="absolute bottom-6 left-6 right-6 bg-[#081A3A] text-white p-6 rounded-2xl backdrop-blur-md border border-white/10 flex items-center gap-4 shadow-xl">
                <div className="bg-[#00C853] p-3 rounded-xl shrink-0 text-white">
                  <Award className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-bold text-lg leading-tight text-white mb-1">Garantia Certificada</h4>
                  <p className="text-gray-300 text-xs">Todos os nossos serviços acompanham laudo técnico e assistência técnica gratuita.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Text block */}
          <div className="flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#081A3A]/5 text-[#081A3A] rounded-full text-xs font-bold tracking-wider uppercase mb-6 self-start">
              <Shield className="w-3.5 h-3.5 text-[#00C853]" /> Quem Somos
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-black text-[#081A3A] tracking-tight leading-tight mb-6">
              NEXO Dedetizadora: Protegendo o seu <span className="text-[#00C853]">patrimônio e saúde</span>
            </h2>
            
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              A <strong>NEXO Dedetizadora</strong> é referência em controle de pragas urbanas e sanitização de ambientes na Grande São Paulo. Fundada com o propósito de oferecer máxima segurança e excelência operacional, atuamos com soluções de alto impacto que aliam controle de infestações ao respeito total ao meio ambiente.
            </p>
            
            <p className="text-gray-600 text-base leading-relaxed mb-8">
              Atendemos residências, condomínios, indústrias, comércios e escritórios com técnicos altamente treinados, certificados e protegidos por EPIs adequados. Utilizamos produtos de laboratórios líderes mundiais, sem cheiro e com baixa toxicidade para pessoas e animais de estimação.
            </p>

            {/* Check list */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#00C853] shrink-0" />
                <span className="font-semibold text-gray-700 text-sm">Controle Químico Seguro</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#00C853] shrink-0" />
                <span className="font-semibold text-gray-700 text-sm">Laudo Integrado (LTV)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#00C853] shrink-0" />
                <span className="font-semibold text-gray-700 text-sm">Equipe 100% Qualificada</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#00C853] shrink-0" />
                <span className="font-semibold text-gray-700 text-sm">Atendimento Imediato</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
