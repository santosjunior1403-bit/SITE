import { useState, useEffect } from 'react';
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

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'image_url' | 'logo_url' | 'banner_url') => {
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
    const { error } = data 
      ? await supabase.from('hero_section').update(form).eq('id', data.id)
      : await supabase.from('hero_section').insert(form);
      
    if (error) alert("Erro: " + error.message);
    else { alert("Salvo!"); fetchHero(); }
    setLoading(false);
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-8 text-blue-400">Página Inicial (Hero)</h2>
      <form onSubmit={handleSave} className="grid md:grid-cols-2 gap-4 bg-gray-800 p-8 rounded-xl border border-gray-700">
        <input className="bg-gray-700 p-3 rounded text-white" value={form.title || ''} onChange={e => setForm({...form, title: e.target.value})} placeholder="Título" />
        <input className="bg-gray-700 p-3 rounded text-white" value={form.subtitle || ''} onChange={e => setForm({...form, subtitle: e.target.value})} placeholder="Subtítulo" />
        <input className="col-span-2 bg-gray-700 p-3 rounded text-white" value={form.whatsapp_number || ''} onChange={e => setForm({...form, whatsapp_number: e.target.value})} placeholder="WhatsApp (55...)" />
        <button type="submit" disabled={loading} className="col-span-2 bg-blue-600 p-4 rounded-lg hover:bg-blue-500 text-white font-bold">{loading ? 'Salvando...' : 'Salvar'}</button>
      </form>
    </div>
  );
}
