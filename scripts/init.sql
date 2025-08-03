CREATE TABLE IF NOT EXISTS clientes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    cpf_cnpj VARCHAR(18) UNIQUE NOT NULL,
    idade_data_fundacao VARCHAR(50) NOT NULL,
    renda_mensal DECIMAL(10,2) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    saldo DECIMAL(10,2) DEFAULT 1000.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS transacoes (
    id SERIAL PRIMARY KEY,
    remetente_id INTEGER REFERENCES clientes(id) ON DELETE CASCADE,
    destinatario_id INTEGER REFERENCES clientes(id) ON DELETE CASCADE,
    valor DECIMAL(10,2) NOT NULL,
    data TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_clientes_email ON clientes(email);
CREATE INDEX IF NOT EXISTS idx_clientes_cpf_cnpj ON clientes(cpf_cnpj);
CREATE INDEX IF NOT EXISTS idx_transacoes_remetente ON transacoes(remetente_id);
CREATE INDEX IF NOT EXISTS idx_transacoes_destinatario ON transacoes(destinatario_id);
CREATE INDEX IF NOT EXISTS idx_transacoes_data ON transacoes(data);

-- Inserção de dados de exemplo (opcional)
-- Senha: 123456 (hash bcrypt)
INSERT INTO clientes (nome, email, cpf_cnpj, idade_data_fundacao, renda_mensal, senha, saldo) VALUES
('João Silva', 'joao@exemplo.com', '123.456.789-00', '30 anos', 5000.00, '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 2500.00),
('Maria Empresa LTDA', 'contato@mariaempresa.com', '12.345.678/0001-90', '2020-01-15', 15000.00, '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 10000.00)
ON CONFLICT (email) DO NOTHING;

-- Inserção de transação de exemplo
INSERT INTO transacoes (remetente_id, destinatario_id, valor) VALUES
(1, 2, 500.00)
ON CONFLICT DO NOTHING;
