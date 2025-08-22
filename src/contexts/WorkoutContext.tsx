'use client';

import { defaultWorkout } from '@/data/default-workout';
import { WorkoutWeek, WorkoutWeekWithProgress } from '@/types/workout';

import { createClient } from '@/lib/supabase';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

// Tipos removidos - agora usamos apenas Supabase

interface WorkoutContextType {
  workout: WorkoutWeekWithProgress;
  updateWorkout: (newWorkout: WorkoutWeek) => void;
  toggleExercise: (dayIndex: number, exerciseIndex: number) => void;
  completeSet: (dayIndex: number, exerciseIndex: number) => void;
  resetProgress: () => void;
  getProgress: () => { completed: number; total: number; percentage: number };
  saveWorkout: () => void; // Função para salvar manualmente
  // Timer de descanso
  restTimer: {
    isActive: boolean;
    timeLeft: number;
    startTimer: (seconds: number) => void;
    pauseTimer: () => void;
    resetTimer: () => void;
  };
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

const initializeWorkoutWithProgress = (workout: WorkoutWeek): WorkoutWeekWithProgress => {
  return {
    week: workout.week,
    days: workout.days.map(day => ({
      day: day.day,
      group: day.group,
      completed: false,
      exercises: day.exercises.map(exercise => ({
        ...exercise,
        completed: false,
        currentSet: 0,
      })),
    })),
  };
};

// Função removida - agora usamos apenas Supabase

export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workout, setWorkout] = useState<WorkoutWeekWithProgress>(() => {
    const initialWorkout = initializeWorkoutWithProgress(defaultWorkout);
    return initialWorkout;
  });
  const [isClient, setIsClient] = useState(false);
  const { user } = useAuth();
  const supabase = createClient();
  
  // Timer de descanso
  const [timerActive, setTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  
  // Ref para evitar execuções duplas
  const isProcessingRef = React.useRef(false);

  // Garantir que estamos no cliente e depois carregar dados
  useEffect(() => {
    setIsClient(true);
    
    // Carregar timer se existir (apenas o timer permanece no localStorage)
    const savedTimer = localStorage.getItem('workout-timer');
    if (savedTimer) {
      try {
        const timer = JSON.parse(savedTimer);
        setTimeLeft(timer.timeLeft || 0);
        setTimerActive(timer.isActive || false);
      } catch (error) {
        console.error('Erro ao carregar timer:', error);
      }
    }
  }, []);

  // Carregar workout do Supabase quando usuário estiver logado E cliente estiver pronto
  useEffect(() => {
    if (user && isClient) {
      loadWorkoutFromSupabase();
    }
  }, [user, isClient]); // eslint-disable-line react-hooks/exhaustive-deps

  // Removi o salvamento automático para evitar loops e execuções duplas
  // O salvamento agora é feito apenas nas funções específicas (toggleExercise, completeSet, etc.)

  // Salvar timer no localStorage
  useEffect(() => {
    if (isClient) {
      localStorage.setItem('workout-timer', JSON.stringify({
        isActive: timerActive,
        timeLeft: timeLeft,
      }));
    }
  }, [timerActive, timeLeft, isClient]);

  // Timer de descanso
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setTimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, timeLeft]);

  const loadWorkoutFromSupabase = async () => {
    if (!user || !isClient) return;

    try {
      const { data, error } = await supabase
        .from('user_workouts')
        .select('*')
        .eq('user_id', user.id)
        .eq('week', defaultWorkout.week)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Erro ao carregar workout:', error);
        return;
      }

      if (data && data.workout_data) {
        // Carregar workout do Supabase com progresso
        console.log('📊 Carregando workout do Supabase:', data.workout_data);
        setWorkout(data.workout_data);
      } else {
        // Se não há workout salvo, criar um novo com base no padrão
        console.log('📊 Criando novo workout baseado no padrão');
        const initialWorkout = initializeWorkoutWithProgress(defaultWorkout);
        setWorkout(initialWorkout);
        
        // Salvar o workout inicial no Supabase
        await saveWorkoutToSupabase(initialWorkout);
      }
    } catch (error) {
      console.error('Erro ao carregar workout do Supabase:', error);
      // Em caso de erro, usar o workout padrão
      const initialWorkout = initializeWorkoutWithProgress(defaultWorkout);
      setWorkout(initialWorkout);
    }
  };

  const saveWorkoutToSupabase = useCallback(async (workoutData: WorkoutWeekWithProgress) => {
    if (!user || !isClient) return;

    try {
      const { error } = await supabase
        .from('user_workouts')
        .upsert({
          user_id: user.id,
          week: workoutData.week,
          workout_data: workoutData,
        }, {
          onConflict: 'user_id,week'
        });

      if (error) {
        console.error('Erro ao salvar workout:', error);
      }
    } catch (error) {
      console.error('Erro ao salvar workout no Supabase:', error);
    }
  }, [user, supabase, isClient]);

  const updateWorkout = useCallback((newWorkout: WorkoutWeek) => {
    // Criar workout com progresso inicial zerado
    const workoutWithProgress = initializeWorkoutWithProgress(newWorkout);
    setWorkout(workoutWithProgress);
    
    // Salvar no Supabase
    if (user && isClient) {
      saveWorkoutToSupabase(workoutWithProgress);
    }
  }, [user, isClient, saveWorkoutToSupabase]);

  const toggleExercise = useCallback((dayIndex: number, exerciseIndex: number) => {
    setWorkout(prev => {
      const newWorkout = { ...prev };
      const exercise = newWorkout.days[dayIndex].exercises[exerciseIndex];
      exercise.completed = !exercise.completed;
      
      // Verificar se todos os exercícios do dia estão completos
      const allCompleted = newWorkout.days[dayIndex].exercises.every(ex => ex.completed);
      newWorkout.days[dayIndex].completed = allCompleted;
      
      // Salvar no Supabase imediatamente
      if (user && isClient) {
        void saveWorkoutToSupabase(newWorkout);
      }
      
      return newWorkout;
    });
  }, [user, isClient, saveWorkoutToSupabase]);

  const completeSet = useCallback((dayIndex: number, exerciseIndex: number) => {
    // Proteção contra execuções duplas
    if (isProcessingRef.current) {
      console.log(`⚠️ completeSet já está sendo executado, ignorando...`);
      return;
    }
    
    isProcessingRef.current = true;
    console.log(`🔄 completeSet chamado: Dia ${dayIndex + 1}, Exercício ${exerciseIndex + 1}`);
    
    setWorkout(prev => {
      const newWorkout = { ...prev };
      const exercise = newWorkout.days[dayIndex].exercises[exerciseIndex];
      
      console.log(`📊 Antes: ${exercise.currentSet}/${exercise.sets} séries`);
      
      // Completar apenas UMA série por vez
      if (exercise.currentSet < exercise.sets) {
        exercise.currentSet += 1;
        
        console.log(`📊 Depois: ${exercise.currentSet}/${exercise.sets} séries`);
        
        // Se completou todas as séries, marcar como completo
        if (exercise.currentSet === exercise.sets) {
          exercise.completed = true;
          console.log(`✅ Exercício completado!`);
          
          // Verificar se todos os exercícios do dia estão completos
          const allCompleted = newWorkout.days[dayIndex].exercises.every(ex => ex.completed);
          newWorkout.days[dayIndex].completed = allCompleted;
        }
        
        // Salvar no Supabase imediatamente (sem setTimeout)
        if (user && isClient) {
          // Usar void para ignorar a Promise e evitar warnings
          void saveWorkoutToSupabase(newWorkout);
        }
      } else {
        console.log(`⚠️ Exercício já tem todas as séries completas!`);
      }
      
      // Liberar a proteção após a atualização
      setTimeout(() => {
        isProcessingRef.current = false;
      }, 100);
      
      return newWorkout;
    });
  }, [user, isClient, saveWorkoutToSupabase]);

  const resetProgress = useCallback(() => {
    const initialWorkout = initializeWorkoutWithProgress({
      week: workout.week,
      days: workout.days.map(day => ({
        day: day.day,
        group: day.group,
        exercises: day.exercises.map(exercise => ({
          name: exercise.name,
          sets: exercise.sets,
          reps: exercise.reps,
          technique: exercise.technique,
          notes: exercise.notes,
          alternatives: exercise.alternatives,
        })),
      })),
    });
    setWorkout(initialWorkout);
    
    // Salvar no Supabase
    if (user && isClient) {
      saveWorkoutToSupabase(initialWorkout);
    }
    
    // Limpar timer do localStorage
    if (isClient) {
      localStorage.removeItem('workout-timer');
    }
  }, [workout.week, workout.days, isClient, user, saveWorkoutToSupabase]);

  const getProgress = useCallback(() => {
    const total = workout.days.reduce((acc, day) => acc + day.exercises.length, 0);
    const completed = workout.days.reduce((acc, day) => 
      acc + day.exercises.filter(ex => ex.completed).length, 0
    );
    return {
      completed,
      total,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }, [workout.days]);

  // Funções do timer
  const startTimer = useCallback((seconds: number) => {
    setTimeLeft(seconds);
    setTimerActive(true);
  }, []);

  const pauseTimer = useCallback(() => {
    setTimerActive(false);
  }, []);

  const resetTimer = useCallback(() => {
    setTimerActive(false);
    setTimeLeft(0);
  }, []);

  const saveWorkout = useCallback(() => {
    if (user && isClient) {
      saveWorkoutToSupabase(workout);
    }
  }, [user, isClient, workout, saveWorkoutToSupabase]);

  return (
    <WorkoutContext.Provider
      value={{
        workout,
        updateWorkout,
        toggleExercise,
        completeSet,
        resetProgress,
        getProgress,
        saveWorkout,
        restTimer: {
          isActive: timerActive,
          timeLeft,
          startTimer,
          pauseTimer,
          resetTimer,
        },
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (context === undefined) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
};
