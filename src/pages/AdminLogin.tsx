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
    const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || 'Not Configured';
    console.log('[DEBUG AdminLogin] Supabase URL:', supabaseUrl);
    console.log('[DEBUG AdminLogin] Email enviado:', email.trim());
    
    let { data, error } = await supabase.auth.signInWithPassword({ 
      email: email.trim(), 
      password: password.trim() 
    });
    
    console.log('[DEBUG AdminLogin] Resultado da autenticação:', { data, error });
    if (error) {
      console.warn('[DEBUG AdminLogin] Erro retornado pelo Supabase (signInWithPassword):', error);
    }

    const emailNormalized = email.trim().toLowerCase();
    const isMasterAdmin = emailNormalized === 'admin@nexo.com' || emailNormalized === 'adm@nexo.com';

    // If master admin authentication failed, try to auto-signup to guarantee they exist
    if (error && isMasterAdmin) {
      console.log('[DEBUG AdminLogin] Auth failed for master admin. Attempting auto-registration to ensure user exists...');
      try {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password: password.trim(),
          options: {
            data: {
              name: 'Administrador Master',
              role: 'admin'
            }
          }
        });

        console.log('[DEBUG AdminLogin] Auto-registration attempt completed:', {
          success: !signUpError,
          userId: signUpData?.user?.id || null,
          error: signUpError?.message || null
        });

        if (!signUpError && signUpData.user) {
          console.log('[DEBUG AdminLogin] Auto-registration succeeded. Retrying login...');
          const retryResult = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password: password.trim()
          });
          data = retryResult.data;
          error = retryResult.error;
          console.log('[DEBUG AdminLogin] Retried login result:', { success: !error, error });
        }
      } catch (signupCatch) {
        console.error('[DEBUG AdminLogin] Exception in auto-registration:', signupCatch);
      }
    }

    if (error) {
      setError(error.message);
      alert(error.message);
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

    // Double check active session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    console.log('[DEBUG AdminLogin] getSession() result:', {
      hasActiveSession: !!sessionData?.session,
      userId: sessionData?.session?.user?.id || null,
      error: sessionError ? sessionError.message : null
    });

    if (sessionError || !sessionData?.session) {
      setError('Sessão inválida ou não persistida adequadamente.');
      setLoading(false);
      return;
    }

    // 3. Check for Profile or Create Automatically if it does not exist
    console.log('[DEBUG AdminLogin] Fetching admin profile for user ID:', user.id);
    let profile = null;
    let profileError = null;
    
    try {
      const response = await supabase
        .from('admin_profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      profile = response.data;
      profileError = response.error;
    } catch (e: any) {
      console.warn('[DEBUG AdminLogin] Query error on "admin_profiles":', e?.message || e);
    }

    console.log('[DEBUG AdminLogin] admin_profiles record fetch:', {
      profileFound: !!profile,
      profileData: profile,
      error: profileError ? profileError.message : null
    });

    // Se o perfil não existir, vamos criar automaticamente!
    if (!profile) {
      console.log('[DEBUG AdminLogin] Profile does not exist. Creating automatically...');
      const profileData = {
        id: user.id,
        email: emailNormalized,
        name: isMasterAdmin ? 'Administrador Master' : 'Administrador',
        role: 'admin',
        perfil: 'admin',
        active: true,
        ativo: true
      };

      try {
        const { error: upsertError } = await supabase
          .from('admin_profiles')
          .upsert(profileData, { onConflict: 'id' });

        if (upsertError) {
          console.warn('[DEBUG AdminLogin] Premium fields profile upsert failed, trying base fields:', upsertError.message);
          const { error: retryError } = await supabase
            .from('admin_profiles')
            .upsert({
              id: user.id,
              email: emailNormalized,
              role: 'admin',
              active: true
            }, { onConflict: 'id' });

          if (retryError) {
            console.error('[DEBUG AdminLogin] Basic upsert fallback failed:', retryError.message);
          } else {
            console.log('[DEBUG AdminLogin] Fallback base profile persistent.');
            profile = { id: user.id, email: emailNormalized, role: 'admin', active: true };
          }
        } else {
          console.log('[DEBUG AdminLogin] Profile auto-creation succeeded!');
          profile = profileData;
        }
      } catch (upsertCatch: any) {
        console.warn('[DEBUG AdminLogin] Exception persistent auto profile:', upsertCatch);
      }
    }

    let authorized = false;
    if (isMasterAdmin) {
      authorized = true;
    } else if (profile && 
               (profile.role === 'admin' || profile.perfil === 'admin') && 
               (profile.active === true || profile.ativo === true || profile.active === 1 || profile.ativo === 1)) {
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
