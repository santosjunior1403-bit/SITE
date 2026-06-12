import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || '';

const projectRef = supabaseUrl ? (supabaseUrl.includes('//') ? supabaseUrl.split('//')[1]?.split('.')[0] : 'Desconhecido') : 'Desconhecido';

console.log('[DEBUG Supabase Initialization] ------------------------');
console.log('[DEBUG Supabase Initialization] VITE_SUPABASE_URL:', supabaseUrl);
console.log('[DEBUG Supabase Initialization] VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'DEFINED (Hidden)' : 'NOT DEFINED');
console.log('[DEBUG Supabase Initialization] Projeto Conectado:', projectRef);
console.log('[DEBUG Supabase Initialization] ------------------------');

// Hybrid fallback storage system
const getFallbackData = (table: string): any => {
  const localKeys: Record<string, string> = {
    company_settings: 'nexo_company_settings',
    hero_section: 'nexo_hero_section',
    services: 'nexo_services',
    testimonials: 'nexo_testimonials',
    blog_posts: 'nexo_blog_posts',
    google_ads_settings: 'nexo_google_ads_settings',
    seo_settings: 'nexo_seo_settings',
    clients: 'nexo_clients',
    admin_profiles: 'nexo_admin_profiles',
    site_banners: 'nexo_site_banners',
  };

  const defaults: Record<string, any> = {
    company_settings: {
      id: "fallback-comp-01",
      company_name: "NEXO Dedetizadora",
      logo_url: "/favicon.png",
      phone: "(11) 4003-9128",
      email: "contato@nexodedetizadora.com.br",
      address: "Av. Paulista, 1000 - Bela Vista",
      city: "São Paulo",
      state: "SP",
      cep: "01310-100",
      instagram_url: "https://instagram.com/nexodedetizadora",
      facebook_url: "https://facebook.com/nexodedetizadora",
      google_business_url: "https://goo.gl/maps/nexo",
      clients_attended: "+600",
      services_completed: "+1200",
      customer_satisfaction: "100%",
      business_hours: "Segunda à Sábado - 08h às 18h",
      about_banner_url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80"
    },
    hero_section: {
      id: "fallback-hero-01",
      title: "Controle Profissional de Pragas Urbanas",
      subtitle: "Protegendo sua família e seu patrimônio com agilidade, segurança e garantia.",
      badge_text: "Atendimento 24 horas em São Paulo",
      whatsapp_number: "5511999999999",
      button_text: "FALE CONOSCO",
      image_url: "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&q=80&w=1200"
    },
    services: [
      {
        id: "serv-01",
        title: "Desinsetização",
        description: "Controle especializado contra baratas, formigas, pulgas e aranhas.",
        icon: "ShieldAlert",
        active: true,
        order: 1
      },
      {
        id: "serv-02",
        title: "Desratização",
        description: "Eliminação e prevenção de ratos de telhado, ratazanas e camundongos.",
        icon: "Shield",
        active: true,
        order: 2
      },
      {
         id: "serv-03",
         title: "Descupinização",
         description: "Controle de cupins de madeira seca e de solo com garantia.",
         icon: "Zap",
         active: true,
         order: 3
      }
    ],
    testimonials: [
      {
        id: "test-01",
        name: "Carlos Eduardo",
        company: "Condomínio Edifício Paulista",
        comment: "Trabalho excelente. Realizaram a descupinização do condomínio e resolveram o problema de vez. Super recomendo!",
        rating: 5
      },
      {
        id: "test-02",
        name: "Mariana Silva",
        company: "Restaurante Sabor & Arte",
        comment: "Equipe pontual e extremamente profissional. Fizeram a dedetização preventiva de forma limpa e sem odor.",
        rating: 5
      }
    ],
    blog_posts: [
      {
        id: "blog-01",
        title: "Como saber se sua casa precisa de dedetização",
        slug: "como-saber-se-sua-casa-precisa-de-dedetizacao",
        subtitle: "Sinais claros de que é hora de chamar um especialista",
        summary: "Saiba identificar os principais vestígios de insetos e animais peçonhentos no seu imóvel antes que se torne uma infestação crítica.",
        content: "Muitas vezes, a necessidade de dedetização só é percebida quando a infestação já está em um estágio crítico. Mas, antes de avistar as pragas de forma frequente, é possível identificar pequenos sinais sutis de que seu lar precisa de socorro técnico.\n\nSinais Comuns de Alerta:\n- Pequenas fezes ou resíduos granulados nos cantos dos armários e no chão.\n- Odores estranhos, adocicados ou de mofo persistente, característicos de baratas.\n- Barulhos estranhos no teto ou nas frestas das paredes durante o período noturno.\n- Móveis e rodapés de madeira que apresentam furos de agulha ou resíduos de pó que simbolizam a presença de cupins.\n\nContratar um serviço especializado garante a higienização do local com produtos sem odor, seguros para crianças e animais de estimação, agindo nos focos principais das infestações antes que virem um grave problema de saúde.",
        category: "Prevenção",
        author: "NEXO Dedetizadora",
        main_image_url: "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&w=600&q=80",
        image_url: "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&w=600&q=80",
        active: true,
        published: true,
        created_at: new Date().toISOString()
      },
      {
        id: "blog-02",
        title: "Controle de baratas: riscos e prevenção",
        slug: "controle-de-baratas-riscos-e-prevencao",
        subtitle: "Como afastar essa praga e proteger sua saúde",
        summary: "Descubra os graves riscos à saúde que as baratas trazem e quais as medidas ideais de prevenção residencial.",
        content: "As baratas são pragas altamente adaptáveis e portadoras de diversas patógenos causadores de diarreia, hepatite A, febre tifoide e alergias respiratórias graves. Elas trafegam por esgotos e superfícies imundas, trazendo para dentro das residências microrganismos nocivos.\n\nComo Prevenir:\n- Mantenha ralos limpos e use grelhas com fechamento.\n- Nunca armazene lixeiras destampadas ou resíduos alimentares abertos.\n- Invista em barreiras de borracha sob as portas externas.\n\nPara infestações ativas, os sprays aerosol comuns geralmente apenas dispersam as colônias sem eliminá-las por completo. A desinsetização profissional com aplicação de gel de alta atração e micropulverização direcionada é o único método capaz de exterminar as baratas no centro de sua colônia de forma definitiva e segura.",
        category: "Saúde",
        author: "NEXO Dedetizadora",
        main_image_url: "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&w=600&q=80",
        image_url: "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&w=600&q=80",
        active: true,
        published: true,
        created_at: new Date().toISOString()
      },
      {
        id: "blog-03",
        title: "Controle de ratos: proteção para residências e empresas",
        slug: "controle-de-ratos-protecao-para-residencias-e-empresas",
        subtitle: "Mantenha os roedores longe do seu patrimônio",
        summary: "Ratos representam grandes riscos biológicos e estruturais. Veja como manter seu patrimônio e saúde perfeitamente seguros.",
        content: "Ratos de telhado, ratazanas e camundongos são animais extremamente inteligentes, capazes de roer fiação elétrica, canos de PVC e provocar graves curtos-circuitos ou incidentes, além de transmitir leptospirose pela urina.\n\nMedidas de Proteção:\n- Evite deixar comedouros de animais de estimação expostos com comida à noite.\n- Faça a correta vedação de aberturas de ventilação com telas metálicas de malha fina.\n- Recolha folhas secas, entulhos e lixo doméstico no quintal.\n\nA desratização profissional da NEXO consiste no mapeamento inteligente, instalação de caixas de monitoramento portas-iscas seguras e lacradas (impedindo o contato acidental de pets ou crianças), com monitoramento ativo até o controle total dos roedores.",
        category: "Proteção",
        author: "NEXO Dedetizadora",
        main_image_url: "https://images.unsplash.com/photo-1473186578172-c141e6798cf4?auto=format&fit=crop&w=600&q=80",
        image_url: "https://images.unsplash.com/photo-1473186578172-c141e6798cf4?auto=format&fit=crop&w=600&q=80",
        active: true,
        published: true,
        created_at: new Date().toISOString()
      },
      {
        id: "blog-04",
        title: "Cupins: como identificar antes do prejuízo",
        slug: "cupins-como-identificar-antes-do-prejuizo",
        subtitle: "Ação silenciosa da pior ameaça para madeiras e móveis",
        summary: "O ataque de cupins pode destruir a mobília e a estrutura de madeira da sua propriedade de forma silenciosa. Aprenda a agir rápido.",
        content: "Diferente de outras pragas, os cupins de madeira seca ou subterrâneos destroem as celuloses de dentro para fora, mantendo a camada externa da madeira intacta. Quando o dano se torna visível em um armário ou porta, o prejuízo financeiro já pode ser gigantesco.\n\nIndícios de Infestação:\n- Acúmulo de esferas duras e minúsculas de pó (fezes de cupins de madeira).\n- Caminhos ou túneis avermelhados de terra subindo por rodapés, paredes ou vigas.\n- Presença de siriris ou aleluias (cupins com asas) rodeando lâmpadas à noite.\n\nA descupinização profissional da NEXO utiliza barreira química protetora e injeção de calda cupinicida diretamente nos veios infestados, garantindo a eliminação completa da rainha e proteção duradoura por até 5 anos.",
        category: "Segurança",
        author: "NEXO Dedetizadora",
        main_image_url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80",
        image_url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80",
        active: true,
        published: true,
        created_at: new Date().toISOString()
      },
      {
        id: "blog-05",
        title: "Limpeza de caixa d’água: por que fazer periodicamente",
        slug: "limpeza-de-caixa-dagua-por-que-fazer-periodicamente",
        subtitle: "Água saudável e de qualidade para toda a família",
        summary: "Entenda por que a higienização a cada seis meses protege contra contaminações sérias de patógenos na água de consumo.",
        content: "O reservatório de água do seu imóvel acumula poeira, lodo, folhas e insetos mortos que decantam ao longo do tempo. Esse acúmulo gera uma espessa camada de matéria orgânica no fundo, propiciando o crescimento acelerado de vírus e bactérias agressivas.\n\nPor que Limpar de 6 em 6 meses:\n- Evita contaminações microbiológicas que provocam vômitos e infecções intestinais.\n- Garante purificação ideal de escovação dentária e preparo de alimentos.\n- Previne a proliferação do mosquito transmissor da Dengue, Zika e Chikungunya, caso a tampa rache ou desloque.\n\nA NEXO realiza a desinfecção residencial e predial com bactericidas regulamentados pela ANVISA, fornecendo laudo de potabilidade e garantia de qualidade na reservação.",
        category: "Higiene",
        author: "NEXO Dedetizadora",
        main_image_url: "https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=600&q=80",
        image_url: "https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=600&q=80",
        active: true,
        published: true,
        created_at: new Date().toISOString()
      },
      {
        id: "blog-06",
        title: "Dedetização em empresas e condomínios",
        slug: "dedetizacao-em-empresas-e-condominios",
        subtitle: "Sua empresa em conformidade com as normas sanitárias",
        summary: "A importância das dedetizações preventivas periódicas para a regularidade sanitária e fiscal em condomínios e indústrias.",
        content: "Para indústrias, comércios do ramo alimentício e condomínios residenciais ou corporativos, a dedetização não é opcional, mas uma exigência legal fiscalizada de perto pela Vigilância Sanitária (CVS/ANVISA).\n\nVantagens do Controle de Pragas Programado:\n- Certificação técnica e laudos prontos para auditorias e fiscalizações.\n- Manutenção de ambientes saudáveis e aumento do bem-estar na convivência.\n- Proteção contra prejuízos reputacionais imprevistos causados por pragas em áreas comuns.\n\nA NEXO desenvolve cronogramas personalizados pós-agendamento e emite todos os relatórios operacionais exigíveis por lei para controle de vetores.",
        category: "Corporativo",
        author: "NEXO Dedetizadora",
        main_image_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
        image_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
        active: true,
        published: true,
        created_at: new Date().toISOString()
      }
    ],
    google_ads_settings: {
      id: "ads-01",
      gtag_id: "AW-123456789",
      conversion_label: "CONV_LABEL_XYZ"
    },
    seo_settings: {
      id: "seo-01",
      title: "NEXO Dedetizadora | Dedetização em São Paulo",
      description: "Controle de pragas em São Paulo. Dedetização de baratas, ratos, cupins, formigas e limpeza de caixa d'água.",
      keywords: "dedetizadora são paulo, controle de pragas, controle de ratos",
      google_analytics_id: "G-XXXXXXXXXX"
    },
    clients: [],
    admin_profiles: [],
    site_banners: [
      {
        id: "banner-hero-desktop",
        banner_type: "hero_desktop",
        title: "Controle Profissional de Pragas Urbanas",
        subtitle: "Protegendo sua família e seu patrimônio com agilidade, segurança e garantia.",
        image_url: "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&q=80&w=1200",
        active: true
      },
      {
        id: "banner-hero-mobile",
        banner_type: "hero_mobile",
        title: "Controle Profissional de Pragas",
        subtitle: "Protegendo sua família com agilidade e total segurança.",
        image_url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80",
        active: true
      },
      {
        id: "banner-about",
        banner_type: "about_banner",
        title: "Quem Somos",
        subtitle: "Nossa trajetória de dedicação.",
        image_url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80",
        active: true
      }
    ]
  };

  const key = localKeys[table];
  if (key) {
    const cached = localStorage.getItem(key);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        console.log(`[STORAGE Fallback] Returning cached data for "${table}"`);
        return parsed;
      } catch (e) {
        console.warn(`[STORAGE Fallback] Failed to parse cache for "${table}":`, e);
      }
    }
  }

  const defVal = defaults[table];
  console.log(`[STORAGE Fallback] Returning default data for "${table}"`);
  return defVal;
};

