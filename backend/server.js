const express = require('express');
const cors = require('cors');
require('dotenv').config();

const clienteRoutes = require('./routes/clienteRoutes');
const transacaoRoutes = require('./routes/transacaoRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/clientes', clienteRoutes);
app.use('/transacoes', transacaoRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
