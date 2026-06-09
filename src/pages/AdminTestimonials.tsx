import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Testimonial } from '../types';
import { uploadImage } from '../lib/storage';

export default function AdminTestimonials() {
  const [data, setData] = useState<Testimonial[]>([]);
  const [form, setForm] = useState<Partial<Testimonial>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchT(); }, []);

  const fetchT = async () => {
    const { data } = await supabase.from('testimonials').select('*');
    if (data) setData(data);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLoading(true);
      const url = await uploadImage(e.target.files[0], 'testimonials');
      setForm(prev => ({...prev, photo_url: url}));
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = form.id 
      ? await supabase.from('testimonials').update(form).eq('id', form.id)
      : await supabase.from('testimonials').insert(form);
    if (error) alert("Erro: " + error.message);
    else { alert("Salvo!"); setForm({}); fetchT(); }
    setLoading(false);
  };

  const deleteT = async (id: string) => {
    if (confirm('Excluir?')) {
      await supabase.from('testimonials').delete().eq('id', id);
      fetchT();
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-8 text-blue-400">Gerenciar Avaliações</h2>
      <form onSubmit={handleSave} className="bg-gray-800 p-8 rounded-xl border border-gray-700 grid gap-4 mb-8">
        <input className="bg-gray-700 p-3 rounded text-white" value={form.client_name || ''} onChange={e => setForm({...form, client_name: e.target.value})} placeholder="Nome" />
        <input className="bg-gray-700 p-3 rounded text-white" value={form.rating || ''} type="number" onChange={e => setForm({...form, rating: Number(e.target.value)})} placeholder="Nota (1-5)" />
        <textarea className="bg-gray-700 p-3 rounded text-white col-span-2" value={form.text || ''} onChange={e => setForm({...form, text: e.target.value})} placeholder="Avaliação" />
        <input className="bg-gray-700 p-3 rounded text-white" value={form.google_review_url || ''} onChange={e => setForm({...form, google_review_url: e.target.value})} placeholder="Link Google" />
        <input type="file" onChange={handleUpload} className="bg-gray-700 p-3 rounded text-white" />
        <button type="submit" disabled={loading} className="bg-blue-600 p-4 rounded text-white font-bold">{loading ? 'Salvando...' : 'Salvar'}</button>
      </form>
      <div className="grid gap-4">
        {data.map(t => (
          <div key={t.id} className="bg-gray-800 p-4 rounded flex justify-between items-center text-white">
            <span>{t.client_name} - {t.rating}★</span>
            <div className='flex gap-2'>
              <button onClick={() => setForm(t)} className="text-blue-400">Editar</button>
              <button onClick={() => deleteT(t.id)} className="text-red-400">Excluir</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
