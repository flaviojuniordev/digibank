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
    }; const selecionarDestinatario = (destinatario: Cliente) => {
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
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold">
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

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Card do saldo - Lado esquerdo */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg p-6 h-fit">
                            <div className="text-center">
                                <div className="bg-green-100 p-4 rounded-full inline-block mb-4">
                                    <span className="text-3xl">💰</span>
                                </div>
                                <p className="text-gray-600 text-sm mb-2">Saldo disponível</p>
                                <p className="text-3xl font-bold text-green-600">
                                    R$ {saldoAtual.toFixed(2)}
                                </p>

                                {/* Status do formulário */}
                                <div className="mt-6 p-3 bg-gray-50 rounded-lg">
                                    <p className="text-xs text-gray-500 font-medium mb-2">Status da Transferência:</p>
                                    <div className="space-y-1 text-xs">
                                        <div className="flex justify-between">
                                            <span>Destinatário:</span>
                                            <span className={destinatarioSelecionado ? 'text-green-600' : 'text-red-600'}>
                                                {destinatarioSelecionado ? '✓' : '✗'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Valor:</span>
                                            <span className={valor && parseFloat(valor) > 0 ? 'text-green-600' : 'text-red-600'}>
                                                {valor && parseFloat(valor) > 0 ? '✓' : '✗'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Processando:</span>
                                            <span className={carregando ? 'text-yellow-600' : 'text-gray-400'}>
                                                {carregando ? '⏳' : '⚪'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Formulário - Lado direito */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleTransferencia} className="space-y-6">
                            {/* Busca de destinatário */}
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                    <span className="text-xl mr-2">👤</span>
                                    Dados do Destinatário
                                </h3>

                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nome ou CPF/CNPJ
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={busca}
                                        onChange={handleBuscaChange}
                                        placeholder="Digite o nome ou CPF/CNPJ do destinatário"
                                        className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-base"
                                        required
                                    />

                                    {/* Lista de sugestões */}
                                    {destinatarios.length > 0 && (
                                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                                            {destinatarios.map(destinatario => (
                                                <div
                                                    key={destinatario.id}
                                                    onClick={() => selecionarDestinatario(destinatario)}
                                                    className="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                                >
                                                    <div className="font-medium text-gray-900">{destinatario.nome}</div>
                                                    <div className="text-sm text-gray-500">{destinatario.cpf_cnpj}</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {destinatarioSelecionado && (
                                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                                        <p className="text-sm text-green-800 font-medium">
                                            ✓ Destinatário confirmado:
                                        </p>
                                        <p className="text-sm text-green-700 mt-1">
                                            {destinatarioSelecionado.nome} - {destinatarioSelecionado.cpf_cnpj}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Valor */}
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                    <span className="text-xl mr-2">💵</span>
                                    Valor da Transferência
                                </h3>

                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Valor (R$)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    max={saldoAtual}
                                    value={valor}
                                    onChange={(e) => setValor(e.target.value)}
                                    placeholder="0,00"
                                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-base"
                                    required
                                />
                                {valor && parseFloat(valor) > saldoAtual && (
                                    <p className="text-red-600 text-sm mt-2">
                                        ⚠️ Valor maior que o saldo disponível
                                    </p>
                                )}
                            </div>

                            {/* Botão de transferir */}
                            <button
                                type="submit"
                                disabled={carregando || !destinatarioSelecionado || !valor || parseFloat(valor) <= 0}
                                className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white py-4 px-6 rounded-xl hover:from-pink-600 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg disabled:transform-none"
                            >
                                {carregando ? (
                                    <span className="flex items-center justify-center">
                                        <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
                                        Processando...
                                    </span>
                                ) : (
                                    '💸 Realizar Transferência'
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Mensagens */}
                {erro && (
                    <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
                        <div className="flex items-center">
                            <span className="text-xl mr-2">❌</span>
                            {erro}
                        </div>
                    </div>
                )}

                {sucesso && (
                    <div className="mt-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl">
                        <div className="flex items-center">
                            <span className="text-xl mr-2">✅</span>
                            {sucesso}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Transferencia;