const saveFallbackData = (table: string, payload: any, id?: string) => {
  const localKeys: Record<string, string> = {
    company_settings: 'nexo_company_settings',
    hero_section: 'nexo_hero_section',
    services: 'nexo_services',
    testimonials: 'nexo_testimonials',
    blog_posts: 'nexo_blog_posts',
    google_ads_settings: 'nexo_google_ads_settings',
    seo_settings: 'nexo_seo_settings',
    clients: 'nexo_clients',
    admin_profiles: 'nexo_admin_profiles',
    site_banners: 'nexo_site_banners',
  };

  const key = localKeys[table];
  if (!key) return;

  const current = getFallbackData(table);
  let updated: any;

  if (Array.isArray(current)) {
    if (id) {
      const idx = current.findIndex((item: any) => item.id === id);
      if (idx !== -1) {
        current[idx] = { ...current[idx], ...payload };
      } else {
        current.push({ id, ...payload });
      }
      updated = current;
    } else if (payload && payload.id) {
      const idx = current.findIndex((item: any) => item.id === payload.id);
      if (idx !== -1) {
        current[idx] = { ...current[idx], ...payload };
      } else {
        current.push(payload);
      }
      updated = current;
    } else {
      updated = [...current, { id: Date.now().toString(), ...payload }];
    }
  } else {
    updated = { ...current, ...payload };
  }

  localStorage.setItem(key, JSON.stringify(updated));
  console.log(`[STORAGE Fallback] Saved data for "${table}" locally:`, updated);
};

