// backend/src/index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();

const usuarioRoutes = require('./routes/usuarioRoutes');
const chamadoRoutes = require('./routes/chamadoRoutes');
const arquivoRoutes = require('./routes/arquivoRoutes');



app.use(cors());
app.use(express.json());

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/chamados', chamadoRoutes);
app.use('/api/arquivos', arquivoRoutes);


// Rota pública para acessar os arquivos diretamente (ex: imagens no navegador)
app.use('/uploads', express.static('uploads')); // 🔓 permite acesso aos arquivos salvos

app.get('/', (req, res) => {
  res.send('API Help Desk rodando...');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
