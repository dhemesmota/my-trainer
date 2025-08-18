'use client';

import { defaultWorkout } from '@/data/default-workout';
import { WorkoutWeek, WorkoutWeekWithProgress } from '@/types/workout';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface WorkoutContextType {
  workout: WorkoutWeekWithProgress;
  updateWorkout: (newWorkout: WorkoutWeek) => void;
  toggleExercise: (dayIndex: number, exerciseIndex: number) => void;
  completeSet: (dayIndex: number, exerciseIndex: number) => void;
  resetProgress: () => void;
  getProgress: () => { completed: number; total: number; percentage: number };
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

// Função para carregar progresso salvo
const loadSavedProgress = (workout: WorkoutWeekWithProgress): WorkoutWeekWithProgress => {
  try {
    const savedProgress = localStorage.getItem('workout-progress');
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      
      // Aplicar progresso salvo ao workout
      const updatedWorkout = { ...workout };
      
      progress.days.forEach((savedDay: any) => {
        const dayIndex = updatedWorkout.days.findIndex(day => day.day === savedDay.day);
        if (dayIndex !== -1) {
          updatedWorkout.days[dayIndex].completed = savedDay.completed;
          
          savedDay.exercises.forEach((savedExercise: any) => {
            const exerciseIndex = updatedWorkout.days[dayIndex].exercises.findIndex(
              ex => ex.name === savedExercise.name
            );
            if (exerciseIndex !== -1) {
              updatedWorkout.days[dayIndex].exercises[exerciseIndex].completed = savedExercise.completed;
              updatedWorkout.days[dayIndex].exercises[exerciseIndex].currentSet = savedExercise.currentSet;
            }
          });
        }
      });
      
      return updatedWorkout;
    }
  } catch (error) {
    console.error('Erro ao carregar progresso:', error);
  }
  
  return workout;
};

export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workout, setWorkout] = useState<WorkoutWeekWithProgress>(() => {
    const initialWorkout = initializeWorkoutWithProgress(defaultWorkout);
    return loadSavedProgress(initialWorkout);
  });
  const [isClient, setIsClient] = useState(false);
  
  // Timer de descanso
  const [timerActive, setTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  // Garantir que estamos no cliente antes de acessar localStorage
  useEffect(() => {
    setIsClient(true);
    
    // Carregar dados do workout se existirem
    const savedWorkout = localStorage.getItem('workout-data');
    if (savedWorkout) {
      try {
        const parsed = JSON.parse(savedWorkout);
        const newWorkout = initializeWorkoutWithProgress(parsed);
        const workoutWithProgress = loadSavedProgress(newWorkout);
        setWorkout(workoutWithProgress);
      } catch (error) {
        console.error('Erro ao carregar workout:', error);
      }
    }
    
    // Carregar timer se existir
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

  // Salvar dados no localStorage sempre que houver mudanças
  useEffect(() => {
    if (isClient) {
      // Salvar dados do workout
      localStorage.setItem('workout-data', JSON.stringify({
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
      }));
      
      // Salvar progresso detalhado
      localStorage.setItem('workout-progress', JSON.stringify({
        days: workout.days.map(day => ({
          day: day.day,
          completed: day.completed,
          exercises: day.exercises.map(exercise => ({
            name: exercise.name,
            completed: exercise.completed,
            currentSet: exercise.currentSet,
          })),
        })),
      }));
    }
  }, [workout, isClient]);

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

  const updateWorkout = (newWorkout: WorkoutWeek) => {
    const workoutWithProgress = initializeWorkoutWithProgress(newWorkout);
    const workoutWithSavedProgress = loadSavedProgress(workoutWithProgress);
    setWorkout(workoutWithSavedProgress);
  };

  const toggleExercise = (dayIndex: number, exerciseIndex: number) => {
    setWorkout(prev => {
      const newWorkout = { ...prev };
      const exercise = newWorkout.days[dayIndex].exercises[exerciseIndex];
      exercise.completed = !exercise.completed;
      
      // Verificar se todos os exercícios do dia estão completos
      const allCompleted = newWorkout.days[dayIndex].exercises.every(ex => ex.completed);
      newWorkout.days[dayIndex].completed = allCompleted;
      
      return newWorkout;
    });
  };

  const completeSet = (dayIndex: number, exerciseIndex: number) => {
    setWorkout(prev => {
      const newWorkout = { ...prev };
      const exercise = newWorkout.days[dayIndex].exercises[exerciseIndex];
      
      if (exercise.currentSet < exercise.sets) {
        exercise.currentSet += 1;
        
        // Se completou todas as séries, marcar como completo
        if (exercise.currentSet === exercise.sets) {
          exercise.completed = true;
          
          // Verificar se todos os exercícios do dia estão completos
          const allCompleted = newWorkout.days[dayIndex].exercises.every(ex => ex.completed);
          newWorkout.days[dayIndex].completed = allCompleted;
        }
      }
      
      return newWorkout;
    });
  };

  const resetProgress = () => {
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
    
    // Limpar progresso do localStorage
    if (isClient) {
      localStorage.removeItem('workout-progress');
      localStorage.removeItem('workout-timer');
    }
  };

  const getProgress = () => {
    const total = workout.days.reduce((acc, day) => acc + day.exercises.length, 0);
    const completed = workout.days.reduce((acc, day) => 
      acc + day.exercises.filter(ex => ex.completed).length, 0
    );
    return {
      completed,
      total,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  };

  // Funções do timer
  const startTimer = (seconds: number) => {
    setTimeLeft(seconds);
    setTimerActive(true);
  };

  const pauseTimer = () => {
    setTimerActive(false);
  };

  const resetTimer = () => {
    setTimerActive(false);
    setTimeLeft(0);
  };

  return (
    <WorkoutContext.Provider
      value={{
        workout,
        updateWorkout,
        toggleExercise,
        completeSet,
        resetProgress,
        getProgress,
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
