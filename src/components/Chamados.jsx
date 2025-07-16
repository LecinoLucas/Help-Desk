import { useEffect, useState } from 'react';

export default function Chamados({ token }) {
  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      setError('Token não fornecido');
      setLoading(false);
      return;
    }

    fetch('http://localhost:3000/api/chamados', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Erro ao buscar chamados');
        return res.json();
      })
      .then(data => {
        setChamados(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [token]);

  if (loading) return <p>Carregando chamados...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-3xl w-full p-6 bg-white rounded shadow">
      {chamados.length === 0 ? (
        <p>Nenhum chamado encontrado.</p>
      ) : (
        <ul className="space-y-4">
          {chamados.map(chamado => (
            <li key={chamado.id} className="border p-4 rounded hover:shadow-md">
              <h2 className="text-xl font-semibold">{chamado.titulo}</h2>
              <p className="text-gray-600">{chamado.descricao}</p>
              <p className="mt-1 text-sm text-gray-500">Prioridade: {chamado.prioridade}</p>
              <p className="mt-1 text-sm text-gray-500">Status: {chamado.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
