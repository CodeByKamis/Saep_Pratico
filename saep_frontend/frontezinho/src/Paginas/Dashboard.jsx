import React from 'react'
export default function Dashboard(){
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  return (
    <div>
      <h2>Página Principal</h2>
      <p>Bem-vindo, {user ? (user.first_name || user.username) : 'Usuário'}</p>
      <p>Acesse Produtos para cadastrar, editar e excluir. Em Gestão de Estoque registre entradas/saídas e verifique alertas.</p>
    </div>
  )
}
