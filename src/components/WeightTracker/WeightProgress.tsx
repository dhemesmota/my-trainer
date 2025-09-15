'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useWeight } from '@/contexts/WeightContext';
import { Calendar, Minus, Target, TrendingDown, TrendingUp, Trophy } from 'lucide-react';

interface WeightProgressProps {
  exerciseName: string;
}

export const WeightProgress: React.FC<WeightProgressProps> = ({ exerciseName }) => {
  const { getExerciseProgress, getExerciseRecentRecords } = useWeight();
  const progress = getExerciseProgress(exerciseName);
  const recentRecords = getExerciseRecentRecords(exerciseName, 3);

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  return (
    <Card className="w-full border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center justify-between text-blue-900">
          <span className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Progresso de Peso
          </span>
          {getTrendIcon()}
        </CardTitle>
        <CardDescription className="text-xs text-blue-700">
          {getTrendText()} • {total_workouts} treinos registrados
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Peso Atual e Máximo */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-white rounded-lg border border-blue-100">
            <div className="text-xs text-gray-600 mb-1">Peso Atual</div>
            <div className="text-lg font-bold text-blue-600">{current_weight} kg</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg border border-blue-100">
            <div className="text-xs text-gray-600 mb-1">Peso Máximo</div>
            <div className="text-lg font-bold text-green-600 flex items-center justify-center gap-1">
              <Trophy className="h-4 w-4" />
              {max_weight} kg
            </div>
          </div>
        </div>

        {/* Barra de Progresso */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">Progresso em relação ao máximo</span>
            <span className="font-medium text-blue-600">{progress_percentage}%</span>
          </div>
          <Progress value={progress_percentage} className="h-3 bg-blue-100" />
        </div>

        {/* Registros Recentes */}
        {recentRecords.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs font-medium text-gray-700 flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Últimos registros
            </div>
            <div className="space-y-1">
              {recentRecords.map((record, index) => (
                <div key={record.id} className="flex items-center justify-between text-xs bg-white p-2 rounded border border-blue-100">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">{formatDate(record.date)}</span>
                    <span className="font-medium">{record.weight}kg</span>
                  </div>
                  <div className="text-gray-500">
                    {record.sets}x{record.reps}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Badges de Resumo */}
        <div className="flex gap-2 flex-wrap">
          <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
            {current_weight}kg atual
          </Badge>
          <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
            {max_weight}kg máximo
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
