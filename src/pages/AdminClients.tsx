import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Client } from '../types';
import { uploadImage } from '../lib/storage';

export default function AdminClients() {
  const [data, setData] = useState<Client[]>([]);
  const [form, setForm] = useState<Partial<Client>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchC(); }, []);

  const fetchC = async () => {
    const { data } = await supabase.from('clients').select('*');
    if (data) setData(data);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLoading(true);
      const url = await uploadImage(e.target.files[0], 'clients');
      setForm(prev => ({...prev, logo_url: url}));
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = form.id 
      ? await supabase.from('clients').update(form).eq('id', form.id)
      : await supabase.from('clients').insert(form);
      
    if (error) alert("Erro: " + error.message);
    else { alert("Salvo!"); setForm({}); fetchC(); }
    setLoading(false);
  };

  const deleteC = async (id: string) => {
    if (confirm('Excluir?')) {
        await supabase.from('clients').delete().eq('id', id);
        fetchC();
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-8 text-blue-400">Clientes e Parceiros</h2>
      <form onSubmit={handleSave} className="bg-gray-800 p-8 rounded-xl border border-gray-700 grid gap-4 mb-8">
        <input className="bg-gray-700 p-3 rounded text-white" value={form.name || ''} onChange={e => setForm({...form, name: e.target.value})} placeholder="Nome" />
        <select className="bg-gray-700 p-3 rounded text-white" value={form.client_type || 'cliente'} onChange={e => setForm({...form, client_type: e.target.value as any})}>
            <option value="cliente">Cliente</option>
            <option value="parceiro">Parceiro</option>
        </select>
        <input type="file" onChange={handleUpload} className="bg-gray-700 p-3 rounded text-white" />
        <button type="submit" disabled={loading} className="bg-blue-600 p-4 rounded text-white font-bold">{loading ? 'Salvando...' : 'Salvar'}</button>
      </form>
      <div className="grid gap-4">
        {data.map(c => (
          <div key={c.id} className="bg-gray-800 p-4 rounded flex justify-between items-center text-white">
            <span>{c.name} ({c.client_type})</span>
            <div className='flex gap-2'>
              <button onClick={() => setForm(c)} className="text-blue-400">Editar</button>
              <button onClick={() => deleteC(c.id)} className="text-red-400">Excluir</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
