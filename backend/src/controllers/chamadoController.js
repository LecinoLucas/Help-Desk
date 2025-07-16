// backend/src/controllers/chamadoController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Criar chamado
exports.criar = async (req, res) => {
  const { titulo, descricao, prioridade, status, responsavelId } = req.body;

  try {
    if (responsavelId) {
      const responsavel = await prisma.usuario.findUnique({ where: { id: responsavelId } });
      if (!responsavel || !responsavel.isAdmin) {
        return res.status(403).json({ erro: "Somente administradores podem ser responsáveis por chamados." });
      }
    }

    const chamado = await prisma.chamado.create({
      data: {
        titulo,
        descricao,
        prioridade,
        status: status || "aberto",
        criadoEm: new Date(),
        atualizadoEm: new Date(),
        autorId: req.usuario.id,
        responsavelId: responsavelId || null,
      }
    });

    res.status(201).json(chamado);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
};

// Listar todos os chamados com autor, responsável e arquivos anexos
exports.listar = async (req, res) => {
  try {
    const chamados = await prisma.chamado.findMany({
      include: {
        autor: { select: { id: true, nome: true, email: true } },
        responsavel: { select: { id: true, nome: true, email: true } },
        arquivos: true, // <- Inclui os arquivos relacionados ao chamado
      }
    });

    res.json(chamados);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

// Buscar um chamado por ID com autor, responsável e arquivos anexos
exports.buscarPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const chamado = await prisma.chamado.findUnique({
      where: { id: Number(id) },
      include: {
        autor: { select: { id: true, nome: true, email: true } },
        responsavel: { select: { id: true, nome: true, email: true } },
        arquivos: true, // <- Inclui os arquivos no resultado
      }
    });

    if (!chamado) {
      return res.status(404).json({ erro: "Chamado não encontrado" });
    }

    res.json(chamado);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};


// Atualizar chamado
exports.atualizar = async (req, res) => {
  const { id } = req.params;
  const { titulo, descricao, status, prioridade, responsavelId } = req.body;

  try {
    if (responsavelId) {
      const responsavel = await prisma.usuario.findUnique({ where: { id: responsavelId } });
      if (!responsavel || !responsavel.isAdmin) {
        return res.status(403).json({ erro: "Somente administradores podem ser responsáveis." });
      }
    }

    const chamado = await prisma.chamado.update({
      where: { id: Number(id) },
      data: {
        titulo,
        descricao,
        status,
        prioridade,
        responsavelId,
        atualizadoEm: new Date(), // atualiza data da última modificação
      },
    });

    res.json(chamado);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
};

// Deletar chamado (apenas admin)
exports.deletar = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.chamado.delete({ where: { id: Number(id) } });
    res.json({ mensagem: "Chamado deletado com sucesso" });
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
};
