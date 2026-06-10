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
    const { error: authError } = await supabase.auth.signInWithPassword({ 
      email, 
      password 
    });

    if (authError) {
      alert(authError.message);
      setLoading(false);
      return;
    }

    // 2. Get User
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        setError('Erro ao obter dados do usuário autenticado.');
        setLoading(false);
        return;
    }

    // 3. Authorize
    const { data: profile, error: profileError } = await supabase
      .from('admin_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    // Validate
    if (profileError || !profile || profile.role !== 'admin' || profile.active !== true) {
      await supabase.auth.signOut();
      setError('Acesso não autorizado. Seu usuário não possui perfil de administrador ativo.');
      setLoading(false);
      return;
    }

    // 4. Success
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