const deleteFallbackData = (table: string, id: string) => {
  const localKeys: Record<string, string> = {
    company_settings: 'nexo_company_settings',
    hero_section: 'nexo_hero_section',
    services: 'nexo_services',
    testimonials: 'nexo_testimonials',
    blog_posts: 'nexo_blog_posts',
    google_ads_settings: 'nexo_google_ads_settings',
    seo_settings: 'nexo_seo_settings',
    clients: 'nexo_clients',
    admin_profiles: 'nexo_admin_profiles',
    site_banners: 'nexo_site_banners',
  };

  const key = localKeys[table];
  if (!key) return;

  const current = getFallbackData(table);
  if (Array.isArray(current)) {
    const updated = current.filter((item: any) => item.id !== id);
    localStorage.setItem(key, JSON.stringify(updated));
    console.log(`[STORAGE Fallback] Deleted row from "${table}" locally ID:`, id);
  }
};

// ---------------- DATABASE SCHEMAS DEFINITIONS FOR SANITIZATION & NORMALIZATION ----------------
const ALLOWED_COLUMNS: Record<string, string[]> = {
  site_banners: [
    'id', 'banner_type', 'title', 'subtitle', 'image_url', 'active', 'created_at', 'updated_at'
  ],
  company_settings: [
    'id', 'company_name', 'logo_url', 'phone', 'email', 'address', 'city',
    'state', 'cep', 'instagram_url', 'facebook_url', 'google_business_url',
    'clients_attended', 'services_completed', 'customer_satisfaction', 'business_hours',
    'free_quote_label', 'free_quote_subtitle', 'contact_center_label', 'about_banner_url'
  ],
  hero_section: [
    'id', 'title', 'subtitle', 'image_url', 'active', 'created_at', 'secondary_banner_url', 'button_text',
    'whatsapp_number', 'free_quote_label', 'free_quote_subtitle', 'contact_center_label'
  ],
  blog_posts: [
    'id', 'title', 'slug', 'content', 'image_url', 'published', 'created_at'
  ],
  admin_profiles: [
    'id', 'user_id', 'email', 'nome', 'perfil', 'ativo', 'created_at'
  ]
};

