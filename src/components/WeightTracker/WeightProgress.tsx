'use client';

import { useWeight } from '@/contexts/WeightContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface WeightProgressProps {
  exerciseName: string;
}

export const WeightProgress: React.FC<WeightProgressProps> = ({ exerciseName }) => {
  const { getExerciseProgress } = useWeight();
  const progress = getExerciseProgress(exerciseName);

  if (!progress) {
    return null;
  }

  const { current_weight, max_weight, total_workouts, progress_percentage } = progress;

  // Calcular tendência (comparar peso atual com máximo)
  const getTrendIcon = () => {
    if (current_weight === max_weight) {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    } else if (current_weight < max_weight * 0.8) {
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    } else {
      return <Minus className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getTrendText = () => {
    if (current_weight === max_weight) {
      return 'Peso máximo';
    } else if (current_weight < max_weight * 0.8) {
      return 'Abaixo do máximo';
    } else {
      return 'Próximo do máximo';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <span>Progresso de Peso</span>
          {getTrendIcon()}
        </CardTitle>
        <CardDescription className="text-xs">
          {getTrendText()} • {total_workouts} treinos registrados
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Peso atual:</span>
          <span className="font-semibold">{current_weight} kg</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Peso máximo:</span>
          <span className="font-semibold">{max_weight} kg</span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">Progresso</span>
            <span className="font-medium">{progress_percentage}%</span>
          </div>
          <Progress value={progress_percentage} className="h-2" />
        </div>

        <div className="flex gap-2">
          <Badge variant="outline" className="text-xs">
            {current_weight}kg atual
          </Badge>
          <Badge variant="outline" className="text-xs">
            {max_weight}kg máximo
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
