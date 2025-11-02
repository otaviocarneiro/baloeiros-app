-- SQL Script para criar as tabelas no Supabase
-- Execute este script no SQL Editor do Supabase

-- Tabela de jogadores
CREATE TABLE IF NOT EXISTS players (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    gender CHAR(1) NOT NULL CHECK (gender IN ('M', 'F')),
    position VARCHAR(20) NOT NULL CHECK (position IN ('levantador', 'libero', 'atacante', 'meio', 'oposto', 'outros')),
    level INTEGER NOT NULL CHECK (level >= 1 AND level <= 5),
    phone VARCHAR(20),
    email VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de eventos
CREATE TABLE IF NOT EXISTS events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    date DATE NOT NULL,
    time_start TIME NOT NULL,
    time_end TIME NOT NULL,
    location VARCHAR(200) NOT NULL,
    max_players INTEGER NOT NULL CHECK (max_players >= 6),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de confirmações
CREATE TABLE IF NOT EXISTS confirmations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'waiting', 'cancelled')),
    confirmed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(player_id, event_id)
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_players_name ON players(name);
CREATE INDEX IF NOT EXISTS idx_players_position ON players(position);
CREATE INDEX IF NOT EXISTS idx_players_gender ON players(gender);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_confirmations_event ON confirmations(event_id);
CREATE INDEX IF NOT EXISTS idx_confirmations_player ON confirmations(player_id);
CREATE INDEX IF NOT EXISTS idx_confirmations_status ON confirmations(status);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_players_updated_at BEFORE UPDATE ON players
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_confirmations_updated_at BEFORE UPDATE ON confirmations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Inserir alguns dados de exemplo
INSERT INTO players (name, gender, position, level, phone, email) VALUES
('Rangel', 'M', 'atacante', 4, '(11) 99999-0001', 'rangel@email.com'),
('Eliel', 'M', 'levantador', 4, '(11) 99999-0002', 'eliel@email.com'),
('Mateus', 'M', 'meio', 3, '(11) 99999-0003', 'mateus@email.com'),
('Scarlet', 'F', 'atacante', 4, '(11) 99999-0004', 'scarlet@email.com'),
('Davi', 'M', 'libero', 3, '(11) 99999-0005', 'davi@email.com'),
('Luis', 'M', 'atacante', 3, '(11) 99999-0006', 'luis@email.com'),
('Luiz Fontes', 'M', 'meio', 4, '(11) 99999-0007', 'luizfontes@email.com'),
('Michael', 'M', 'oposto', 4, '(11) 99999-0008', 'michael@email.com'),
('Lucas', 'M', 'atacante', 3, '(11) 99999-0009', 'lucas@email.com'),
('David', 'M', 'meio', 3, '(11) 99999-0010', 'david@email.com'),
('Alê', 'F', 'levantador', 4, '(11) 99999-0011', 'ale@email.com'),
('Alisson', 'M', 'libero', 3, '(11) 99999-0012', 'alisson@email.com'),
('JP', 'M', 'atacante', 4, '(11) 99999-0013', 'jp@email.com'),
('Nilton', 'M', 'meio', 3, '(11) 99999-0014', 'nilton@email.com'),
('Carlinhos', 'M', 'atacante', 3, '(11) 99999-0015', 'carlinhos@email.com'),
('Pacheco', 'M', 'oposto', 4, '(11) 99999-0016', 'pacheco@email.com'),
('Jonathan', 'M', 'atacante', 3, '(11) 99999-0017', 'jonathan@email.com'),
('Leandro', 'M', 'meio', 3, '(11) 99999-0018', 'leandro@email.com'),
('Kessy', 'F', 'atacante', 3, '(11) 99999-0019', 'kessy@email.com'),
('Matheuzinho', 'M', 'libero', 2, '(11) 99999-0020', 'matheuzinho@email.com');

-- Inserir evento de exemplo
INSERT INTO events (title, date, time_start, time_end, location, max_players, description) VALUES
('Vôlei Campo dos Alemães', CURRENT_DATE + INTERVAL '7 days', '13:00', '17:00', 'Campo dos Alemães', 18, 'Jogo semanal de vôlei');

-- RLS (Row Level Security) - Opcional, para segurança
-- ALTER TABLE players ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE events ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE confirmations ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso público (ajuste conforme necessário)
-- CREATE POLICY "Allow public read access" ON players FOR SELECT USING (true);
-- CREATE POLICY "Allow public insert access" ON players FOR INSERT WITH CHECK (true);
-- CREATE POLICY "Allow public update access" ON players FOR UPDATE USING (true);
-- CREATE POLICY "Allow public delete access" ON players FOR DELETE USING (true);

-- Repetir para as outras tabelas se necessário...