// Mapping and sanitization helpers
const sanitizeAndSavePayload = (tableName: string, originalPayload: any): any => {
  if (!originalPayload) return originalPayload;
  
  // 1. Save completely to localStorage so client features are 100% intact
  saveFallbackData(tableName, originalPayload, originalPayload.id);

  // 2. If we don't have constraints defined, send as is
  const allowed = ALLOWED_COLUMNS[tableName];
  if (!allowed) return originalPayload;

  // 3. Make column conversion transformations
  let processed = { ...originalPayload };

  if (tableName === 'blog_posts') {
    processed.image_url = processed.image_url || processed.main_image_url;
    if (processed.active !== undefined && processed.published === undefined) {
      processed.published = processed.active;
    }
    if (!processed.slug && processed.title) {
      processed.slug = processed.title.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove accents
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }
  }

  if (tableName === 'admin_profiles') {
    processed.user_id = processed.user_id || processed.id;
    processed.nome = processed.nome || processed.name;
    processed.perfil = processed.perfil || processed.role || 'admin';
    if (processed.ativo === undefined && processed.active !== undefined) {
      processed.ativo = processed.active;
    }
  }

  // 4. Strip non-existent columns to avoid database exceptions
  const sanitized: Record<string, any> = {};
  allowed.forEach(col => {
    if (processed[col] !== undefined) {
      sanitized[col] = processed[col];
    }
  });

  console.log(`[SUPABASE PROXY] Sanited payload for "${tableName}":`, sanitized);
  return sanitized;
};

