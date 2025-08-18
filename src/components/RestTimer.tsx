'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useWorkout } from '@/contexts/WorkoutContext';
import { Pause, Play, RotateCcw, Timer } from 'lucide-react';
import React from 'react';

export const RestTimer: React.FC = () => {
  const { restTimer } = useWorkout();
  const { isActive, timeLeft, startTimer, pauseTimer, resetTimer } = restTimer;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    // Assumindo que o timer padrão é 90 segundos (1:30)
    const defaultTime = 90;
    return ((defaultTime - timeLeft) / defaultTime) * 100;
  };

  const handleQuickStart = (seconds: number) => {
    if (isActive) {
      pauseTimer();
    } else {
      startTimer(seconds);
    }
  };

  if (!isActive && timeLeft === 0) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Timer className="h-5 w-5" />
            Timer de Descanso
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => handleQuickStart(30)}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              30s
            </Button>
            <Button
              onClick={() => handleQuickStart(60)}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              1min
            </Button>
            <Button
              onClick={() => handleQuickStart(90)}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              1:30
            </Button>
            <Button
              onClick={() => handleQuickStart(120)}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              2min
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6 border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg text-orange-800">
          <Timer className="h-5 w-5" />
          Descanso em Andamento
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-orange-600 mb-2">
              {formatTime(timeLeft)}
            </div>
            <Progress value={getProgressPercentage()} className="h-2" />
          </div>
          
          <div className="flex justify-center gap-2">
            <Button
              onClick={isActive ? pauseTimer : () => startTimer(timeLeft)}
              variant={isActive ? "outline" : "default"}
              size="sm"
              className="flex items-center gap-2"
            >
              {isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isActive ? 'Pausar' : 'Continuar'}
            </Button>
            <Button
              onClick={resetTimer}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Resetar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
