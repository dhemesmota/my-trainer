'use client';

import { createClient } from '@/lib/supabase';
import { WeightProgress, WeightRecord } from '@/types/user';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

interface WeightContextType {
  weightRecords: WeightRecord[];
  weightProgress: WeightProgress[];
  loading: boolean;
  addWeightRecord: (record: Omit<WeightRecord, 'id' | 'user_id' | 'created_at'>) => Promise<{ error: Error | null }>;
  updateWeightRecord: (id: string, updates: Partial<WeightRecord>) => Promise<{ error: Error | null }>;
  deleteWeightRecord: (id: string) => Promise<{ error: Error | null }>;
  getExerciseProgress: (exerciseName: string) => WeightProgress | null;
  getExerciseRecentRecords: (exerciseName: string, limit?: number) => WeightRecord[];
  refreshData: () => Promise<void>;
}

const WeightContext = createContext<WeightContextType | undefined>(undefined);

export const WeightProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [weightRecords, setWeightRecords] = useState<WeightRecord[]>([]);
  const [weightProgress, setWeightProgress] = useState<WeightProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const supabase = createClient();

  const fetchWeightRecords = async () => {
    if (!user) {
      setWeightRecords([]);
      setWeightProgress([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('weight_records')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;

      setWeightRecords(data || []);
      calculateProgress(data || []);
    } catch (error) {
      console.error('Erro ao buscar registros de peso:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = (records: WeightRecord[]) => {
    const progressMap = new Map<string, WeightProgress>();

    records.forEach(record => {
      const existing = progressMap.get(record.exercise_name);
      
      if (!existing) {
        // Primeiro registro para este exercício
        progressMap.set(record.exercise_name, {
          exercise_name: record.exercise_name,
          current_weight: record.weight,
          max_weight: record.weight,
          total_workouts: 1,
          last_updated: record.date,
          progress_percentage: 100,
        });
      } else {
        // Atualizar contador de treinos
        existing.total_workouts += 1;
        
        // Atualizar peso máximo se necessário
        if (record.weight > existing.max_weight) {
          existing.max_weight = record.weight;
        }
        
        // Atualizar peso atual (sempre o mais recente)
        if (record.date >= existing.last_updated) {
          existing.current_weight = record.weight;
          existing.last_updated = record.date;
        }
        
        // Recalcular porcentagem de progresso
        existing.progress_percentage = Math.round((existing.current_weight / existing.max_weight) * 100);
      }
    });

    setWeightProgress(Array.from(progressMap.values()));
  };

  useEffect(() => {
    fetchWeightRecords();
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const addWeightRecord = async (record: Omit<WeightRecord, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) {
      return { error: new Error('Usuário não autenticado') };
    }

    try {
      const { data, error } = await supabase
        .from('weight_records')
        .insert([{
          ...record,
          user_id: user.id,
        }])
        .select()
        .single();

      if (error) throw error;

      setWeightRecords(prev => [data, ...prev]);
      await fetchWeightRecords(); // Recalcular progresso
      
      return { error: null };
    } catch (error) {
      console.error('Erro ao adicionar registro de peso:', error);
      return { error: error instanceof Error ? error : new Error(String(error)) };
    }
  };

  const updateWeightRecord = async (id: string, updates: Partial<WeightRecord>) => {
    try {
      const { error } = await supabase
        .from('weight_records')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setWeightRecords(prev => 
        prev.map(record => 
          record.id === id ? { ...record, ...updates } : record
        )
      );
      await fetchWeightRecords(); // Recalcular progresso
      
      return { error: null };
    } catch (error) {
      console.error('Erro ao atualizar registro de peso:', error);
      return { error: error instanceof Error ? error : new Error(String(error)) };
    }
  };

  const deleteWeightRecord = async (id: string) => {
    try {
      const { error } = await supabase
        .from('weight_records')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setWeightRecords(prev => prev.filter(record => record.id !== id));
      await fetchWeightRecords(); // Recalcular progresso
      
      return { error: null };
    } catch (error) {
      console.error('Erro ao deletar registro de peso:', error);
      return { error: error instanceof Error ? error : new Error(String(error)) };
    }
  };

  const getExerciseProgress = (exerciseName: string) => {
    return weightProgress.find(progress => progress.exercise_name === exerciseName) || null;
  };

  const getExerciseRecentRecords = (exerciseName: string, limit: number = 3): WeightRecord[] => {
    return weightRecords
      .filter(record => record.exercise_name === exerciseName)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  };

  const refreshData = async () => {
    await fetchWeightRecords();
  };

  return (
    <WeightContext.Provider
      value={{
        weightRecords,
        weightProgress,
        loading,
        addWeightRecord,
        updateWeightRecord,
        deleteWeightRecord,
        getExerciseProgress,
        getExerciseRecentRecords,
        refreshData,
      }}
    >
      {children}
    </WeightContext.Provider>
  );
};

export const useWeight = () => {
  const context = useContext(WeightContext);
  if (context === undefined) {
    throw new Error('useWeight must be used within a WeightProvider');
  }
  return context;
};
