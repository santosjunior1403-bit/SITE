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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog/:id" element={<BlogPostPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Admin />} />
          <Route path="dashboard" element={<Navigate to="/admin" />} />
          <Route path="company" element={<AdminCompany />} />
          <Route path="home" element={<div className="p-4">Gerenciar Página Inicial</div>} />
          <Route path="services" element={<AdminServices />} />
          <Route path="blog" element={<AdminBlog />} />
          <Route path="testimonials" element={<div className="p-4">Gerenciar Avaliações</div>} />
          <Route path="clients" element={<div className="p-4">Gerenciar Clientes/Parceiros</div>} />
          <Route path="settings" element={<div className="p-4">Configurações</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
