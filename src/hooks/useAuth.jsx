import { useState } from 'react';

export function useAuth() {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [usuario, setUsuario] = useState(() => {
    const user = localStorage.getItem('usuario');
    return user ? JSON.parse(user) : null;
  });

  const isAuthenticated = !!token;

  const login = (token, usuario) => {
    // Garante que isAdmin seja booleano
    const usuarioCorrigido = {
      ...usuario,
      isAdmin: Boolean(usuario.isAdmin === true || usuario.isAdmin === 'true'),
    };

    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuarioCorrigido));
    setToken(token);
    setUsuario(usuarioCorrigido);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setToken(null);
    setUsuario(null);
  };

  return { token, login, logout, isAuthenticated, usuario };
}
