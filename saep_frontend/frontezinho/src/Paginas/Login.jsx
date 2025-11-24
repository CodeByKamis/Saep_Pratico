// src/Paginas/Login.jsx
import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import styles from "../Styles/Login.module.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    try {
      const res = await api.post("/auth/token/", { username, password });

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/dashboard");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else if (err.response) {
        setError("Usuário ou senha incorretos.");
      } else {
        setError("Erro de conexão com o servidor.");
      }
    }
  }

  return (
    <div className={styles['login-container']}>
      <div className={styles['login-box']}>
        <h2 className={styles['login-title']}>Acesso ao Sistema</h2>

        {error && <div className={styles['login-error']}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <label>Usuário</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className={styles['login-input']}
          />

          <label>Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles['login-input']}
          />

          <button type="submit" className={styles['login-btn']}>
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
