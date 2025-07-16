// src/pages/CadastroAdmin.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/CadastroAdmin.css'; // Se quiser separar estilos
import Footer from '../components/Footer'; // Ajuste o caminho conforme seu projeto

export default function CadastroAdmin() {
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
    setMensagem('');

    if (!token) {
      setMensagem('Você precisa estar logado para cadastrar um administrador.');
      return;
    }

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
          isAdmin: true,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMensagem('Administrador cadastrado com sucesso!');
      setForm({ nome: '', email: '', senha: '', confirmarSenha: '' });
    } catch (error) {
      setMensagem(error.response?.data?.erro || 'Erro ao cadastrar administrador.');
    }
  };

  return (
    <>
      <div className="cadastro-container">
        <h2>Cadastro de Usuário Administrador</h2>
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

          <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">
            Cadastrar Administrador
          </button>
        </form>
        {mensagem && <p className="mensagem">{mensagem}</p>}

        <button
          onClick={() => navigate('/admin')}
          className="voltar-btn mt-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Voltar para Admin
        </button>
      </div>
      <Footer />
    </>
  );
}
