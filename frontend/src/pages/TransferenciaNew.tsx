import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

interface Cliente {
    id: number;
    nome: string;
    cpf_cnpj: string;
}

const Transferencia: React.FC = () => {
    const [valor, setValor] = useState('');
    const [busca, setBusca] = useState('');
    const [destinatarios, setDestinatarios] = useState<Cliente[]>([]);
    const [destinatarioSelecionado, setDestinatarioSelecionado] = useState<Cliente | null>(null);
    const [saldoAtual, setSaldoAtual] = useState(0);
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
            return;
        }

        api.get('/transacoes/saldo')
            .then(response => {
                setSaldoAtual(Number(response.data.saldo));
            })
            .catch(error => {
                console.error('Erro ao buscar saldo:', error);
                if (error.response?.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/');
                }
            });
    }, [navigate]);

    const buscarDestinatarios = async (termoBusca: string) => {
        if (termoBusca.length < 3) {
            setDestinatarios([]);
            return;
        }

        try {
            const response = await api.get(`/transacoes/buscar-destinatario?busca=${termoBusca}`);
            setDestinatarios(response.data);
        } catch (error) {
            console.error('Erro ao buscar destinatários:', error);
            setDestinatarios([]);
        }
    };

    const handleBuscaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const valor = e.target.value;
        setBusca(valor);
        buscarDestinatarios(valor);

        if (destinatarioSelecionado &&
            valor.toLowerCase() !== destinatarioSelecionado.nome.toLowerCase() &&
            valor.toLowerCase() !== destinatarioSelecionado.cpf_cnpj.toLowerCase()) {
            setDestinatarioSelecionado(null);
        }
    };

    const selecionarDestinatario = (destinatario: Cliente) => {
        setDestinatarioSelecionado(destinatario);
        setBusca(`${destinatario.nome} (${destinatario.cpf_cnpj})`);
        setDestinatarios([]);
        console.log('Destinatário selecionado:', destinatario);
    };

    const handleTransferencia = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!destinatarioSelecionado) {
            setErro('Por favor, selecione um destinatário.');
            return;
        }

        const valorNumerico = parseFloat(valor);
        if (!valorNumerico || valorNumerico <= 0) {
            setErro('Por favor, digite um valor válido maior que zero.');
            return;
        }

        if (valorNumerico > saldoAtual) {
            setErro(`Saldo insuficiente. Saldo atual: R$ ${saldoAtual.toFixed(2)}`);
            return;
        }

        setCarregando(true);
        setErro('');
        setSucesso('');

        try {
            const response = await api.post('/transacoes/transferir', {
                destinatarioId: destinatarioSelecionado.id,
                valor: valorNumerico
            });

            setSucesso(`Transferência de R$ ${valorNumerico.toFixed(2)} para ${destinatarioSelecionado.nome} realizada com sucesso!`);
            setSaldoAtual(response.data.novoSaldo);

            setValor('');
            setBusca('');
            setDestinatarioSelecionado(null);
            setDestinatarios([]);

        } catch (error: any) {
            console.error('Erro na transferência:', error);
            setErro(error.response?.data?.mensagem || 'Erro ao realizar transferência.');
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold">
                                <span className="mr-2">💸</span>
                                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Transferência
                                </span>
                            </h1>
                            <p className="text-gray-600 mt-2">Envie dinheiro de forma segura</p>
                        </div>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-200 transform hover:scale-105 shadow-lg font-medium"
                        >
                            ← Voltar
                        </button>
                    </div>
                </div>

                {/* Card do saldo */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                    <div className="flex items-center justify-center">
                        <div className="bg-green-100 p-4 rounded-full mr-4">
                            <span className="text-3xl">💰</span>
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm">Saldo disponível</p>
                            <p className="text-3xl font-bold text-green-600">
                                R$ {saldoAtual.toFixed(2)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Formulário */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <form onSubmit={handleTransferencia} className="space-y-6">
                        {/* Busca de destinatário */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                👤 Destinatário (Nome ou CPF/CNPJ)
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={busca}
                                    onChange={handleBuscaChange}
                                    placeholder="Digite o nome ou CPF/CNPJ do destinatário"
                                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
                                    required
                                />

                                {/* Lista de sugestões */}
                                {destinatarios.length > 0 && (
                                    <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                                        {destinatarios.map(destinatario => (
                                            <div
                                                key={destinatario.id}
                                                onClick={() => selecionarDestinatario(destinatario)}
                                                className="p-4 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-150"
                                            >
                                                <div className="font-medium text-gray-800">{destinatario.nome}</div>
                                                <div className="text-sm text-gray-500">{destinatario.cpf_cnpj}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {destinatarioSelecionado && (
                                <div className="mt-3 p-4 bg-green-50 border border-green-200 rounded-xl">
                                    <div className="flex items-center">
                                        <span className="text-2xl mr-3">✅</span>
                                        <div>
                                            <p className="text-sm text-green-800 font-medium">
                                                Destinatário confirmado:
                                            </p>
                                            <p className="text-sm text-green-700">
                                                {destinatarioSelecionado.nome} - {destinatarioSelecionado.cpf_cnpj}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Valor */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                💵 Valor (R$)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0.01"
                                max={saldoAtual}
                                value={valor}
                                onChange={(e) => setValor(e.target.value)}
                                placeholder="0,00"
                                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
                                required
                            />
                        </div>

                        {/* Status do formulário (debug) */}
                        <div className="text-xs text-gray-500 p-3 bg-gray-50 rounded-lg border">
                            <span className="font-medium">Status:</span>
                            Destinatário={destinatarioSelecionado ? '✅' : '❌'} |
                            Valor={valor ? '✅' : '❌'} |
                            Carregando={carregando ? '⏳' : '✅'}
                        </div>

                        {/* Botão de transferir */}
                        <button
                            type="submit"
                            disabled={carregando || !destinatarioSelecionado || !valor || parseFloat(valor) <= 0}
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6 rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed font-medium text-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
                        >
                            {carregando ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent mr-3"></div>
                                    Processando transferência...
                                </div>
                            ) : (
                                '🚀 Realizar Transferência'
                            )}
                        </button>
                    </form>

                    {/* Mensagens */}
                    {erro && (
                        <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
                            <div className="flex items-center">
                                <span className="text-2xl mr-3">❌</span>
                                <div>{erro}</div>
                            </div>
                        </div>
                    )}

                    {sucesso && (
                        <div className="mt-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl">
                            <div className="flex items-center">
                                <span className="text-2xl mr-3">🎉</span>
                                <div>{sucesso}</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Transferencia;
