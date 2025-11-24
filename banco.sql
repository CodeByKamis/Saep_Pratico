-- Cria o banco (nome exigido pelo SAEP)
CREATE DATABASE IF NOT EXISTS saep_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE saep_db;

INSERT INTO api_usuario (nome, login, senha) VALUES
('lindomar', 'lin', '123');


-- Produtos: 4 itens (>=3)
INSERT INTO produtos (nome, descricao, estoque_atual, estoque_min) VALUES
('Parafuso M6', 'Parafuso de aço inox M6 x 20mm', 150, 50),
('Arruela 8mm', 'Arruela lisa zincada 8mm', 300, 80),
('Porca M8', 'Porca sextavada M8 zincada', 200, 60),
('Chave Philips', 'Chave de fenda Philips tamanho médio', 40, 10);

-- Movimentacoes: alguns exemplos (>=3)
INSERT INTO movimentacoes (id_produto, id_usuario, tipo, quantidade, data_movimentacao) VALUES
(1, 1, 'entrada', 50, '2025-11-24'),
(1, 2, 'saida', 10, '2025-11-24'),
(2, 1, 'entrada', 100, '2025-11-24'),
(3, 3, 'saida', 20, '2025-11-24'),
(4, 2, 'entrada', 10, '2025-11-24');

DROP DATABASE saep_db;