// src/pages/Admin.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer'; // ajuste o caminho conforme sua estrutura

export default function Admin({ logout }) {
  const navigate = useNavigate();

  return (
    <>
      <main className="admin-container">
        <header className="admin-header">
          <h1>Painel de Chamados - Admin</h1>
          <div>
            <button
              className="btn-create-admin"
              onClick={() => navigate('/cadastro-admin')}
            >
              Criar Novo Administrador
            </button>
            <button
              className="btn-logout"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </header>

        {/* Aqui você pode colocar a listagem dos chamados */}
        <section className="chamados-list">
          {/* Componente ou lógica para listar chamados */}
          <p>Aqui vai a listagem de chamados para o Admin.</p>
        </section>
      </main>
      <Footer />
    </>
  );
}
