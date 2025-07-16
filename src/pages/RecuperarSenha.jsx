import React, { useState } from 'react';
import axios from 'axios';
import '../styles/RecuperarSenha.css';
import { useNavigate } from 'react-router-dom';
import Footer from './components/Footer'; // importe seu footer

export default function RecuperarSenha() {
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem('');

    try {
      await axios.post('http://localhost:3000/api/usuarios/recuperar-senha', { email });
      setMensagem('Se o email estiver correto, enviaremos instruções.');
    } catch (error) {
      setMensagem(error.response?.data?.erro || 'Erro ao enviar solicitação.');
    }
  };

  return (
    <>
      <main className="recuperar-main">
        <div className="recuperar-container">
          <form className="recuperar-form" onSubmit={handleSubmit}>
            <h2>Recuperar Senha</h2>
            <input
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">Enviar</button>
            {mensagem && <p className="mensagem">{mensagem}</p>}
            <button type="button" className="voltar-btn" onClick={() => navigate('/')}>
              Voltar ao login
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
