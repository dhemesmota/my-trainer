'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useWorkout } from '@/contexts/WorkoutContext';
import { DayWithProgress } from '@/types/workout';
import {
    Calendar,
    ChevronDown,
    ChevronUp,
    Dumbbell
} from 'lucide-react';
import React, { useState } from 'react';
import { ExerciseCard } from './ExerciseCard';

interface DayCardProps {
  day: DayWithProgress;
  dayIndex: number;
}

export const DayCard: React.FC<DayCardProps> = ({ day, dayIndex }) => {
  const { toggleExercise, completeSet } = useWorkout();
  const [isExpanded, setIsExpanded] = useState(true);

  const completedExercises = day.exercises.filter(ex => ex.completed).length;
  const totalExercises = day.exercises.length;
  const progressPercentage = totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0;

  const getGroupIcon = (group: string) => {
    if (group.includes('Bíceps') || group.includes('Tríceps')) return '💪';
    if (group.includes('Peito') || group.includes('Ombros')) return '🏋️';
    if (group.includes('Costas')) return '🦴';
    if (group.includes('Pernas') || group.includes('Core')) return '🦵';
    return '🏃';
  };

  return (
    <Card className="transition-all duration-300 hover:shadow-lg">
      <CardHeader 
        className="cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{getGroupIcon(day.group)}</div>
            <div>
              <CardTitle className="text-xl font-bold text-gray-900">
                Dia {day.day} - {day.group}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Dia {day.day}
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Dumbbell className="h-3 w-3" />
                  {totalExercises} exercícios
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm text-gray-600">Progresso</div>
              <div className="text-lg font-bold text-gray-900">
                {completedExercises}/{totalExercises}
              </div>
            </div>
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </div>
        </div>
        
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-gray-600">Progresso do dia</span>
            <span className="text-sm font-medium text-gray-900">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0">
          <div className="space-y-4">
            {day.exercises.map((exercise, exerciseIndex) => (
              <ExerciseCard
                key={exerciseIndex}
                exercise={exercise}
                onToggle={() => toggleExercise(dayIndex, exerciseIndex)}
                onCompleteSet={() => completeSet(dayIndex, exerciseIndex)}
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
