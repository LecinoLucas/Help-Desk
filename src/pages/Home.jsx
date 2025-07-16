// src/pages/Home.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';
import Footer from '../components/Footer'; // Corrigido o caminho

export default function Home({ login }) {
  const navigate = useNavigate();

  const [emailLogin, setEmailLogin] = useState('');
  const [senhaLogin, setSenhaLogin] = useState('');
  const [erroLogin, setErroLogin] = useState(null);

  async function handleLogin(e) {
    e.preventDefault();
    setErroLogin(null);

    try {
      const res = await axios.post('http://localhost:3000/api/usuarios/login', {
        email: emailLogin,
        senha: senhaLogin,
      });

      login(res.data.token, res.data.usuario);

      if (res.data.usuario.isAdmin) {
        navigate('/admin');
      } else {
        navigate('/usuario');
      }
    } catch (error) {
      setErroLogin(error.response?.data?.erro || 'Erro no login');
    }
  }

  return (
    <div className="home-wrapper">
      <main className="home-container">
        <div className="login-box">
          <h2>Bem-vindo</h2>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={emailLogin}
              onChange={(e) => setEmailLogin(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Senha"
              value={senhaLogin}
              onChange={(e) => setSenhaLogin(e.target.value)}
              required
            />
            <button type="submit" className="btn-login">Entrar</button>

            {erroLogin && <p className="erro">{erroLogin}</p>}
          </form>

          <div className="extra-links">
            <button
              className="btn-cadastrar"
              onClick={() => navigate('/cadastro-usuario')}
            >
              Criar Conta
            </button>

            <button
              className="btn-esqueci"
              onClick={() => navigate('/recuperar-senha')}
            >
              Esqueci minha senha
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
