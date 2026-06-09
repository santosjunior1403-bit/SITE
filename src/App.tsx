/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
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

export default function App() {
  return (
    <BrowserRouter>
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
