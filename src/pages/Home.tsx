import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import Services from '../components/Services';
import StatsSection from '../components/StatsSection';
import TestimonialsSection from '../components/TestimonialsSection';
import PartnersSection from '../components/PartnersSection';
import BlogSection from '../components/BlogSection';
import Footer from '../components/Footer';
import WhatsAppFloatingButton from '../components/WhatsAppFloatingButton';

export default function Home() {
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
