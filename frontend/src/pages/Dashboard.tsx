import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

interface Cliente {
    id: number;
    nome: string;
    cpf_cnpj: string;
    idade_data_fundacao: string;
    renda_mensal: number | string;
    saldo: number | string;
}

const Dashboard: React.FC = () => {
    const [cliente, setCliente] = useState<Cliente | null>(null);
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log('Token encontrado:', token ? 'Sim' : 'Não');

        if (!token) {
            console.log('Sem token, redirecionando para login');
            navigate('/');
            return;
        }

        console.log('Dashboard carregado, fazendo chamada para /clientes/me...');
        setCarregando(true);

        api.get('/clientes/me')
            .then(response => {
                console.log('Status da resposta:', response.status);
                console.log('Dados do cliente recebidos:', response.data);
                setCliente(response.data);
                setErro('');
            })
            .catch((error) => {
                console.error('Erro completo:', error);
                console.error('Resposta do erro:', error.response?.data);
                console.error('Status do erro:', error.response?.status);

                if (error.response?.status === 401 || error.response?.status === 403) {
                    setErro('Token inválido, faça login novamente.');
                    localStorage.removeItem('token');
                    navigate('/');
                } else if (error.response?.status === 404) {
                    setErro('Usuário não encontrado no sistema. Faça login novamente.');
                } else {
                    setErro('Erro ao carregar dados: ' + (error.response?.data?.mensagem || error.message));
                }
            })
            .finally(() => {
                console.log('Finalizando carregamento');
                setCarregando(false);
            });
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    if (carregando) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-500 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Carregando seus dados...</p>
                </div>
            </div>
        );
    }

    if (erro) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md mx-4">
                    <div className="text-6xl mb-4">⚠️</div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Ops! Algo deu errado</h1>
                    <p className="text-red-600 mb-6">{erro}</p>
                    <button
                        onClick={handleLogout}
                        className="px-8 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-xl hover:from-pink-600 hover:to-red-600 transition-all duration-200 transform hover:scale-105 shadow-lg font-medium"
                    >
                        Voltar ao Login 🔑
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold">
                                <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                                    Olá, {cliente?.nome || 'Usuário'}!
                                </span>
                                <span className="ml-2">👋</span>
                            </h1>
                            <p className="text-gray-600 mt-2">Bem-vindo ao seu DigiBank</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Saldo atual</p>
                            <p className="text-3xl font-bold text-green-600">
                                R$ {Number(cliente?.saldo || 0).toFixed(2)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Cards de informações */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {/* Card de dados pessoais */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                            <span className="bg-blue-100 p-2 rounded-lg mr-3">👤</span>
                            Dados Pessoais
                        </h2>
                        {cliente ? (
                            <div className="space-y-3">
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="text-gray-600">CPF/CNPJ:</span>
                                    <span className="font-medium">{cliente.cpf_cnpj}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="text-gray-600">Idade/Data Fundação:</span>
                                    <span className="font-medium">{cliente.idade_data_fundacao}</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-gray-600">Renda Mensal:</span>
                                    <span className="font-medium text-green-600">
                                        R$ {Number(cliente.renda_mensal || 0).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-500">Dados não disponíveis</p>
                        )}
                    </div>

                    {/* Card de ações rápidas */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                            <span className="bg-green-100 p-2 rounded-lg mr-3">⚡</span>
                            Ações Rápidas
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <button
                                onClick={() => navigate('/transferencia')}
                                className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                            >
                                <div className="text-2xl mb-2">💸</div>
                                <div className="text-sm font-medium">Transferir</div>
                            </button>

                            <button
                                onClick={() => navigate('/historico')}
                                className="p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                            >
                                <div className="text-2xl mb-2">📊</div>
                                <div className="text-sm font-medium">Histórico</div>
                            </button>

                            <button
                                onClick={() => navigate('/clientes')}
                                className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                            >
                                <div className="text-2xl mb-2">👥</div>
                                <div className="text-sm font-medium">Clientes</div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Botão de logout */}
                <div className="text-center">
                    <button
                        onClick={handleLogout}
                        className="px-8 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-xl hover:from-pink-600 hover:to-red-600 transition-all duration-200 transform hover:scale-105 shadow-lg font-medium"
                    >
                        Sair da Conta 🚪
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
