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

export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workout, setWorkout] = useState<WorkoutWeekWithProgress>(() => 
    initializeWorkoutWithProgress(defaultWorkout)
  );
  const [isClient, setIsClient] = useState(false);
  
  // Timer de descanso
  const [timerActive, setTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  // Garantir que estamos no cliente antes de acessar localStorage
  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem('workout-data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setWorkout(initializeWorkoutWithProgress(parsed));
      } catch {
        // Se houver erro, mantém o default
      }
    }
  }, []);

  // Salvar dados no localStorage sempre que houver mudanças
  useEffect(() => {
    if (isClient) {
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
      
      // Salvar progresso separadamente
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
    setWorkout(initializeWorkoutWithProgress(newWorkout));
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
    setWorkout(initializeWorkoutWithProgress({
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
