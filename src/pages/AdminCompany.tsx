import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { CompanySettings } from '../types';
import { uploadImage } from '../lib/storage';

export default function AdminCompany() {
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [form, setForm] = useState<Partial<CompanySettings>>({});
  const [loading, setLoading] = useState(false);

  // States for statistics
  const [stats, setStats] = useState({
    clientes_atendidos: '+500',
    servicos_realizados: '+1000',
    clientes_satisfeitos: '100%'
  });

  useEffect(() => { 
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data } = await supabase.from('company_settings').select('*').single();
    if (data) {
      setSettings(data);
      setForm(data);
      if (data.institutional_text) {
        try {
          const parsed = JSON.parse(data.institutional_text);
          if (parsed && typeof parsed === 'object') {
            setStats({
              clientes_atendidos: parsed.clientes_atendidos || '+500',
              servicos_realizados: parsed.servicos_realizados || '+1000',
              clientes_satisfeitos: parsed.clientes_satisfeitos || '100%'
            });
          }
        } catch (e) {
          console.error("Error parsing stats", e);
        }
      }
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'logo_url' | 'team_photo_url') => {
    if (e.target.files && e.target.files[0]) {
      setLoading(true);
      const url = await uploadImage(e.target.files[0], 'company');
      setForm(prev => ({...prev, [field]: url}));
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...form,
      company_name: form.company_name || form.name,
      name: form.company_name || form.name,
      bairro: form.bairro || form.neighborhood || '',
      neighborhood: form.bairro || form.neighborhood || '',
      cidade: form.cidade || form.city || '',
      city: form.cidade || form.city || '',
      estado: form.estado || form.state || '',
      state: form.estado || form.state || '',
      cep: form.cep || form.zip || '',
      zip: form.cep || form.zip || '',
      business_hours: form.business_hours || form.opening_hours || '',
      opening_hours: form.business_hours || form.opening_hours || '',
      google_business_url: form.google_business_url || form.google_business_link || '',
      google_business_link: form.google_business_url || form.google_business_link || '',
      institutional_text: JSON.stringify(stats)
    };

    const { error } = settings 
      ? await supabase.from('company_settings').update(payload).eq('id', settings.id)
      : await supabase.from('company_settings').insert(payload);
      
    if (error) alert("Erro: " + error.message);
    else { alert("Salvo com sucesso!"); fetchSettings(); }
    setLoading(false);
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-8 text-blue-400">Dados da Empresa</h2>
      <form onSubmit={handleSave} className="grid md:grid-cols-2 gap-4 bg-gray-800 p-8 rounded-xl border border-gray-700">
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-300 font-medium">Nome da Empresa</label>
          <input className="bg-gray-700 p-3 rounded text-white font-medium" value={form.company_name || form.name || ''} onChange={e => setForm({...form, company_name: e.target.value, name: e.target.value})} placeholder="Nome" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-300 font-medium">CNPJ</label>
          <input className="bg-gray-700 p-3 rounded text-white font-medium" value={form.cnpj || ''} onChange={e => setForm({...form, cnpj: e.target.value})} placeholder="CNPJ" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-300 font-medium">WhatsApp</label>
          <input className="bg-gray-700 p-3 rounded text-white font-medium" value={form.whatsapp || ''} onChange={e => setForm({...form, whatsapp: e.target.value})} placeholder="WhatsApp" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-300 font-medium">Telefone</label>
          <input className="bg-gray-700 p-3 rounded text-white font-medium" value={form.phone || ''} onChange={e => setForm({...form, phone: e.target.value})} placeholder="Telefone" />
        </div>
        <div className="flex flex-col gap-1 col-span-2">
          <label className="text-sm text-gray-300 font-medium">E-mail</label>
          <input className="bg-gray-700 p-3 rounded text-white font-medium" value={form.email || ''} onChange={e => setForm({...form, email: e.target.value})} placeholder="E-mail" />
        </div>
        
        <div className="col-span-2">
            <label className="block mb-2 text-gray-300 font-medium">Logo</label>
            {form.logo_url && <img src={form.logo_url} className="h-16 mb-2 border border-gray-600 rounded p-1 bg-white" />}
            <input type="file" onChange={(e) => handleUpload(e, 'logo_url')} className="bg-gray-700 p-2 rounded w-full text-gray-300" />
        </div>

        {/* Fale Conosco - Endereço, Horário e Redes Sociais */}
        <div className="col-span-2 border-t border-gray-700/50 pt-6 mt-4">
          <h3 className="text-lg font-bold mb-2 text-[#00C853] tracking-wide uppercase text-sm">Fale Conosco (Endereço, Horários e Redes)</h3>
          <p className="text-xs text-gray-400 mb-4">
            Gerencie todas as informações de contato direto e localização física exibidas no rodapé e canais de atendimento.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1 col-span-2">
              <label className="text-sm text-gray-300 font-medium">Endereço (Rua, Número)</label>
              <input 
                className="bg-gray-700 p-3 rounded text-white font-medium" 
                value={form.address || ''} 
                onChange={e => setForm({...form, address: e.target.value})} 
                placeholder="Ex: Av. Paulista, 1000 - Cj 50" 
              />
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-300 font-medium">Bairro</label>
              <input 
                className="bg-gray-700 p-3 rounded text-white font-medium" 
                value={form.bairro || form.neighborhood || ''} 
                onChange={e => setForm({...form, bairro: e.target.value, neighborhood: e.target.value})} 
                placeholder="Ex: Bela Vista" 
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-300 font-medium">CEP</label>
              <input 
                className="bg-gray-700 p-3 rounded text-white font-medium" 
                value={form.cep || form.zip || ''} 
                onChange={e => setForm({...form, cep: e.target.value, zip: e.target.value})} 
                placeholder="Ex: 01310-100" 
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-300 font-medium">Cidade</label>
              <input 
                className="bg-gray-700 p-3 rounded text-white font-medium" 
                value={form.cidade || form.city || ''} 
                onChange={e => setForm({...form, cidade: e.target.value, city: e.target.value})} 
                placeholder="Ex: São Paulo" 
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-300 font-medium">Estado</label>
              <input 
                className="bg-gray-700 p-3 rounded text-white font-medium" 
                value={form.estado || form.state || ''} 
                onChange={e => setForm({...form, estado: e.target.value, state: e.target.value})} 
                placeholder="Ex: SP" 
              />
            </div>

            <div className="flex flex-col gap-1 col-span-2">
              <label className="text-sm text-gray-300 font-medium">Horário de Funcionamento</label>
              <input 
                className="bg-gray-700 p-3 rounded text-white font-medium" 
                value={form.business_hours || form.opening_hours || ''} 
                onChange={e => setForm({...form, business_hours: e.target.value, opening_hours: e.target.value})} 
                placeholder="Ex: Segunda à Sábado - 08h às 18h" 
              />
            </div>

            <div className="flex flex-col gap-1 col-span-2">
              <label className="text-sm text-gray-300 font-medium">Google Meu Negócio (Link de Compartilhamento do Maps)</label>
              <input 
                className="bg-gray-700 p-3 rounded text-white font-medium text-xs" 
                value={form.google_business_url || form.google_business_link || ''} 
                onChange={e => setForm({...form, google_business_url: e.target.value, google_business_link: e.target.value})} 
                placeholder="Ex: https://goo.gl/maps/..." 
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-300 font-medium font-sans">Instagram (Link completo ou usuário)</label>
              <input 
                className="bg-gray-700 p-3 rounded text-white font-medium" 
                value={form.instagram || ''} 
                onChange={e => setForm({...form, instagram: e.target.value})} 
                placeholder="Ex: https://instagram.com/seu_perfil" 
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-300 font-medium font-sans">Facebook (Link completo ou usuário)</label>
              <input 
                className="bg-gray-700 p-3 rounded text-white font-medium" 
                value={form.facebook || ''} 
                onChange={e => setForm({...form, facebook: e.target.value})} 
                placeholder="Ex: https://facebook.com/seu_perfil" 
              />
            </div>
          </div>
        </div>

        {/* Estatísticas editáveis */}
        <div className="col-span-2 border-t border-gray-700/50 pt-6 mt-4">
          <h3 className="text-lg font-bold mb-2 text-[#00C853] tracking-wide uppercase text-sm">Dados Estatísticos (Números do Site)</h3>
          <p className="text-xs text-gray-400 mb-4">
            Estes números são mostrados nas seções de destaque e contadores na página inicial do site.
          </p>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-300 font-medium">Clientes Atendidos</label>
              <input 
                className="bg-gray-700 p-3 rounded text-white font-bold" 
                value={stats.clientes_atendidos} 
                onChange={e => setStats({...stats, clientes_atendidos: e.target.value})} 
                placeholder="Ex: +500" 
              />
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-300 font-medium">Serviços Realizados</label>
              <input 
                className="bg-gray-700 p-3 rounded text-white font-bold" 
                value={stats.servicos_realizados} 
                onChange={e => setStats({...stats, servicos_realizados: e.target.value})} 
                placeholder="Ex: +1000" 
              />
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-300 font-medium">Clientes Satisfeitos</label>
              <input 
                className="bg-gray-700 p-3 rounded text-white font-bold" 
                value={stats.clientes_satisfeitos} 
                onChange={e => setStats({...stats, clientes_satisfeitos: e.target.value})} 
                placeholder="Ex: 100%" 
              />
            </div>
          </div>
        </div>

        <button type="submit" disabled={loading} className="col-span-2 bg-[#00C853] hover:bg-[#00a846] p-4 rounded-lg font-bold text-white transition-all cursor-pointer shadow-md hover:shadow-lg mt-4">
          {loading ? 'Salvando...' : 'Salvar Dados'}
        </button>
      </form>
    </div>
  );
}
