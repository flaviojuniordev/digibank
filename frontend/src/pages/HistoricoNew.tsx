import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

interface Transacao {
    id: number;
    remetente: string;
    destinatario: string;
    valor: string | number;
    data: string;
}

const HistoricoNew: React.FC = () => {
    const [transacoes, setTransacoes] = useState<Transacao[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
            return;
        }

        api.get('/transacoes')
            .then(response => {
                setTransacoes(response.data);
            })
            .catch(error => {
                console.error('Erro ao carregar transações:', error);
                if (error.response?.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/');
                } else {
                    setErro('Erro ao carregar histórico de transações.');
                }
            })
            .finally(() => {
                setCarregando(false);
            });
    }, [navigate]);

    const formatarData = (dataString: string) => {
        const data = new Date(dataString);
        return data.toLocaleString('pt-BR');
    };

    if (carregando) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Carregando histórico...</p>
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
                                <span className="mr-2">📊</span>
                                <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                                    Histórico de Transações
                                </span>
                            </h1>
                            <p className="text-gray-600 mt-2">Acompanhe todas suas movimentações</p>
                        </div>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-200 transform hover:scale-105 shadow-lg font-medium"
                        >
                            ← Voltar
                        </button>
                    </div>
                </div>

                {erro && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
                        <div className="flex items-center">
                            <span className="text-2xl mr-3">❌</span>
                            <div>{erro}</div>
                        </div>
                    </div>
                )}

                {transacoes.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                        <div className="text-6xl mb-4">💳</div>
                        <h3 className="text-2xl font-semibold text-gray-800 mb-2">Nenhuma transação encontrada</h3>
                        <p className="text-gray-500 mb-6">Você ainda não realizou nenhuma transferência.</p>
                        <button
                            onClick={() => navigate('/transferencia')}
                            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg font-medium"
                        >
                            Fazer primeira transferência 🚀
                        </button>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                        {/* Header da tabela */}
                        <div className="bg-gradient-to-r from-green-500 to-blue-500 p-6">
                            <h2 className="text-xl font-semibold text-white">
                                📋 {transacoes.length} transação{transacoes.length !== 1 ? 'ões' : ''} encontrada{transacoes.length !== 1 ? 's' : ''}
                            </h2>
                        </div>

                        {/* Tabela responsiva */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            📅 Data
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            👤 Remetente
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            🎯 Destinatário
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            💰 Valor
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            📝 Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {transacoes.map((transacao, index) => (
                                        <tr key={transacao.id} className={`hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {formatarData(transacao.data)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                                {transacao.remetente}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                                {transacao.destinatario}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                                                R$ {Number(transacao.valor).toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                                    ✅ Concluída
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Footer da tabela */}
                        <div className="bg-gray-50 px-6 py-4">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-500">
                                    Total de transferências realizadas
                                </p>
                                <p className="text-lg font-semibold text-green-600">
                                    R$ {transacoes.reduce((total, t) => total + Number(t.valor), 0).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistoricoNew;
