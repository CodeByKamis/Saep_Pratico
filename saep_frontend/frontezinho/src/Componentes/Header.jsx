// src/Componentes/Header.jsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../services/auth";
import styles from "../Styles/Header.module.css";

export default function Header() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || {}


  function handleLogout() {
    logout();
    navigate("/", { replace: true });
  }

  return (
    <header className={styles.header}>
      <div className={styles.logo}>SAEP - Almoxarifado</div>
      <div className={styles.nome}>
        <p>Seja bem-vindo(a) {user.nome}</p>
      </div>
      <nav className={styles.nav}>
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? styles.active : ''}>Dashboard</NavLink>
        <NavLink to="/products" className={({ isActive }) => isActive ? styles.active : ''}>Produtos</NavLink>
        <NavLink to="/stock" className={({ isActive }) => isActive ? styles.active : ''}>Movimentações</NavLink>
        <button onClick={handleLogout} className={styles.logout}>Sair</button>
      </nav>
    </header>
  );
}
