'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle, Info, Play, Timer } from 'lucide-react';
import { ExerciseWithProgress } from '@/types/workout';
import { useWorkout } from '@/contexts/WorkoutContext';

interface ExerciseCardProps {
  exercise: ExerciseWithProgress;
  dayIndex: number;
  exerciseIndex: number;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, dayIndex, exerciseIndex }) => {
  const { toggleExercise, completeSet, restTimer } = useWorkout();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCompleteSet = () => {
    completeSet(dayIndex, exerciseIndex);
    
    // Iniciar timer de descanso de 90 segundos após completar uma série
    if (exercise.currentSet < exercise.sets - 1) {
      restTimer.startTimer(90);
    }
  };

  const progressPercentage = exercise.sets > 0 ? (exercise.currentSet / exercise.sets) * 100 : 0;

  return (
    <Card className={`transition-all duration-200 ${exercise.completed ? 'bg-green-50 border-green-200' : 'bg-white'}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <button
                onClick={() => toggleExercise(dayIndex, exerciseIndex)}
                className="flex-shrink-0"
              >
                {exercise.completed ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <Circle className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
              <span className="truncate">{exercise.name}</span>
            </CardTitle>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Badge variant="secondary" className="text-xs">
                {exercise.sets} séries
              </Badge>
              <Badge variant="outline" className="text-xs">
                {exercise.reps}
              </Badge>
              {exercise.technique && (
                <Badge variant="outline" className="text-xs">
                  {exercise.technique}
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Info className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{exercise.name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm text-gray-700 mb-2">Detalhes:</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Séries:</strong> {exercise.sets}</div>
                      <div><strong>Repetições:</strong> {exercise.reps}</div>
                      <div><strong>Técnica:</strong> {exercise.technique}</div>
                    </div>
                  </div>
                  
                  {exercise.notes && (
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-2">Notas:</h4>
                      <p className="text-sm text-gray-600">{exercise.notes}</p>
                    </div>
                  )}
                  
                  {exercise.alternatives && exercise.alternatives.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-2">Alternativas:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {exercise.alternatives.map((alt, index) => (
                          <li key={index}>• {alt}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Progresso das séries */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Progresso: {exercise.currentSet}/{exercise.sets} séries
              </span>
              <span className="text-sm text-gray-500">{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {/* Botões de controle */}
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handleCompleteSet}
              disabled={exercise.currentSet >= exercise.sets}
              variant="default"
              size="sm"
              className="flex items-center gap-2 flex-1 min-w-[120px]"
            >
              <CheckCircle className="h-4 w-4" />
              Completar Série
            </Button>
            
            <Button
              onClick={() => restTimer.startTimer(90)}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Timer className="h-4 w-4" />
              Descanso
            </Button>
          </div>

          {/* Status do exercício */}
          {exercise.completed && (
            <div className="flex items-center gap-2 text-green-600 text-sm">
              <CheckCircle className="h-4 w-4" />
              <span>Exercício completado!</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
