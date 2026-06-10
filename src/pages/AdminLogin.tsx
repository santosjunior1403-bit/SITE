import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    console.log("EMAIL", email);
    console.log("PASSWORD", password);

    if (!email) {
      alert("Informe o e-mail");
      return;
    }

    if (!password) {
      alert("Informe a senha");
      return;
    }
    
    // 1. Authenticate
    const { data, error: authError } = await supabase.auth.signInWithPassword({ 
      email, 
      password 
    });

    console.log("LOGIN DATA", data);
    console.log("LOGIN ERROR", authError);

    if (authError) {
      alert(authError.message);
      return;
    }

    // 2. Get User
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        setError('Erro ao autenticar usuário.');
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
      setError('Acesso não autorizado.');
      return;
    }

    // 4. Success
    navigate('/admin/dashboard');
  };

  return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
        <form onSubmit={handleLogin} className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-sm border border-gray-700">
          <h2 className="text-2xl font-bold mb-6 text-center text-blue-400">Login Administrativo</h2>
          {error && <p className="text-red-400 mb-4 text-sm">{error}</p>}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail"
            className="w-full p-3 mb-4 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            className="w-full p-3 mb-6 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded font-semibold hover:bg-blue-500 transition duration-200">
            Entrar
          </button>
        </form>
      </div>
  );
}