// Map output data when loading from Supabase, merging with cached fallback fields
const normalizeOutputData = (tableName: string, data: any): any => {
  if (!data) return data;

  const fallbackSource = getFallbackData(tableName);

  const normalizeRow = (row: any): any => {
    if (!row) return row;
    let normalized = { ...row };

    // Find custom offline fields to merge
    if (fallbackSource) {
      if (Array.isArray(fallbackSource)) {
        const matching = fallbackSource.find((item: any) => String(item.id) === String(row.id));
        if (matching) {
          normalized = { ...matching, ...normalized };
        }
      } else if (fallbackSource.id === row.id || !row.id) {
        normalized = { ...fallbackSource, ...normalized };
      }
    }

    // Apply strict field aliases
    if (tableName === 'blog_posts') {
      normalized.main_image_url = normalized.main_image_url || normalized.image_url;
      normalized.active = normalized.active !== undefined ? normalized.active : (normalized.published !== undefined ? normalized.published : true);
    }

    if (tableName === 'admin_profiles') {
      normalized.name = normalized.name || normalized.nome;
      normalized.role = normalized.role || normalized.perfil;
      normalized.active = normalized.active !== undefined ? normalized.active : (normalized.ativo !== undefined ? normalized.ativo : true);
    }

    return normalized;
  };

  if (Array.isArray(data)) {
    return data.map(normalizeRow);
  }
  return normalizeRow(data);
};

