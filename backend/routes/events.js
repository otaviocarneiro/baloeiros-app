const express = require('express');
const router = express.Router();
const Joi = require('joi');
const Event = require('../models/Event');

// Validation schema
const eventSchema = Joi.object({
  title: Joi.string().min(3).max(200).required(),
  date: Joi.date().iso().required(),
  time_start: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
  time_end: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
  location: Joi.string().min(3).max(200).required(),
  max_players: Joi.number().integer().min(6).max(50).required(),
  description: Joi.string().max(500).optional()
});

// GET /api/events - Listar todos os eventos
router.get('/', async (req, res) => {
  try {
    const events = await Event.findAll();
    res.json(events);
  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
    res.status(500).json({ error: 'Erro ao buscar eventos' });
  }
});

// GET /api/events/current - Buscar evento atual/próximo
router.get('/current', async (req, res) => {
  try {
    const event = await Event.findCurrent();
    if (!event) {
      return res.status(404).json({ error: 'Nenhum evento futuro encontrado' });
    }
    res.json(event);
  } catch (error) {
    console.error('Erro ao buscar evento atual:', error);
    res.status(500).json({ error: 'Erro ao buscar evento atual' });
  }
});

// GET /api/events/:id - Buscar evento por ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Evento não encontrado' });
    }
    res.json(event);
  } catch (error) {
    console.error('Erro ao buscar evento:', error);
    res.status(500).json({ error: 'Erro ao buscar evento' });
  }
});

// POST /api/events - Criar novo evento
router.post('/', async (req, res) => {
  try {
    const { error, value } = eventSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const event = await Event.create(value);
    res.status(201).json(event);
  } catch (error) {
    console.error('Erro ao criar evento:', error);
    res.status(500).json({ error: 'Erro ao criar evento' });
  }
});

// PUT /api/events/:id - Atualizar evento
router.put('/:id', async (req, res) => {
  try {
    const { error, value } = eventSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const event = await Event.update(req.params.id, value);
    if (!event) {
      return res.status(404).json({ error: 'Evento não encontrado' });
    }
    res.json(event);
  } catch (error) {
    console.error('Erro ao atualizar evento:', error);
    res.status(500).json({ error: 'Erro ao atualizar evento' });
  }
});

module.exports = router;