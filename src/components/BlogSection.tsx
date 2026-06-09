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
    <section id="blog" className="py-20 bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Dicas e informações</h2>
        <p className="text-gray-400 mb-12">Aprenda como proteger sua casa, empresa ou condomínio.</p>
        <div className="grid md:grid-cols-3 gap-8">
          {posts.map(post => (
            <div key={post.id} className="bg-gray-900 border border-gray-800 p-6 rounded-3xl hover:border-blue-600 transition duration-300 transform hover:-translate-y-2 text-left">
              {post.main_image_url && <img src={post.main_image_url} alt={post.title} className="w-full h-48 object-cover rounded-2xl mb-4" />}
              <span className="text-blue-500 font-bold text-sm block mb-2">{post.category || 'Blog'}</span>
              <h3 className="font-bold text-xl text-white mb-2">{post.title}</h3>
              <p className="text-gray-400 mb-6 text-sm">{post.summary}</p>
              <Link to={`/blog/${post.id}`} className="text-blue-500 font-semibold border-b-2 border-blue-500 pb-1">Ler artigo</Link>
           </div>
          ))}
        </div>
      </div>
    </section>
  );
}
