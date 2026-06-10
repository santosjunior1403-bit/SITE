import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { BlogPost } from '../types';
import { uploadImage } from '../lib/storage';

export default function AdminBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [form, setForm] = useState<Partial<BlogPost>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchPosts(); }, []);

  const fetchPosts = async () => {
    const { data } = await supabase.from('blog_posts').select('*');
    if (data) setPosts(data);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLoading(true);
      const url = await uploadImage(e.target.files[0], 'blog');
      setForm(prev => ({...prev, main_image_url: url}));
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = form.id 
      ? await supabase.from('blog_posts').update(form).eq('id', form.id)
      : await supabase.from('blog_posts').insert(form);
    if (error) alert("Erro: " + error.message);
    else { alert("Salvo com sucesso!"); setForm({}); fetchPosts(); }
    setLoading(false);
  };

  const deletePost = async (id: string) => {
    if (confirm('Excluir post?')) {
      await supabase.from('blog_posts').delete().eq('id', id);
      fetchPosts();
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-8 text-blue-400">Gerenciar Blog</h2>
      <form onSubmit={handleSave} className="bg-gray-800 p-8 rounded-xl border border-gray-700 grid gap-4 mb-8">
        <input className="bg-gray-700 p-3 rounded text-white" value={form.title || ''} onChange={e => setForm({...form, title: e.target.value})} placeholder="Título" />
        <input className="bg-gray-700 p-3 rounded text-white" value={form.subtitle || ''} onChange={e => setForm({...form, subtitle: e.target.value})} placeholder="Subtítulo" />
        <textarea className="bg-gray-700 p-3 rounded text-white col-span-2" value={form.summary || ''} onChange={e => setForm({...form, summary: e.target.value})} placeholder="Resumo" />
        <textarea className="bg-gray-700 p-3 rounded text-white col-span-2 h-40" value={form.content || ''} onChange={e => setForm({...form, content: e.target.value})} placeholder="Conteúdo" />
        <input type="file" onChange={handleUpload} className="bg-gray-700 p-3 rounded text-white" />
        <button type="submit" disabled={loading} className="bg-blue-600 p-4 rounded text-white font-bold">{loading ? 'Salvando...' : 'Salvar Post'}</button>
      </form>
      <div className="grid gap-4">
        {posts.map(post => (
          <div key={post.id} className="bg-gray-800 p-4 rounded flex justify-between items-center text-white border border-gray-700">
            <span>{post.title}</span>
            <div className='flex gap-2'>
              <button onClick={() => setForm(post)} className="text-blue-400">Editar</button>
              <button onClick={() => deletePost(post.id)} className="text-red-400">Excluir</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
