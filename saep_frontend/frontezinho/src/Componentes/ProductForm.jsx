// src/Componentes/ProductForm.jsx
import React, { useState, useEffect } from 'react'
import api from '../api'

export default function ProductForm({ initial = null, onSaved }) {
  const [form, setForm] = useState({
    nome: '', descricao: '', estoque_atual: 0, estoque_min: 0
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (initial) setForm({
      nome: initial.nome || '',
      descricao: initial.descricao || '',
      estoque_atual: initial.estoque_atual ?? 0,
      estoque_min: initial.estoque_min ?? 0
    })
  }, [initial])

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      if (initial && initial.id_produto) {
        await api.put(`/products/${initial.id_produto}/`, form)
      } else {
        await api.post('/products/', form)
      }
      onSaved && onSaved()
    } catch (err) {
      setError(err.response?.data || 'Erro')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 8 }}>
      <input placeholder="Nome" value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} required />
      <textarea placeholder="Descrição" value={form.descricao} onChange={e => setForm({...form, descricao: e.target.value})} />
      <input type="number" placeholder="Estoque atual" value={form.estoque_atual} onChange={e => setForm({...form, estoque_atual: Number(e.target.value)})} />
      <input type="number" placeholder="Estoque mínimo" value={form.estoque_min} onChange={e => setForm({...form, estoque_min: Number(e.target.value)})} />
      <button type="submit" disabled={loading}>{loading ? 'Salvando...' : 'Salvar'}</button>
      {error && <div style={{ color: 'crimson' }}>{JSON.stringify(error)}</div>}
    </form>
  )
}
