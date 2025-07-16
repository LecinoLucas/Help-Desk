const multer = require('multer'); // Middleware para upload de arquivos
const path = require('path');     // Manipulação de caminhos de arquivos
const fs = require('fs');         // Sistema de arquivos para criar pastas

// Configuração de armazenamento dos arquivos no disco
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Define pasta "uploads" no nível raiz do projeto
    const uploadDir = path.join(__dirname, '../../uploads');

    // Cria pasta "uploads" caso não exista (recursivamente)
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Informa multer o destino do arquivo
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    // Cria nome único: timestamp + nome original sem espaços
    const uniqueName = Date.now() + '-' + file.originalname.replace(/\s+/g, '_');
    cb(null, uniqueName);
  }
});

// Filtro para validar tipos permitidos: imagens, pdf e excel
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|pdf|xls|xlsx/;

  // Verifica extensão e mimetype
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true); // aceita arquivo
  } else {
    cb(new Error('Apenas arquivos de imagem, PDF e Excel são permitidos!'));
  }
};

// Exporta o middleware multer configurado para upload
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter,
});

module.exports = upload;
