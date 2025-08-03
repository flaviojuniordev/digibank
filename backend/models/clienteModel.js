const pool = require('./db');

const ClienteModel = {
    async findById(id) {
        const query = 'SELECT id, nome, cpf_cnpj, idade_data_fundacao, renda_mensal, saldo, email FROM clientes WHERE id = $1';
        const values = [id];
        const { rows } = await pool.query(query, values);
        return rows[0];
    },

    async findByEmail(email) {
        const query = 'SELECT * FROM clientes WHERE email = $1';
        const values = [email];
        const { rows } = await pool.query(query, values);
        return rows[0];
    },

    async create({ nome, cpf_cnpj, idade_data_fundacao, renda_mensal, email, senha }) {
        const query = `
      INSERT INTO clientes (nome, cpf_cnpj, idade_data_fundacao, renda_mensal, email, senha)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
        const values = [nome, cpf_cnpj, idade_data_fundacao, renda_mensal, email, senha];
        const { rows } = await pool.query(query, values);
        return rows[0];
    },

    async update(id, { nome, idade_data_fundacao, renda_mensal }) {
        const query = `
      UPDATE clientes 
      SET nome = $1, idade_data_fundacao = $2, renda_mensal = $3
      WHERE id = $4
      RETURNING *`;
        const values = [nome, idade_data_fundacao, renda_mensal, id];
        const { rows } = await pool.query(query, values);
        return rows[0];
    },

    async delete(id) {
        const query = 'DELETE FROM clientes WHERE id = $1';
        const values = [id];
        await pool.query(query, values);
    },

    async listAll() {
        const query = 'SELECT id, nome, cpf_cnpj, idade_data_fundacao, renda_mensal, saldo, email FROM clientes';
        const { rows } = await pool.query(query);
        return rows;
    },
};

module.exports = ClienteModel;
