import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { BlogPost } from '../types';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function BlogPostPage() {
  const { id } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    async function fetchPostAndCompany() {
      const { data: postData } = await supabase.from('blog_posts').select('*').eq('id', id).single();
      if (postData) {
        setPost(postData);
        // Fetch company name to display in tab
        const { data: companyData } = await supabase.from('company_settings').select('company_name, name').single();
        const companyName = companyData?.company_name || companyData?.name || 'NEXO Dedetizadora';
        document.title = `${postData.title} | ${companyName}`;
      }
    }
    fetchPostAndCompany();
  }, [id]);

  if (!post) return <div>Carregando...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <Navbar />
      <article className="max-w-4xl mx-auto px-4 py-12">
        <img src={post.image_url} alt={post.title} className="w-full h-96 object-cover rounded-xl mb-8" />
        <h1 className="text-4xl font-bold text-blue-900 mb-4">{post.title}</h1>
        <p className="text-xl text-gray-600 mb-8">{post.subtitle}</p>
        <div className="prose lg:prose-xl">{post.content}</div>
        <div className="mt-12 bg-blue-50 p-6 rounded-lg text-center">
             <h3 className="font-bold text-lg mb-4">Está com problema de pragas? Fale com a NEXO.</h3>
             <a href="#contato" className="bg-blue-900 text-white px-8 py-3 rounded-full hover:bg-blue-800">Chamar no WhatsApp</a>
        </div>
      </article>
      <Footer />
    </div>
  );
}
