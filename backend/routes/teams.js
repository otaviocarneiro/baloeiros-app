const express = require('express');
const router = express.Router();
const Confirmation = require('../models/Confirmation');

// Algoritmo para equilibrar times
function balanceTeams(players) {
  // Separar jogadores por características
  const setters = players.filter(p => p.position === 'levantador');
  const liberos = players.filter(p => p.position === 'libero');
  const men = players.filter(p => p.gender === 'M' && p.position !== 'levantador' && p.position !== 'libero');
  const women = players.filter(p => p.gender === 'F' && p.position !== 'levantador' && p.position !== 'libero');

  // Verificar se temos recursos mínimos para 2 times
  if (setters.length < 2) {
    throw new Error('É necessário pelo menos 2 levantadores para formar os times');
  }

  // Calcular número de times possíveis
  const playersPerTeam = 6;
  const maxTeams = Math.floor(players.length / playersPerTeam);
  const numTeams = Math.min(maxTeams, 2); // Limitando a 2 times por enquanto

  if (numTeams < 2) {
    throw new Error('Jogadores insuficientes para formar 2 times completos');
  }

  // Ordenar jogadores por nível (do maior para o menor)
  setters.sort((a, b) => b.level - a.level);
  liberos.sort((a, b) => b.level - a.level);
  men.sort((a, b) => b.level - a.level);
  women.sort((a, b) => b.level - a.level);

  // Inicializar times
  const teams = Array.from({ length: numTeams }, () => ({
    players: [],
    totalLevel: 0,
    menCount: 0,
    womenCount: 0,
    hasLibero: false,
    hasSetter: false
  }));

  // Distribuir levantadores primeiro (1 por time)
  setters.slice(0, numTeams).forEach((setter, index) => {
    teams[index].players.push(setter);
    teams[index].totalLevel += setter.level;
    teams[index].hasSetter = true;
    if (setter.gender === 'M') teams[index].menCount++;
    else teams[index].womenCount++;
  });

  // Distribuir liberos (máximo 1 por time)
  liberos.slice(0, numTeams).forEach((libero, index) => {
    teams[index].players.push(libero);
    teams[index].totalLevel += libero.level;
    teams[index].hasLibero = true;
    if (libero.gender === 'M') teams[index].menCount++;
    else teams[index].womenCount++;
  });

  // Combinar homens e mulheres restantes e ordenar por nível
  const remainingPlayers = [...men, ...women];
  remainingPlayers.sort((a, b) => b.level - a.level);

  // Distribuir os jogadores restantes alternadamente
  let teamIndex = 0;
  const maxPlayersPerTeam = playersPerTeam;

  for (const player of remainingPlayers) {
    // Encontrar o time com menor número de jogadores e menor nível total
    let bestTeam = 0;
    let minPlayers = teams[0].players.length;
    let minLevel = teams[0].totalLevel;

    for (let i = 0; i < teams.length; i++) {
      if (teams[i].players.length < maxPlayersPerTeam) {
        if (teams[i].players.length < minPlayers || 
           (teams[i].players.length === minPlayers && teams[i].totalLevel < minLevel)) {
          bestTeam = i;
          minPlayers = teams[i].players.length;
          minLevel = teams[i].totalLevel;
        }
      }
    }

    // Adicionar jogador ao time se houver espaço
    if (teams[bestTeam].players.length < maxPlayersPerTeam) {
      teams[bestTeam].players.push(player);
      teams[bestTeam].totalLevel += player.level;
      if (player.gender === 'M') teams[bestTeam].menCount++;
      else teams[bestTeam].womenCount++;
    }
  }

  // Calcular estatísticas dos times
  const teamStats = teams.map((team, index) => ({
    teamNumber: index + 1,
    players: team.players,
    totalPlayers: team.players.length,
    averageLevel: (team.totalLevel / team.players.length).toFixed(2),
    menCount: team.menCount,
    womenCount: team.womenCount,
    hasSetter: team.hasSetter,
    hasLibero: team.hasLibero,
    positions: {
      levantador: team.players.filter(p => p.position === 'levantador').length,
      libero: team.players.filter(p => p.position === 'libero').length,
      atacante: team.players.filter(p => p.position === 'atacante').length,
      meio: team.players.filter(p => p.position === 'meio').length,
      oposto: team.players.filter(p => p.position === 'oposto').length,
      outros: team.players.filter(p => p.position === 'outros').length
    }
  }));

  return teamStats;
}

// POST /api/teams/generate/:eventId - Gerar times equilibrados
router.post('/generate/:eventId', async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const confirmedPlayers = await Confirmation.getConfirmedPlayers(eventId);

    if (confirmedPlayers.length < 12) {
      return res.status(400).json({ 
        error: 'Mínimo de 12 jogadores necessários para gerar times',
        currentPlayers: confirmedPlayers.length
      });
    }

    const teams = balanceTeams(confirmedPlayers);
    
    // Calcular jogadores que ficaram de fora
    const playersInTeams = teams.reduce((acc, team) => acc + team.totalPlayers, 0);
    const benchPlayers = confirmedPlayers.slice(playersInTeams);

    res.json({
      teams,
      benchPlayers,
      summary: {
        totalConfirmedPlayers: confirmedPlayers.length,
        playersInTeams,
        playersOnBench: benchPlayers.length,
        averageLevelDifference: Math.abs(parseFloat(teams[0].averageLevel) - parseFloat(teams[1].averageLevel)).toFixed(2)
      }
    });

  } catch (error) {
    console.error('Erro ao gerar times:', error);
    res.status(500).json({ error: error.message || 'Erro ao gerar times' });
  }
});

// GET /api/teams/players/:eventId - Listar jogadores disponíveis para o evento
router.get('/players/:eventId', async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const confirmedPlayers = await Confirmation.getConfirmedPlayers(eventId);
    
    const playerStats = {
      total: confirmedPlayers.length,
      byGender: {
        men: confirmedPlayers.filter(p => p.gender === 'M').length,
        women: confirmedPlayers.filter(p => p.gender === 'F').length
      },
      byPosition: {
        levantador: confirmedPlayers.filter(p => p.position === 'levantador').length,
        libero: confirmedPlayers.filter(p => p.position === 'libero').length,
        atacante: confirmedPlayers.filter(p => p.position === 'atacante').length,
        meio: confirmedPlayers.filter(p => p.position === 'meio').length,
        oposto: confirmedPlayers.filter(p => p.position === 'oposto').length,
        outros: confirmedPlayers.filter(p => p.position === 'outros').length
      },
      byLevel: {
        level1: confirmedPlayers.filter(p => p.level === 1).length,
        level2: confirmedPlayers.filter(p => p.level === 2).length,
        level3: confirmedPlayers.filter(p => p.level === 3).length,
        level4: confirmedPlayers.filter(p => p.level === 4).length,
        level5: confirmedPlayers.filter(p => p.level === 5).length
      },
      averageLevel: (confirmedPlayers.reduce((sum, p) => sum + p.level, 0) / confirmedPlayers.length).toFixed(2)
    };

    res.json({
      players: confirmedPlayers,
      stats: playerStats
    });

  } catch (error) {
    console.error('Erro ao buscar jogadores do evento:', error);
    res.status(500).json({ error: 'Erro ao buscar jogadores do evento' });
  }
});

module.exports = router;