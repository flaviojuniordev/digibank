import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
    const [formData, setFormData] = useState({
        nome: '',
        cpf_cnpj: '',
        email: '',
        senha: '',
        confirmarSenha: '',
        idade: '',
        data_fundacao: '',
        renda_mensal: '',
        saldo: '1000.00' // Saldo inicial padrão
    });
    const [tipoPessoa, setTipoPessoa] = useState<'fisica' | 'juridica'>('fisica');
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.senha !== formData.confirmarSenha) {
            setErro('As senhas não coincidem.');
            return;
        }

        if (formData.senha.length < 6) {
            setErro('A senha deve ter pelo menos 6 caracteres.');
            return;
        }

        setCarregando(true);
        setErro('');
        setSucesso('');

        try {
            const dadosEnvio: any = {
                nome: formData.nome,
                cpf_cnpj: formData.cpf_cnpj,
                email: formData.email,
                senha: formData.senha,
                renda_mensal: parseFloat(formData.renda_mensal),
                saldo: parseFloat(formData.saldo)
            };

            if (tipoPessoa === 'fisica') {
                dadosEnvio.idade_data_fundacao = formData.idade + ' anos';
            } else {
                dadosEnvio.idade_data_fundacao = formData.data_fundacao;
            }

            await api.post('/clientes/registro', dadosEnvio);

            setSucesso('Conta criada com sucesso! Redirecionando para o login...');

            setTimeout(() => {
                navigate('/');
            }, 2000);

        } catch (error: any) {
            console.error('Erro no registro:', error);
            setErro(error.response?.data?.mensagem || 'Erro ao criar conta. Tente novamente.');
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold">
                                <span className="mr-2">🏦</span>
                                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Criar Conta
                                </span>
                            </h1>
                            <p className="text-gray-600 mt-2">Cadastre-se no DigiBank</p>
                        </div>
                        <button
                            onClick={() => navigate('/')}
                            className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-200 transform hover:scale-105 shadow-lg font-medium"
                        >
                            ← Voltar
                        </button>
                    </div>
                </div>

                {/* Formulário de Registro */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Tipo de Pessoa */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Tipo de Conta
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Nome */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {tipoPessoa === 'fisica' ? 'Nome Completo' : 'Razão Social'}
                                </label>
                                <input
                                    type="text"
                                    name="nome"
                                    value={formData.nome}
                                    onChange={handleInputChange}
                                    placeholder={tipoPessoa === 'fisica' ? 'Digite seu nome completo' : 'Digite a razão social'}
                                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>

                            {/* CPF/CNPJ */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {tipoPessoa === 'fisica' ? 'CPF' : 'CNPJ'}
                                </label>
                                <input
                                    type="text"
                                    name="cpf_cnpj"
                                    value={formData.cpf_cnpj}
                                    onChange={handleInputChange}
                                    placeholder={tipoPessoa === 'fisica' ? '000.000.000-00' : '00.000.000/0000-00'}
                                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>

                            {/* Idade ou Data de Fundação */}
                            {tipoPessoa === 'fisica' ? (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Idade
                                    </label>
                                    <input
                                        type="number"
                                        name="idade"
                                        value={formData.idade}
                                        onChange={handleInputChange}
                                        placeholder="Ex: 25"
                                        min="18"
                                        max="120"
                                        className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                                        name="data_fundacao"
                                        value={formData.data_fundacao}
                                        onChange={handleInputChange}
                                        className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                            )}

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="seu@email.com"
                                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>

                            {/* Renda Mensal */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {tipoPessoa === 'fisica' ? 'Renda Mensal' : 'Faturamento Mensal'}
                                </label>
                                <input
                                    type="number"
                                    name="renda_mensal"
                                    value={formData.renda_mensal}
                                    onChange={handleInputChange}
                                    placeholder="0.00"
                                    step="0.01"
                                    min="0"
                                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>

                            {/* Senha */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Senha
                                </label>
                                <input
                                    type="password"
                                    name="senha"
                                    value={formData.senha}
                                    onChange={handleInputChange}
                                    placeholder="Mínimo 6 caracteres"
                                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                    minLength={6}
                                />
                            </div>

                            {/* Confirmar Senha */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirmar Senha
                                </label>
                                <input
                                    type="password"
                                    name="confirmarSenha"
                                    value={formData.confirmarSenha}
                                    onChange={handleInputChange}
                                    placeholder="Confirme sua senha"
                                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                        </div>

                        {/* Saldo Inicial */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Saldo Inicial (R$)
                            </label>
                            <input
                                type="number"
                                name="saldo"
                                value={formData.saldo}
                                onChange={handleInputChange}
                                placeholder="1000.00"
                                step="0.01"
                                min="0"
                                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                            <p className="text-sm text-gray-500 mt-1">
                                Valor mínimo recomendado: R$ 100,00
                            </p>
                        </div>

                        {/* Botão de Submit */}
                        <button
                            type="submit"
                            disabled={carregando}
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6 rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg disabled:transform-none"
                        >
                            {carregando ? (
                                <span className="flex items-center justify-center">
                                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
                                    Criando conta...
                                </span>
                            ) : (
                                '🏦 Criar Conta'
                            )}
                        </button>
                    </form>

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
        </div>
    );
};

export default Register;
