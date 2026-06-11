import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import Services from '../components/Services';
import StatsSection from '../components/StatsSection';
import AboutUsSection from '../components/AboutUsSection';
import PartnersSection from '../components/PartnersSection';
import TestimonialsSection from '../components/TestimonialsSection';
import BlogSection from '../components/BlogSection';
import FAQ from '../components/FAQ';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';
import WhatsAppFloatingButton from '../components/WhatsAppFloatingButton';
import { supabase } from '../lib/supabase';

export default function Home() {
  useEffect(() => {
    // Define robust fallback SEO tags so they match requirements precisely
    document.title = 'NEXO Dedetizadora | Dedetização em São Paulo';
    
    try {
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', 'Controle de pragas em São Paulo. Dedetização de baratas, ratos, cupins, formigas e limpeza de caixa d\'água. Atendimento rápido e garantia.');
      }
    } catch (e) {
      console.warn("Could not set meta descriptive SEO tags:", e);
    }

    if (!supabase) return;
    
    supabase.from('company_settings').select('company_name, name').single().then(({ data, error }) => {
      if (!error && data) {
        const name = data.company_name || data.name;
        if (name) {
          document.title = `${name} | Dedetização em São Paulo`;
        }
      }
    }).catch(err => {
      console.warn("Could not query custom company name from database, staying with SEO title:", err);
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#081A3A]/5">
        <Navbar />
        <HeroSection />
        <StatsSection />
        <Services />
        <AboutUsSection />
        <PartnersSection />
        <TestimonialsSection />
        <BlogSection />
        <FAQ />
        <ContactSection />
        <Footer />
        <WhatsAppFloatingButton />
    </div>
  );
}

