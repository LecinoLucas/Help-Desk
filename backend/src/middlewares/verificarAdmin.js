// backend/src/middlewares/verificarAdmin.js
module.exports = (req, res, next) => {
  if (!req.usuario) {
    return res.status(401).json({ erro: "Usuário não autenticado" });
  }

  if (!req.usuario.isAdmin) {
    return res.status(403).json({ erro: "Acesso negado: administrador apenas" });
  }

  next();
};
