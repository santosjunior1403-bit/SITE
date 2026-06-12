import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Service } from '../types';
import { uploadImage } from '../lib/storage';
import { Bug, Droplet, Shield, ShieldAlert, Sparkles, AlertOctagon, Plus, Edit, Trash, Eye, EyeOff, ArrowUp, ArrowDown, RefreshCw } from 'lucide-react';

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [form, setForm] = useState<Partial<Service>>({
    name: '',
    category: '',
    short_description: '',
    full_description: '',
    image_url: 'bug',
    icon_url: '🪳',
    active: true,
    order: 1,
    whatsapp_message: ''
  });
  const [loading, setLoading] = useState(false);
  const [uploadingField, setUploadingField] = useState<'image_url' | null>(null);

  useEffect(() => { 
    fetchServices(); 
  }, []);

  const fetchServices = async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase.from('services').select('*').order('order', { ascending: true });
      if (!error && data) {
        setServices(data);
      }
    } catch (err) {
      console.error("Error fetching services:", err);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'image_url') => {
    if (e.target.files && e.target.files[0]) {
      setUploadingField(field);
      try {
        const url = await uploadImage(e.target.files[0], 'services');
        setForm(prev => ({ ...prev, [field]: url }));
      } catch (err: any) {
        alert("Erro no upload da imagem: " + (err.message || err));
      } finally {
        setUploadingField(null);
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.category) {
      alert("Por favor, preencha o Nome e a Categoria.");
      return;
    }

    setLoading(true);

    const payload: any = {
      name: form.name || '',
      category: form.category || '',
      short_description: form.short_description || form.full_description || '',
      full_description: form.full_description || form.short_description || '',
      image_url: form.image_url || 'bug',
      icon_url: form.icon_url || '🪳',
      active: form.active !== false,
      order: Number(form.order) || 1,
      whatsapp_message: form.whatsapp_message || `Olá NEXO! Gostaria de um orçamento para o serviço de *${form.name}*.`
    };

    if (form.id) {
      payload.id = form.id;
    }

    try {
      const { error } = await supabase.from('services').upsert(payload);
      if (error) {
        alert("Erro ao salvar serviço: " + error.message);
      } else {
        alert("Serviço salvo com sucesso!");
        resetForm();
        fetchServices();
      }
    } catch (err: any) {
      alert("Exceção ao salvar: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const editService = (service: Service) => {
    setForm({
      ...service,
      order: service.order || 1,
      active: service.active !== false
    });
    // Scroll smoothly to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteService = async (id: string) => {
    if (!supabase) return;
    if (confirm('Tem certeza que deseja excluir permanentemente este serviço?')) {
      try {
        const { error } = await supabase.from('services').delete().eq('id', id);
        if (error) {
          alert("Erro ao excluir do Supabase: " + error.message);
        } else {
          fetchServices();
        }
      } catch (err: any) {
        alert("Exceção ao excluir: " + err.message);
      }
    }
  };

  const resetForm = () => {
    setForm({
      name: '',
      category: '',
      short_description: '',
      full_description: '',
      image_url: 'bug',
      icon_url: '🪳',
      active: true,
      order: services.length + 1,
      whatsapp_message: ''
    });
  };

  const handleMoveOrder = async (service: Service, direction: number) => {
    if (!supabase) return;
    const currentIndex = services.findIndex(s => s.id === service.id);
    if (currentIndex === -1) return;
    const targetIndex = currentIndex + direction;
    if (targetIndex < 0 || targetIndex >= services.length) return;

    const copy = [...services];
    // Keep reference or assign default sequence if order values are equal or undefined
    const originalOrder = copy[currentIndex].order || (currentIndex + 1);
    const targetOrder = copy[targetIndex].order || (targetIndex + 1);

    // Make sure we have separate values
    const finalOriginalOrder = originalOrder === targetOrder ? originalOrder + direction : targetOrder;
    const finalTargetOrder = originalOrder;

    copy[currentIndex].order = finalOriginalOrder;
    copy[targetIndex].order = finalTargetOrder;

    try {
      setLoading(true);
      await Promise.all([
        supabase.from('services').upsert(copy[currentIndex]),
        supabase.from('services').upsert(copy[targetIndex])
      ]);
      fetchServices();
    } catch (e: any) {
      alert("Erro ao reordenar: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const renderIconPreview = (name: string) => {
    const iconClass = "w-10 h-10 text-[#00C853] shrink-0";
    if (!name) return <Bug className={iconClass} />;

    const isEmoji = /\p{Emoji}/u.test(name);
    if (isEmoji && name.length <= 8) {
      return (
        <span className="text-3xl select-none h-10 w-10 flex items-center justify-center">
          {name}
        </span>
      );
    }

    switch (name.toLowerCase()) {
      case 'bug': return <Bug className={iconClass} />;
      case 'droplet': return <Droplet className={iconClass} />;
      case 'shield': return <Shield className={iconClass} />;
      case 'shieldalert': return <ShieldAlert className={iconClass} />;
      case 'sparkles': return <Sparkles className={iconClass} />;
      case 'alertoctagon': return <AlertOctagon className={iconClass} />;
      default: return <Bug className={iconClass} />;
    }
  };

  return (
    <div className="p-6 font-sans text-white">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-[#00C853] tracking-tight">Gerenciar Serviços</h2>
          <p className="text-gray-400 text-sm mt-1">Crie, edite fotos, defina ícones/emojis e mude a ordem dos serviços exibidos no site.</p>
        </div>
        {form.id && (
          <button 
            onClick={resetForm}
            className="flex items-center gap-1.5 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <Plus size={16} /> Novo Serviço
          </button>
        )}
      </div>

      {/* Modern Form */}
      <form onSubmit={handleSave} className="bg-gray-800 p-8 rounded-2xl border border-gray-700/80 grid md:grid-cols-2 gap-6 mb-12 shadow-xl">
        <h3 className="text-lg font-bold text-gray-200 md:col-span-2 border-b border-gray-700/50 pb-3 flex items-center gap-2">
          {form.id ? <Edit size={18} className="text-[#00C853]" /> : <Plus size={18} className="text-[#00C853]" />}
          {form.id ? 'Editar Serviço Existente' : 'Cadastrar Novo Serviço'}
        </h3>

        {/* Name & Category */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-gray-300 uppercase tracking-wide">Nome do Serviço</label>
          <input 
            type="text"
            className="bg-gray-700 p-3.5 rounded-xl text-white font-medium focus:border-[#00C853] outline-none transition-colors border border-transparent text-sm"
            value={form.name || ''} 
            onChange={e => setForm({...form, name: e.target.value})} 
            placeholder="Ex: Controle de Baratas, Limpeza de Caixa d'Água"
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-gray-300 uppercase tracking-wide">Categoria</label>
          <input 
            type="text"
            className="bg-gray-700 p-3.5 rounded-xl text-white font-medium focus:border-[#00C853] outline-none transition-colors border border-transparent text-sm"
            value={form.category || ''} 
            onChange={e => setForm({...form, category: e.target.value})} 
            placeholder="Ex: Dedetização, Desinsetização, Limpeza"
            required
          />
        </div>

        {/* Short & Full Descriptions */}
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="text-xs font-bold text-gray-300 uppercase tracking-wide">Descrição Curta (Exibida no Card)</label>
          <textarea 
            rows={2}
            className="bg-gray-700 p-3.5 rounded-xl text-white font-medium focus:border-[#00C853] outline-none transition-colors border border-transparent text-sm resize-none"
            value={form.short_description || ''} 
            onChange={e => setForm({...form, short_description: e.target.value})} 
            placeholder="Uma frase marcante resumindo os benefícios principais do serviço..."
          />
        </div>

        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="text-xs font-bold text-gray-300 uppercase tracking-wide">Descrição Completa</label>
          <textarea 
            rows={4}
            className="bg-gray-700 p-3.5 rounded-xl text-white font-medium focus:border-[#00C853] outline-none transition-colors border border-transparent text-sm resize-none"
            value={form.full_description || ''} 
            onChange={e => setForm({...form, full_description: e.target.value})} 
            placeholder="Forneça detalhes adicionais sobre como funciona a aplicação técnica..."
          />
        </div>

        {/* Custom Icon/Emoji Field & Display Order */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-gray-300 uppercase tracking-wide">Ícone ou Emoji do Serviço</label>
          <input 
            type="text"
            className="bg-gray-700 p-3.5 rounded-xl text-white font-medium focus:border-[#00C853] outline-none transition-colors border border-transparent text-sm"
            value={form.icon_url || ''} 
            onChange={e => setForm({...form, icon_url: e.target.value})} 
            placeholder="Ex: 🪳, 🐀, 🐜, 🪵, 🦟, 🚰 ou bug, droplet, shield..."
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-gray-300 uppercase tracking-wide font-sans">Texto Customizado do WhatsApp (Ao Clicar no Site)</label>
          <input 
            type="text"
            className="bg-gray-700 p-3.5 rounded-xl text-white font-medium focus:border-[#00C853] outline-none transition-colors border border-transparent text-sm"
            value={form.whatsapp_message || ''} 
            onChange={e => setForm({...form, whatsapp_message: e.target.value})} 
            placeholder="Ex: Olá NEXO! Quero agendar dedetização contra baratas."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wide">Ordem de Exibição</label>
            <input 
              type="number"
              min={1}
              className="bg-gray-700 p-3.5 rounded-xl text-white font-bold focus:border-[#00C853] outline-none transition-colors border border-transparent text-sm"
              value={form.order || 1} 
              onChange={e => setForm({...form, order: Number(e.target.value)})} 
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wide">Status</label>
            <label className="flex items-center gap-2 bg-gray-700/50 p-3 rounded-xl cursor-pointer hover:bg-gray-700/80 transition text-sm font-semibold select-none mt-1 h-12 border border-transparent focus-within:border-[#00C853]/60">
              <input 
                type="checkbox" 
                checked={form.active !== false} 
                onChange={e => setForm({...form, active: e.target.checked})} 
                className="w-5 h-5 accent-[#00C853] cursor-pointer"
              />
              <span>Ativo no Site</span>
            </label>
          </div>
        </div>

        {/* Photo Upload segment */}
        <div className="md:col-span-2 border-t border-gray-700/50 pt-6 mt-2 grid md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wide">Foto do Serviço (Upload para o site)</label>
            <p className="text-xs text-gray-400">Envie um arquivo ou cole um endereço de imagem da web para ilustrar o card.</p>
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => handleUpload(e, 'image_url')} 
              className="bg-gray-700 p-3 rounded-xl text-white text-xs file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#00C853] file:text-white hover:file:bg-[#00a846] cursor-pointer w-full" 
            />
            
            <div className="flex flex-col gap-1.5 mt-2">
              <span className="text-xs text-gray-400">Ou cole uma URL direta da internet:</span>
              <input 
                type="text"
                className="bg-gray-700 p-2 rounded text-xs outline-none border border-gray-600 focus:border-[#00C853]"
                value={(!form.image_url || ['bug', 'droplet', 'shield', 'shieldalert', 'sparkles', 'alertoctagon'].includes(form.image_url)) ? '' : form.image_url}
                onChange={e => setForm({...form, image_url: e.target.value || 'bug'})}
                placeholder="Ex http://exemplo.com/imagem.jpg"
              />
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-4 bg-gray-900/60 rounded-2xl border border-gray-700/70 min-h-36">
            {uploadingField === 'image_url' ? (
              <div className="flex flex-col items-center gap-2">
                <RefreshCw className="animate-spin text-[#00C853] w-8 h-8" />
                <span className="text-xs text-gray-300">Enviando imagem...</span>
              </div>
            ) : form.image_url && (form.image_url.startsWith('http') || form.image_url.startsWith('/')) ? (
              <div className="w-full relative rounded-xl overflow-hidden aspect-video max-h-32">
                <img src={form.image_url} alt="Pre-visualização" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <button 
                  type="button"
                  onClick={() => setForm({...form, image_url: 'bug', icon_url: '🪳'})} 
                  className="absolute top-2 right-2 bg-red-600 hover:bg-red-500 rounded px-1.5 py-0.5 text-[10px] font-bold text-white transition cursor-pointer"
                >
                  Remover Foto
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                {renderIconPreview(form.icon_url || form.image_url || 'bug')}
                <span className="text-xs text-gray-400">Usando Ícone/Emoji: {form.icon_url || form.image_url || 'bug'}</span>
              </div>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="md:col-span-2 border-t border-gray-700/50 pt-4 mt-2 flex justify-end gap-3">
          {form.id && (
            <button 
              type="button" 
              onClick={resetForm}
              className="bg-gray-700 hover:bg-gray-600 px-6 py-3.5 rounded-xl font-bold transition duration-200 cursor-pointer text-sm font-sans"
            >
              Cancelar Edição
            </button>
          )}
          <button 
            type="submit" 
            disabled={loading} 
            className="bg-[#00C853] hover:bg-[#00a846] px-8 py-3.5 rounded-xl font-bold transition duration-200 cursor-pointer hover:shadow-lg text-sm text-white uppercase tracking-wider font-sans"
          >
            {loading ? 'Salvando...' : form.id ? 'Salvar Alterações' : 'Cadastrar Serviço'}
          </button>
        </div>
      </form>

      {/* Services List / Cards */}
      <h3 className="text-xl font-bold mb-6 text-gray-200 border-b border-gray-700/50 pb-2">Serviços Atuais ({services.length})</h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.length === 0 ? (
          <div className="col-span-full py-12 text-center text-gray-500 font-medium font-sans">
            Nenhum serviço cadastrado no momento. Preencha o formulário acima para adicionar!
          </div>
        ) : (
          services.map((s, idx) => (
            <div key={s.id} className="bg-gray-800 p-6 rounded-2xl border border-gray-700 flex flex-col justify-between hover:border-gray-600 transition shadow-md">
              <div>
                <div className="flex justify-between items-start gap-4 mb-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#00C853] bg-[#00C853]/10 px-2 py-0.5 rounded-full">
                      {s.category}
                    </span>
                    <h4 className="font-bold text-lg mt-1 text-white">{s.name}</h4>
                  </div>
                  <div className="text-xs font-bold text-gray-400">
                    Ordem: #{s.order || (idx + 1)}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 mb-4">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Resumo:</span>
                  <p className="text-gray-300 text-xs line-clamp-2 leading-relaxed">
                    {s.short_description || s.full_description}
                  </p>
                </div>

                {/* Cover or Icon Preview */}
                <div className="h-32 bg-gray-900 rounded-xl overflow-hidden mb-4 flex items-center justify-center border border-gray-700/50 relative">
                  {s.image_url && (s.image_url.startsWith('http') || s.image_url.startsWith('/')) ? (
                    <>
                      <img src={s.image_url} alt={s.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      {s.icon_url && (
                        <div className="absolute top-2 left-2 w-8 h-8 rounded-full bg-[#081A3A]/90 border border-white/10 flex items-center justify-center text-lg shadow">
                          {renderIconPreview(s.icon_url)}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-1.5">
                      {renderIconPreview(s.icon_url || s.image_url)}
                      <span className="text-[10px] text-gray-500">Ícone: {s.icon_url || s.image_url}</span>
                    </div>
                  )}
                  
                  {/* Status overlay badge */}
                  <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-[#081A3A]/80 backdrop-blur px-2.5 py-1 rounded-full text-[10px] font-semibold">
                    {s.active !== false ? (
                      <>
                        <Eye size={10} className="text-[#00C853]" />
                        <span className="text-gray-200">Visível</span>
                      </>
                    ) : (
                      <>
                        <EyeOff size={10} className="text-red-400" />
                        <span className="text-gray-400">Oculto</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-gray-700/50 pt-4 mt-2">
                {/* Positional Reordering tools */}
                <div className="flex items-center gap-1">
                  <button 
                    type="button"
                    onClick={() => handleMoveOrder(s, -1)}
                    disabled={idx === 0}
                    className="flex items-center justify-center p-2 rounded bg-gray-700 hover:bg-gray-600 hover:text-[#00C853] disabled:opacity-30 text-gray-300 transition cursor-pointer"
                    title="Mover para cima"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleMoveOrder(s, 1)}
                    disabled={idx === services.length - 1}
                    className="flex items-center justify-center p-2 rounded bg-gray-700 hover:bg-gray-600 hover:text-[#00C853] disabled:opacity-30 text-gray-300 transition cursor-pointer"
                    title="Mover para baixo"
                  >
                    <ArrowDown size={14} />
                  </button>
                </div>

                <div className="flex gap-1.5">
                  <button 
                    type="button"
                    onClick={() => editService(s)}
                    className="flex items-center gap-1 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer font-sans"
                  >
                    <Edit size={12} /> Editar
                  </button>
                  <button 
                    type="button"
                    onClick={() => deleteService(s.id)}
                    className="flex items-center gap-1 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer font-sans"
                  >
                    <Trash size={12} /> Excluir
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
