'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useWorkout } from '@/contexts/WorkoutContext';
import { WorkoutWeek } from '@/types/workout';
import {
  AlertCircle,
  CheckCircle,
  Download,
  FileText,
  Info,
  RefreshCw,
  Upload
} from 'lucide-react';
import React, { useState } from 'react';

export const UploadWorkout: React.FC = () => {
  const { updateWorkout, workout } = useWorkout();
  const [isOpen, setIsOpen] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadStatus('loading');
    setErrorMessage('');

    try {
      const text = await file.text();
      const workoutData: WorkoutWeek = JSON.parse(text);

      // Validação básica do formato
      if (!workoutData.week || !workoutData.days || !Array.isArray(workoutData.days)) {
        throw new Error('Formato de arquivo inválido. O JSON deve conter "week" e "days".');
      }

      updateWorkout(workoutData);
      setUploadStatus('success');
      
      // Fechar o modal após 2 segundos
      setTimeout(() => {
        setIsOpen(false);
        setUploadStatus('idle');
      }, 2000);

    } catch (error) {
      setUploadStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Erro ao processar arquivo');
    }
  };

  const downloadCurrentWorkout = () => {
    const workoutData = {
      week: workout.week,
      days: workout.days.map(day => ({
        day: day.day,
        group: day.group,
        exercises: day.exercises.map(exercise => ({
          name: exercise.name,
          sets: exercise.sets,
          reps: exercise.reps,
          technique: exercise.technique,
          notes: exercise.notes,
          alternatives: exercise.alternatives,
        })),
      })),
    };

    const blob = new Blob([JSON.stringify(workoutData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `treino-semana-${workout.week}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Atualizar Treino
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Gerenciar Treinos
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium text-gray-900">Upload de Novo Treino</h3>
            <p className="text-sm text-gray-600">
              Faça upload de um arquivo JSON com o formato correto para atualizar seus treinos.
            </p>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
                id="workout-upload"
                disabled={uploadStatus === 'loading'}
              />
              <label
                htmlFor="workout-upload"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <Upload className="h-8 w-8 text-gray-400" />
                <span className="text-sm text-gray-600">
                  Clique para selecionar arquivo JSON
                </span>
              </label>
            </div>

            {uploadStatus === 'loading' && (
              <div className="flex items-center gap-2 text-blue-600">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span className="text-sm">Processando arquivo...</span>
              </div>
            )}

            {uploadStatus === 'success' && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Treino atualizado com sucesso!</span>
              </div>
            )}

            {uploadStatus === 'error' && (
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{errorMessage}</span>
              </div>
            )}
          </div>

          <div className="border-t pt-4">
            <h3 className="font-medium text-gray-900 mb-2">Treino Atual</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Semana atual:</span>
                <Badge variant="outline">Semana {workout.week}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Dias de treino:</span>
                <Badge variant="secondary">{workout.days.length} dias</Badge>
              </div>
              
              <Button
                onClick={downloadCurrentWorkout}
                variant="outline"
                size="sm"
                className="w-full flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Baixar Treino Atual
              </Button>
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 mt-0.5 text-blue-600" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Formato do arquivo JSON:</p>
                <p>O arquivo deve conter "week" (número) e "days" (array de dias com exercícios).</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
