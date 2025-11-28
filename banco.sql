-- banco (nome exigido pelo SAEP)
CREATE DATABASE IF NOT EXISTS saep_db;
USE saep_db;

INSERT INTO usuarios (nome, login, senha, ativo) VALUES
('lindomar', 'lin', '123', 1),
('kamila', 'kamila', '123', 1),
('paula', 'paula', '123', 1);

INSERT INTO produtos (nome, descricao, estoque_atual, estoque_min) VALUES
('TV 150 polegadas', 'TV da samsung 150 polegadas smart', 150, 50),
('iphone 14', 'celular da apple', 120, 80),
('tablet s3 lite', 'tablet samsung', 200, 60),
('Caixa Philips', 'caixa de som philips', 40, 10);

INSERT INTO movimentacoes (id_produto, id_usuario, tipo, quantidade, data_movimentacao) VALUES
(1, 1, 'entrada', 50, '2025-11-24'),
(1, 1, 'saida', 10, '2025-11-24'),
(2, 1, 'entrada', 100, '2025-11-24'),
(3, 1, 'saida', 20, '2025-11-24'),
(4, 1, 'entrada', 10, '2025-11-24');

SELECT * FROM usuarios;
SELECT * FROM produtos;
SELECT * FROM movimentacoes;