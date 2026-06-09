import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import Services from '../components/Services';
import PartnersSection from '../components/PartnersSection';
import BlogSection from '../components/BlogSection';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
        <Navbar />
        <HeroSection />
        <Services />
        <PartnersSection />
        <BlogSection />
        <Footer />
    </div>
  );
}
