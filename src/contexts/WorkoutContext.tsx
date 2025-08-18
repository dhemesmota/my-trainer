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
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

const initializeWorkoutWithProgress = (workout: WorkoutWeek): WorkoutWeekWithProgress => {
  return {
    ...workout,
    days: workout.days.map(day => ({
      ...day,
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
    }
  }, [workout, isClient]);

  const updateWorkout = (newWorkout: WorkoutWeek) => {
    setWorkout(initializeWorkoutWithProgress(newWorkout));
  };

  const toggleExercise = (dayIndex: number, exerciseIndex: number) => {
    setWorkout(prev => ({
      ...prev,
      days: prev.days.map((day, dIndex) =>
        dIndex === dayIndex
          ? {
              ...day,
              exercises: day.exercises.map((exercise, eIndex) =>
                eIndex === exerciseIndex
                  ? { ...exercise, completed: !exercise.completed }
                  : exercise
              ),
              completed: dIndex === dayIndex
                ? day.exercises.every((ex, eIndex) =>
                    eIndex === exerciseIndex ? !day.exercises[exerciseIndex].completed : ex.completed
                  )
                : day.completed,
            }
          : day
      ),
    }));
  };

  const completeSet = (dayIndex: number, exerciseIndex: number) => {
    setWorkout(prev => ({
      ...prev,
      days: prev.days.map((day, dIndex) =>
        dIndex === dayIndex
          ? {
              ...day,
              exercises: day.exercises.map((exercise, eIndex) =>
                eIndex === exerciseIndex
                  ? {
                      ...exercise,
                      currentSet: Math.min(exercise.currentSet + 1, exercise.sets),
                      completed: exercise.currentSet + 1 >= exercise.sets,
                    }
                  : exercise
              ),
            }
          : day
      ),
    }));
  };

  const resetProgress = () => {
    setWorkout(prev => initializeWorkoutWithProgress({
      week: prev.week,
      days: prev.days.map(day => ({
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
    const totalExercises = workout.days.reduce((acc, day) => acc + day.exercises.length, 0);
    const completedExercises = workout.days.reduce(
      (acc, day) => acc + day.exercises.filter(ex => ex.completed).length,
      0
    );
    return {
      completed: completedExercises,
      total: totalExercises,
      percentage: totalExercises > 0 ? Math.round((completedExercises / totalExercises) * 100) : 0,
    };
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
