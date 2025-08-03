const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');
const auth = require('../middleware/auth');
const pool = require('../models/db');

// Rotas públicas
router.post('/register', clienteController.register);
router.post('/registro', clienteController.register); 
router.post('/login', clienteController.login);

router.get('/', auth, clienteController.listarClientes);
router.put('/:id', auth, clienteController.atualizarCliente);
router.delete('/:id', auth, clienteController.deletarCliente);

router.get('/me', auth, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT c.id, c.nome, c.email, c.cpf_cnpj, c.idade_data_fundacao, c.renda_mensal, c.saldo
            FROM clientes c
            WHERE c.id = $1
        `, [req.clienteId]);
        const cliente = result.rows[0];

        if (!cliente) {
            return res.status(404).json({ mensagem: 'Cliente não encontrado' });
        }

        res.json(cliente);
    } catch (error) {
        console.error('Erro na rota /me:', error);
        res.status(500).json({ mensagem: 'Erro no servidor' });
    }
});

module.exports = router;
