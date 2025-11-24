import React, {useState, useEffect} from 'react'
import api from '../api'
import ProductForm from '../Componentes/ProductForm'

export default function Products(){
  const [products,setProducts] = useState([])
  const [query,setQuery] = useState('')
  const [editing,setEditing] = useState(null)
  const [error,setError] = useState(null)

  async function load(){
    try{
      const res = await api.get('/products/')
      setProducts(res.data)
    } catch(err){
      setError('Erro ao carregar produtos')
    }
  }

  useEffect(()=>{ load() },[])

  async function search(e){
    e.preventDefault()
    try{
      const res = await api.get(`/products/search/?q=${encodeURIComponent(query)}`)
      setProducts(res.data)
    } catch(err){
      setError('Erro na busca')
    }
  }

  async function remove(id){
    if(!confirm('Deseja excluir este produto?')) return;
    try{
      await api.delete(`/products/${id}/`)
      setProducts(products.filter(p=>p.id!==id))
    } catch(err){
      setError('Erro ao excluir')
    }
  }

  return (
    <div>
      <h2>Produtos</h2>
      {error && <div style={{color:'red'}}>{error}</div>}
      <form onSubmit={search}>
        <input placeholder="buscar por nome ou SKU" value={query} onChange={e=>setQuery(e.target.value)} />
        <button>Buscar</button>
        <button type="button" onClick={()=>{setQuery(''); load()}}>Limpar</button>
      </form>

      <button onClick={()=>setEditing({})}>Novo Produto</button>

      <table border="1" cellPadding="6" style={{marginTop:10}}>
        <thead><tr><th>SKU</th><th>Nome</th><th>Qtd</th><th>Qtd Mín</th><th>Ações</th></tr></thead>
        <tbody>
          {products.map(p=>(
            <tr key={p.id}>
              <td>{p.sku}</td>
              <td>{p.name}</td>
              <td>{p.quantity}</td>
              <td>{p.minimum_quantity}</td>
              <td>
                <button onClick={()=>setEditing(p)}>Editar</button>
                <button onClick={()=>remove(p.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editing && <ProductForm product={editing} onDone={(saved)=>{ setEditing(null); load() }} onCancel={()=>setEditing(null)} />}
    </div>
  )
}
