import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { HeroSection } from '../types';
import { uploadImage } from '../lib/storage';
import { Monitor, Smartphone, BookOpen, Upload, Trash2, Save, RefreshCw } from 'lucide-react';

export default function AdminHome() {
  const [data, setData] = useState<HeroSection | null>(null);
  const [form, setForm] = useState<Partial<HeroSection>>({});
  const [loading, setLoading] = useState(false);
  
  // Custom states for site_banners
  const [banners, setBanners] = useState<{
    hero_desktop: any;
    hero_mobile: any;
    about_banner: any;
  }>({
    hero_desktop: {
      id: 'banner-hero-desktop',
      banner_type: 'hero_desktop',
      image_url: 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&q=80&w=1200',
      active: true
    },
    hero_mobile: {
      id: 'banner-hero-mobile',
      banner_type: 'hero_mobile',
      image_url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
      active: true
    },
    about_banner: {
      id: 'banner-about',
      banner_type: 'about_banner',
      image_url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
      active: true
    },
  });

  const [uploadingField, setUploadingField] = useState<string | null>(null);

  useEffect(() => {
    fetchHero();
    fetchBanners();
  }, []);

  const fetchHero = async () => {
    const { data } = await supabase.from('hero_section').select('*').single();
    if (data) {
      setData(data);
      setForm(data);
    }
  };

  const fetchBanners = async () => {
    try {
      const { data: bList, error } = await supabase.from('site_banners').select('*');
      if (bList && Array.isArray(bList)) {
        const desktop = bList.find((b: any) => b.banner_type === 'hero_desktop') || {
          id: 'banner-hero-desktop',
          banner_type: 'hero_desktop',
          image_url: 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&q=80&w=1200',
          active: true
        };
        const mobile = bList.find((b: any) => b.banner_type === 'hero_mobile') || {
          id: 'banner-hero-mobile',
          banner_type: 'hero_mobile',
          image_url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
          active: true
        };
        const about = bList.find((b: any) => b.banner_type === 'about_banner') || {
          id: 'banner-about',
          banner_type: 'about_banner',
          image_url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
          active: true
        };

        setBanners({
          hero_desktop: desktop,
          hero_mobile: mobile,
          about_banner: about,
        });
      }
    } catch (err) {
      console.error("Error loading banners:", err);
    }
  };

  const handleSaveHeroInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      title: form.title,
      subtitle: form.subtitle,
      whatsapp_number: form.whatsapp_number,
      button_text: form.button_text || 'FALE CONOSCO',
    };

    const { error } = data 
      ? await supabase.from('hero_section').update(payload).eq('id', data.id)
      : await supabase.from('hero_section').insert(payload);
      
    if (error) {
      alert("Erro ao salvar: " + error.message);
    } else {
      alert("Informações textuais salvas com sucesso!");
      fetchHero();
    }
    setLoading(false);
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'hero_desktop' | 'hero_mobile' | 'about_banner') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadingField(type);
      try {
        const folder = type === 'hero_desktop' ? 'hero' : type === 'hero_mobile' ? 'mobile' : 'about';
        const url = await uploadImage(file, folder);
        
        setBanners(prev => ({
          ...prev,
          [type]: {
            ...prev[type],
            image_url: url
          }
        }));
      } catch (err: any) {
        console.error("Upload error:", err);
        alert(err.message || "Erro no upload da imagem.");
      } finally {
        setUploadingField(null);
      }
    }
  };

  const handleSaveBanner = async (type: 'hero_desktop' | 'hero_mobile' | 'about_banner') => {
    setLoading(true);
    const banner = banners[type];
    
    const payload = {
      id: banner.id || `banner-${type}`,
      banner_type: type,
      image_url: banner.image_url || '',
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      active: banner.active !== false,
      updated_at: new Date().toISOString()
    };

    try {
      const { data: existing } = await supabase.from('site_banners').select('id').eq('banner_type', type).maybeSingle();
      
      let res;
      if (existing) {
        res = await supabase.from('site_banners').update(payload).eq('id', existing.id);
      } else {
        res = await supabase.from('site_banners').insert(payload);
      }

      if (res.error) {
        alert("Erro ao salvar banner: " + res.error.message);
      } else {
        alert("Banner salvo com sucesso");
        fetchBanners();
      }
    } catch (err: any) {
      alert("Erro ao salvar banner: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBanner = async (type: 'hero_desktop' | 'hero_mobile' | 'about_banner') => {
    if (confirm("Deseja realmente remover este banner e restaurar o padrão?")) {
      setLoading(true);
      try {
        const banner = banners[type];
        const payload = {
          id: banner.id || `banner-${type}`,
          banner_type: type,
          image_url: "", // Clear URL to trigger default fallback
          updated_at: new Date().toISOString()
        };

        const { data: existing } = await supabase.from('site_banners').select('id').eq('banner_type', type).maybeSingle();
        
        let res;
        if (existing) {
          res = await supabase.from('site_banners').update(payload).eq('id', existing.id);
        } else {
          res = await supabase.from('site_banners').insert(payload);
        }

        if (res.error) {
          alert("Erro ao remover banner: " + res.error.message);
        } else {
          alert("Banner removido com sucesso");
          fetchBanners();
        }
      } catch (err: any) {
        alert("Erro ao remover banner: " + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-extrabold mb-8 text-[#081A3A] tracking-tight">Configurações da Página Inicial</h2>
      
      {/* Informações de Texto do Hero */}
      <div className="bg-gray-800 p-6 md:p-8 rounded-2xl border border-gray-700/60 shadow-lg mb-10">
        <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider text-[#00C853] flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#00C853]" /> Textos e Chamada de Ação (Hero)
        </h3>
        
        <form onSubmit={handleSaveHeroInfo} className="grid md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Título Principal</label>
            <input 
              className="bg-gray-900 border border-gray-700/70 p-3 rounded-xl text-white outline-none focus:border-[#00C853] transition-all text-sm font-medium" 
              value={form.title || ''} 
              onChange={e => setForm({...form, title: e.target.value})} 
              placeholder="Ex: PROTEÇÃO QUE VOCÊ PODE CONFIAR" 
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Subtítulo / Descrição</label>
            <input 
              className="bg-gray-900 border border-gray-700/70 p-3 rounded-xl text-white outline-none focus:border-[#00C853] transition-all text-sm font-medium" 
              value={form.subtitle || ''} 
              onChange={e => setForm({...form, subtitle: e.target.value})} 
              placeholder="Descrição dos serviços" 
            />
          </div>
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider">WhatsApp de Contato (DDD + Número, ex: 551140039128)</label>
            <input 
              className="bg-gray-900 border border-gray-700/70 p-3 rounded-xl text-white outline-none focus:border-[#00C853] transition-all text-sm font-medium leading-relaxed" 
              value={form.whatsapp_number || ''} 
              onChange={e => setForm({...form, whatsapp_number: e.target.value})} 
              placeholder="55..." 
            />
          </div>
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Texto do Botão Principal</label>
            <input 
              className="bg-gray-900 border border-gray-700/70 p-3 rounded-xl text-white outline-none focus:border-[#00C853] transition-all text-sm font-medium" 
              value={form.button_text || ''} 
              onChange={e => setForm({...form, button_text: e.target.value})} 
              placeholder="Chamar no WhatsApp" 
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading} 
            className="md:col-span-2 mt-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Save className="w-5 h-5" /> {loading ? 'Salvando...' : 'Salvar Textos do Hero'}
          </button>
        </form>
      </div>

      {/* Gerenciamento de Banners */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-6 uppercase tracking-wider text-[#081A3A] flex items-center gap-2 border-b-2 border-gray-100 pb-2">
          Gerenciamento Geral de Banners (Website)
        </h3>
        
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Card Banner Desktop */}
          <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                  <Monitor className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-gray-900 text-base">Banner Principal Desktop</h4>
              </div>
              <p className="text-xs text-gray-500 mb-4 leading-relaxed">Exibido em computadores e tablets de tela grande. Use imagens de alta resolução horizontais (ex: 1920x1080).</p>
              
              {/* Visualizador */}
              <div className="mb-4 bg-gray-100 rounded-xl aspect-[16/9] overflow-hidden border border-gray-200 relative flex items-center justify-center">
                {banners.hero_desktop?.image_url ? (
                  <img src={banners.hero_desktop.image_url} alt="Desktop Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs text-gray-400">Nenhum banner personalizado ativo</span>
                )}
                {uploadingField === 'hero_desktop' && (
                  <div className="absolute inset-x-0 inset-y-0 bg-[#081A3A]/70 flex items-center justify-center text-white text-xs font-semibold gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-[#00C853]" /> Fazendo upload...
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-2">
              <label className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-xs font-bold uppercase transition duration-350 cursor-pointer text-center">
                <Upload className="w-4 h-4 text-gray-500" /> Escolher Outra Imagem
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleBannerUpload(e, 'hero_desktop')} />
              </label>

              <div className="grid grid-cols-2 gap-2.5">
                <button 
                  onClick={() => handleSaveBanner('hero_desktop')}
                  className="bg-[#00C853] hover:bg-[#00a846] text-white py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition duration-350 cursor-pointer"
                >
                  <Save className="w-4 h-4" /> Salvar
                </button>
                <button 
                  onClick={() => handleRemoveBanner('hero_desktop')}
                  className="bg-red-50 hover:bg-red-100 text-red-600 py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition duration-350 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" /> Restaurar
                </button>
              </div>
            </div>
          </div>

          {/* Card Banner Mobile */}
          <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="p-2 bg-purple-50 rounded-xl text-purple-600">
                  <Smartphone className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-gray-900 text-base">Banner Principal Mobile</h4>
              </div>
              <p className="text-xs text-gray-500 mb-4 leading-relaxed">Exibido em smartphones e telas muito estreitas. Use imagens verticais ou quadradas equilibradas (ex: 800x1200).</p>
              
              {/* Visualizador */}
              <div className="mb-4 bg-gray-100 rounded-xl aspect-[16/9] overflow-hidden border border-gray-200 relative flex items-center justify-center">
                {banners.hero_mobile?.image_url ? (
                  <img src={banners.hero_mobile.image_url} alt="Mobile Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs text-gray-400">Nenhum banner personalizado ativo</span>
                )}
                {uploadingField === 'hero_mobile' && (
                  <div className="absolute inset-x-0 inset-y-0 bg-[#081A3A]/70 flex items-center justify-center text-white text-xs font-semibold gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-[#00C853]" /> Fazendo upload...
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-2">
              <label className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-xs font-bold uppercase transition duration-350 cursor-pointer text-center">
                <Upload className="w-4 h-4 text-gray-500" /> Escolher Outra Imagem
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleBannerUpload(e, 'hero_mobile')} />
              </label>

              <div className="grid grid-cols-2 gap-2.5">
                <button 
                  onClick={() => handleSaveBanner('hero_mobile')}
                  className="bg-[#00C853] hover:bg-[#00a846] text-white py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition duration-350 cursor-pointer"
                >
                  <Save className="w-4 h-4" /> Salvar
                </button>
                <button 
                  onClick={() => handleRemoveBanner('hero_mobile')}
                  className="bg-red-50 hover:bg-red-100 text-red-600 py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition duration-350 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" /> Restaurar
                </button>
              </div>
            </div>
          </div>

          {/* Card Banner Quem Somos */}
          <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="p-2 bg-teal-50 rounded-xl text-teal-600">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-gray-900 text-base">Banner "Quem Somos"</h4>
              </div>
              <p className="text-xs text-gray-500 mb-4 leading-relaxed">Exibido na seção "Quem Somos". Proporção recomendada de 4:3 (ex: técnicos, veículos ou instalações).</p>
              
              {/* Visualizador */}
              <div className="mb-4 bg-gray-100 rounded-xl aspect-[16/9] overflow-hidden border border-gray-200 relative flex items-center justify-center">
                {banners.about_banner?.image_url ? (
                  <img src={banners.about_banner.image_url} alt="About Us Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs text-gray-400">Nenhum banner personalizado ativo</span>
                )}
                {uploadingField === 'about_banner' && (
                  <div className="absolute inset-x-0 inset-y-0 bg-[#081A3A]/70 flex items-center justify-center text-white text-xs font-semibold gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-[#00C853]" /> Fazendo upload...
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-2">
              <label className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-xs font-bold uppercase transition duration-350 cursor-pointer text-center">
                <Upload className="w-4 h-4 text-gray-500" /> Escolher Outra Imagem
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleBannerUpload(e, 'about_banner')} />
              </label>

              <div className="grid grid-cols-2 gap-2.5">
                <button 
                  onClick={() => handleSaveBanner('about_banner')}
                  className="bg-[#00C853] hover:bg-[#00a846] text-white py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition duration-350 cursor-pointer"
                >
                  <Save className="w-4 h-4" /> Salvar
                </button>
                <button 
                  onClick={() => handleRemoveBanner('about_banner')}
                  className="bg-red-50 hover:bg-red-100 text-red-600 py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition duration-350 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" /> Restaurar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
