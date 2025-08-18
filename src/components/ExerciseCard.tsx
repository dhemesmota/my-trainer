'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { ExerciseWithProgress } from '@/types/workout';
import {
    ArrowRight,
    CheckCircle,
    Circle,
    Dumbbell,
    Info,
    Lightbulb,
    Play,
    Target,
    Timer
} from 'lucide-react';
import React, { useState } from 'react';

interface ExerciseCardProps {
  exercise: ExerciseWithProgress;
  onToggle: () => void;
  onCompleteSet: () => void;
  dayIndex: number;
  exerciseIndex: number;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  onToggle,
  onCompleteSet,
  dayIndex,
  exerciseIndex,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const progressPercentage = (exercise.currentSet / exercise.sets) * 100;

  return (
    <Card className={`transition-all duration-300 hover:shadow-lg ${
      exercise.completed ? 'bg-green-50 border-green-200' : 'bg-white'
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              {exercise.completed ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <Circle className="h-5 w-5 text-gray-400" />
              )}
              {exercise.name}
            </CardTitle>
            <div className="flex items-center gap-4 mt-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Dumbbell className="h-3 w-3" />
                {exercise.sets} séries
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Target className="h-3 w-3" />
                {exercise.reps} reps
              </Badge>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDetails(true)}
            className="text-gray-500 hover:text-gray-700"
          >
            <Info className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Progresso das séries</span>
            <span className="text-sm font-medium text-gray-900">
              {exercise.currentSet}/{exercise.sets}
            </span>
          </div>
          
          <Progress value={progressPercentage} className="h-2" />
          
          <div className="flex gap-2">
            <Button
              onClick={onCompleteSet}
              disabled={exercise.currentSet >= exercise.sets}
              className="flex-1"
              size="sm"
            >
              <Play className="h-4 w-4 mr-1" />
              Completar Série
            </Button>
            
            <Button
              onClick={onToggle}
              variant={exercise.completed ? "outline" : "default"}
              size="sm"
              className="flex items-center gap-1"
            >
              {exercise.completed ? "Desmarcar" : "Completar"}
            </Button>
          </div>
        </div>
      </CardContent>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Dumbbell className="h-5 w-5" />
              {exercise.name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-sm font-medium text-gray-700">
                  <Timer className="h-4 w-4" />
                  Séries
                </div>
                <p className="text-lg font-semibold">{exercise.sets}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-sm font-medium text-gray-700">
                  <Target className="h-4 w-4" />
                  Repetições
                </div>
                <p className="text-lg font-semibold">{exercise.reps}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <Play className="h-4 w-4 mt-0.5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Técnica</p>
                  <p className="text-sm text-gray-600">{exercise.technique}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 mt-0.5 text-orange-600" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Observações</p>
                  <p className="text-sm text-gray-600">{exercise.notes}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-yellow-600" />
                <p className="text-sm font-medium text-gray-700">Alternativas</p>
              </div>
              <div className="space-y-1">
                {exercise.alternatives.map((alternative, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                    <ArrowRight className="h-3 w-3" />
                    {alternative}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
