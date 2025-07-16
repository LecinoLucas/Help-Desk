// backend/src/controllers/usuarioController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Criar usuário
exports.criar = async (req, res) => {
  const { nome, email, senha, isAdmin } = req.body;

  try {
    // Verifica se já existe usuário com esse email
    const usuarioExistente = await prisma.usuario.findUnique({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ erro: 'Email já cadastrado.' });
    }

    const hashedPassword = await bcrypt.hash(senha, 10);

    const usuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha: hashedPassword,
        isAdmin: isAdmin || false,
      },
    });

    res.status(201).json({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      isAdmin: usuario.isAdmin
    });
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
};

// Login do usuário
exports.login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuario = await prisma.usuario.findUnique({ where: { email } });

    if (!usuario) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ erro: "Senha incorreta" });
    }

    const token = jwt.sign(
      { id: usuario.id, isAdmin: usuario.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        isAdmin: usuario.isAdmin,
      }
    });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

// Listar usuários
exports.listar = async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

// Buscar usuário por ID
exports.buscarPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const usuario = await prisma.usuario.findUnique({ where: { id: Number(id) } });
    if (!usuario) return res.status(404).json({ erro: "Usuário não encontrado" });

    res.json(usuario);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

// Atualizar usuário
exports.atualizar = async (req, res) => {
  const { id } = req.params;
  const { nome, email, senha, isAdmin } = req.body;

  try {
    const data = { nome, email, isAdmin };

    if (senha) {
      data.senha = await bcrypt.hash(senha, 10);
    }

    const usuario = await prisma.usuario.update({
      where: { id: Number(id) },
      data,
    });

    res.json(usuario);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
};

// Deletar usuário
exports.deletar = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.usuario.delete({ where: { id: Number(id) } });
    res.json({ mensagem: "Usuário deletado com sucesso" });
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
};
