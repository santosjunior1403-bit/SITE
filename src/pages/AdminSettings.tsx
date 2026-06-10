import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { uploadImage } from '../lib/storage';

interface Settings {
  id: string;
  seo_title: string;
  seo_description: string;
  keywords: string;
  share_image_url: string;
  whatsapp_message: string;
  primary_color: string;
  secondary_color: string;
  footer_text: string;
  member_area_enabled: boolean;
  site_active: boolean;
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [form, setForm] = useState<Partial<Settings>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    const { data } = await supabase.from('seo_settings').select('*').single();
    if (data) { setSettings(data); setForm(data); }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLoading(true);
      const url = await uploadImage(e.target.files[0], 'settings');
      setForm(prev => ({...prev, share_image_url: url}));
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = settings 
      ? await supabase.from('seo_settings').update(form).eq('id', settings.id)
      : await supabase.from('seo_settings').insert(form);
    
    if (error) alert("Erro: " + error.message);
    else { alert("Salvo com sucesso!"); fetchSettings(); }
    setLoading(false);
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-8 text-blue-400">Configurações</h2>
      <form onSubmit={handleSave} className="bg-gray-800 p-8 rounded-xl border border-gray-700 grid md:grid-cols-2 gap-4">
        <input className="bg-gray-700 p-3 rounded" value={form.seo_title || ''} onChange={e => setForm({...form, seo_title: e.target.value})} placeholder="SEO Título" />
        <input className="bg-gray-700 p-3 rounded" value={form.whatsapp_message || ''} onChange={e => setForm({...form, whatsapp_message: e.target.value})} placeholder="WhatsApp Mensagem" />
        <textarea className="col-span-2 bg-gray-700 p-3 rounded" value={form.seo_description || ''} onChange={e => setForm({...form, seo_description: e.target.value})} placeholder="SEO Descrição" />
        <label className="text-sm text-gray-300 col-span-2">Imagem de Compartilhamento</label>
        <input type="file" onChange={handleUpload} className="bg-gray-700 p-3 rounded col-span-2" />
        <button type="submit" disabled={loading} className="col-span-2 bg-blue-600 p-3 rounded">{loading ? 'Salvando...' : 'Salvar'}</button>
      </form>
    </div>
  );
}
