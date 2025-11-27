import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem("access");
    setToken(t);
    setLoading(false);
  }, []);

  if (loading) return null; // não renderiza nada enquanto checa token
  if (!token) return <Navigate to="/" replace />; // redireciona se não tiver token

  return children;
}
