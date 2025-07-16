import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

import Login from './components/Login';
import Chamados from './components/Chamados';
import CadastroUsuario from './pages/CadastroUsuario';
import CadastroAdmin from './pages/CadastroAdmin';
import Admin from './pages/Admin';
import Usuario from './pages/Usuario';
import Home from './pages/Home';
import RecuperarSenha from './pages/RecuperarSenha';

export default function App() {
  const { login, logout, isAuthenticated, usuario } = useAuth();

  // Rota protegida para admin
  const AdminRoute = ({ children }) => {
    if (!isAuthenticated) return <Navigate to="/" />;
    return usuario?.isAdmin ? children : <Navigate to="/usuario" />;
  };

  // Rota protegida para usuário comum
  const UsuarioRoute = ({ children }) => {
    if (!isAuthenticated) return <Navigate to="/" />;
    return !usuario?.isAdmin ? children : <Navigate to="/admin" />;
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Home com login e cadastro de usuário comum */}
        <Route path="/" element={<Home login={login} />} />

        {/* Página de recuperação de senha */}
        <Route path="/recuperar-senha" element={<RecuperarSenha />} />

        {/* Cadastro de usuário comum (público) */}
        <Route path="/cadastro-usuario" element={<CadastroUsuario />} />

        {/* Cadastro de admin (somente admin autenticado) */}
        <Route
          path="/cadastro-admin"
          element={
            <AdminRoute>
              <CadastroAdmin />
            </AdminRoute>
          }
        />

        {/* Rota de login (opcional, se quiser deixar separado da Home) */}
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <Login login={login} />
            ) : (
              <Navigate to={usuario?.isAdmin ? '/admin' : '/usuario'} />
            )
          }
        />

        {/* Painel do admin */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Admin logout={logout} />
            </AdminRoute>
          }
        />

        {/* Painel do usuário comum */}
        <Route
          path="/usuario"
          element={
            <UsuarioRoute>
              <Usuario logout={logout} />
            </UsuarioRoute>
          }
        />

        {/* Página 404 */}
        <Route path="*" element={<p>Página não encontrada</p>} />
      </Routes>
    </BrowserRouter>
  );
}
