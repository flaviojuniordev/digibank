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

const Historico: React.FC = () => {
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
            <div className="p-4 max-w-4xl mx-auto">
                <p>Carregando histórico...</p>
            </div>
        );
    }

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-pink-600">Histórico de Transações</h1>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                    Voltar
                </button>
            </div>

            {erro && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {erro}
                </div>
            )}

            {transacoes.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-500">Nenhuma transação encontrada.</p>
                </div>
            ) : (
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Data
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Remetente
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Destinatário
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Valor
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tipo
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {transacoes.map((transacao) => (
                                <tr key={transacao.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {formatarData(transacao.data)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {transacao.remetente}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {transacao.destinatario}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        R$ {Number(transacao.valor).toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className="inline-flex px-2 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                            Transferência
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Historico;
