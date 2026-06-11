import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { BlogPost } from '../types';

const defaultPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Como Prevenir Baratas e Formigas em Casa',
    subtitle: 'Passos simples e práticos para manter as pragas longe do seu lar',
    summary: 'Aprenda como pequenas atitudes no dia a dia podem evitar grandes infestações na sua cozinha e residência.',
    category: 'Prevenção',
    main_image_url: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&w=600&q=80',
    content: 'Manter a cozinha de sua residência limpa, vedar frestas sob as portas, cobrir ralos e evitar o acúmulo de louça suja são as primeiras linhas de defesa no controle residencial de pragas urbanas. Com estas ações simples, você remove as fontes de abrigo, água e alimento que as pragas necessitam para sobreviver e se multiplicar.',
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
    content: 'A detecção precoce é o segredo para evitar prejuízos estruturais catastróas com cupins. Fique atento a resíduos que parecem serragem acumulada perto de rodapés e móveis, caminhos de terra nas paredes ou pequenas asas de insetos perto de janelas após chuvas quentes de verão.',
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

export default function BlogSection() {
  const [posts, setPosts] = useState<BlogPost[]>(defaultPosts);

  useEffect(() => {
    async function fetchPosts() {
        if (!supabase) {
          setPosts(defaultPosts);
          return;
        }
        try {
          const { data, error } = await supabase.from('blog_posts').select('*').eq('active', true).limit(3);
          if (error) {
            console.warn("Could not retrieve blog posts, loading local defaults.", error);
            setPosts(defaultPosts);
          } else if (data && data.length > 0) {
            setPosts(data);
          } else {
            setPosts(defaultPosts);
          }
        } catch (e) {
          console.warn("Error fetching blog posts from Supabase:", e);
          setPosts(defaultPosts);
        }
    }
    fetchPosts();
  }, []);

  return (
    <section id="blog" className="py-20 bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Dicas e informações</h2>
        <p className="text-gray-400 mb-12">Aprenda como proteger sua casa, empresa ou condomínio.</p>
        <div className="grid md:grid-cols-3 gap-8">
          {posts.map(post => {
            const imgUrl = post.main_image_url;
            return (
              <div key={post.id} className="bg-gray-900 border border-gray-800 p-6 rounded-3xl hover:border-[#00C853] transition duration-300 transform hover:-translate-y-2 text-left flex flex-col justify-between">
                <div>
                  {imgUrl && <img src={imgUrl} alt={post.title} className="w-full h-48 object-cover rounded-2xl mb-4" />}
                  <span className="text-blue-500 font-bold text-sm block mb-2">{post.category || 'Blog'}</span>
                  <h3 className="font-bold text-xl text-white mb-2 leading-snug">{post.title}</h3>
                  <p className="text-gray-400 mb-6 text-sm line-clamp-3">{post.summary}</p>
                </div>
                <div>
                  <Link to={`/blog/${post.id}`} className="text-[#00C853] font-semibold border-b-2 border-[#00C853] pb-1 transition-colors hover:text-white hover:border-white">Ler artigo</Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
