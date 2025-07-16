const express = require('express');
const router = express.Router();

// Middleware de autenticação JWT
const autenticarToken = require('../middlewares/autenticarToken');

// Configuração do multer para upload de arquivos
const upload = require('../services/uploadService');

// Controller que vai salvar os arquivos no banco
const arquivoController = require('../controllers/arquivoController');

// Listar todos os arquivos de um chamado específico
router.get('/chamado/:chamadoId', autenticarToken, arquivoController.listarPorChamado);

// Rota para baixar arquivo pelo id
router.get('/download/:id', autenticarToken, arquivoController.baixarArquivo);

// Deletar um arquivo específico por ID
router.delete('/:id', autenticarToken, arquivoController.deletar);

// DELETE /api/arquivos/chamado/:chamadoId
router.delete('/chamado/:chamadoId', autenticarToken, arquivoController.deletarArquivosPorChamado);


// Upload de múltiplos arquivos (até 10 arquivos por vez)
// O campo do formulário que receberá os arquivos deve se chamar 'arquivos'
router.post(
  '/upload',
  autenticarToken,
  (req, res, next) => {
    upload.array('arquivos', 10)(req, res, (err) => {
      if (err && err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ erro: 'Arquivo excede o tamanho máximo de 10MB.' });
      } else if (err) {
        return res.status(400).json({ erro: err.message });
      }
      next();
    });
  },
  arquivoController.uploadArquivos
);

module.exports = router;
