// src/pages/CadastroUsuario.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../styles/CadastroUsuario.css";
import Footer from '../components/Footer';  // ajuste o caminho conforme seu projeto

const CadastroUsuario = () => {
  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
  });

  const [mensagem, setMensagem] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.senha !== form.confirmarSenha) {
      setMensagem('As senhas não coincidem.');
      return;
    }

    try {
      await axios.post(
        'http://localhost:3000/api/usuarios',
        {
          nome: form.nome,
          email: form.email,
          senha: form.senha,
          isAdmin: false, // fixo como usuário comum
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMensagem('Usuário cadastrado com sucesso!');
      setForm({ nome: '', email: '', senha: '', confirmarSenha: '' });
    } catch (error) {
      setMensagem(error.response?.data?.erro || 'Erro ao cadastrar usuário.');
    }
  };

  return (
    <>
      <div className="cadastro-container">
        <h2>Cadastro de Usuário Comum</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="nome"
            placeholder="Nome"
            value={form.nome}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="E-mail"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="senha"
            placeholder="Senha"
            value={form.senha}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirmarSenha"
            placeholder="Confirmar Senha"
            value={form.confirmarSenha}
            onChange={handleChange}
            required
          />

          <button type="submit">Cadastrar</button>
        </form>

        {mensagem && <p className="mensagem">{mensagem}</p>}

        <button onClick={() => navigate('/')} className="voltar-btn">
          Voltar para a Home
        </button>
      </div>
      <Footer />
    </>
  );
};

export default CadastroUsuario;
