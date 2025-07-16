// backend/src/routes/usuarioRoutes.js
const express = require('express');
const router = express.Router();

const autenticarToken = require('../middlewares/autenticarToken');
const verificarAdmin = require('../middlewares/verificarAdmin');
const usuarioController = require('../controllers/usuarioController');

router.post('/login', usuarioController.login);
router.get('/', autenticarToken, verificarAdmin, usuarioController.listar);
router.post('/', usuarioController.criar);
router.get('/:id', autenticarToken, verificarAdmin, usuarioController.buscarPorId);
router.put('/:id', autenticarToken, verificarAdmin, usuarioController.atualizar);
router.delete('/:id', autenticarToken, verificarAdmin, usuarioController.deletar);

module.exports = router;
