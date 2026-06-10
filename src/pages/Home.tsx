import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import Services from '../components/Services';
import StatsSection from '../components/StatsSection';
import TestimonialsSection from '../components/TestimonialsSection';
import PartnersSection from '../components/PartnersSection';
import BlogSection from '../components/BlogSection';
import Footer from '../components/Footer';
import WhatsAppFloatingButton from '../components/WhatsAppFloatingButton';
import { supabase } from '../lib/supabase';

export default function Home() {
  useEffect(() => {
    supabase.from('company_settings').select('company_name, name').single().then(({ data }) => {
      if (data) {
        const name = data.company_name || data.name || 'NEXO Dedetizadora';
        document.title = name;
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
        <Navbar />
        <HeroSection />
        <StatsSection />
        <Services />
        <PartnersSection />
        <TestimonialsSection />
        <BlogSection />
        <Footer />
        <WhatsAppFloatingButton />
    </div>
  );
}

