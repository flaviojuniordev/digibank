import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

interface Cliente {
    id: number;
    nome: string;
    cpf_cnpj: string;
    email: string;
    idade_data_fundacao: string;
    renda_mensal: number;
    saldo: number;
    created_at: string;
}

interface NovoCliente {
    nome: string;
    cpf_cnpj: string;
    email: string;
    idade_data_fundacao: string;
    renda_mensal: string;
    senha: string;
}

const PainelClientes: React.FC = () => {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [clientesFiltrados, setClientesFiltrados] = useState<Cliente[]>([]);
    const [busca, setBusca] = useState('');
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');
    const [mostrarModal, setMostrarModal] = useState(false);
    const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null);
    const [tipoPessoa, setTipoPessoa] = useState<'fisica' | 'juridica'>('fisica');
    const [novoCliente, setNovoCliente] = useState<NovoCliente>({
        nome: '',
        cpf_cnpj: '',
        email: '',
        idade_data_fundacao: '',
        renda_mensal: '',
        senha: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        carregarClientes();
    }, [navigate]);

    useEffect(() => {
        filtrarClientes();
    }, [busca, clientes]);

    const carregarClientes = async () => {
        try {
            const response = await api.get('/clientes');
            setClientes(response.data);
            setClientesFiltrados(response.data);
        } catch (error) {
            console.error('Erro ao carregar clientes:', error);
            setErro('Erro ao carregar lista de clientes.');
        } finally {
            setCarregando(false);
        }
    };

    const filtrarClientes = () => {
        if (!busca.trim()) {
            setClientesFiltrados(clientes);
            return;
        }

        const filtrados = clientes.filter(cliente =>
            cliente.nome.toLowerCase().includes(busca.toLowerCase()) ||
            cliente.cpf_cnpj.includes(busca) ||
            cliente.email.toLowerCase().includes(busca.toLowerCase())
        );
        setClientesFiltrados(filtrados);
    };

    const abrirModalNovo = () => {
        setClienteEditando(null);
        setNovoCliente({
            nome: '',
            cpf_cnpj: '',
            email: '',
            idade_data_fundacao: '',
            renda_mensal: '',
            senha: ''
        });
        setMostrarModal(true);
    };

    const abrirModalEditar = (cliente: Cliente) => {
        setClienteEditando(cliente);
        // Determinar tipo de pessoa baseado no CPF/CNPJ
        // CPF tem 11 dígitos, CNPJ tem 14 dígitos
        const cpfCnpjLimpo = cliente.cpf_cnpj.replace(/\D/g, '');
        const tipoDetectado = cpfCnpjLimpo.length === 11 ? 'fisica' : 'juridica';
        setTipoPessoa(tipoDetectado);

        setNovoCliente({
            nome: cliente.nome,
            cpf_cnpj: cliente.cpf_cnpj,
            email: cliente.email,
            idade_data_fundacao: cliente.idade_data_fundacao,
            renda_mensal: cliente.renda_mensal.toString(),
            senha: ''
        });
        setMostrarModal(true);
    };

    const fecharModal = () => {
        setMostrarModal(false);
        setClienteEditando(null);
        setErro('');
        setSucesso('');
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNovoCliente(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const salvarCliente = async (e: React.FormEvent) => {
        e.preventDefault();
        setCarregando(true);
        setErro('');
        setSucesso('');

        try {
            const dados: any = {
                nome: novoCliente.nome,
                cpf_cnpj: novoCliente.cpf_cnpj,
                email: novoCliente.email,
                renda_mensal: parseFloat(novoCliente.renda_mensal),
                idade_data_fundacao: novoCliente.idade_data_fundacao
            };

            if (clienteEditando) {
                await api.put(`/clientes/${clienteEditando.id}`, dados);
                setSucesso('Cliente atualizado com sucesso!');
            } else {
                dados.senha = novoCliente.senha;
                dados.saldo = 1000;
                await api.post('/clientes/registro', dados);
                setSucesso('Cliente criado com sucesso!');
            }

            setTimeout(() => {
                fecharModal();
                carregarClientes();
            }, 1500);

        } catch (error: any) {
            console.error('Erro ao salvar cliente:', error);
            setErro(error.response?.data?.mensagem || 'Erro ao salvar cliente.');
        } finally {
            setCarregando(false);
        }
    };

    const excluirCliente = async (id: number, nome: string) => {
        if (!window.confirm(`Tem certeza que deseja excluir o cliente "${nome}"?`)) {
            return;
        }

        try {
            await api.delete(`/clientes/${id}`);
            setSucesso('Cliente excluído com sucesso!');
            carregarClientes();
            setTimeout(() => setSucesso(''), 3000);
        } catch (error: any) {
            console.error('Erro ao excluir cliente:', error);
            setErro(error.response?.data?.mensagem || 'Erro ao excluir cliente.');
            setTimeout(() => setErro(''), 3000);
        }
    };

    const formatarMoeda = (valor: number) => {
        return valor.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    };

    if (carregando && clientes.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando clientes...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold">
                                <span className="mr-2">👥</span>
                                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Painel de Clientes
                                </span>
                            </h1>
                            <p className="text-gray-600 mt-2">
                                Gerencie todos os clientes do sistema
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={abrirModalNovo}
                                className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:scale-105 shadow-lg font-medium"
                            >
                                + Novo Cliente
                            </button>
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-200 transform hover:scale-105 shadow-lg font-medium"
                            >
                                ← Voltar
                            </button>
                        </div>
                    </div>
                </div>

                {/* Barra de Pesquisa */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <div className="flex items-center gap-4">
                        <div className="flex-1 relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-400 text-xl">🔍</span>
                            </div>
                            <input
                                type="text"
                                value={busca}
                                onChange={(e) => setBusca(e.target.value)}
                                placeholder="Buscar por nome, CPF/CNPJ ou email..."
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                            />
                        </div>
                        <div className="text-sm text-gray-500">
                            {clientesFiltrados.length} cliente(s) encontrado(s)
                        </div>
                    </div>
                </div>

                {/* Lista de Clientes */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    {clientesFiltrados.length === 0 ? (
                        <div className="p-12 text-center">
                            <span className="text-6xl block mb-4">📭</span>
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                {busca ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
                            </h3>
                            <p className="text-gray-500">
                                {busca ? 'Tente uma busca diferente' : 'Clique em "Novo Cliente" para começar'}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                                    <tr>
                                        <th className="px-6 py-4 text-left font-semibold">Cliente</th>
                                        <th className="px-6 py-4 text-left font-semibold">CPF/CNPJ</th>
                                        <th className="px-6 py-4 text-left font-semibold">Idade/Fundação</th>
                                        <th className="px-6 py-4 text-left font-semibold">Renda Mensal</th>
                                        <th className="px-6 py-4 text-left font-semibold">Saldo</th>
                                        <th className="px-6 py-4 text-center font-semibold">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {clientesFiltrados.map((cliente, index) => (
                                        <tr key={cliente.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="font-medium text-gray-900">{cliente.nome}</div>
                                                    <div className="text-sm text-gray-500">{cliente.email}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-900 font-mono">{cliente.cpf_cnpj}</td>
                                            <td className="px-6 py-4 text-gray-900">
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                    {cliente.idade_data_fundacao}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-green-600 font-semibold">
                                                {formatarMoeda(cliente.renda_mensal)}
                                            </td>
                                            <td className="px-6 py-4 text-blue-600 font-semibold">
                                                {formatarMoeda(cliente.saldo)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-center gap-2">
                                                    <button
                                                        onClick={() => abrirModalEditar(cliente)}
                                                        className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                                                    >
                                                        ✏️ Editar
                                                    </button>
                                                    <button
                                                        onClick={() => excluirCliente(cliente.id, cliente.nome)}
                                                        className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                                                    >
                                                        🗑️ Excluir
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Modal de Novo/Editar Cliente */}
                {mostrarModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        {clienteEditando ? '✏️ Editar Cliente' : '➕ Novo Cliente'}
                                    </h2>
                                    <button
                                        onClick={fecharModal}
                                        className="text-gray-400 hover:text-gray-600 text-2xl"
                                    >
                                        ✕
                                    </button>
                                </div>

                                <form onSubmit={salvarCliente} className="space-y-6">
                                    {!clienteEditando && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                                Tipo de Pessoa
                                            </label>
                                            <div className="flex gap-4">
                                                <button
                                                    type="button"
                                                    onClick={() => setTipoPessoa('fisica')}
                                                    className={`flex-1 p-4 rounded-xl border-2 transition-all ${tipoPessoa === 'fisica'
                                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                        : 'border-gray-300 hover:border-gray-400'
                                                        }`}
                                                >
                                                    <div className="text-center">
                                                        <span className="text-2xl block mb-2">👤</span>
                                                        <span className="font-medium">Pessoa Física</span>
                                                    </div>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setTipoPessoa('juridica')}
                                                    className={`flex-1 p-4 rounded-xl border-2 transition-all ${tipoPessoa === 'juridica'
                                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                        : 'border-gray-300 hover:border-gray-400'
                                                        }`}
                                                >
                                                    <div className="text-center">
                                                        <span className="text-2xl block mb-2">🏢</span>
                                                        <span className="font-medium">Pessoa Jurídica</span>
                                                    </div>
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                {tipoPessoa === 'fisica' ? 'Nome Completo' : 'Razão Social'}
                                            </label>
                                            <input
                                                type="text"
                                                name="nome"
                                                value={novoCliente.nome}
                                                onChange={handleInputChange}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                {tipoPessoa === 'fisica' ? 'CPF' : 'CNPJ'}
                                            </label>
                                            <input
                                                type="text"
                                                name="cpf_cnpj"
                                                value={novoCliente.cpf_cnpj}
                                                onChange={handleInputChange}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                required
                                                disabled={!!clienteEditando}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={novoCliente.email}
                                                onChange={handleInputChange}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                required
                                            />
                                        </div>

                                        {tipoPessoa === 'fisica' ? (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Idade
                                                </label>
                                                <input
                                                    type="text"
                                                    name="idade_data_fundacao"
                                                    value={novoCliente.idade_data_fundacao}
                                                    onChange={handleInputChange}
                                                    placeholder="Ex: 25 anos"
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    required
                                                />
                                            </div>
                                        ) : (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Data de Fundação
                                                </label>
                                                <input
                                                    type="date"
                                                    name="idade_data_fundacao"
                                                    value={novoCliente.idade_data_fundacao}
                                                    onChange={handleInputChange}
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    required
                                                />
                                            </div>
                                        )}

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                {tipoPessoa === 'fisica' ? 'Renda Mensal' : 'Faturamento Mensal'}
                                            </label>
                                            <input
                                                type="number"
                                                name="renda_mensal"
                                                value={novoCliente.renda_mensal}
                                                onChange={handleInputChange}
                                                step="0.01"
                                                min="0"
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                required
                                            />
                                        </div>

                                        {!clienteEditando && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Senha de Acesso
                                                </label>
                                                <input
                                                    type="password"
                                                    name="senha"
                                                    value={novoCliente.senha}
                                                    onChange={handleInputChange}
                                                    placeholder="Digite a senha para a conta"
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    required
                                                    minLength={6}
                                                />
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Mínimo 6 caracteres
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <button
                                            type="button"
                                            onClick={fecharModal}
                                            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={carregando}
                                            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 transition-all font-medium"
                                        >
                                            {carregando ? 'Salvando...' : (clienteEditando ? 'Atualizar' : 'Criar Cliente')}
                                        </button>
                                    </div>
                                </form>

                                {/* Mensagens no Modal */}
                                {erro && (
                                    <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                                        {erro}
                                    </div>
                                )}

                                {sucesso && (
                                    <div className="mt-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
                                        {sucesso}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Mensagens Globais */}
                {erro && !mostrarModal && (
                    <div className="fixed bottom-4 right-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl shadow-lg">
                        <div className="flex items-center">
                            <span className="text-xl mr-2">❌</span>
                            {erro}
                        </div>
                    </div>
                )}

                {sucesso && !mostrarModal && (
                    <div className="fixed bottom-4 right-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl shadow-lg">
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

export default PainelClientes;
