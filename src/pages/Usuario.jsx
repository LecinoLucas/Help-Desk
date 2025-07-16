// src/pages/UsuarioDashboard.jsx
import Footer from './components/Footer';

export default function Usuario({ logout }) {
  return (
    <>
      <main className="p-6 min-h-[calc(100vh-80px)] flex flex-col">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Dashboard Usuário</h1>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Logout
          </button>
        </header>
        <p className="flex-grow">Bem-vindo, usuário! Aqui você pode ver seus chamados.</p>
      </main>
      <Footer />
    </>
  );
}
