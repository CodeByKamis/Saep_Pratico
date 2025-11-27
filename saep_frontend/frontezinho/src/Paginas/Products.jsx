// src/Paginas/Products.jsx
import React, { useEffect, useState } from 'react';
import api from '../api';
import ProductForm from '../Componentes/ProductForm';
import Header from '../Componentes/Header';
import styles from '../Styles/Products.module.css';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  async function load() {
    setLoading(true);
    try {
      const res = await api.get('/products/');
      setProducts(res.data);
      setFilteredProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function handleSearch(e) {
    e.preventDefault();
    const query = search.toLowerCase();
    const filtered = products.filter(p => p.nome.toLowerCase().includes(query));
    setFilteredProducts(filtered);
  }

  return (
    <>
      <Header />
      <div className={styles.container}>
        <h1>Produtos Cadastrados</h1>

        {/* busca de produtos */}
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <input
            type="text"
            placeholder="Buscar produto pelo nome..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchButton}>Buscar</button>
        </form>

        <div className={styles.adicionar}>
          <button onClick={() => { setEditing(null); setShowForm(true); }}>Adicionar Produto</button>
        </div>

        {showForm && (
          <div className={styles.formWrapper}>
            <ProductForm initial={editing} onSaved={() => { setShowForm(false); load(); }} />
          </div>
        )}

        {loading ? <div>os produtos estão carregando.</div> : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Estoque</th>
                <th>Min</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(p => (
                <tr key={p.id_produto}>
                  <td>{p.nome}</td>
                  <td>{p.estoque_atual}</td>
                  <td>{p.estoque_min}</td>
                  <td>
                    <button onClick={() => { setEditing(p); setShowForm(true); }}>Editar</button>
                    <button onClick={async () => {
                      if (!confirm('Excluir?')) return;
                      await api.delete(`/products/${p.id_produto}/`);
                      load();
                    }}>Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
