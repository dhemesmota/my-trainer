'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useWorkout } from '@/contexts/WorkoutContext';
import React, { useEffect, useState } from 'react';

export const TestProgress: React.FC = () => {
  const { workout, completeSet, resetProgress } = useWorkout();
  const [mounted, setMounted] = useState(false);

  // Evitar erro de hidratação
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleTestProgress = () => {
    // Simular progresso em alguns exercícios - UMA série por vez
    completeSet(0, 0); // Dia 1, Exercício 1 - Série 1
    // completeSet(0, 0); // Dia 1, Exercício 1 - Série 2 (comentado para não pular)
    completeSet(0, 1); // Dia 1, Exercício 2 - Série 1
    completeSet(1, 0); // Dia 2, Exercício 1 - Série 1
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

  // Não renderizar até estar no cliente
  if (!mounted) {
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
                <strong>Exercícios:</strong> 0/0
              </div>
              <div>
                <strong>Séries:</strong> 0/0
              </div>
            </div>
            
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                disabled
              >
                Carregando...
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                disabled
              >
                Carregando...
              </Button>
            </div>
            
            <div className="text-xs text-yellow-700">
              <p>💡 Carregando dados...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

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
              Simular Progresso (1 série por exercício)
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
            <p>💡 Dica: Clique em &quot;Simular Progresso&quot;, recarregue a página e veja se o progresso persiste!</p>
            <p>💡 Teste: Clique em &quot;Completar Série&quot; nos exercícios - deve incrementar de 1 em 1!</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
