import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { BlogPost } from '../types';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

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
    content: "Diferente de outras pragas, os cupins de madeira seca ou subterrâneos destroem as celuloses de dentro para fora, mantendo a camada externa da madeira intacta. Quando o dano se torna visível in um armário ou porta, o prejuízo financeiro já pode ser gigantesco.\n\nIndícios de Infestação:\n- Acúmulo de esferas duras e minúsculas de pó (fezes de cupins de madeira).\n- Caminhos ou túneis avermelhados de terra subindo por rodapés, paredes ou vigas.\n- Presença de siriris ou aleluias (cupins com asas) rodeando lâmpadas à noite.\n\nA descupinização profissional da NEXO utiliza barreira química protetora e injeção de calda cupinicida diretamente nos veios infestados, garantindo a eliminação completa da rainha e proteção duradoura por até 5 anos.",
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
          const { data: companyData } = await supabase.from('company_settings').select('company_name').single();
          const companyName = companyData?.company_name || 'NEXO Dedetizadora';
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
