'use client';

import { useWeight } from '@/contexts/WeightContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, BarChart3, Calendar, Target } from 'lucide-react';

export const WeightProgressPage: React.FC = () => {
  const { weightProgress, loading } = useWeight();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando progresso...</p>
        </div>
      </div>
    );
  }

  if (weightProgress.length === 0) {
    return (
      <div className="text-center p-8">
        <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum registro de peso encontrado</h3>
        <p className="text-gray-600 mb-4">
          Comece a registrar seus pesos nos exercícios para acompanhar seu progresso.
        </p>
      </div>
    );
  }

  // Calcular estatísticas gerais
  const totalExercises = weightProgress.length;
  const exercisesAtMax = weightProgress.filter(p => p.current_weight === p.max_weight).length;
  const averageProgress = Math.round(
    weightProgress.reduce((acc, p) => acc + p.progress_percentage, 0) / totalExercises
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Progresso de Peso</h2>
          <p className="text-gray-600">Acompanhe sua evolução em cada exercício</p>
        </div>
        <Badge variant="outline" className="w-fit">
          {totalExercises} exercícios
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Progresso Médio</CardTitle>
            <Target className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{averageProgress}%</div>
            <p className="text-xs text-gray-600">média geral</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">No Peso Máximo</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{exercisesAtMax}</div>
            <p className="text-xs text-gray-600">de {totalExercises} exercícios</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total de Treinos</CardTitle>
            <Calendar className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {weightProgress.reduce((acc, p) => acc + p.total_workouts, 0)}
            </div>
            <p className="text-xs text-gray-600">registros totais</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Exercícios</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {weightProgress.map((progress) => {
            const getTrendIcon = () => {
              if (progress.current_weight === progress.max_weight) {
                return <TrendingUp className="h-4 w-4 text-green-500" />;
              } else if (progress.current_weight < progress.max_weight * 0.8) {
                return <TrendingDown className="h-4 w-4 text-red-500" />;
              } else {
                return <Minus className="h-4 w-4 text-yellow-500" />;
              }
            };

            const getTrendText = () => {
              if (progress.current_weight === progress.max_weight) {
                return 'Peso máximo';
              } else if (progress.current_weight < progress.max_weight * 0.8) {
                return 'Abaixo do máximo';
              } else {
                return 'Próximo do máximo';
              }
            };

            return (
              <Card key={progress.exercise_name} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center justify-between">
                    <span className="truncate">{progress.exercise_name}</span>
                    {getTrendIcon()}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {getTrendText()} • {progress.total_workouts} treinos
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Atual:</span>
                    <span className="font-semibold">{progress.current_weight} kg</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Máximo:</span>
                    <span className="font-semibold">{progress.max_weight} kg</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Progresso</span>
                      <span className="font-medium">{progress.progress_percentage}%</span>
                    </div>
                    <Progress value={progress.progress_percentage} className="h-2" />
                  </div>

                  <div className="flex gap-1">
                    <Badge variant="outline" className="text-xs flex-1 text-center">
                      {progress.current_weight}kg
                    </Badge>
                    <Badge variant="outline" className="text-xs flex-1 text-center">
                      {progress.max_weight}kg
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
