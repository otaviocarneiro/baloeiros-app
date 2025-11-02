const express = require('express');
const router = express.Router();
const Joi = require('joi');
const Player = require('../models/Player');

// Validation schema
const playerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  gender: Joi.string().valid('M', 'F').required(),
  position: Joi.string().valid('levantador', 'libero', 'atacante', 'meio', 'oposto', 'outros').required(),
  level: Joi.number().integer().min(1).max(5).required(),
  phone: Joi.string().optional(),
  email: Joi.string().email().optional()
});

// GET /api/players - Listar todos os jogadores
router.get('/', async (req, res) => {
  try {
    const players = await Player.findAll();
    res.json(players);
  } catch (error) {
    console.error('Erro ao buscar jogadores:', error);
    res.status(500).json({ error: 'Erro ao buscar jogadores' });
  }
});

// GET /api/players/:id - Buscar jogador por ID
router.get('/:id', async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) {
      return res.status(404).json({ error: 'Jogador não encontrado' });
    }
    res.json(player);
  } catch (error) {
    console.error('Erro ao buscar jogador:', error);
    res.status(500).json({ error: 'Erro ao buscar jogador' });
  }
});

// POST /api/players - Criar novo jogador
router.post('/', async (req, res) => {
  try {
    const { error, value } = playerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const player = await Player.create(value);
    res.status(201).json(player);
  } catch (error) {
    console.error('Erro ao criar jogador:', error);
    res.status(500).json({ error: 'Erro ao criar jogador' });
  }
});

// PUT /api/players/:id - Atualizar jogador
router.put('/:id', async (req, res) => {
  try {
    const { error, value } = playerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const player = await Player.update(req.params.id, value);
    if (!player) {
      return res.status(404).json({ error: 'Jogador não encontrado' });
    }
    res.json(player);
  } catch (error) {
    console.error('Erro ao atualizar jogador:', error);
    res.status(500).json({ error: 'Erro ao atualizar jogador' });
  }
});

// DELETE /api/players/:id - Deletar jogador
router.delete('/:id', async (req, res) => {
  try {
    await Player.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar jogador:', error);
    res.status(500).json({ error: 'Erro ao deletar jogador' });
  }
});

// GET /api/players/search/:name - Buscar jogadores por nome
router.get('/search/:name', async (req, res) => {
  try {
    const players = await Player.findByName(req.params.name);
    res.json(players);
  } catch (error) {
    console.error('Erro ao buscar jogadores:', error);
    res.status(500).json({ error: 'Erro ao buscar jogadores' });
  }
});

module.exports = router;