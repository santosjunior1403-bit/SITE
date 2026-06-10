import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { HeroSection } from '../types';
import { uploadImage } from '../lib/storage';

export default function AdminHome() {
  const [data, setData] = useState<HeroSection | null>(null);
  const [form, setForm] = useState<Partial<HeroSection>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchHero(); }, []);

  const fetchHero = async () => {
    const { data } = await supabase.from('hero_section').select('*').single();
    if (data) {
      setData(data);
      setForm(data);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'image_url' | 'logo_url' | 'banner_url' | 'secondary_banner_url') => {
    if (e.target.files && e.target.files[0]) {
      setLoading(true);
      const url = await uploadImage(e.target.files[0], 'hero');
      setForm(prev => ({...prev, [field]: url}));
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      title: form.title,
      subtitle: form.subtitle,
      whatsapp_number: form.whatsapp_number,
      image_url: form.image_url,
      secondary_banner_url: form.secondary_banner_url || null,
      button_text: form.button_text || 'FALE CONOSCO',
    };

    const { error } = data 
      ? await supabase.from('hero_section').update(payload).eq('id', data.id)
      : await supabase.from('hero_section').insert(payload);
      
    if (error) {
      alert("Erro ao salvar: " + error.message);
    } else {
      alert("Salvo com sucesso!");
      fetchHero();
    }
    setLoading(false);
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-8 text-blue-400">Página Inicial (Hero)</h2>
      <form onSubmit={handleSave} className="grid md:grid-cols-2 gap-4 bg-gray-800 p-8 rounded-xl border border-gray-700">
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-300 font-medium">Título Principal</label>
          <input className="bg-gray-700 p-3 rounded text-white font-medium" value={form.title || ''} onChange={e => setForm({...form, title: e.target.value})} placeholder="Título" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-300 font-medium">Subtítulo / Descrição</label>
          <input className="bg-gray-700 p-3 rounded text-white font-medium" value={form.subtitle || ''} onChange={e => setForm({...form, subtitle: e.target.value})} placeholder="Subtítulo" />
        </div>
        <div className="flex flex-col gap-1 col-span-2">
          <label className="text-sm text-gray-300 font-medium">WhatsApp de Contato (Formatado com DDD e código do país, ex: 5511999999999)</label>
          <input className="bg-gray-700 p-3 rounded text-white font-medium" value={form.whatsapp_number || ''} onChange={e => setForm({...form, whatsapp_number: e.target.value})} placeholder="WhatsApp (55...)" />
        </div>
        <div className="flex flex-col gap-1 col-span-2">
          <label className="text-sm text-gray-300 font-medium">Texto do Botão Principal</label>
          <input className="bg-gray-700 p-3 rounded text-white font-medium" value={form.button_text || ''} onChange={e => setForm({...form, button_text: e.target.value})} placeholder="Texto do botão" />
        </div>
        
        {/* Banner para Computador */}
        <div className="col-span-2 md:col-span-1 border-t border-gray-700/50 pt-4 mt-2">
            <label className="block mb-2 text-sm font-semibold text-[#00C853]">Banner para Computador (Desktop)</label>
            <p className="text-xs text-gray-400 mb-2">Ideal: formato horizontal ou panorâmico. Será exibido em computadores e telas grandes.</p>
            {form.image_url && <img src={form.image_url} className="h-32 object-cover rounded border border-gray-700 mb-2 max-w-full" />}
            <input type="file" onChange={(e) => handleUpload(e, 'image_url')} className="bg-gray-700 p-2 rounded w-full text-xs text-gray-300" />
        </div>

        {/* Banner para Celular */}
        <div className="col-span-2 md:col-span-1 border-t border-gray-700/50 pt-4 mt-2">
            <label className="block mb-2 text-sm font-semibold text-[#00C853]">Banner para Celular (Mobile)</label>
            <p className="text-xs text-gray-400 mb-2">Ideal: formato vertical ou quadrado. Otimizado para telas estreitas de smartphones.</p>
            {form.secondary_banner_url && <img src={form.secondary_banner_url} className="h-32 object-cover rounded border border-gray-700 mb-2 max-w-full" />}
            <input type="file" onChange={(e) => handleUpload(e, 'secondary_banner_url')} className="bg-gray-700 p-2 rounded w-full text-xs text-gray-300" />
        </div>

        <button type="submit" disabled={loading} className="col-span-2 mt-4 bg-blue-600 p-4 rounded-lg hover:bg-blue-500 text-white font-bold transition-all shadow-md hover:shadow-lg">{loading ? 'Salvando...' : 'Salvar Informações do Banner'}</button>
      </form>
    </div>
  );
}
