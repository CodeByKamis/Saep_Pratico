// pagina sobre o estoque
import React, { useEffect, useState } from 'react';
import api from '../api';
import Header from '../Componentes/Header';
import styles from '../Styles/Stock.module.css';

export default function Stock() {
  const [movs, setMovs] = useState([]);

  useEffect(() => {
    api.get('/movements/')
      .then(r => setMovs(r.data))
      .catch(() => {});
  }, []);

  return (
    <>
      <Header />
      <div className={styles.container}>
        <h1>Movimentações do Estoque</h1>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Produto</th>
              <th>Usuário</th>
              <th>Tipo</th>
              <th>Qtd</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            {movs.map(m => (
              <tr key={m.id_movimentacao}>
                <td>{m.produto_nome || m.id_produto}</td>
                <td>{m.usuario_nome || m.id_usuario}</td>
                <td>{m.tipo}</td>
                <td>{m.quantidade}</td>
                <td>{m.data_movimentacao}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
