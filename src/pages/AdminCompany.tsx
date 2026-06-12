import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { CompanySettings } from '../types';
import { uploadImage } from '../lib/storage';

export default function AdminCompany() {
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [form, setForm] = useState<Partial<CompanySettings>>({
    company_name: '',
    logo_url: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    cep: '',
    instagram_url: '',
    facebook_url: '',
    google_business_url: '',
    clients_attended: '',
    services_completed: '',
    customer_satisfaction: '',
    business_hours: '',
    free_quote_label: '',
    free_quote_subtitle: '',
    contact_center_label: '',
    about_banner_url: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => { 
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase.from('company_settings').select('*').single();
      if (!error && data) {
        setSettings(data);
        setForm(data);
      } else {
        console.warn("Could not retrieve company settings:", error);
      }
    } catch (e) {
      console.error("Exception fetching settings:", e);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'logo_url' | 'about_banner_url') => {
    if (e.target.files && e.target.files[0]) {
      setLoading(true);
      try {
        const url = await uploadImage(e.target.files[0], 'company');
        setForm(prev => ({ ...prev, [field]: url }));
      } catch (err: any) {
        alert("Erro no upload: " + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      company_name: form.company_name || '',
      logo_url: form.logo_url || '',
      phone: form.phone || '',
      email: form.email || '',
      address: form.address || '',
      city: form.city || '',
      state: form.state || '',
      cep: form.cep || '',
      instagram_url: form.instagram_url || '',
      facebook_url: form.facebook_url || '',
      google_business_url: form.google_business_url || '',
      clients_attended: form.clients_attended || '',
      services_completed: form.services_completed || '',
      customer_satisfaction: form.customer_satisfaction || '',
      business_hours: form.business_hours || '',
      free_quote_label: form.free_quote_label || '',
      free_quote_subtitle: form.free_quote_subtitle || '',
      contact_center_label: form.contact_center_label || '',
      about_banner_url: form.about_banner_url || ''
    };

    try {
      const { error } = settings && settings.id
        ? await supabase.from('company_settings').update(payload).eq('id', settings.id)
        : await supabase.from('company_settings').insert(payload);
        
      if (error) {
        alert("Erro ao salvar: " + error.message);
      } else {
        alert("Salvo com sucesso!");
        fetchSettings();
      }
    } catch (err: any) {
      alert("Exceção ao salvar: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-8 text-blue-400 font-sans">Dados da Empresa</h2>
      <form onSubmit={handleSave} className="grid md:grid-cols-2 gap-6 bg-gray-800 p-8 rounded-xl border border-gray-700">
        
        {/* Company Name */}
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="text-sm text-gray-300 font-semibold tracking-wide uppercase text-xs">Nome da Empresa</label>
          <input 
            className="bg-gray-700 p-3.5 rounded-xl text-white font-medium focus:border-[#00C853] outline-none transition-colors border border-transparent" 
            value={form.company_name || ''} 
            onChange={e => setForm({...form, company_name: e.target.value})} 
            placeholder="Ex: NEXO Dedetizadora Ltda" 
            required
          />
        </div>

        {/* Phone & Email */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-gray-300 font-semibold tracking-wide uppercase text-xs">Telefone de Contato</label>
          <input 
            className="bg-gray-700 p-3.5 rounded-xl text-white font-medium focus:border-[#00C853] outline-none transition-colors border border-transparent" 
            value={form.phone || ''} 
            onChange={e => setForm({...form, phone: e.target.value})} 
            placeholder="Ex: (11) 4003-9128" 
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-gray-300 font-semibold tracking-wide uppercase text-xs">E-mail Comercial</label>
          <input 
            type="email"
            className="bg-gray-700 p-3.5 rounded-xl text-white font-medium focus:border-[#00C853] outline-none transition-colors border border-transparent" 
            value={form.email || ''} 
            onChange={e => setForm({...form, email: e.target.value})} 
            placeholder="Ex: contato@nexodedetizadora.com.br" 
          />
        </div>

        {/* Address Details */}
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="text-sm text-gray-300 font-semibold tracking-wide uppercase text-xs">Endereço Completo</label>
          <input 
            className="bg-gray-700 p-3.5 rounded-xl text-white font-medium focus:border-[#00C853] outline-none transition-colors border border-transparent" 
            value={form.address || ''} 
            onChange={e => setForm({...form, address: e.target.value})} 
            placeholder="Ex: Av. Paulista, 1000 - Bela Vista" 
          />
        </div>

        {/* City, State & CEP */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-gray-300 font-semibold tracking-wide uppercase text-xs">Cidade</label>
          <input 
            className="bg-gray-700 p-3.5 rounded-xl text-white font-medium focus:border-[#00C853] outline-none transition-colors border border-transparent" 
            value={form.city || ''} 
            onChange={e => setForm({...form, city: e.target.value})} 
            placeholder="Ex: São Paulo" 
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-300 font-semibold tracking-wide uppercase text-xs">Estado</label>
              <input 
                className="bg-gray-700 p-3.5 rounded-xl text-white font-medium focus:border-[#00C853] outline-none transition-colors border border-transparent" 
                value={form.state || ''} 
                onChange={e => setForm({...form, state: e.target.value})} 
                placeholder="Ex: SP" 
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-300 font-semibold tracking-wide uppercase text-xs">CEP</label>
              <input 
                className="bg-gray-700 p-3.5 rounded-xl text-white font-medium focus:border-[#00C853] outline-none transition-colors border border-transparent" 
                value={form.cep || ''} 
                onChange={e => setForm({...form, cep: e.target.value})} 
                placeholder="Ex: 01310-100" 
              />
            </div>
          </div>
        </div>

        {/* Brand Logo Upload */}
        <div className="md:col-span-2 border-t border-gray-700/50 pt-6 mt-2">
          <label className="block text-sm text-gray-300 font-semibold tracking-wide uppercase text-xs mb-3">Logo da Empresa</label>
          <div className="flex items-center gap-4">
            {form.logo_url && (
              <div className="p-2 bg-white rounded-xl border border-gray-600 shrink-0">
                <img src={form.logo_url} alt="Logo" className="h-12 w-auto object-contain" />
              </div>
            )}
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => handleUpload(e, 'logo_url')} 
              className="bg-gray-700 p-3.5 rounded-xl text-gray-300 w-full text-sm outline-none file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#00C853] file:text-white hover:file:bg-[#00a846] cursor-pointer" 
            />
          </div>
        </div>

        {/* About Us Banner Upload */}
        <div className="md:col-span-2 border-t border-gray-700/50 pt-6 mt-2">
          <label className="block text-sm text-gray-300 font-semibold tracking-wide uppercase text-xs mb-3">Banner da Seção "Quem Somos"</label>
          <p className="text-xs text-gray-400 mb-2">Ideal: imagem de técnicos em alta resolução, proporção aproximada de 4:3.</p>
          <div className="flex flex-col gap-3">
            {form.about_banner_url && (
              <div className="p-2 bg-gray-900 rounded-xl border border-gray-700 max-w-sm overflow-hidden">
                <img src={form.about_banner_url} alt="Banner Quem Somos" className="h-32 w-full object-cover rounded-lg" />
              </div>
            )}
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => handleUpload(e, 'about_banner_url')} 
              className="bg-gray-700 p-3.5 rounded-xl text-gray-300 w-full text-sm outline-none file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#00C853] file:text-white hover:file:bg-[#00a846] cursor-pointer" 
            />
          </div>
        </div>

        {/* Hours & Business Links */}
        <div className="md:col-span-2 border-t border-gray-700/50 pt-6 mt-2">
          <h3 className="text-base font-bold text-[#00C853] tracking-wide uppercase mb-4">Funcionamento & Redes Sociais</h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-sm text-gray-300 font-semibold tracking-wide uppercase text-xs">Horário de Funcionamento</label>
              <input 
                className="bg-gray-700 p-3.5 rounded-xl text-white font-medium focus:border-[#00C853] outline-none transition-colors border border-transparent" 
                value={form.business_hours || ''} 
                onChange={e => setForm({...form, business_hours: e.target.value})} 
                placeholder="Ex: Segunda à Sábado - 08h às 18h" 
              />
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-sm text-gray-300 font-semibold tracking-wide uppercase text-xs">Google Meu Negócio (Link do Maps)</label>
              <input 
                className="bg-gray-700 p-3.5 rounded-xl text-white font-medium focus:border-[#00C853] outline-none transition-colors border border-transparent text-sm" 
                value={form.google_business_url || ''} 
                onChange={e => setForm({...form, google_business_url: e.target.value})} 
                placeholder="Ex: https://goo.gl/maps/..." 
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-gray-300 font-semibold tracking-wide uppercase text-xs">Instagram (Link completo)</label>
              <input 
                className="bg-gray-700 p-3.5 rounded-xl text-white font-medium focus:border-[#00C853] outline-none transition-colors border border-transparent" 
                value={form.instagram_url || ''} 
                onChange={e => setForm({...form, instagram_url: e.target.value})} 
                placeholder="Ex: https://instagram.com/nexodedetizadora" 
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-gray-300 font-semibold tracking-wide uppercase text-xs">Facebook (Link completo)</label>
              <input 
                className="bg-gray-700 p-3.5 rounded-xl text-white font-medium focus:border-[#00C853] outline-none transition-colors border border-transparent" 
                value={form.facebook_url || ''} 
                onChange={e => setForm({...form, facebook_url: e.target.value})} 
                placeholder="Ex: https://facebook.com/nexodedetizadora" 
              />
            </div>
          </div>
        </div>

        {/* Textos Personalizados do Site */}
        <div className="md:col-span-2 border-t border-gray-700/50 pt-6 mt-2 font-sans">
          <h3 className="text-base font-bold text-[#00C853] tracking-wide uppercase mb-4">Textos Personalizados do Canal de Contato</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5 col-span-2">
              <label className="text-sm text-gray-300 font-semibold tracking-wide uppercase text-xs">Texto Destacado do Orçamento (Ex: Orçamento Gratuito)</label>
              <input 
                className="bg-gray-700 p-3.5 rounded-xl text-white font-medium focus:border-[#00C853] outline-none transition-colors border border-transparent text-sm" 
                value={form.free_quote_label || ''} 
                onChange={e => setForm({...form, free_quote_label: e.target.value})} 
                placeholder="Ex: Orçamento Gratuito" 
              />
            </div>

            <div className="flex flex-col gap-1.5 col-span-2">
              <label className="text-sm text-gray-300 font-semibold tracking-wide uppercase text-xs">Subtítulo explicativo do canal de contato</label>
              <input 
                className="bg-gray-700 p-3.5 rounded-xl text-white font-medium focus:border-[#00C853] outline-none transition-colors border border-transparent text-sm" 
                value={form.free_quote_subtitle || ''} 
                onChange={e => setForm({...form, free_quote_subtitle: e.target.value})} 
                placeholder="Ex: Nossa equipe técnica está pronta para atender o seu chamado com agilidade..." 
              />
            </div>

            <div className="flex flex-col gap-1.5 col-span-2">
              <label className="text-sm text-gray-300 font-semibold tracking-wide uppercase text-xs">Texto para Central de Atendimento (Ex: Central de Atendimento)</label>
              <input 
                className="bg-gray-700 p-3.5 rounded-xl text-white font-medium focus:border-[#00C853] outline-none transition-colors border border-transparent text-sm" 
                value={form.contact_center_label || ''} 
                onChange={e => setForm({...form, contact_center_label: e.target.value})} 
                placeholder="Ex: Central de Atendimento" 
              />
            </div>
          </div>
        </div>

        {/* Statistical Counters */}
        <div className="md:col-span-2 border-t border-gray-700/50 pt-6 mt-2">
          <h3 className="text-base font-bold text-[#00C853] tracking-wide uppercase mb-4">Dados Estatísticos do Site</h3>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-gray-300 font-semibold tracking-wide uppercase text-xs">Clientes Atendidos</label>
              <input 
                className="bg-gray-700 p-3.5 rounded-xl text-white font-bold focus:border-[#00C853] outline-none transition-colors border border-transparent" 
                value={form.clients_attended || ''} 
                onChange={e => setForm({...form, clients_attended: e.target.value})} 
                placeholder="Ex: +500" 
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-gray-300 font-semibold tracking-wide uppercase text-xs">Serviços Realizados</label>
              <input 
                className="bg-gray-700 p-3.5 rounded-xl text-white font-bold focus:border-[#00C853] outline-none transition-colors border border-transparent" 
                value={form.services_completed || ''} 
                onChange={e => setForm({...form, services_completed: e.target.value})} 
                placeholder="Ex: +1000" 
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-gray-300 font-semibold tracking-wide uppercase text-xs">Clientes Satisfeitos</label>
              <input 
                className="bg-gray-700 p-3.5 rounded-xl text-white font-bold focus:border-[#00C853] outline-none transition-colors border border-transparent" 
                value={form.customer_satisfaction || ''} 
                onChange={e => setForm({...form, customer_satisfaction: e.target.value})} 
                placeholder="Ex: 100%" 
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <button 
          type="submit" 
          disabled={loading} 
          className="md:col-span-2 bg-[#00C853] hover:bg-[#00a846] p-4 rounded-xl font-bold text-white transition-all cursor-pointer shadow-md hover:shadow-lg mt-6 uppercase tracking-wider text-sm outline-none"
        >
          {loading ? 'Salvando...' : 'Salvar Dados da Empresa'}
        </button>
      </form>
    </div>
  );
}
