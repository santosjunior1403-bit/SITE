import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { BlogPost } from '../types';

export default function AdminBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [form, setForm] = useState<Partial<BlogPost>>({});

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data } = await supabase.from('blog_posts').select('*');
    if (data) setPosts(data);
  };

  const handleSave = async () => {
    if (form.id) {
      await supabase.from('blog_posts').update(form).eq('id', form.id);
    } else {
      await supabase.from('blog_posts').insert(form);
    }
    setForm({});
    fetchPosts();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Gerenciar Blog</h2>
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold mb-4">{form.id ? 'Editar Post' : 'Novo Post'}</h3>
        <input className="w-full p-2 border mb-2" placeholder="Título" value={form.title || ''} onChange={e => setForm({...form, title: e.target.value})} />
        <textarea className="w-full p-2 border mb-2" placeholder="Conteúdo" value={form.content || ''} onChange={e => setForm({...form, content: e.target.value})} />
        <button onClick={handleSave} className="bg-blue-900 text-white px-4 py-2 rounded">Salvar Post</button>
      </div>
      <div>
        {posts.map(post => (
          <div key={post.id} className="bg-white p-4 mb-2 flex justify-between items-center rounded shadow">
            <span>{post.title}</span>
            <div>
              <button onClick={() => setForm(post)} className="text-blue-600 mr-2">Editar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
