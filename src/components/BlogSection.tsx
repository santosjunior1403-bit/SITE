import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { BlogPost } from '../types';

const defaultPosts: BlogPost[] = [
  {
    id: 'blog-01',
    title: 'Como saber se sua casa precisa de dedetização',
    slug: 'como-saber-se-sua-casa-precisa-de-dedetizacao',
    subtitle: 'Sinais claros de que é hora de chamar um especialista',
    summary: 'Saiba identificar os principais vestígios de insetos e animais peçonhentos no seu imóvel antes que se torne uma infestação crítica.',
    category: 'Prevenção',
    main_image_url: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&w=600&q=80',
    content: "Muitas vezes, a necessidade de dedetização só é percebida quando a infestação já está em um estágio crítico. Mas, antes de avistar as pragas de forma frequente, é possível identificar pequenos sinais sutis de que seu lar precisa de socorro técnico.\n\nSinais Comuns de Alerta:\n- Pequenas fezes ou resíduos granulados nos cantos dos armários e no chão.\n- Odores estranhos, adocicados ou de mofo persistente, característicos de baratas.\n- Barulhos estranhos no teto ou nas frestas das paredes durante o período noturno.\n- Móveis e rodapés de madeira que apresentam furos de agulha ou resíduos de pó que simbolizam a presença de cupins.\n\nContratar um serviço especializado garante a higienização do local com produtos sem odor, seguros para crianças e animais de estimação, agindo nos focos principais das infestações antes que virem um grave problema de saúde.",
    active: true,
    author: 'NEXO Dedetizadora',
    published_at: new Date().toISOString(),
    featured: true,
    order: 1
  },
  {
    id: 'blog-02',
    title: 'Controle de baratas: riscos e prevenção',
    slug: 'controle-de-baratas-riscos-e-prevencao',
    subtitle: 'Como afastar essa praga e proteger sua saúde',
    summary: 'Descubra os graves riscos à saúde que as baratas trazem e quais as medidas ideais de prevenção residencial.',
    category: 'Saúde',
    main_image_url: 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&w=600&q=80',
    content: "As baratas são pragas altamente adaptáveis e portadoras de diversas patógenos causadores de diarreia, hepatite A, febre tifoide e alergias respiratórias graves. Elas trafegam por esgotos e superfícies imundas, trazendo para dentro das residências microrganismos nocivos.\n\nComo Prevenir:\n- Mantenha ralos limpos e use grelhas com fechamento.\n- Nunca armazene lixeiras destampadas ou resíduos alimentares abertos.\n- Invista em barreiras de borracha sob as portas externas.\n\nPara infestações ativas, os sprays aerosol comuns geralmente apenas dispersam as colônias sem eliminá-las por completo. A desinsetização profissional com aplicação de gel de alta atração e micropulverização direcionada é o único método capaz de exterminar as baratas no centro de sua colônia de forma definitiva e segura.",
    active: true,
    author: 'NEXO Dedetizadora',
    published_at: new Date().toISOString(),
    featured: true,
    order: 2
  },
  {
    id: 'blog-03',
    title: 'Controle de ratos: proteção para residências e empresas',
    slug: 'controle-de-ratos-protecao-para-residencias-e-empresas',
    subtitle: 'Mantenha os roedores longe do seu patrimônio',
    summary: 'Ratos representam grandes riscos biológicos e estruturais. Veja como manter seu patrimônio e saúde perfeitamente seguros.',
    category: 'Proteção',
    main_image_url: 'https://images.unsplash.com/photo-1473186578172-c141e6798cf4?auto=format&fit=crop&w=600&q=80',
    content: "Ratos de telhado, ratazanas e camundongos são animais extremamente inteligentes, capazes de roer fiação elétrica, canos de PVC e provocar graves curtos-circuitos ou incidentes, além de transmitir leptospirose pela urina.\n\nMedidas de Proteção:\n- Evite deixar comedouros de animais de estimação expostos com comida à noite.\n- Faça a correta vedação de aberturas de ventilação com telas metálicas de malha fina.\n- Recolha folhas secas, entulhos e lixo doméstico no quintal.\n\nA desratização profissional da NEXO consiste no mapeamento inteligente, instalação de caixas de monitoramento portas-iscas seguras e lacradas (impedindo o contato acidental de pets ou crianças), com monitoramento ativo até o controle total dos roedores.",
    active: true,
    author: 'NEXO Dedetizadora',
    published_at: new Date().toISOString(),
    featured: true,
    order: 3
  },
  {
    id: 'blog-04',
    title: 'Cupins: como identificar antes do prejuízo',
    slug: 'cupins-como-identificar-antes-do-prejuizo',
    subtitle: 'Ação silenciosa da pior ameaça para madeiras e móveis',
    summary: 'O ataque de cupins pode destruir a mobília e a estrutura de madeira da sua propriedade de forma silenciosa. Aprenda a agir rápido.',
    category: 'Segurança',
    main_image_url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
    content: "Diferente de outras pragas, os cupins de madeira seca ou subterrâneos destroem as celuloses de dentro para fora, mantendo a camada externa da madeira intacta. Quando o dano se torna visível em um armário ou porta, o prejuízo financeiro já pode ser gigantesco.\n\nIndícios de Infestação:\n- Acúmulo de esferas duras e minúsculas de pó (fezes de cupins de madeira).\n- Caminhos ou túneis avermelhados de terra subindo por rodapés, paredes ou vigas.\n- Presença de siriris ou aleluias (cupins com asas) rodeando lâmpadas à noite.\n\nA descupinização profissional da NEXO utiliza barreira química protetora e injeção de calda cupinicida diretamente nos veios infestados, garantindo a eliminação completa da rainha e proteção duradoura por até 5 anos.",
    active: true,
    author: 'NEXO Dedetizadora',
    published_at: new Date().toISOString(),
    featured: true,
    order: 4
  },
  {
    id: 'blog-05',
    title: 'Limpeza de caixa d’água: por que fazer periodicamente',
    slug: 'limpeza-de-caixa-dagua-por-que-fazer-periodicamente',
    subtitle: 'Água saudável e de qualidade para toda a família',
    summary: 'Entenda por que a higienização a cada seis meses protege contra contaminações sérias de patógenos na água de consumo.',
    category: 'Higiene',
    main_image_url: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=600&q=80',
    content: "O reservatório de água do seu imóvel acumula poeira, lodo, folhas e insetos mortos que decantam ao longo do tempo. Esse acúmulo gera uma espessa camada de matéria orgânica no fundo, propiciando o crescimento acelerado de vírus e bactérias agressivas.\n\nPor que Limpar de 6 em 6 meses:\n- Evita contaminações microbiológicas que provocam vômitos e infecções intestinais.\n- Garante purificação ideal de escovação dentária e preparo de alimentos.\n- Previne a proliferação do mosquito transmissor da Dengue, Zika e Chikungunya, caso a tampa rache ou desloque.\n\nA NEXO realiza a desinfecção residencial e predial com bactericidas regulamentados pela ANVISA, fornecendo laudo de potabilidade e garantia de qualidade na reservação.",
    active: true,
    author: 'NEXO Dedetizadora',
    published_at: new Date().toISOString(),
    featured: true,
    order: 5
  },
  {
    id: 'blog-06',
    title: 'Dedetização em empresas e condomínios',
    slug: 'dedetizacao-em-empresas-e-condominios',
    subtitle: 'Sua empresa em conformidade com as normas sanitárias',
    summary: 'A importância das dedetizações preventivas periódicas para a regularidade sanitária e fiscal em condomínios e indústrias.',
    category: 'Corporativo',
    main_image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
    content: "Para indústrias, comércios do ramo alimentício e condomínios residenciais ou corporativos, a dedetização não é opcional, mas uma exigência legal fiscalizada de perto pela Vigilância Sanitária (CVS/ANVISA).\n\nVantagens do Controle de Pragas Programado:\n- Certificação técnica e laudos prontos para auditorias e fiscalizações.\n- Manutenção de ambientes saudáveis e aumento do bem-estar na convivência.\n- Proteção contra prejuízos reputacionais imprevistos causados por pragas em áreas comuns.\n- A NEXO desenvolve cronogramas personalizados pós-agendamento e emite todos os relatórios operacionais exigíveis por lei para controle de vetores.",
    active: true,
    author: 'NEXO Dedetizadora',
    published_at: new Date().toISOString(),
    featured: true,
    order: 6
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
          const { data, error } = await supabase.from('blog_posts').select('*').eq('active', true).limit(6);
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
            const imgUrl = post.main_image_url || post.image_url;
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
