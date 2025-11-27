import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../Paginas/Login";
import Dashboard from "../Paginas/Dashboard";
import Products from "../Paginas/Products";
import Stock from "../Paginas/Stock";
import ProtectedRoute from "../Componentes/ProtectedRoute";

export default function Rotas() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={ <ProtectedRoute> <Dashboard /> </ProtectedRoute>}/>
      <Route path="/products" element={ <ProtectedRoute> <Products /> </ProtectedRoute>}/>
      <Route path="/stock" element={ <ProtectedRoute> <Stock /> </ProtectedRoute> }/>
      <Route path="*" element={ <Navigate to="/" replace />} />
    </Routes>
  );
}
