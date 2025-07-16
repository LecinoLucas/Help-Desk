// src/components/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Componente de login
export default function Login({ login }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState(null);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErro(null);

    try {
      const res = await fetch('http://localhost:3000/api/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      if (!res.ok) {
        const erroJson = await res.json();
        throw new Error(erroJson.erro || 'Erro no login');
      }

      const data = await res.json();

      // Aqui salvamos o token e o usuário no hook useAuth
      login(data.token, data.usuario);

      alert('Login realizado com sucesso!');

      // Redireciona conforme o tipo do usuário
      if (data.usuario.isAdmin) {
        navigate('/admin');
      } else {
        navigate('/usuario');
      }
    } catch (error) {
      setErro(error.message);
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 shadow-md rounded w-full max-w-sm flex flex-col gap-4"
      >
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">Login</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border border-gray-300 p-2 rounded"
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
          className="border border-gray-300 p-2 rounded"
        />

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          Entrar
        </button>

        {erro && <p className="text-red-600 text-sm text-center">{erro}</p>}

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">Ainda não tem conta?</p>
          <button
            type="button"
            onClick={() => navigate('/cadastro')}
            className="text-blue-600 hover:underline text-sm mt-1"
          >
            Cadastrar novo usuário
          </button>
        </div>
      </form>
    </main>
  );
}
