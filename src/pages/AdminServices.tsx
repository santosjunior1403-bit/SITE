import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Service } from '../types';
import { uploadImage } from '../lib/storage';

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [form, setForm] = useState<Partial<Service>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchServices(); }, []);

  const fetchServices = async () => {
    const { data } = await supabase.from('services').select('*');
    if (data) setServices(data);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'image_url' | 'icon_url') => {
    if (e.target.files && e.target.files[0]) {
      setLoading(true);
      const url = await uploadImage(e.target.files[0], 'services');
      setForm(prev => ({...prev, [field]: url}));
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = form.id 
      ? await supabase.from('services').update(form).eq('id', form.id)
      : await supabase.from('services').insert(form);
      
    if (error) alert("Erro: " + error.message);
    else { alert("Salvo!"); setForm({}); fetchServices(); }
    setLoading(false);
  };

  const deleteService = async (id: string) => {
    if (confirm('Excluir?')) {
        await supabase.from('services').delete().eq('id', id);
        fetchServices();
    }
  };

  return (
    <div className="text-white p-6">
      <h2 className="text-3xl font-bold mb-8 text-blue-400">Gerenciar Serviços</h2>
      <form onSubmit={handleSave} className="bg-gray-800 p-8 rounded-xl border border-gray-700 grid md:grid-cols-2 gap-4 mb-8">
        <input className="bg-gray-700 p-3 rounded" value={form.name || ''} onChange={e => setForm({...form, name: e.target.value})} placeholder="Nome" />
        <input className="bg-gray-700 p-3 rounded" value={form.category || ''} onChange={e => setForm({...form, category: e.target.value})} placeholder="Categoria" />
        <textarea className="col-span-2 bg-gray-700 p-3 rounded" value={form.short_description || ''} onChange={e => setForm({...form, short_description: e.target.value})} placeholder="Descrição curta" />
        <textarea className="col-span-2 bg-gray-700 p-3 rounded" value={form.full_description || ''} onChange={e => setForm({...form, full_description: e.target.value})} placeholder="Descrição completa" />
        <label className="text-sm text-gray-300">Foto</label>
        <input type="file" onChange={(e) => handleUpload(e, 'image_url')} />
        <button type="submit" disabled={loading} className="col-span-2 bg-blue-600 p-3 rounded">{loading ? 'Salvando...' : 'Salvar'}</button>
      </form>
      <div className="grid gap-4">
        {services.map(s => (
          <div key={s.id} className="bg-gray-800 p-4 rounded flex justify-between items-center">
            <span>{s.name}</span>
            <div className='flex gap-2'>
              <button onClick={() => setForm(s)} className="text-blue-400">Editar</button>
              <button onClick={() => deleteService(s.id)} className="text-red-400">Excluir</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
