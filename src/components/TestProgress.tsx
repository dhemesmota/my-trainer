'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useWorkout } from '@/contexts/WorkoutContext';

export const TestProgress: React.FC = () => {
  const { workout, completeSet, resetProgress } = useWorkout();

  const handleTestProgress = () => {
    // Simular progresso em alguns exercícios
    completeSet(0, 0); // Dia 1, Exercício 1
    completeSet(0, 0); // Segunda série
    completeSet(0, 1); // Dia 1, Exercício 2
    completeSet(1, 0); // Dia 2, Exercício 1
  };

  const getProgressSummary = () => {
    const totalExercises = workout.days.reduce((acc, day) => acc + day.exercises.length, 0);
    const completedExercises = workout.days.reduce((acc, day) => 
      acc + day.exercises.filter(ex => ex.completed).length, 0
    );
    const totalSets = workout.days.reduce((acc, day) => 
      acc + day.exercises.reduce((dayAcc, exercise) => dayAcc + exercise.sets, 0), 0
    );
    const completedSets = workout.days.reduce((acc, day) => 
      acc + day.exercises.reduce((dayAcc, exercise) => dayAcc + exercise.currentSet, 0), 0
    );

    return {
      totalExercises,
      completedExercises,
      totalSets,
      completedSets,
    };
  };

  const progress = getProgressSummary();

  return (
    <Card className="mb-6 border-yellow-200 bg-yellow-50">
      <CardHeader>
        <CardTitle className="text-lg text-yellow-800">
          🧪 Teste de Persistência
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Exercícios:</strong> {progress.completedExercises}/{progress.totalExercises}
            </div>
            <div>
              <strong>Séries:</strong> {progress.completedSets}/{progress.totalSets}
            </div>
          </div>
          
          <div className="space-y-2">
            <Button
              onClick={handleTestProgress}
              variant="outline"
              size="sm"
              className="w-full"
            >
              Simular Progresso
            </Button>
            <Button
              onClick={resetProgress}
              variant="outline"
              size="sm"
              className="w-full"
            >
              Resetar Progresso
            </Button>
          </div>
          
          <div className="text-xs text-yellow-700">
            <p>💡 Dica: Clique em "Simular Progresso", recarregue a página e veja se o progresso persiste!</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
