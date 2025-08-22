-- Script para configurar o banco de dados do Supabase para o My Trainer

-- Habilitar RLS (Row Level Security)
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Criar tabela de treinos dos usuários
CREATE TABLE IF NOT EXISTS user_workouts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  week INTEGER NOT NULL,
  workout_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, week)
);

-- Criar tabela de registros de peso
CREATE TABLE IF NOT EXISTS weight_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  exercise_name TEXT NOT NULL,
  weight DECIMAL(5,2) NOT NULL CHECK (weight > 0),
  reps INTEGER NOT NULL CHECK (reps > 0),
  sets INTEGER NOT NULL CHECK (sets > 0),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_user_workouts_user_id ON user_workouts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_workouts_week ON user_workouts(week);
CREATE INDEX IF NOT EXISTS idx_weight_records_user_id ON weight_records(user_id);
CREATE INDEX IF NOT EXISTS idx_weight_records_exercise_name ON weight_records(exercise_name);
CREATE INDEX IF NOT EXISTS idx_weight_records_date ON weight_records(date);

-- Habilitar RLS nas tabelas
ALTER TABLE user_workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE weight_records ENABLE ROW LEVEL SECURITY;

-- Criar políticas para user_workouts
CREATE POLICY "Users can view their own workouts" ON user_workouts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own workouts" ON user_workouts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workouts" ON user_workouts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workouts" ON user_workouts
  FOR DELETE USING (auth.uid() = user_id);

-- Criar política para permitir que usuários vejam apenas seus próprios registros
CREATE POLICY "Users can view their own weight records" ON weight_records
  FOR SELECT USING (auth.uid() = user_id);

-- Criar política para permitir que usuários insiram seus próprios registros
CREATE POLICY "Users can insert their own weight records" ON weight_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Criar política para permitir que usuários atualizem seus próprios registros
CREATE POLICY "Users can update their own weight records" ON weight_records
  FOR UPDATE USING (auth.uid() = user_id);

-- Criar política para permitir que usuários deletem seus próprios registros
CREATE POLICY "Users can delete their own weight records" ON weight_records
  FOR DELETE USING (auth.uid() = user_id);

-- Função para atualizar o campo updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_user_workouts_updated_at
  BEFORE UPDATE ON user_workouts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_weight_records_updated_at
  BEFORE UPDATE ON weight_records
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comentários para documentação
COMMENT ON TABLE user_workouts IS 'Treinos dos usuários';
COMMENT ON COLUMN user_workouts.user_id IS 'ID do usuário';
COMMENT ON COLUMN user_workouts.week IS 'Número da semana do treino';
COMMENT ON COLUMN user_workouts.workout_data IS 'Dados completos do treino em JSON';

COMMENT ON TABLE weight_records IS 'Registros de peso dos exercícios dos usuários';
COMMENT ON COLUMN weight_records.user_id IS 'ID do usuário que fez o registro';
COMMENT ON COLUMN weight_records.exercise_name IS 'Nome do exercício';
COMMENT ON COLUMN weight_records.weight IS 'Peso usado no exercício (em kg)';
COMMENT ON COLUMN weight_records.reps IS 'Número de repetições';
COMMENT ON COLUMN weight_records.sets IS 'Número de séries';
COMMENT ON COLUMN weight_records.date IS 'Data do treino';
COMMENT ON COLUMN weight_records.notes IS 'Observações sobre o treino';
