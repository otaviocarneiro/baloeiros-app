const express = require('express');
const router = express.Router();
const multer = require('multer');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');
const path = require('path');
const Player = require('../models/Player');

// Configurar multer para upload de arquivos
const upload = multer({ 
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Apenas arquivos CSV são permitidos'), false);
    }
  }
});

// POST /api/csv/import - Importar jogadores via CSV
router.post('/import', upload.single('csvFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Arquivo CSV é obrigatório' });
    }

    const results = [];
    const errors = [];
    let lineNumber = 1;

    // Ler e processar arquivo CSV
    const stream = fs.createReadStream(req.file.path)
      .pipe(csv({
        headers: ['name', 'gender', 'position', 'level', 'phone', 'email'],
        skipEmptyLines: true
      }));

    for await (const data of stream) {
      lineNumber++;
      
      try {
        // Validar dados básicos
        if (!data.name || !data.gender || !data.position || !data.level) {
          errors.push(`Linha ${lineNumber}: Campos obrigatórios faltando (name, gender, position, level)`);
          continue;
        }

        // Normalizar dados
        const playerData = {
          name: data.name.trim(),
          gender: data.gender.toUpperCase().trim(),
          position: data.position.toLowerCase().trim(),
          level: parseInt(data.level),
          phone: data.phone ? data.phone.trim() : null,
          email: data.email ? data.email.trim() : null
        };

        // Validar valores
        if (!['M', 'F'].includes(playerData.gender)) {
          errors.push(`Linha ${lineNumber}: Gênero deve ser M ou F`);
          continue;
        }

        if (!['levantador', 'libero', 'atacante', 'meio', 'oposto', 'outros'].includes(playerData.position)) {
          errors.push(`Linha ${lineNumber}: Posição inválida`);
          continue;
        }

        if (isNaN(playerData.level) || playerData.level < 1 || playerData.level > 5) {
          errors.push(`Linha ${lineNumber}: Nível deve ser um número entre 1 e 5`);
          continue;
        }

        // Tentar criar jogador
        const player = await Player.create(playerData);
        results.push(player);

      } catch (error) {
        errors.push(`Linha ${lineNumber}: ${error.message}`);
      }
    }

    // Limpar arquivo temporário
    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      imported: results.length,
      errors: errors.length,
      players: results,
      errorDetails: errors
    });

  } catch (error) {
    console.error('Erro na importação CSV:', error);
    
    // Limpar arquivo temporário em caso de erro
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ error: 'Erro na importação do arquivo CSV' });
  }
});

// GET /api/csv/export - Exportar jogadores para CSV
router.get('/export', async (req, res) => {
  try {
    const players = await Player.findAll();
    
    const csvFilePath = path.join(__dirname, '../temp', `players_${Date.now()}.csv`);
    
    // Criar diretório temp se não existir
    const tempDir = path.dirname(csvFilePath);
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const csvWriter = createCsvWriter({
      path: csvFilePath,
      header: [
        { id: 'name', title: 'Nome' },
        { id: 'gender', title: 'Gênero' },
        { id: 'position', title: 'Posição' },
        { id: 'level', title: 'Nível' },
        { id: 'phone', title: 'Telefone' },
        { id: 'email', title: 'Email' }
      ]
    });

    await csvWriter.writeRecords(players);

    // Enviar arquivo para download
    res.download(csvFilePath, 'jogadores.csv', (err) => {
      if (err) {
        console.error('Erro ao enviar arquivo:', err);
      }
      
      // Limpar arquivo temporário após o download
      fs.unlink(csvFilePath, (unlinkErr) => {
        if (unlinkErr) console.error('Erro ao deletar arquivo temporário:', unlinkErr);
      });
    });

  } catch (error) {
    console.error('Erro na exportação CSV:', error);
    res.status(500).json({ error: 'Erro na exportação para CSV' });
  }
});

// GET /api/csv/template - Baixar template CSV
router.get('/template', (req, res) => {
  const templateData = [
    {
      name: 'João Silva',
      gender: 'M',
      position: 'atacante',
      level: 3,
      phone: '(11) 99999-9999',
      email: 'joao@email.com'
    },
    {
      name: 'Maria Santos',
      gender: 'F',
      position: 'levantador',
      level: 4,
      phone: '(11) 88888-8888',
      email: 'maria@email.com'
    }
  ];

  const csvFilePath = path.join(__dirname, '../temp', `template_${Date.now()}.csv`);
  
  // Criar diretório temp se não existir
  const tempDir = path.dirname(csvFilePath);
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  const csvWriter = createCsvWriter({
    path: csvFilePath,
    header: [
      { id: 'name', title: 'Nome' },
      { id: 'gender', title: 'Gênero (M/F)' },
      { id: 'position', title: 'Posição (levantador/libero/atacante/meio/oposto/outros)' },
      { id: 'level', title: 'Nível (1-5)' },
      { id: 'phone', title: 'Telefone' },
      { id: 'email', title: 'Email' }
    ]
  });

  csvWriter.writeRecords(templateData)
    .then(() => {
      res.download(csvFilePath, 'template_jogadores.csv', (err) => {
        if (err) {
          console.error('Erro ao enviar template:', err);
        }
        
        // Limpar arquivo temporário
        fs.unlink(csvFilePath, (unlinkErr) => {
          if (unlinkErr) console.error('Erro ao deletar template temporário:', unlinkErr);
        });
      });
    })
    .catch(error => {
      console.error('Erro ao criar template:', error);
      res.status(500).json({ error: 'Erro ao gerar template CSV' });
    });
});

module.exports = router;