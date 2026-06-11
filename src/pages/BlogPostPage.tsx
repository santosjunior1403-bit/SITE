import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { BlogPost } from '../types';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const defaultPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Como Prevenir Baratas e Formigas em Casa',
    subtitle: 'Passos simples e práticos para manter as pragas longe do seu lar',
    summary: 'Aprenda como pequenas atitudes no dia a dia podem evitar grandes infestações na sua cozinha e residência.',
    category: 'Prevenção',
    main_image_url: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&w=600&q=80',
    content: 'Manter a cozinha de sua residência limpa, vedar frestas sob as portas, cobrir ralos e evitar o acúmulo de lixo ou louça suja são as primeiras linhas de defesa no controle residencial de pragas urbanas. Com estas ações simples, você remove as fontes de abrigo, água e alimento que as pragas necessitam para sobreviver e se multiplicar.',
    active: true,
    author: 'Nexo Dedetizadora',
    published_at: new Date().toISOString(),
    featured: true,
    order: 1
  },
  {
    id: '2',
    title: 'Sinais Silenciosos de Infestação de Cupins',
    subtitle: 'Proteja seus móveis e estruturas de madeira antes que seja tarde',
    summary: 'Os cupins agem em silêncio. Saiba quais são os principais indícios de que seu imóvel está em risco.',
    category: 'Segurança',
    main_image_url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
    content: 'A detecção precoce é o segredo para evitar prejuízos estruturais catastróficos com cupins. Fique atento a resíduos que parecem serragem acumulada perto de rodapés e móveis, caminhos de terra nas paredes ou pequenas asas de insetos perto de janelas após chuvas quentes de verão.',
    active: true,
    author: 'Nexo Dedetizadora',
    published_at: new Date().toISOString(),
    featured: true,
    order: 2
  },
  {
    id: '3',
    title: 'A Importância da Limpeza da Caixa d\'Água',
    subtitle: 'Garanta água limpa e livre de contaminações para sua família',
    summary: 'Limpar a caixa d\'água a cada 6 meses é essencial para evitar bactérias e proliferação do mosquito da dengue.',
    category: 'Saúde',
    main_image_url: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=600&q=80',
    content: 'A água que entra na nossa torneira precisa ser reservada em condições absolutamente higiênicas. O acúmulo de lodo, poeira e matéria orgânica no fundo do reservatório cria um ambiente perfeito para bactérias além de potenciar a entrada de vetores caso a tampa não esteja perfeitamente vedada.',
    active: true,
    author: 'Nexo Dedetizadora',
    published_at: new Date().toISOString(),
    featured: true,
    order: 3
  }
];

export default function BlogPostPage() {
  const { id } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    async function fetchPostAndCompany() {
      if (!supabase) {
        const found = defaultPosts.find(p => p.id === id);
        if (found) {
          setPost(found);
          document.title = `${found.title} | NEXO Dedetizadora`;
        }
        return;
      }

      try {
        const { data: postData, error } = await supabase.from('blog_posts').select('*').eq('id', id).single();
        if (!error && postData) {
          setPost(postData);
          // Fetch company name to display in tab
          const { data: companyData } = await supabase.from('company_settings').select('company_name, name').single();
          const companyName = companyData?.company_name || companyData?.name || 'NEXO Dedetizadora';
          document.title = `${postData.title} | ${companyName}`;
        } else {
          // If error or not found, fall back to default posts
          const found = defaultPosts.find(p => p.id === id);
          if (found) {
            setPost(found);
            document.title = `${found.title} | NEXO Dedetizadora`;
          }
        }
      } catch (e) {
        console.warn("Could not query blog post from Supabase:", e);
        const found = defaultPosts.find(p => p.id === id);
        if (found) {
          setPost(found);
          document.title = `${found.title} | NEXO Dedetizadora`;
        }
      }
    }
    fetchPostAndCompany();
  }, [id]);

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-4">Artigo não encontrado</p>
          <a href="/" className="text-blue-600 hover:underline">Voltar para a página inicial</a>
        </div>
      </div>
    );
  }

  const activeImage = post.main_image_url;

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <Navbar />
      <article className="max-w-4xl mx-auto px-4 py-12">
        {activeImage && <img src={activeImage} alt={post.title} className="w-full h-96 object-cover rounded-xl mb-8" />}
        <h1 className="text-4xl font-bold text-blue-900 mb-4">{post.title}</h1>
        <p className="text-xl text-gray-600 mb-8">{post.subtitle}</p>
        <div className="prose lg:prose-xl text-gray-700 leading-relaxed whitespace-pre-wrap">{post.content}</div>
        <div className="mt-12 bg-blue-50 p-8 rounded-2xl border border-blue-100 text-center">
             <h3 className="font-bold text-xl text-blue-950 mb-4">Está com problemas de pragas? Fale com a NEXO.</h3>
             <a href="https://wa.me/5511999999999" className="bg-[#00C853] hover:bg-[#00a846] transition text-white px-8 py-4 rounded-full font-bold shadow-md hover:shadow-lg inline-block">Chamar no WhatsApp</a>
        </div>
      </article>
      <Footer />
    </div>
  );
}
