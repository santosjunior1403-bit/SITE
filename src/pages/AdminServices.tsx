import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Service } from '../types';

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [form, setForm] = useState<Partial<Service>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchServices(); }, []);

  const fetchServices = async () => {
    const { data } = await supabase.from('services').select('*').order('order');
    if (data) setServices(data);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = form.id 
      ? await supabase.from('services').update(form).eq('id', form.id)
      : await supabase.from('services').insert(form);
      
    if (error) {
      alert("Erro ao salvar: " + error.message);
    } else {
      alert("Salvo com sucesso!");
      setForm({});
      fetchServices();
    }
    setLoading(false);
  };

  const deleteService = async (id: string) => {
    if(!confirm("Tem certeza que deseja excluir?")) return;
    await supabase.from('services').delete().eq('id', id);
    alert("Excluído com sucesso!");
    fetchServices();
  };

  return (
    <div className="text-white p-6">
      <h2 className="text-3xl font-bold mb-8 text-blue-400">Gerenciar Serviços</h2>
      <form onSubmit={handleSave} className="bg-gray-800 p-8 rounded-xl shadow-xl mb-8 border border-gray-700">
        <input className="w-full p-3 bg-gray-700 border border-gray-600 rounded mb-4 text-white placeholder-gray-400" placeholder="Nome do serviço" value={form.name || ''} onChange={e => setForm({...form, name: e.target.value})} />
        <textarea className="w-full p-3 bg-gray-700 border border-gray-600 rounded mb-4 text-white placeholder-gray-400" placeholder="Descrição curta" value={form.description || ''} onChange={e => setForm({...form, description: e.target.value})} />
        <textarea className="w-full p-3 bg-gray-700 border border-gray-600 rounded mb-4 text-white placeholder-gray-400" placeholder="Descrição completa" value={form.full_description || ''} onChange={e => setForm({...form, full_description: e.target.value})} />
        <input className="w-full p-3 bg-gray-700 border border-gray-600 rounded mb-4 text-white placeholder-gray-400" placeholder="URL da imagem" value={form.image_url || ''} onChange={e => setForm({...form, image_url: e.target.value})} />
        
        <div className="flex items-center gap-4 mb-4">
            <label className="flex items-center gap-2">
                <input type="checkbox" checked={!!form.active} onChange={e => setForm({...form, active: e.target.checked})} /> Ativo
            </label>
        </div>
        
        <button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-500 transition">{loading ? 'Salvando...' : (form.id ? 'Atualizar' : 'Cadastrar')}</button>
        {form.id && <button type="button" onClick={() => setForm({})} className="ml-4 text-gray-400 hover:text-white">Cancelar</button>}
      </form>
      
      <div className="grid gap-4">
        {services.map(s => (
          <div key={s.id} className="bg-gray-800 p-6 flex justify-between items-center rounded-lg border border-gray-700">
            <div>
                <h3 className="font-bold text-xl text-blue-100">{s.name}</h3>
                <span className={`text-sm ${s.active ? 'text-green-400' : 'text-red-400'}`}>{s.active ? 'Ativo' : 'Inativo'}</span>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setForm(s)} className="text-blue-400 hover:text-blue-300">Editar</button>
              <button onClick={() => deleteService(s.id)} className="text-red-400 hover:text-red-300">Excluir</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
