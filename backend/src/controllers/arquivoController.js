// controllers/arquivoController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const express = require('express');
const path = require('path');
const fs = require('fs');
const autenticarToken = require('../middlewares/autenticarToken');



// Função para upload de múltiplos arquivos no chamado
exports.uploadArquivos = async (req, res) => {
  try {
    // Verifica se arquivos foram enviados pelo Multer
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ erro: 'Nenhum arquivo enviado.' });
    }

    // Pega o ID do chamado do corpo da requisição
    const { chamadoId } = req.body;

    if (!chamadoId) {
      return res.status(400).json({ erro: 'ID do chamado é obrigatório.' });
    }

    // Verifica se o chamado existe no banco
    const chamado = await prisma.chamado.findUnique({
      where: { id: Number(chamadoId) }
    });

    if (!chamado) {
      return res.status(404).json({ erro: 'Chamado não encontrado.' });
    }

    // Para cada arquivo, cria um registro na tabela Arquivo vinculando ao chamado
    const arquivosCriados = [];

    for (const file of req.files) {
      const arquivo = await prisma.arquivo.create({
        data: {
          nome: file.filename,           // nome salvo no servidor
          tipo: file.mimetype,           // tipo mime (ex: image/png)
          caminho: path.join('uploads', file.filename), // caminho relativo do arquivo
          chamadoId: chamado.id,         // FK para o chamado
        }
      });
      arquivosCriados.push(arquivo);
    }

    // Retorna sucesso com dados dos arquivos e do chamado
    res.status(201).json({
      mensagem: 'Arquivos enviados e salvos com sucesso!',
      arquivos: arquivosCriados,
      chamado
    });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

// Listar arquivos por chamadoId
exports.listarPorChamado = async (req, res) => {
  const { chamadoId } = req.params;

  try {
    const arquivos = await prisma.arquivo.findMany({
      where: { chamadoId: Number(chamadoId) }
    });

    res.json(arquivos);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

//Deletar um arquivo pelo ID 

exports.deletar = async (req, res) => {
  const { id } = req.params;

  try {
    // Busca o arquivo no banco
    const arquivo = await prisma.arquivo.findUnique({ where: { id: Number(id) } });

    if (!arquivo) {
      return res.status(404).json({ erro: 'Arquivo não encontrado.' });
    }
// Remove fisicamente o arquivo do disco
    const caminhoFisico = path.join(__dirname, '../../', arquivo.caminho);
    if (fs.existsSync(caminhoFisico)) {
      fs.unlinkSync(caminhoFisico);
    }

    // Remove do banco de dados
    await prisma.arquivo.delete({ where: { id: Number(id) } });

    res.json({ mensagem: 'Arquivo deletado com sucesso.' });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};


exports.deletarArquivosPorChamado = async (req, res) => {
  const { chamadoId } = req.params;

  try {
    // Busca arquivos relacionados ao chamado
    const arquivos = await prisma.arquivo.findMany({
      where: { chamadoId: Number(chamadoId) }
    });

    if (arquivos.length === 0) {
      return res.status(404).json({ erro: "Nenhum arquivo encontrado para esse chamado." });
    }

    // Deleta arquivos do sistema de arquivos
    arquivos.forEach((arquivo) => {
      const caminhoFisico = path.join(__dirname, '../../', arquivo.caminho);
      if (fs.existsSync(caminhoFisico)) {
        fs.unlinkSync(caminhoFisico);
      }
    });

    // Deleta registros do banco
    await prisma.arquivo.deleteMany({
      where: { chamadoId: Number(chamadoId) }
    });

    res.json({ mensagem: "Todos os arquivos do chamado foram deletados com sucesso." });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

//ROTA PARA BAIXAR ARQUIVO
exports.baixarArquivo = async (req, res) => {
  const { id } = req.params;
  try {
    const arquivo = await prisma.arquivo.findUnique({ where: { id: Number(id) } });
    if (!arquivo) return res.status(404).json({ erro: 'Arquivo não encontrado' });

    const filePath = path.resolve(__dirname, '../../', arquivo.caminho);
    res.download(filePath, arquivo.nome);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};