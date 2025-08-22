'use client';

import { DayCard } from '@/components/DayCard';
import { RestTimer } from '@/components/RestTimer';
import { UploadWorkout } from '@/components/UploadWorkout';
import { WeightProgressPage } from '@/components/WeightTracker/WeightProgressPage';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { useWorkout } from '@/contexts/WorkoutContext';
import {
  Activity,
  BarChart3,
  Calendar,
  Dumbbell,
  LogOut,
  RefreshCw,
  Target,
  TrendingUp,
  Trophy,
  Users
} from 'lucide-react';
import React, { useState } from 'react';

export const DashboardContent: React.FC = () => {
  const { workout, getProgress, resetProgress } = useWorkout();
  const { user, signOut } = useAuth();
  const [currentView, setCurrentView] = useState<'dashboard' | 'weight-progress'>('dashboard');
  const progress = getProgress();

  const totalSets = workout.days.reduce((acc, day) => 
    acc + day.exercises.reduce((dayAcc, exercise) => dayAcc + exercise.sets, 0), 0
  );

  const completedSets = workout.days.reduce((acc, day) => 
    acc + day.exercises.reduce((dayAcc, exercise) => dayAcc + exercise.currentSet, 0), 0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Dumbbell className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">My Trainer</h1>
                <p className="text-xs sm:text-sm text-gray-600">
                  Olá, {user?.user_metadata?.name || user?.email || 'Atleta'}!
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              <div className="flex gap-2">
                <Button
                  onClick={() => setCurrentView('dashboard')}
                  variant={currentView === 'dashboard' ? 'default' : 'outline'}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Dumbbell className="h-4 w-4" />
                  <span className="hidden sm:inline">Treinos</span>
                </Button>
                
                <Button
                  onClick={() => setCurrentView('weight-progress')}
                  variant={currentView === 'weight-progress' ? 'default' : 'outline'}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Progresso</span>
                </Button>
              </div>
              
              <div className="flex gap-2">
                <UploadWorkout />
                <Button
                  onClick={resetProgress}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span className="hidden sm:inline">Resetar</span>
                </Button>
                <Button
                  onClick={signOut}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Sair</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Timer de Descanso */}
        <RestTimer />

        {currentView === 'dashboard' ? (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Semana Atual</CardTitle>
                  <Calendar className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">Semana {workout.week}</div>
                  <p className="text-xs text-gray-600">Programa de treino</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Progresso Geral</CardTitle>
                  <Target className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{progress.percentage}%</div>
                  <div className="flex items-center gap-2">
                    <Progress value={progress.percentage} className="flex-1 h-2" />
                    <span className="text-xs text-gray-600">{progress.completed}/{progress.total}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Séries Completadas</CardTitle>
                  <Activity className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{completedSets}</div>
                  <p className="text-xs text-gray-600">de {totalSets} séries totais</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Dias de Treino</CardTitle>
                  <Users className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{workout.days.length}</div>
                  <p className="text-xs text-gray-600">dias programados</p>
                </CardContent>
              </Card>
            </div>

            {/* Progress Overview */}
            <Card className="mb-6 sm:mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Visão Geral do Progresso
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                  {workout.days.map((day, index) => {
                    const dayProgress = day.exercises.filter(ex => ex.completed).length;
                    const dayTotal = day.exercises.length;
                    const dayPercentage = dayTotal > 0 ? (dayProgress / dayTotal) * 100 : 0;
                    
                    return (
                      <div key={index} className="text-center">
                        <div className="text-base sm:text-lg font-semibold text-gray-900">Dia {day.day}</div>
                        <div className="text-xs sm:text-sm text-gray-600 mb-2">{day.group}</div>
                        <div className="text-xl sm:text-2xl font-bold text-blue-600">{Math.round(dayPercentage)}%</div>
                        <div className="text-xs text-gray-500">{dayProgress}/{dayTotal} exercícios</div>
                        <Progress value={dayPercentage} className="mt-2 h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Workout Days */}
            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Seus Treinos da Semana</h2>
                <Badge variant="outline" className="flex items-center gap-1 w-fit">
                  <Trophy className="h-3 w-3" />
                  {progress.completed} de {progress.total} completados
                </Badge>
              </div>
              
              {workout.days.map((day, index) => (
                <DayCard key={index} day={day} dayIndex={index} />
              ))}
            </div>
          </>
        ) : (
          <WeightProgressPage />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-8 sm:mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="text-center text-xs sm:text-sm text-gray-600">
            <p>My Trainer - Acompanhe seus treinos com facilidade 💪</p>
            <p className="mt-1">Desenvolvido com Next.js, TypeScript e Tailwind CSS</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
