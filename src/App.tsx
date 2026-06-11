/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import { supabase } from './lib/supabase';
import PageTracker from './components/PageTracker';
import AdminLogin from './pages/AdminLogin';
import AdminLayout from './components/AdminLayout';
import AdminCompany from './pages/AdminCompany';
import AdminServices from './pages/AdminServices';
import AdminBlog from './pages/AdminBlog';
import BlogPostPage from './pages/BlogPostPage';
import AdminTestimonials from './pages/AdminTestimonials';
import AdminClients from './pages/AdminClients';
import AdminHome from './pages/AdminHome';
import AdminSettings from './pages/AdminSettings';
import AdminGoogleAds from './pages/AdminGoogleAds';

const DEFAULT_FAVICON = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="25" fill="#081A3A"/><path d="M50 15 L80 35 L80 65 L50 85 L20 65 L20 35 Z" fill="none" stroke="#00C853" stroke-width="8"/><text x="50" y="65" font-family="'Inter', sans-serif" font-weight="900" font-size="42" fill="white" text-anchor="middle">N</text></svg>`
)}`;

export default function App() {
  useEffect(() => {
    // Dynamically retrieve company logo for browser favicon
    const updateFavicon = async () => {
      let url = DEFAULT_FAVICON;
      
      if (supabase) {
        try {
          const { data } = await supabase.from('company_settings').select('logo_url').single();
          if (data && data.logo_url) {
            url = data.logo_url;
          }
        } catch (e) {
          console.warn("Could not fetch brand logo for favicon:", e);
        }
      }

      // Find or create favicon element
      let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = url;
    };

    updateFavicon();
  }, []);

  return (
    <BrowserRouter>
      <PageTracker />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog/:id" element={<BlogPostPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" />} />
          <Route path="dashboard" element={<Admin />} />
          <Route path="home" element={<AdminHome />} />
          <Route path="company" element={<AdminCompany />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="blog" element={<AdminBlog />} />
          <Route path="testimonials" element={<AdminTestimonials />} />
          <Route path="clients" element={<AdminClients />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="google-ads" element={<AdminGoogleAds />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
