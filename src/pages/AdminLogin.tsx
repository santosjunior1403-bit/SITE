import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function AdminLogin() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
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
    const { data, error: authError } = await supabase.auth.signInWithPassword({ 
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

    // Logging
    console.log('User ID:', user.id);
    console.log('User Email:', user.email);
    console.log('Profile found:', profile);

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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!name) {
      alert("Informe o seu nome completo");
      setLoading(false);
      return;
    }

    if (!email) {
      alert("Informe o e-mail");
      setLoading(false);
      return;
    }

    if (!password || password.length < 6) {
      alert("A senha de administrador deve conter ao menos 6 caracteres");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      alert("As senhas não coincidem");
      setLoading(false);
      return;
    }

    // 1. Create user in Supabase Auth
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      alert("Erro ao criar login auth: " + signUpError.message);
      setLoading(false);
      return;
    }

    const authUser = signUpData.user;
    if (!authUser) {
      alert("Não foi possível recuperar os dados do usuário recém-criado.");
      setLoading(false);
      return;
    }

    // 2. Insert into admin_profiles
    const { error: profileError } = await supabase
      .from('admin_profiles')
      .insert([
        {
          id: authUser.id,
          name: name,
          role: 'admin',
          active: true,
          email: email
        }
      ]);

    if (profileError) {
      console.error("Erro ao criar perfil em admin_profiles:", profileError);
      alert("Sua conta auth foi criada! Porém, ocorreu um erro ao salvar o perfil na tabela admin_profiles: " + profileError.message);
      setLoading(false);
      return;
    }

    setSuccess("Conta de Administrador criada com sucesso! Faça login abaixo com o e-mail cadastrado.");
    alert("Administrador cadastrado e ativado com sucesso!");
    setActiveTab('login');
    setPassword('');
    setConfirmPassword('');
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md border border-gray-700 overflow-hidden">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-700 bg-gray-850">
          <button 
            type="button" 
            onClick={() => { setActiveTab('login'); setError(''); setSuccess(''); }}
            className={`flex-1 py-4 text-center text-sm font-semibold transition-colors duration-200 ${activeTab === 'login' ? 'text-blue-400 border-b-2 border-blue-500 bg-gray-800' : 'text-gray-400 hover:text-white bg-gray-900/50'}`}
          >
            Acessar Painel
          </button>
          <button 
            type="button" 
            onClick={() => { setActiveTab('register'); setError(''); setSuccess(''); }}
            className={`flex-1 py-4 text-center text-sm font-semibold transition-colors duration-200 ${activeTab === 'register' ? 'text-blue-400 border-b-2 border-blue-500 bg-gray-800' : 'text-gray-400 hover:text-white bg-gray-900/50'}`}
          >
            Cadastrar Novo Admin
          </button>
        </div>

        <div className="p-8">
          <h2 className="text-2xl font-bold mb-2 text-center text-blue-400">
            {activeTab === 'login' ? 'Login Administrativo' : 'Criar Administrador'}
          </h2>
          <p className="text-xs text-gray-400 text-center mb-6">
            {activeTab === 'login' 
              ? 'Insira suas credenciais para gerenciar o site da NEXO.' 
              : 'Cadastre suas credenciais para obter acesso total às configurações.'}
          </p>

          {error && <p className="text-red-400 mb-4 text-sm text-center bg-red-950/40 p-3 rounded border border-red-900/50">{error}</p>}
          {success && <p className="text-emerald-400 mb-4 text-sm text-center bg-emerald-950/40 p-3 rounded border border-emerald-900/50">{success}</p>}

          {activeTab === 'login' ? (
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
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 block mb-1 font-medium">Nome Completo</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  disabled={loading}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 block mb-1 font-medium">Novo E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="novo-admin@nexo.com.br"
                  disabled={loading}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 block mb-1 font-medium">Nova Senha (mínimo 6 caracteres)</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo de 6 caracteres"
                  disabled={loading}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 block mb-1 font-medium">Confirme a Senha</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repita a nova senha"
                  disabled={loading}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>

              <div className="bg-blue-950/20 text-gray-400 text-[10px] leading-relaxed p-3 rounded border border-blue-900/30">
                <strong>Atenção:</strong> Ao cadastrar-se, seu registro de autenticação e perfil administrador correspondente serão criados e ativados automaticamente na tabela <code className="bg-gray-900 px-1 rounded text-blue-300 font-mono">admin_profiles</code>.
              </div>

              <button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-[#00C853] text-white p-3 rounded font-semibold hover:bg-emerald-500 transition duration-200 mt-2 flex justify-center items-center gap-2 text-sm"
              >
                {loading ? 'Cadastrando...' : 'Cadastrar e Ativar Administrador'}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
