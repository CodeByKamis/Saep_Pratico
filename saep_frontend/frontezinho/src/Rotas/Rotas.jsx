import { Routes, Route } from 'react-router-dom';
import Login from '../Paginas/Login';
import Dashboard from '../Paginas/Dashboard';
import Products from '../Paginas/Products';
import Stock from '../Paginas/Stock';

export function Rotas() {
  return (
    <Routes>
        <Route path="/" element={<Login />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="stock" element={<Stock />} />
    </Routes>
  );
}
