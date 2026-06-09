import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { BlogPost } from '../types';

export default function BlogSection() {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    async function fetchPosts() {
      const { data } = await supabase.from('blog_posts').select('*').eq('active', true).limit(3);
      if (data) setPosts(data);
    }
    fetchPosts();
  }, []);

  return (
    <section id="blog" className="py-20 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-blue-900 mb-4">Dicas e informações</h2>
        <p className="text-gray-600 mb-12">Aprenda como proteger sua casa, empresa ou condomínio.</p>
        <div className="grid md:grid-cols-3 gap-8">
          {posts.map(post => (
            <div key={post.id} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 text-left">
             <img src={post.image_url} alt={post.title} className="w-full h-48 object-cover rounded mb-4" />
             <h3 className="font-bold text-lg text-blue-900">{post.title}</h3>
             <p className="text-gray-600 mt-2 text-sm">{post.subtitle}</p>
             <Link to={`/blog/${post.id}`} className="mt-4 text-blue-600 font-semibold block">Ler mais</Link>
          </div>
          ))}
        </div>
      </div>
    </section>
  );
}
