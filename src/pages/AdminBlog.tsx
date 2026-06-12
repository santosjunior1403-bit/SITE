import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { BlogPost } from '../types';
import { uploadImage } from '../lib/storage';
import { Plus, Pencil, Trash2, Globe, EyeOff, Search, FileText, Image as ImageIcon, Sparkles, X } from 'lucide-react';

export default function AdminBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState<Partial<BlogPost>>({
    title: '',
    slug: '',
    subtitle: '',
    summary: '',
    content: '',
    main_image_url: '',
    category: 'Geral',
    active: true,
  });
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('blog_posts').select('*');
      if (error) {
        console.warn("Could not retrieve posts from DB, loading falling back state");
      }
      if (data && data.length > 0) {
        setPosts(data.sort((a, b) => b.id.localeCompare(a.id)));
      } else {
        // Fetch default fallback posts if any
        const localData = localStorage.getItem('supabase_fallback_blog_posts');
        if (localData) {
          try {
            setPosts(JSON.parse(localData));
          } catch {
            setPosts([]);
          }
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const sanitizeSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // remove accents
      .replace(/[^a-z0-9\s-]/g, '') // remove special chars
      .replace(/\s+/g, '-') // replace spaces with hyphens
      .replace(/-+/g, '-'); // trim double hyphens
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setForm(prev => {
      const updated: Partial<BlogPost> = { ...prev, title: val };
      if (!isEditing) {
        updated.slug = sanitizeSlug(val);
      }
      return updated;
    });
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLoading(true);
      try {
        const url = await uploadImage(e.target.files[0], 'blog');
        if (url) {
          setForm(prev => ({ ...prev, main_image_url: url }));
          showToast('success', 'Imagem carregada com sucesso!');
        } else {
          showToast('error', 'Falha no upload da imagem.');
        }
      } catch (err) {
        showToast('error', 'Erro ao subir imagem.');
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setForm({
      title: '',
      slug: '',
      subtitle: '',
      summary: '',
      content: '',
      main_image_url: '',
      category: 'Geral',
      active: true,
    });
    setIsEditing(false);
  };

  const handleEditInit = (post: BlogPost) => {
    setForm(post);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.content) {
      showToast('error', 'Título e conteúdo completo são obrigatórios!');
      return;
    }

    setLoading(true);
    const slug = form.slug || sanitizeSlug(form.title || '');
    const finalPayload = {
      ...form,
      slug,
      category: form.category || 'Geral',
      published_at: form.published_at || new Date().toISOString(),
      author: form.author || 'NEXO Dedetizadora',
      active: form.active !== undefined ? form.active : true,
    };

    try {
      const { error } = form.id
        ? await supabase.from('blog_posts').update(finalPayload).eq('id', form.id)
        : await supabase.from('blog_posts').insert({
            ...finalPayload,
            id: 'blog-' + Date.now()
          });

      if (error) {
        showToast('error', 'Erro ao salvar: ' + error.message);
      } else {
        showToast('success', form.id ? 'Artigo atualizado!' : 'Novo artigo criado!');
        resetForm();
        fetchPosts();
      }
    } catch (err: any) {
      showToast('error', 'Erro de conexão: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir permanentemente este post?')) {
      setLoading(true);
      try {
        const { error } = await supabase.from('blog_posts').delete().eq('id', id);
        if (error) {
          showToast('error', 'Erro ao excluir: ' + error.message);
        } else {
          showToast('success', 'Post excluído com sucesso!');
          fetchPosts();
          if (form.id === id) {
            resetForm();
          }
        }
      } catch (err: any) {
        showToast('error', 'Falha ao excluir post.');
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.summary?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-10">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-2xl flex items-center gap-3 border ${
          toast.type === 'success' 
            ? 'bg-emerald-950/90 border-emerald-500 text-emerald-300' 
            : 'bg-red-950/90 border-red-500 text-red-300'
        }`}>
          <Sparkles className="w-5 h-5 flex-shrink-0 animate-pulse" />
          <p className="font-medium text-sm">{toast.message}</p>
        </div>
      )}

      {/* Header section with instructions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-800 pb-6 gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <FileText className="text-[#00C853] w-8 h-8" />
            Central de Artigos
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Publique, edite e organize tópicos sobre controle de pragas, higiene e prevenção.
          </p>
        </div>
        {isEditing && (
          <button 
            onClick={resetForm}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl transition flex items-center gap-2 text-sm border border-gray-700"
          >
            <X className="w-4 h-4" /> Cancelar Edição
          </button>
        )}
      </div>

      <div className="grid lg:grid-cols-5 gap-10">
        {/* Form panel */}
        <div className="lg:col-span-3">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#00C853]"></div>
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#00C853]" />
              {isEditing ? 'Editar Postagem' : 'Escrever Novo Artigo'}
            </h3>

            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 col-span-2">
                  <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Título do Artigo</label>
                  <input 
                    className="bg-gray-950/60 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#00C853] transition text-sm font-medium"
                    value={form.title || ''} 
                    onChange={handleTitleChange} 
                    placeholder="Ex: Como evitar cupins no armário..." 
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5 col-span-2">
                  <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider">URL amigável (slug)</label>
                  <input 
                    className="bg-gray-950/60 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition text-xs font-mono"
                    value={form.slug || ''} 
                    onChange={e => setForm({...form, slug: sanitizeSlug(e.target.value)})} 
                    placeholder="como-evitar-cupins-no-armario" 
                  />
                </div>

                <div className="flex flex-col gap-1.5 col-span-2">
                  <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Subtítulo ou Resumo Curto</label>
                  <input 
                    className="bg-gray-950/60 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#00C853] transition text-sm"
                    value={form.subtitle || ''} 
                    onChange={e => setForm({...form, subtitle: e.target.value})} 
                    placeholder="Breve linha de instrução complementar..." 
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Categoria / Marcador</label>
                  <select 
                    className="bg-gray-950/60 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00C853] transition text-sm font-medium cursor-pointer"
                    value={form.category || 'Geral'} 
                    onChange={e => setForm({...form, category: e.target.value})}
                  >
                    <option value="Prevenção">Prevenção</option>
                    <option value="Saúde">Saúde</option>
                    <option value="Proteção">Proteção</option>
                    <option value="Segurança">Segurança</option>
                    <option value="Higiene">Higiene</option>
                    <option value="Corporativo">Corporativo</option>
                    <option value="Geral">Geral</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Autor</label>
                  <input 
                    className="bg-gray-950/60 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#00C853] transition text-sm"
                    value={form.author || 'NEXO Dedetizadora'} 
                    onChange={e => setForm({...form, author: e.target.value})} 
                  />
                </div>

                <div className="flex flex-col gap-1.5 col-span-2">
                  <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Breve Resumo (Exibido no card de listagem)</label>
                  <textarea 
                    className="bg-gray-950/60 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#00C853] transition text-sm h-20"
                    value={form.summary || ''} 
                    onChange={e => setForm({...form, summary: e.target.value})} 
                    placeholder="Esse resumo aparece na lista inicial de posts antes do botão 'Ler artigo'..." 
                  />
                </div>

                <div className="flex flex-col gap-1.5 col-span-2 justify-center py-2 bg-gray-950/40 p-4 rounded-xl border border-gray-850">
                  <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">Visibilidade e Status</span>
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={form.active !== undefined ? form.active : true}
                      onChange={e => setForm({...form, active: e.target.checked})}
                    />
                    <div className="w-11 h-6 bg-gray-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-300 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00C853]"></div>
                    <span className="ml-3 text-sm text-gray-300 font-medium select-none">Ativo e publicado no site público</span>
                  </label>
                </div>

                {/* Cover Image inputs */}
                <div className="col-span-2 p-4 bg-gray-950/40 border border-gray-850 rounded-xl space-y-4">
                  <span className="text-xs text-gray-300 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-emerald-500" />
                    Capa / Imagem Principal
                  </span>

                  <div className="grid gap-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] text-gray-500 font-medium">Link da Imagem (Unsplash, etc.)</span>
                      <input 
                        className="bg-gray-950/80 border border-gray-800 rounded-lg px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-[#00C853] transition text-xs font-mono"
                        value={form.main_image_url || ''} 
                        onChange={e => setForm({...form, main_image_url: e.target.value})} 
                        placeholder="https://images.unsplash.com/..." 
                      />
                    </div>

                    <div className="flex items-center gap-2 py-1">
                      <div className="h-[1px] bg-gray-850 flex-1"></div>
                      <span className="text-[10px] text-gray-500 uppercase font-black">Ou faça upload</span>
                      <div className="h-[1px] bg-gray-850 flex-1"></div>
                    </div>

                    <div>
                      <input 
                        type="file" 
                        onChange={handleUpload} 
                        accept="image/*"
                        className="block w-full text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-gray-800 file:text-gray-200 hover:file:bg-gray-700 cursor-pointer file:cursor-pointer" 
                      />
                    </div>

                    {form.main_image_url && (
                      <div className="mt-2 rounded-lg overflow-hidden border border-gray-850 h-28 relative">
                        <img src={form.main_image_url} alt="Capa" className="w-full h-full object-cover" />
                        <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 rounded text-[9px] text-white">Visualização</div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 col-span-2 mt-2">
                  <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Texto Completo do Artigo (Suporta quebras de linha)</label>
                  <textarea 
                    className="bg-gray-950/60 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#00C853] transition text-sm h-64 font-sans leading-relaxed"
                    value={form.content || ''} 
                    onChange={e => setForm({...form, content: e.target.value})} 
                    placeholder="Escreva as instruções completas do seu artigo..." 
                    required
                  />
                </div>
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full bg-[#00C853] hover:bg-[#00E676] text-gray-950 p-4 rounded-xl font-bold cursor-pointer transition shadow-lg text-sm uppercase tracking-wider flex items-center justify-center gap-2 disabled:bg-gray-600 disabled:text-gray-400"
                >
                  {loading ? 'Salvando...' : isEditing ? 'Atualizar Postagem' : 'Publicar Artigo'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* List of articles */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="text-md font-semibold text-white">Posts cadastrados</h3>
            
            <div className="relative">
              <Search className="w-4 h-4 text-gray-500 absolute left-3 top-3.5" />
              <input 
                className="w-full bg-gray-950/80 border border-gray-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00C853] transition"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Filtrar por título..."
              />
            </div>

            <div className="space-y-3 max-h-[750px] overflow-y-auto pr-1">
              {filteredPosts.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-gray-840 rounded-xl">
                  <p className="text-gray-500 text-xs">Nenhum post correspondente encontrado.</p>
                </div>
              ) : (
                filteredPosts.map(post => {
                  const isActive = post.active !== false;
                  return (
                    <div 
                      key={post.id} 
                      className={`p-3.5 rounded-xl border flex flex-col justify-between gap-3 text-white transition ${
                        form.id === post.id 
                          ? 'bg-emerald-950/40 border-emerald-500' 
                          : 'bg-gray-950/40 hover:bg-gray-950 border-gray-800 hover:border-gray-700'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <span className="px-2 py-0.5 bg-gray-800 text-gray-400 rounded text-[9px] font-bold uppercase tracking-wider">
                            {post.category || 'Geral'}
                          </span>
                          {isActive ? (
                            <span className="flex items-center gap-1 text-[9px] text-[#00C853] font-bold">
                              <Globe className="w-3 h-3" /> ATIVO
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-[9px] text-gray-500 font-bold">
                              <EyeOff className="w-3 h-3" /> OCULTO
                            </span>
                          )}
                        </div>
                        <h4 className="font-bold text-sm text-gray-100 line-clamp-2 leading-snug">{post.title}</h4>
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-gray-900/60">
                        <span className="text-[10px] text-gray-500">
                          {post.published_at ? new Date(post.published_at).toLocaleDateString() : 'Indefinida'}
                        </span>
                        <div className="flex items-center gap-3">
                          <button 
                            type="button"
                            onClick={() => handleEditInit(post)} 
                            className="text-xs text-gray-400 hover:text-emerald-400 font-medium flex items-center gap-1 transition"
                            title="Editar"
                          >
                            <Pencil className="w-3.5 h-3.5" /> Editar
                          </button>
                          <button 
                            type="button"
                            onClick={() => deletePost(post.id)} 
                            className="text-xs text-gray-400 hover:text-red-500 font-medium flex items-center gap-1 transition"
                            title="Remover"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Excluir
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
