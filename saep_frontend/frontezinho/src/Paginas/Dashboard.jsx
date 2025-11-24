import React from 'react'

export default function Dashboard() {
  // Recupera usuário de forma segura
  let user = null
  try {
    const saved = localStorage.getItem('user')
    if (saved) {
      user = JSON.parse(saved)
    }
  } catch (e) {
    user = null
  }

  const nome = user?.nome || user?.username || "Usuário"

  return (
    <div>
      <h2>Página Principal</h2>
      <p>Bem-vindo, {nome}!</p>

      <p>
        Acesse <strong>Produtos</strong> para cadastrar, editar e excluir.<br/>
        Em <strong>Gestão de Estoque</strong> registre entradas/saídas e verifique alertas.
      </p>
    </div>
  )
}
