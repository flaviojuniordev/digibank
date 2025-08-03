const express = require('express');
const router = express.Router();
const transacaoController = require('../controllers/transacaoController');
const auth = require('../middleware/auth');

router.post('/transferir', auth, transacaoController.transferir);
router.get('/saldo', auth, transacaoController.verSaldo);
router.get('/buscar-destinatario', auth, transacaoController.buscarDestinatario);
router.get('/', auth, transacaoController.verTransacoes);

module.exports = router;
