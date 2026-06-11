import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!supabase) {
      setError("O Supabase não está configurado. Verifique as chaves VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.");
      setLoading(false);
      return;
    }

    if (!email) {
      alert("Informe o e-mail");
      setLoading(false);
      return;
    }

    if (!password) {
      alert("Informe a senha");
      setLoading(false);
      return;
    }
    
    // 1. Authenticate
    console.log('[DEBUG AdminLogin] Initiating login flow for email:', email);
    
    const signInResult = await supabase.auth.signInWithPassword({ 
      email, 
      password 
    });
    
    console.log('[DEBUG AdminLogin] signInWithPassword result:', {
      success: !signInResult.error,
      error: signInResult.error ? {
        message: signInResult.error.message,
        status: signInResult.error.status
      } : null,
      session: signInResult.data?.session ? 'Session established' : 'No session'
    });

    if (signInResult.error) {
      alert(signInResult.error.message);
      setError(signInResult.error.message);
      setLoading(false);
      return;
    }

    // 2. Get User
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    console.log('[DEBUG AdminLogin] getUser() result:', {
      userExists: !!user,
      id: user?.id || null,
      email: user?.email || null,
      error: userError ? userError.message : null
    });

    if (userError || !user) {
        setError('Erro ao obter dados do usuário autenticado.');
        setLoading(false);
        return;
    }

    // 3. Authorize or Create Profile for admin@nexo.com
    let authorized = false;
    
    if (user.email === 'admin@nexo.com') {
      console.log('[DEBUG AdminLogin] User is admin@nexo.com. Ensuring admin_profile exists.');
      try {
        // Try to insert/upsert with standard fields
        const { error: upsertError } = await supabase
          .from('admin_profiles')
          .upsert({
            id: user.id,
            email: 'admin@nexo.com',
            name: 'Administrador Master',
            role: 'admin',
            perfil: 'admin',
            active: true,
            ativo: true
          }, { onConflict: 'id' });

        if (upsertError) {
          console.warn('[DEBUG AdminLogin] Upsert failed, trying direct insert:', upsertError.message);
          // Try inserting only supported basic fields
          await supabase
            .from('admin_profiles')
            .insert({
              id: user.id,
              email: 'admin@nexo.com',
              role: 'admin',
              active: true
            });
        }
      } catch (upsertCatch: any) {
        console.warn('[DEBUG AdminLogin] Exception during profile upsert:', upsertCatch);
      }
      authorized = true; // Auto-authorize admin@nexo.com
    }

    console.log('[DEBUG AdminLogin] Fetching admin profile for user ID:', user.id);
    const { data: profile, error: profileError } = await supabase
      .from('admin_profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    console.log('[DEBUG AdminLogin] admin_profiles record fetch:', {
      profileFound: !!profile,
      profileData: profile,
      error: profileError ? profileError.message : null
    });

    if (user.email === 'admin@nexo.com') {
      authorized = true;
    } else if (profile && 
               (profile.role === 'admin' || profile.perfil === 'admin') && 
               (profile.active === true || profile.ativo === true)) {
      authorized = true;
    }

    // Validate
    if (!authorized) {
      console.log('[DEBUG AdminLogin] Authorization failed. Signing out.');
      await supabase.auth.signOut();
      setError('Acesso não autorizado. Seu usuário não possui perfil de administrador ativo.');
      setLoading(false);
      return;
    }

    // 4. Success
    console.log('[DEBUG AdminLogin] Login and profile verification successful! Redirecting to dashboard.');
    setLoading(false);
    navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md border border-gray-700 overflow-hidden">
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-2 text-center text-blue-400">
            Login Administrativo
          </h2>
          <p className="text-xs text-gray-400 text-center mb-6">
            Insira suas credenciais para gerenciar o site da NEXO.
          </p>

          {error && <p className="text-red-400 mb-4 text-sm text-center bg-red-950/40 p-3 rounded border border-red-900/50">{error}</p>}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs text-gray-400 block mb-1 font-medium">E-mail Administrativo</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemplo@nexo.com.br"
                disabled={loading}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
            </div>

            <div>
              <label className="text-xs text-gray-400 block mb-1 font-medium">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="******"
                disabled={loading}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-blue-600 text-white p-3 rounded font-semibold hover:bg-blue-500 transition duration-200 mt-2 flex justify-center items-center gap-2"
            >
              {loading ? 'Entrando...' : 'Entrar no Painel'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