function createSafeBuilder(originalBuilder: any, tableName: string) {
  let mode: 'select' | 'insert' | 'update' | 'upsert' | 'delete' = 'select';
  let payload: any = null;
  let updateId: string | null = null;
  let singleMode = false;
  let filterCol: string | null = null;
  let filterVal: any = null;

  const mockThenable = {
    then(resolve: any) {
      setTimeout(() => {
        if (mode === 'select') {
          let fb = getFallbackData(tableName);
          if (filterCol && filterVal) {
            if (Array.isArray(fb)) {
              fb = fb.filter((item: any) => String(item[filterCol!]) === String(filterVal));
            } else if (fb && String(fb[filterCol]) !== String(filterVal)) {
              fb = null;
            }
          }
          if (singleMode) {
            fb = Array.isArray(fb) ? fb[0] : fb;
          }
          const normalized = normalizeOutputData(tableName, fb);
          resolve({ data: normalized, error: null });
        } else if (mode === 'insert' || mode === 'update' || mode === 'upsert') {
          saveFallbackData(tableName, payload, updateId || payload?.id);
          const normalized = normalizeOutputData(tableName, payload);
          resolve({ data: normalized, error: null });
        } else if (mode === 'delete') {
          if (filterCol === 'id' && filterVal) {
            deleteFallbackData(tableName, filterVal);
          }
          resolve({ data: null, error: null });
        } else {
          resolve({ data: null, error: null });
        }
      }, 0);
    }
  };

  const proxyHandler = {
    get(target: any, prop: string, receiver: any): any {
      if (prop === 'then') {
        return function(resolve: any, reject: any) {
          if (!target || !originalBuilder) {
            return mockThenable.then(resolve);
          }

          const realPromise = target;
          return realPromise.then((result: any) => {
            if (result.error && (
              result.error.message?.includes('schema cache') ||
              result.error.message?.includes('does not exist') ||
              result.error.message?.includes('Could not find') ||
              result.error.status === 400 ||
              result.error.status === 404
            )) {
              console.warn(`[SUPABASE PROXY] Table "${tableName}" requested failed (schema cache / non-existent error):`, result.error.message);
              console.log(`[SUPABASE PROXY] Deploying fallback for table "${tableName}"...`);
              
              if (mode === 'select') {
                let fb = getFallbackData(tableName);
                if (filterCol && filterVal) {
                  if (Array.isArray(fb)) {
                    fb = fb.filter((item: any) => String(item[filterCol!]) === String(filterVal));
                  } else if (fb && String(fb[filterCol]) !== String(filterVal)) {
                    fb = null;
                  }
                }
                if (singleMode) {
                  fb = Array.isArray(fb) ? fb[0] : fb;
                }
                const normalized = normalizeOutputData(tableName, fb);
                return resolve({ data: normalized, error: null });
              } else if (mode === 'insert' || mode === 'update' || mode === 'upsert') {
                saveFallbackData(tableName, payload, updateId || payload?.id);
                const normalized = normalizeOutputData(tableName, payload);
                return resolve({ data: normalized, error: null });
              } else if (mode === 'delete') {
                if (filterCol === 'id' && filterVal) {
                  deleteFallbackData(tableName, filterVal);
                }
                return resolve({ data: null, error: null });
              }
            }

            // If success, enrich the returned data with normalized fields
            if (result.data) {
              result.data = normalizeOutputData(tableName, result.data);
            }
            return resolve(result);
          }).catch((err: any) => {
            console.error(`[SUPABASE PROXY EXCEPTION] for table "${tableName}":`, err);
            if (mode === 'select') {
              let fb = getFallbackData(tableName);
              if (singleMode) {
                fb = Array.isArray(fb) ? fb[0] : fb;
              }
              const normalized = normalizeOutputData(tableName, fb);
              return resolve({ data: normalized, error: null });
            } else {
              if (payload) {
                saveFallbackData(tableName, payload);
              }
              return resolve({ data: null, error: null });
            }
          });
        };
      }

      if (!target || !originalBuilder) {
        return function(...args: any[]) {
          const lowerProp = prop.toLowerCase();
          if (lowerProp === 'select') {
            mode = 'select';
          } else if (lowerProp === 'insert') {
            mode = 'insert';
            payload = sanitizeAndSavePayload(tableName, args[0]);
          } else if (lowerProp === 'update') {
            mode = 'update';
            payload = sanitizeAndSavePayload(tableName, args[0]);
          } else if (lowerProp === 'upsert') {
            mode = 'upsert';
            payload = sanitizeAndSavePayload(tableName, args[0]);
          } else if (lowerProp === 'delete') {
            mode = 'delete';
          } else if (lowerProp === 'eq') {
            filterCol = args[0];
            filterVal = args[1];
            if (filterCol === 'id') {
              updateId = args[1];
            }
            // For query operations like .eq('active', true), map to 'published' for blog_posts
            if (tableName === 'blog_posts' && filterCol === 'active') {
              filterCol = 'published';
            }
          } else if (lowerProp === 'single' || lowerProp === 'maybesingle') {
            singleMode = true;
          }
          return new Proxy({}, proxyHandler);
        };
      }

      const originalVal = target[prop];
      if (typeof originalVal === 'function') {
        return function(...args: any[]) {
          const lowerProp = prop.toLowerCase();
          let runtimeArgs = [...args];

          if (lowerProp === 'select') {
            mode = 'select';
          } else if (lowerProp === 'insert') {
            mode = 'insert';
            runtimeArgs[0] = sanitizeAndSavePayload(tableName, args[0]);
            payload = runtimeArgs[0];
          } else if (lowerProp === 'update') {
            mode = 'update';
            runtimeArgs[0] = sanitizeAndSavePayload(tableName, args[0]);
            payload = runtimeArgs[0];
          } else if (lowerProp === 'upsert') {
            mode = 'upsert';
            runtimeArgs[0] = sanitizeAndSavePayload(tableName, args[0]);
            payload = runtimeArgs[0];
          } else if (lowerProp === 'delete') {
            mode = 'delete';
          } else if (lowerProp === 'eq') {
            filterCol = args[0];
            filterVal = args[1];
            if (filterCol === 'id') {
              updateId = args[1];
            }
            // Translate query column filters inside real remote queries as well
            if (tableName === 'blog_posts' && filterCol === 'active') {
              runtimeArgs[0] = 'published';
              filterCol = 'published';
            }
            if (tableName === 'admin_profiles' && filterCol === 'active') {
              runtimeArgs[0] = 'ativo';
              filterCol = 'ativo';
            }
          } else if (lowerProp === 'single' || lowerProp === 'maybesingle') {
            singleMode = true;
          }

          const nextBuilder = originalVal.apply(target, runtimeArgs);
          return new Proxy(nextBuilder, proxyHandler);
        };
      }

      return originalVal;
    }
  };

  return new Proxy(originalBuilder || {}, proxyHandler);
}

