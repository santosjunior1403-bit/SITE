import { useEffect, useState } from 'react';
import { useNavigate, Outlet, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function AdminLayout() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!supabase) {
      console.warn("Supabase not initiated, cannot access admin panel.");
      navigate('/admin/login');
      return;
    }
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/admin/login');
        return;
      }
      
      const userEmail = session.user.email?.toLowerCase() || '';
      const isMasterAdmin = userEmail === 'admin@nexo.com' || userEmail === 'adm@nexo.com';
      
      let profile = null;
      try {
        const response = await supabase
          .from('admin_profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();
        profile = response?.data || null;
      } catch (e: any) {
        console.warn("Could not query admin profile in layout checks:", e?.message || e);
      }
        
      let isAuthorized = false;
      if (isMasterAdmin) {
        isAuthorized = true;
        
        // Auto-recreate profile if it disappeared during checked state
        if (!profile) {
          try {
            supabase.from('admin_profiles').upsert({
              id: session.user.id,
              email: userEmail || 'adm@nexo.com',
              name: 'Administrador Master',
              role: 'admin',
              perfil: 'admin',
              active: true,
              ativo: true
            }).catch(e => console.warn("Async auto-create admin profile failure:", e));
          } catch (e) {
            console.warn("Could not auto-create admin profile in layout checks:", e);
          }
        }
      } else if (profile && 
                 (profile.role === 'admin' || profile.perfil === 'admin') && 
                 (profile.active === true || profile.ativo === true || profile.active === 1 || profile.ativo === 1)) {
        isAuthorized = true;
      }
        
      if (!isAuthorized) {
        await supabase.auth.signOut();
        navigate('/admin/login');
      } else {
        document.title = "Painel Administrativo| NEXO";
        setLoading(false);
      }
    };
    checkUser();
  }, [navigate]);

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      <aside className="w-64 bg-gray-900 border-r border-gray-800 p-6">
        <h1 className="text-xl font-bold mb-8 text-blue-400">NEXO Painel</h1>
        <nav className="space-y-4">
             <Link to="/" className="block text-gray-300 hover:text-white mb-6 underline">← Voltar ao site</Link>
             <Link to="/admin/dashboard" className="block text-gray-300 hover:text-white">Dashboard</Link>
             <Link to="/admin/company" className="block text-gray-300 hover:text-white">Dados da Empresa</Link>
             <Link to="/admin/home" className="block text-gray-300 hover:text-white">Página Inicial</Link>
             <Link to="/admin/services" className="block text-gray-300 hover:text-white">Serviços</Link>
             <Link to="/admin/blog" className="block text-gray-300 hover:text-white">Blog</Link>
             <Link to="/admin/testimonials" className="block text-gray-300 hover:text-white">Avaliações</Link>
             <Link to="/admin/clients" className="block text-gray-300 hover:text-white">Clientes/Parceiros</Link>
             <Link to="/admin/settings" className="block text-gray-300 hover:text-white">Configurações</Link>
             <Link to="/admin/google-ads" className="block text-gray-300 hover:text-white">Google Ads</Link>
             <button onClick={async () => { if (supabase) { await supabase.auth.signOut(); } navigate('/admin/login'); }} className="text-red-400 mt-8 hover:text-red-300">Sair</button>
        </nav>
      </aside>
      <main className="flex-1 p-8 bg-gray-950 text-white"><Outlet /></main>
    </div>
  );
}
