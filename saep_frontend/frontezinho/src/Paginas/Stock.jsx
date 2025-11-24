import React, {useEffect, useState} from 'react'
import api from '../api'

export default function Stock(){
  const [products,setProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [movementType, setMovementType] = useState('IN')
  const [quantity, setQuantity] = useState(1)
  const [history, setHistory] = useState([])
  const [alertMessage, setAlertMessage] = useState('')

  useEffect(()=>{ loadProducts(); loadHistory() },[])

  async function loadProducts(){
    const res = await api.get('/products/')
    // ordena alfabeticamente pelo nome usando algoritmo simples (bubble sort demonstrativo)
    let arr = res.data.slice()
    // bubble sort (para atender requisito que pede aplicar algoritmo)
    for(let i=0;i<arr.length;i++){
      for(let j=0;j<arr.length-1-i;j++){
        if(arr[j].name.toLowerCase() > arr[j+1].name.toLowerCase()){
          const tmp = arr[j]
          arr[j]=arr[j+1]
          arr[j+1]=tmp
        }
      }
    }
    setProducts(arr)
  }

  async function loadHistory(){
    const res = await api.get('/movements/')
    setHistory(res.data)
  }

  async function submitMovement(e){
    e.preventDefault()
    if(!selectedProduct) return alert('Selecione um produto')
    try{
      await api.post('/movements/', {
        product: selectedProduct,
        movement_type: movementType,
        quantity: parseInt(quantity,10),
        comment: ''
      })
      await loadProducts()
      await loadHistory()
      // checa se produto está abaixo do mínimo
      const prod = products.find(p=>p.id===selectedProduct)
      if(prod){
        const updated = (movementType==='IN') ? prod.quantity + parseInt(quantity,10) : prod.quantity - parseInt(quantity,10)
        if(updated < prod.minimum_quantity){
          setAlertMessage(`ALERTA: Estoque do produto "${prod.name}" abaixo do mínimo (${updated} < ${prod.minimum_quantity})`)
        } else {
          setAlertMessage('')
        }
      }
    } catch(err){
      alert('Erro ao registrar movimentação')
    }
  }

  return (
    <div>
      <h2>Gestão de Estoque</h2>
      {alertMessage && <div style={{background:'#ffdddd', padding:10, marginBottom:10}}>{alertMessage}</div>}
      <form onSubmit={submitMovement}>
        <div>
          <label>Produto</label><br/>
          <select onChange={e=>setSelectedProduct(parseInt(e.target.value,10))} value={selectedProduct || ''}>
            <option value="">-- selecione --</option>
            {products.map(p=> <option value={p.id} key={p.id}>{p.name} (Qtd: {p.quantity})</option>)}
          </select>
        </div>
        <div>
          <label>Tipo</label><br/>
          <select value={movementType} onChange={e=>setMovementType(e.target.value)}>
            <option value="IN">Entrada</option>
            <option value="OUT">Saída</option>
          </select>
        </div>
        <div>
          <label>Quantidade</label><br/>
          <input type="number" value={quantity} onChange={e=>setQuantity(e.target.value)} />
        </div>
        <button type="submit">Registrar</button>
      </form>

      <h3>Histórico</h3>
      <table border="1" cellPadding="6">
        <thead><tr><th>Produto</th><th>Tipo</th><th>Qtd</th><th>Responsável</th><th>Data</th></tr></thead>
        <tbody>
          {history.map(h=>(
            <tr key={h.id}>
              <td>{h.product_name}</td>
              <td>{h.movement_type}</td>
              <td>{h.quantity}</td>
              <td>{h.responsible?.username || '—'}</td>
              <td>{new Date(h.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
