'use client';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useWorkout } from '@/contexts/WorkoutContext';
import { Pause, Play, RotateCcw, Timer, X } from 'lucide-react';
import React from 'react';

export const FloatingTimer: React.FC = () => {
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

  // Só mostra o timer flutuante quando está ativo
  if (!isActive && timeLeft === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
      <div className="bg-white border-2 border-orange-200 rounded-xl shadow-2xl p-4 min-w-[280px] backdrop-blur-sm bg-white/95">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Timer className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">Timer de Descanso</h3>
              <p className="text-xs text-gray-500">Próxima série em</p>
            </div>
          </div>
          <Button
            onClick={resetTimer}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Timer Display */}
        <div className="text-center mb-4">
          <div className="text-3xl font-bold text-orange-600 mb-2 font-mono">
            {formatTime(timeLeft)}
          </div>
          <Progress 
            value={getProgressPercentage()} 
            className="h-2 bg-orange-100" 
          />
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          <Button
            onClick={isActive ? pauseTimer : () => startTimer(timeLeft)}
            variant={isActive ? "outline" : "default"}
            size="sm"
            className="flex-1 flex items-center gap-2"
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
            Reset
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-2">Início rápido:</p>
          <div className="flex gap-1">
            <Button
              onClick={() => startTimer(30)}
              variant="ghost"
              size="sm"
              className="text-xs px-2 py-1 h-auto"
            >
              30s
            </Button>
            <Button
              onClick={() => startTimer(60)}
              variant="ghost"
              size="sm"
              className="text-xs px-2 py-1 h-auto"
            >
              1min
            </Button>
            <Button
              onClick={() => startTimer(90)}
              variant="ghost"
              size="sm"
              className="text-xs px-2 py-1 h-auto"
            >
              1:30
            </Button>
            <Button
              onClick={() => startTimer(120)}
              variant="ghost"
              size="sm"
              className="text-xs px-2 py-1 h-auto"
            >
              2min
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
