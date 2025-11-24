import React, {useState} from 'react'
import api from '../api'
import { useNavigate } from 'react-router-dom'

export default function Login(){
  const [username,setUsername] = useState('')
  const [password,setPassword] = useState('')
  const [error,setError] = useState(null)
  const navigate = useNavigate()

  async function handleSubmit(e){
    e.preventDefault()
    setError(null)
    try{
      const res = await api.post('/auth/token/', {username, password})
      localStorage.setItem('access', res.data.access)
      localStorage.setItem('refresh', res.data.refresh)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      navigate('/dashboard')
    } catch(err){
      if(err.response){
        setError(err.response.data.detail || 'Falha na autenticação')
      } else {
        setError('Erro de conexão')
      }
    }
  }

  return (
    <div style={{maxWidth:400}}>
      <h2>Login</h2>
      {error && <div style={{color:'red'}}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Usuário</label><br/>
          <input value={username} onChange={e=>setUsername(e.target.value)} required/>
        </div>
        <div>
          <label>Senha</label><br/>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required/>
        </div>
        <button type="submit">Entrar</button>
      </form>
    </div>
  )
}