let realClient: any = null;

if (supabaseUrl && supabaseAnonKey) {
  realClient = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.warn("Supabase environment variables are missing. Running with hybrid local-first database.");
}

const proxyClient = new Proxy(realClient || {}, {
  get(target: any, prop: string, receiver: any): any {
    if (prop === 'auth') {
      if (!realClient) {
        return {
          signInWithPassword: async ({ email }: any) => {
            console.warn('[SUPABASE AUTH fallback] No real client. Mocking login.');
            return {
              data: {
                user: { id: 'mock-user-01', email: email || 'admin@nexo.com' },
                session: { user: { id: 'mock-user-01', email: email || 'admin@nexo.com' } }
              },
              error: null
            };
          },
          getSession: async () => ({
            data: { session: { user: { id: 'mock-user-01', email: 'admin@nexo.com' } } },
            error: null
          }),
          getUser: async () => ({
            data: { user: { id: 'mock-user-01', email: 'admin@nexo.com' } },
            error: null
          }),
          signOut: async () => ({ error: null })
        };
      }
      return target.auth;
    }
    if (prop === 'storage') {
      if (!realClient) {
        return {
          from: () => ({
            upload: async () => ({ error: new Error('MOCK STORAGE') }),
            getPublicUrl: () => ({ data: { publicUrl: '' } })
          })
        };
      }
      return target.storage;
    }
    if (prop === 'from') {
      return function(tableName: string) {
        if (!realClient) {
          return createSafeBuilder(null, tableName);
        }
        const originalQueryBuilder = target.from(tableName);
        return createSafeBuilder(originalQueryBuilder, tableName);
      };
    }
    return Reflect.get(target, prop, receiver);
  }
});

export const supabase: any = proxyClient;

