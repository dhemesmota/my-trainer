'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronDown, ChevronUp, Dumbbell, Target } from 'lucide-react';
import { DayWithProgress } from '@/types/workout';
import { ExerciseCard } from './ExerciseCard';

interface DayCardProps {
  day: DayWithProgress;
  dayIndex: number;
}

export const DayCard: React.FC<DayCardProps> = ({ day, dayIndex }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const completedExercises = day.exercises.filter(ex => ex.completed).length;
  const totalExercises = day.exercises.length;
  const progressPercentage = totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0;

  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader 
        className="cursor-pointer pb-4"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
              <Dumbbell className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <span>Dia {day.day}</span>
                <Badge variant="outline" className="text-xs">
                  {day.group}
                </Badge>
              </CardTitle>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {completedExercises}/{totalExercises} exercícios
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">
                    {Math.round(progressPercentage)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            {day.completed && (
              <Badge variant="default" className="bg-green-600">
                Completo
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        
        <Progress value={progressPercentage} className="h-2 mt-3" />
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0">
          <div className="space-y-4">
            {day.exercises.map((exercise, exerciseIndex) => (
              <ExerciseCard
                key={exerciseIndex}
                exercise={exercise}
                dayIndex={dayIndex}
                exerciseIndex={exerciseIndex}
              />
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
};
