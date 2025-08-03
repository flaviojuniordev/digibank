const pool = require('../models/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();


exports.register = async (req, res) => {
    const { nome, email, cpf_cnpj, idade_data_fundacao, renda_mensal, senha, saldo = 1000 } = req.body;

    try {
        const clienteExistente = await pool.query('SELECT id FROM clientes WHERE email = $1 OR cpf_cnpj = $2', [email, cpf_cnpj]);
        if (clienteExistente.rows.length > 0) {
            return res.status(400).json({ mensagem: 'Cliente já existe com este email ou CPF/CNPJ.' });
        }

        const hashedPassword = await bcrypt.hash(senha, 10);

        const clienteResult = await pool.query(`
            INSERT INTO clientes (nome, email, cpf_cnpj, idade_data_fundacao, renda_mensal, senha, saldo, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
            RETURNING id, nome, email
        `, [nome, email, cpf_cnpj, idade_data_fundacao, renda_mensal, hashedPassword, saldo]);

        const cliente = clienteResult.rows[0];

        return res.status(201).json({
            mensagem: 'Cliente registrado com sucesso.',
            cliente: cliente
        });

    } catch (err) {
        console.error('Erro ao registrar cliente:', err);
        res.status(500).json({ mensagem: 'Erro ao registrar cliente.' });
    }
};
exports.login = async (req, res) => {
    const { email, senha } = req.body;

    try {

        const result = await pool.query('SELECT id, nome, email, senha FROM clientes WHERE email = $1', [email]);

        if (result.rows.length === 0) {
            return res.status(401).json({ mensagem: 'Email ou senha inválidos.' });
        }

        const cliente = result.rows[0];

        const senhaValida = await bcrypt.compare(senha, cliente.senha);
        if (!senhaValida) {
            return res.status(401).json({ mensagem: 'Email ou senha inválidos.' });
        }

        const token = jwt.sign({ id: cliente.id }, process.env.JWT_SECRET, { expiresIn: '24h' });

        res.json({
            mensagem: 'Login realizado com sucesso.',
            token,
            cliente: {
                id: cliente.id,
                nome: cliente.nome,
                email: cliente.email
            },
            redirectUrl: '/dashboard'
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ mensagem: 'Erro ao fazer login.' });
    }
};

exports.listarClientes = async (req, res) => {
    const { filtro } = req.query;

    try {
        let result;
        if (filtro) {
            result = await pool.query(`
                SELECT c.id, c.nome, c.email, c.cpf_cnpj, c.idade_data_fundacao, c.renda_mensal, 
                       c.saldo, c.created_at
                FROM clientes c
                WHERE (c.nome ILIKE $1 OR c.cpf_cnpj ILIKE $1 OR c.email ILIKE $1)
                ORDER BY c.created_at DESC
            `, [`%${filtro}%`]);
        } else {
            result = await pool.query(`
                SELECT c.id, c.nome, c.email, c.cpf_cnpj, c.idade_data_fundacao, c.renda_mensal, 
                       c.saldo, c.created_at
                FROM clientes c
                ORDER BY c.created_at DESC
            `);
        }

        res.json(result.rows);

    } catch (err) {
        console.error('Erro ao buscar clientes:', err);
        res.status(500).json({ mensagem: 'Erro ao buscar clientes.' });
    }
};

exports.atualizarCliente = async (req, res) => {
    const { id } = req.params;
    const { nome, idade_data_fundacao, renda_mensal, email } = req.body;

    try {
        await pool.query(`
            UPDATE clientes
            SET nome = $1, idade_data_fundacao = $2, renda_mensal = $3, email = $4
            WHERE id = $5
        `, [nome, idade_data_fundacao, renda_mensal, email, id]);

        res.json({ mensagem: 'Cliente atualizado com sucesso.' });

    } catch (err) {
        console.error('Erro ao atualizar cliente:', err);
        res.status(500).json({ mensagem: 'Erro ao atualizar cliente.' });
    }
};

exports.deletarCliente = async (req, res) => {
    const { id } = req.params;

    try {

        const clienteExiste = await pool.query('SELECT id FROM clientes WHERE id = $1', [id]);
        if (clienteExiste.rows.length === 0) {
            return res.status(404).json({ mensagem: 'Cliente não encontrado.' });
        }

        await pool.query('DELETE FROM transacoes WHERE remetente_id = $1 OR destinatario_id = $1', [id]);

        await pool.query('DELETE FROM clientes WHERE id = $1', [id]);
        res.json({ mensagem: 'Cliente removido com sucesso.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ mensagem: 'Erro ao deletar cliente.' });
    }
};
