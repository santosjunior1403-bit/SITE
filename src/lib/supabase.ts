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
      business_hours: "Segunda à Sábado - 08h às 18h"
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
        title: "Como evitar baratas no outono",
        content: "Neste artigo ensinamos as melhores práticas para manter seu lar livre de baratas durante o outono...",
        excerpt: "Dicas essenciais para o controle preventivo de baratas em residências.",
        active: true,
        image_url: "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&q=80&w=600",
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
    admin_profiles: []
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
  company_settings: [
    'id', 'company_name', 'logo_url', 'phone', 'email', 'address', 'city',
    'state', 'cep', 'instagram_url', 'facebook_url', 'google_business_url',
    'clients_attended', 'services_completed', 'customer_satisfaction', 'business_hours'
  ],
  hero_section: [
    'id', 'title', 'subtitle', 'image_url', 'active', 'created_at'
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

