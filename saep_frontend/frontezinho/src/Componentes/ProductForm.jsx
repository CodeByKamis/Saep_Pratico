import React, {useState} from 'react'
import api from '../api'

export default function ProductForm({product, onDone, onCancel}){
  const [sku,setSku] = useState(product.sku||'')
  const [name,setName] = useState(product.name||'')
  const [description,setDescription] = useState(product.description||'')
  const [quantity,setQuantity] = useState(product.quantity||0)
  const [minimum,setMinimum] = useState(product.minimum_quantity||0)
  const [error,setError] = useState(null)

  async function handleSubmit(e){
    e.preventDefault()
    setError(null)
    if(!sku || !name) { setError('SKU e Nome são obrigatórios'); return }
    const payload = {sku,name,description,quantity:parseInt(quantity,10),minimum_quantity:parseInt(minimum,10)}
    try{
      if(product.id){
        await api.put(`/products/${product.id}/`, payload)
      } else {
        await api.post('/products/', payload)
      }
      onDone && onDone()
    } catch(err){
      setError(err.response?.data || 'Erro ao salvar')
    }
  }

  return (
    <div style={{border:'1px solid #ccc', padding:10, marginTop:10}}>
      <h3>{product.id ? 'Editar' : 'Novo'} Produto</h3>
      {error && <div style={{color:'red'}}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div><label>SKU</label><br/><input value={sku} onChange={e=>setSku(e.target.value)} /></div>
        <div><label>Nome</label><br/><input value={name} onChange={e=>setName(e.target.value)} /></div>
        <div><label>Descrição</label><br/><textarea value={description} onChange={e=>setDescription(e.target.value)} /></div>
        <div><label>Quantidade</label><br/><input type="number" value={quantity} onChange={e=>setQuantity(e.target.value)} /></div>
        <div><label>Quantidade Mínima</label><br/><input type="number" value={minimum} onChange={e=>setMinimum(e.target.value)} /></div>
        <button type="submit">Salvar</button>
        <button type="button" onClick={onCancel}>Cancelar</button>
      </form>
    </div>
  )
}
