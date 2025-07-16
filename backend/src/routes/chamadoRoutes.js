// backend/src/routes/chamadoRoutes.js
const express = require('express');
const router = express.Router();

const autenticarToken = require('../middlewares/autenticarToken');
const verificarAdmin = require('../middlewares/verificarAdmin');
const chamadoController = require('../controllers/chamadoController');

router.get('/', autenticarToken, chamadoController.listar);
router.post('/', autenticarToken, chamadoController.criar);
router.get('/:id', autenticarToken, chamadoController.buscarPorId);
router.put('/:id', autenticarToken, chamadoController.atualizar);
router.delete('/:id', autenticarToken, verificarAdmin, chamadoController.deletar);

module.exports = router;
