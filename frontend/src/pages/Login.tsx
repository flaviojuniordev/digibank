import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(false);
    const navigate = useNavigate();

    // Se o usuário já está autenticado, redireciona para o dashboard
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/dashboard');
        }
    }, [navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setCarregando(true);
        setErro('');

        try {
            console.log('Tentando fazer login...');
            const response = await api.post('/clientes/login', {
                email,
                senha
            });

            console.log('Resposta do login:', response.data);
            const token = response.data.token;
            localStorage.setItem('token', token);

            alert('Login realizado com sucesso!');
            console.log('Redirecionando para /dashboard...');
            navigate('/dashboard');
        } catch (err: any) {
            console.error('Erro no login:', err);
            setErro(err.response?.data?.mensagem || 'Erro ao fazer login.');
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4">
                {/* Logo/Header */}
                <div className="text-center mb-8">
                    <div className="text-6xl mb-4">🏦</div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                        DigiBank
                    </h1>
                    <p className="text-gray-600 mt-2">Faça login em sua conta</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            📧 Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                            placeholder="seu@email.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            🔒 Senha
                        </label>
                        <input
                            type="password"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            required
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={carregando}
                        className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-4 rounded-xl hover:from-pink-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed font-medium transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
                    >
                        {carregando ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                                Entrando...
                            </div>
                        ) : (
                            'Entrar 🚀'
                        )}
                    </button>
                </form>

                {erro && (
                    <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-center">
                        <div className="text-2xl mb-2">❌</div>
                        {erro}
                    </div>
                )}

                {/* Link para registro */}
                <div className="mt-8 text-center">
                    <p className="text-gray-600">
                        Não tem uma conta?{' '}
                        <button
                            onClick={() => navigate('/register')}
                            className="text-pink-600 hover:text-pink-700 font-medium transition-colors duration-200"
                        >
                            Cadastre-se aqui
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;