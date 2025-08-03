# 🏦 DigiBank - Desafio Técnico CDC Bank

Um sistema bancário digital completo desenvolvido como **desafio técnico para a CDC Bank**. Projeto construído com **React + TypeScript** no frontend e **Node.js + Express** no backend, utilizando **PostgreSQL** como banco de dados e **Docker** para containerização.

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Quick Start](#-quick-start-docker)
- [Competências Demonstradas](#-competências-demonstradas)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Arquitetura](#-arquitetura-do-projeto)
- [Instalação e Configuração](#-instalação)
- [Documentação da API](#-documentação-da-api)
- [Interface do Usuário](#-interface-do-usuário)
- [Segurança](#-segurança)
- [Roadmap](#-roadmap)
- [Contato](#-contato)

## 🎯 Visão Geral

O **DigiBank** é uma aplicação web completa desenvolvida como **desafio técnico para a CDC Bank**. O sistema simula um banco digital moderno, demonstrando competências em desenvolvimento full-stack, arquitetura de software e melhores práticas de desenvolvimento.

O projeto permite cadastro de clientes (Pessoa Física e Jurídica), autenticação segura com JWT, transferências bancárias em tempo real, visualização de histórico detalhado e painel administrativo completo para gestão de clientes.

### Principais Características:

- ✅ **Sistema de Autenticação** com JWT e segurança bcrypt
- ✅ **Gestão Completa de Clientes** (Pessoa Física e Jurídica)
- ✅ **Transferências Bancárias** em tempo real com validações
- ✅ **Histórico de Transações** detalhado e filtrado
- ✅ **Painel Administrativo** para gestão completa
- ✅ **Interface Responsiva** com Tailwind CSS
- ✅ **Containerização Docker** para deploy facilitado
- ✅ **Validações Robustas** no frontend e backend
- ✅ **Arquitetura Escalável** seguindo padrões de mercado

## 🚀 Funcionalidades

### 👤 Gestão de Usuários
- **Cadastro de Clientes**: Suporte para Pessoa Física (CPF) e Pessoa Jurídica (CNPJ)
- **Login Seguro**: Autenticação com JWT e validação de credenciais
- **Perfil do Usuário**: Visualização e edição de dados pessoais
- **Logout**: Encerramento seguro da sessão

### 💰 Operações Bancárias
- **Saldo em Tempo Real**: Visualização do saldo atual da conta
- **Transferências**: Envio de dinheiro entre contas com validações
- **Busca de Destinatários**: Localização de outros usuários por nome ou documento
- **Confirmação de Transferência**: Sistema de confirmação antes da execução

### 📊 Relatórios e Histórico
- **Histórico Completo**: Visualização de todas as transações
- **Detalhes da Transação**: Informações completas sobre cada operação
- **Filtragem**: Busca e organização do histórico
- **Status da Transação**: Identificação visual do tipo de operação

### 🛠️ Painel Administrativo
- **Gestão de Clientes**: Criação, edição e exclusão de clientes
- **Busca Avançada**: Filtros por nome, documento ou email
- **Validação de Dados**: Verificação automática de CPF/CNPJ
- **Relatórios**: Estatísticas e informações dos clientes

## 🛠️ Tecnologias Utilizadas

| Categoria | Tecnologias |
|-----------|-------------|
| **Frontend** | React 19.1.0, TypeScript, Vite, Tailwind CSS 3.4.0, Axios, React Router DOM |
| **Backend** | Node.js 20, Express 5.1.0, PostgreSQL, JWT, bcryptjs, pg, CORS, dotenv |
| **DevOps** | Docker, Docker Compose, ESLint, PostCSS, Autoprefixer, Nodemon |

## 🏗️ Arquitetura do Projeto

### � Estrutura
```
digibank/
├── backend/          # API Node.js + Express
├── frontend/         # React + TypeScript
├── scripts/          # Scripts SQL
└── docker-compose.yml
```

### 🔧 Padrões Implementados
- **MVC Architecture** no backend
- **Component-Based** no frontend  
- **RESTful API** para comunicação
- **JWT Authentication** para segurança
- **Docker Multi-Service** para isolamento

## � Quick Start (Docker)

**Avaliação rápida do projeto:**

```bash
# Clone e execute
git clone <url-do-repositorio>
cd digibank
docker-compose up --build

# Acesso: http://localhost:5173
# Credenciais: joao@exemplo.com / 123456
```

## 🎯 Competências Demonstradas

### 💻 Desenvolvimento Full-Stack
- **Frontend**: React 19 + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + RESTful APIs  
- **Database**: PostgreSQL com modelagem relacional

### 🏗️ Arquitetura e Padrões
- **MVC Pattern** para organização backend
- **Component-Based Architecture** no React
- **JWT Authentication** stateless
- **RESTful API Design** com códigos HTTP apropriados

### 🔒 Segurança
- Hash de senhas com bcryptjs
- Middleware JWT personalizado
- Validação robusta frontend/backend
- CORS e environment variables

### 🐳 DevOps
- Docker & Docker Compose
- Multi-stage builds
- Health checks e dependency management
- Scripts de automação multiplataforma

## � Instalação e Configuração

###  Docker (Recomendado)
```bash
git clone <url-do-repositorio>
cd digibank
docker-compose up --build
```

### 💻 Local Development
**Pré-requisitos**: Node.js 20+, PostgreSQL 12+

```bash
# Backend
cd backend && npm install

# Frontend  
cd frontend && npm install

# Configure .env com credenciais do banco
# Execute scripts/init.sql no PostgreSQL

# Start services
npm start  # backend (porta 3001)
npm run dev  # frontend (porta 5173)
```

## 📡 Documentação da API

### Base URL
```
http://localhost:3001
```

### Endpoints Públicos

#### 🔐 Autenticação

**POST** `/clientes/register` ou `/clientes/registro`
- **Descrição**: Cadastro de novo cliente
- **Body**:
```json
{
    "nome": "João Silva",
    "email": "joao@email.com",
    "cpf_cnpj": "123.456.789-00",
    "idade_data_fundacao": "30 anos",
    "renda_mensal": 5000.00,
    "senha": "123456",
    "saldo": 1000.00
}
```

**POST** `/clientes/login`
- **Descrição**: Login do cliente
- **Body**:
```json
{
    "email": "joao@email.com",
    "senha": "123456"
}
```

### Endpoints Protegidos (Requer Token JWT)

#### 👥 Clientes

**GET** `/clientes/me`
- **Descrição**: Dados do cliente autenticado
- **Headers**: `Authorization: Bearer <token>`

**GET** `/clientes?filtro=termo`
- **Descrição**: Lista todos os clientes (com filtro opcional)
- **Headers**: `Authorization: Bearer <token>`

**PUT** `/clientes/:id`
- **Descrição**: Atualiza dados do cliente
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
```json
{
    "nome": "João Santos",
    "idade_data_fundacao": "31 anos",
    "renda_mensal": 5500.00,
    "email": "joao.santos@email.com"
}
```

**DELETE** `/clientes/:id`
- **Descrição**: Remove cliente (e suas transações)
- **Headers**: `Authorization: Bearer <token>`

#### 💸 Transações

**GET** `/transacoes/saldo`
- **Descrição**: Saldo atual do cliente autenticado
- **Headers**: `Authorization: Bearer <token>`

**GET** `/transacoes`
- **Descrição**: Histórico de transações do cliente
- **Headers**: `Authorization: Bearer <token>`

**GET** `/transacoes/buscar-destinatario?busca=termo`
- **Descrição**: Busca destinatários para transferência
- **Headers**: `Authorization: Bearer <token>`

**POST** `/transacoes/transferir`
- **Descrição**: Realiza transferência entre contas
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
```json
{
    "destinatarioId": 2,
    "valor": 100.00,
    "cpfDestinatario": "987.654.321-00"
}
```

## 🎨 Interface do Usuário

### 🌟 Características da Interface

- **Design Responsivo**: Adapta-se a dispositivos móveis e desktop
- **Tema Moderno**: Gradientes coloridos e interface limpa
- **Feedback Visual**: Mensagens de sucesso, erro e carregamento
- **Navegação Intuitiva**: Menu claro e rotas bem definidas
- **Emojis**: Interface amigável com ícones visuais

### 📱 Páginas Principais

#### 1. **Login** (`/`)
- Formulário de autenticação
- Validação de credenciais
- Redirecionamento para dashboard
- Link para cadastro

#### 2. **Cadastro** (`/register`)
- Seleção entre Pessoa Física e Jurídica
- Validação de campos em tempo real
- Campos adaptativos conforme tipo de pessoa
- Confirmação de senha

#### 3. **Dashboard** (`/dashboard`)
- Saudação personalizada ao usuário
- Exibição do saldo atual
- Dados pessoais do cliente
- Ações rápidas (Transferir, Histórico, Clientes)
- Botão de logout

#### 4. **Transferência** (`/transferencia`)
- Exibição do saldo atual
- Busca de destinatários
- Seleção de destinatário
- Inserção do valor
- Confirmação da transferência
- Validações de saldo

#### 5. **Histórico** (`/historico`)
- Lista completa de transações
- Informações detalhadas (remetente, destinatário, valor, data)
- Ordenação por data (mais recente primeiro)
- Status visual das operações

#### 6. **Painel de Clientes** (`/clientes`)
- Lista de todos os clientes do sistema
- Busca e filtros
- Criação de novos clientes
- Edição de dados existentes
- Exclusão de clientes
- Modal responsivo para operações

### 🎨 Sistema de Cores

- **Primário**: Gradiente azul para roxo (`from-blue-500 to-purple-600`)
- **Secundário**: Gradiente rosa para roxo (`from-pink-500 to-purple-600`)
- **Sucesso**: Verde (`green-500`)
- **Erro**: Vermelho (`red-500`)
- **Aviso**: Amarelo (`yellow-500`)
- **Neutro**: Cinza (`gray-500`)

### ⚡ Animações e Transições

- **Hover Effects**: Transformações suaves nos botões
- **Loading States**: Indicadores de carregamento animados
- **Scale Effects**: Efeitos de escala em elementos interativos
- **Smooth Transitions**: Transições suaves entre estados

## 🔒 Segurança

### 🛡️ Implementações
- **Hash bcryptjs** com salt rounds
- **JWT tokens** com expiração configurável
- **Middleware de autenticação** personalizado
- **Validação robusta** frontend + backend
- **CORS** e environment variables

### � Fluxo de Autenticação
1. Credenciais → Hash verification
2. JWT generation → Token return
3. localStorage storage → Header authorization
4. Middleware validation per request

---

## 📞 Contato

**Desenvolvido para o Desafio Técnico CDC Bank**

Para dúvidas técnicas ou feedback sobre o projeto:

- 📧 **Email**: [devflaviojunior@gmail.com]
- 🔗 **LinkedIn**: [Flavio Junior](https://www.linkedin.com/in/flaviojrdev/)
- 🐙 **GitHub**: [Flavio Junior](https://github.com/FlavioJunior)
- 📁 **Portfólio**: [Meu Portifólio](https://flaviojunior-portfolio.vercel.app/)

### 🎯 Sobre o Desafio

Este projeto foi desenvolvido como resposta ao desafio técnico da **CDC Bank**, demonstrando competências em:

- ✅ **Desenvolvimento Full-Stack** com tecnologias modernas
- ✅ **Arquitetura de Software** escalável e bem estruturada  
- ✅ **DevOps** com Docker e containerização
- ✅ **Segurança** com autenticação JWT e validações
- ✅ **Boas Práticas** de desenvolvimento e código limpo

---

<div align="center">

**Desenvolvido com ❤️ para o Desafio CDC Bank**

[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19+-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

**Sistema bancário digital completo - Demonstração de competências técnicas**

</div>