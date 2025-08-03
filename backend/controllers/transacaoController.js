const pool = require('../models/db');

exports.transferir = async (req, res) => {
    const { destinatarioId, valor, cpfDestinatario } = req.body;
    const remetenteId = req.clienteId;

    try {
        if (!valor || valor <= 0) {
            return res.status(400).json({ mensagem: 'Valor deve ser maior que zero.' });
        }

        if (!destinatarioId && !cpfDestinatario) {
            return res.status(400).json({ mensagem: 'É necessário informar o destinatário.' });
        }

        if (destinatarioId && parseInt(destinatarioId) === parseInt(remetenteId)) {
            return res.status(400).json({ mensagem: 'Não é possível transferir para si mesmo.' });
        }

        const remetente = await pool.query('SELECT saldo, nome FROM clientes WHERE id = $1', [remetenteId]);
        if (remetente.rows.length === 0) {
            return res.status(404).json({ mensagem: 'Remetente não encontrado.' });
        }

        const saldoRemetente = parseFloat(remetente.rows[0].saldo);
        if (saldoRemetente < valor) {
            return res.status(400).json({
                mensagem: `Saldo insuficiente. Saldo atual: R$ ${saldoRemetente.toFixed(2)}`
            });
        }

        let destinatario;
        if (destinatarioId) {
            destinatario = await pool.query('SELECT id, nome, cpf_cnpj FROM clientes WHERE id = $1', [destinatarioId]);
        } else {
            destinatario = await pool.query('SELECT id, nome, cpf_cnpj FROM clientes WHERE cpf_cnpj = $1', [cpfDestinatario]);
        }

        if (destinatario.rows.length === 0) {
            return res.status(404).json({ mensagem: 'Destinatário não encontrado.' });
        }

        const dadosDestinatario = destinatario.rows[0];

        if (dadosDestinatario.id === remetenteId) {
            return res.status(400).json({ mensagem: 'Não é possível transferir para si mesmo.' });
        }

        await pool.query('BEGIN');

        await pool.query('UPDATE clientes SET saldo = saldo - $1 WHERE id = $2', [valor, remetenteId]);
        await pool.query('UPDATE clientes SET saldo = saldo + $1 WHERE id = $2', [valor, dadosDestinatario.id]);
        await pool.query(`
            INSERT INTO transacoes (remetente_id, destinatario_id, valor)
            VALUES ($1, $2, $3)
        `, [remetenteId, dadosDestinatario.id, valor]);

        await pool.query('COMMIT');

        res.json({
            mensagem: 'Transferência realizada com sucesso.',
            destinatario: {
                nome: dadosDestinatario.nome,
                cpf_cnpj: dadosDestinatario.cpf_cnpj
            },
            valor: valor,
            novoSaldo: saldoRemetente - valor
        });

    } catch (err) {
        await pool.query('ROLLBACK');
        console.error('Erro na transferência:', err);
        res.status(500).json({ mensagem: 'Erro ao realizar transferência.' });
    }
};

exports.verSaldo = async (req, res) => {
    try {
        const result = await pool.query('SELECT saldo FROM clientes WHERE id = $1', [req.clienteId]);
        res.json({ saldo: result.rows[0].saldo });
    } catch (err) {
        res.status(500).json({ mensagem: 'Erro ao obter saldo.' });
    }
};

exports.verTransacoes = async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT t.id, c1.nome AS remetente, c2.nome AS destinatario, t.valor, t.data
      FROM transacoes t
      JOIN clientes c1 ON c1.id = t.remetente_id
      JOIN clientes c2 ON c2.id = t.destinatario_id
      WHERE t.remetente_id = $1 OR t.destinatario_id = $1
      ORDER BY t.data DESC
    `, [req.clienteId]);

        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ mensagem: 'Erro ao obter transações.' });
    }
};

exports.buscarDestinatario = async (req, res) => {
    const { busca } = req.query;
    const clienteAtualId = req.clienteId;

    try {
        if (!busca || busca.trim().length < 3) {
            return res.status(400).json({ mensagem: 'Digite pelo menos 3 caracteres para buscar.' });
        }

        const result = await pool.query(`
            SELECT id, nome, cpf_cnpj 
            FROM clientes 
            WHERE (nome ILIKE $1 OR cpf_cnpj ILIKE $1) 
            AND id != $2
            LIMIT 10
        `, [`%${busca.trim()}%`, clienteAtualId]);

        res.json(result.rows);
    } catch (err) {
        console.error('Erro ao buscar destinatário:', err);
        res.status(500).json({ mensagem: 'Erro ao buscar destinatário.' });
    }
};
