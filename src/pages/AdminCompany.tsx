import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { CompanySettings } from '../types';
import { uploadImage } from '../lib/storage';

export default function AdminCompany() {
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [form, setForm] = useState<Partial<CompanySettings>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    const { data } = await supabase.from('company_settings').select('*').single();
    if (data) {
      setSettings(data);
      setForm(data);
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
    const { error } = settings 
      ? await supabase.from('company_settings').update(form).eq('id', settings.id)
      : await supabase.from('company_settings').insert(form);
      
    if (error) alert("Erro: " + error.message);
    else { alert("Salvo com sucesso!"); fetchSettings(); }
    setLoading(false);
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-8 text-blue-400">Dados da Empresa</h2>
      <form onSubmit={handleSave} className="grid md:grid-cols-2 gap-4 bg-gray-800 p-8 rounded-xl border border-gray-700">
        <input className="bg-gray-700 p-3 rounded text-white" value={form.name || ''} onChange={e => setForm({...form, name: e.target.value})} placeholder="Nome" />
        <input className="bg-gray-700 p-3 rounded text-white" value={form.cnpj || ''} onChange={e => setForm({...form, cnpj: e.target.value})} placeholder="CNPJ" />
        <input className="bg-gray-700 p-3 rounded text-white" value={form.whatsapp || ''} onChange={e => setForm({...form, whatsapp: e.target.value})} placeholder="WhatsApp" />
        <input className="bg-gray-700 p-3 rounded text-white" value={form.email || ''} onChange={e => setForm({...form, email: e.target.value})} placeholder="E-mail" />
        <div className="col-span-2">
            <label className="block mb-2 text-gray-300">Logo</label>
            {form.logo_url && <img src={form.logo_url} className="h-16 mb-2 border border-gray-600" />}
            <input type="file" onChange={(e) => handleUpload(e, 'logo_url')} className="bg-gray-700 p-2 rounded w-full text-gray-300" />
        </div>
        <button type="submit" disabled={loading} className="col-span-2 bg-blue-600 p-4 rounded-lg hover:bg-blue-500 font-bold text-white transition">{loading ? 'Salvando...' : 'Salvar Dados'}</button>
      </form>
    </div>
  );
}
