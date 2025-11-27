//tela secundaria de dashboard
import React, { useEffect, useState } from 'react';
import api from '../api';
import Header from '../Componentes/Header';
import styles from '../Styles/Dashboard.module.css';

export default function Dashboard(){
  const [products, setProducts] = useState([]);
  const [movs, setMovs] = useState([]);

  useEffect(() => {
    api.get('/products/').then(r => setProducts(r.data)).catch(()=>{});
    api.get('/movements/').then(r => setMovs(r.data)).catch(()=>{});
  }, []);

  const low = products.filter(p => p.estoque_atual <= p.estoque_min);

  return (
    <>
      <Header />
      <div className={styles.container}>
        <h1>Dashboard</h1>
        <div>Total produtos: {products.length}</div>
        <div>Produtos abaixo estoque mínimo: {low.length}</div>

        <h3>Últimas movimentações</h3>
        <table className={styles.table}>
          <thead><tr><th>Produto</th><th>Usuário</th><th>Tipo</th><th>Qtd</th><th>Data</th></tr></thead>
          <tbody>
            {movs.slice(0,10).map(m => (
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
