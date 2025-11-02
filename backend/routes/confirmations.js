const express = require('express');
const router = express.Router();
const Joi = require('joi');
const Confirmation = require('../models/Confirmation');
const Event = require('../models/Event');

// Validation schema
const confirmationSchema = Joi.object({
  player_id: Joi.string().uuid().required(),
  event_id: Joi.string().uuid().required(),
  status: Joi.string().valid('confirmed', 'waiting', 'cancelled').default('confirmed')
});

// GET /api/confirmations/event/:eventId - Listar confirmações de um evento
router.get('/event/:eventId', async (req, res) => {
  try {
    const confirmations = await Confirmation.findByEvent(req.params.eventId);
    res.json(confirmations);
  } catch (error) {
    console.error('Erro ao buscar confirmações:', error);
    res.status(500).json({ error: 'Erro ao buscar confirmações' });
  }
});

// GET /api/confirmations/event/:eventId/confirmed - Jogadores confirmados
router.get('/event/:eventId/confirmed', async (req, res) => {
  try {
    const players = await Confirmation.getConfirmedPlayers(req.params.eventId);
    res.json(players);
  } catch (error) {
    console.error('Erro ao buscar jogadores confirmados:', error);
    res.status(500).json({ error: 'Erro ao buscar jogadores confirmados' });
  }
});

// GET /api/confirmations/event/:eventId/waiting - Lista de espera
router.get('/event/:eventId/waiting', async (req, res) => {
  try {
    const waitingList = await Confirmation.getWaitingList(req.params.eventId);
    res.json(waitingList);
  } catch (error) {
    console.error('Erro ao buscar lista de espera:', error);
    res.status(500).json({ error: 'Erro ao buscar lista de espera' });
  }
});

// POST /api/confirmations - Confirmar presença
router.post('/', async (req, res) => {
  try {
    const { error, value } = confirmationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Verificar se já existe confirmação para este jogador neste evento
    const existingConfirmation = await Confirmation.findByPlayer(value.player_id, value.event_id);
    if (existingConfirmation) {
      return res.status(400).json({ error: 'Jogador já confirmou presença para este evento' });
    }

    // Verificar se ainda há vagas ou se vai para lista de espera
    const event = await Event.findById(value.event_id);
    const confirmedPlayers = await Confirmation.getConfirmedPlayers(value.event_id);
    
    if (confirmedPlayers.length >= event.max_players) {
      value.status = 'waiting';
    }

    value.confirmed_at = new Date().toISOString();
    const confirmation = await Confirmation.create(value);
    res.status(201).json(confirmation);
  } catch (error) {
    console.error('Erro ao confirmar presença:', error);
    res.status(500).json({ error: 'Erro ao confirmar presença' });
  }
});

// PUT /api/confirmations/:id - Atualizar confirmação
router.put('/:id', async (req, res) => {
  try {
    const updateData = req.body;
    const confirmation = await Confirmation.update(req.params.id, updateData);
    if (!confirmation) {
      return res.status(404).json({ error: 'Confirmação não encontrada' });
    }
    res.json(confirmation);
  } catch (error) {
    console.error('Erro ao atualizar confirmação:', error);
    res.status(500).json({ error: 'Erro ao atualizar confirmação' });
  }
});

// DELETE /api/confirmations/:id - Cancelar confirmação
router.delete('/:id', async (req, res) => {
  try {
    await Confirmation.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error('Erro ao cancelar confirmação:', error);
    res.status(500).json({ error: 'Erro ao cancelar confirmação' });
  }
});

module.exports = router;