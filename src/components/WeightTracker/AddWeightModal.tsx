'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useWeight } from '@/contexts/WeightContext';
import { Loader2, Target, X } from 'lucide-react';
import React, { useState } from 'react';

interface AddWeightModalProps {
  exerciseName: string;
  isOpen: boolean;
  onClose: () => void;
  defaultWeight?: number;
  defaultReps?: number;
  defaultSets?: number;
}

export const AddWeightModal: React.FC<AddWeightModalProps> = ({
  exerciseName,
  isOpen,
  onClose,
  defaultWeight = 0,
  defaultReps = 0,
  defaultSets = 0,
}) => {
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [sets, setSets] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { addWeightRecord } = useWeight();

  // Reset form when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setWeight(defaultWeight > 0 ? defaultWeight.toString() : '');
      setReps(defaultReps > 0 ? defaultReps.toString() : '');
      setSets(defaultSets > 0 ? defaultSets.toString() : '');
      setNotes('');
      setError('');
    }
  }, [isOpen, defaultWeight, defaultReps, defaultSets]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const weightNum = parseFloat(weight);
    const repsNum = parseInt(reps);
    const setsNum = parseInt(sets);

    if (!weight || !reps || !sets || weightNum <= 0 || repsNum <= 0 || setsNum <= 0) {
      setError('Todos os campos são obrigatórios e devem ser maiores que zero');
      setLoading(false);
      return;
    }

    const { error } = await addWeightRecord({
      exercise_name: exerciseName,
      weight: weightNum,
      reps: repsNum,
      sets: setsNum,
      date: new Date().toISOString().split('T')[0],
      notes: notes.trim() || undefined,
    });

    if (error) {
      setError(error.message || 'Erro ao salvar registro');
    } else {
      onClose();
    }

    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-lg border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-xl font-bold text-blue-900 flex items-center gap-2">
              <Target className="h-5 w-5" />
              Adicionar Peso
            </CardTitle>
            <CardDescription className="text-blue-700 font-medium">{exerciseName}</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-blue-100">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive" className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight" className="text-sm font-medium text-gray-700">Peso (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  min="0"
                  step="0.5"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="0"
                  required
                  className="text-center font-semibold text-lg border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reps" className="text-sm font-medium text-gray-700">Repetições</Label>
                <Input
                  id="reps"
                  type="number"
                  min="1"
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                  placeholder="0"
                  required
                  className="text-center font-semibold text-lg border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sets" className="text-sm font-medium text-gray-700">Séries</Label>
                <Input
                  id="sets"
                  type="number"
                  min="1"
                  value={sets}
                  onChange={(e) => setSets(e.target.value)}
                  placeholder="0"
                  required
                  className="text-center font-semibold text-lg border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium text-gray-700">Observações (opcional)</Label>
              <Textarea
                id="notes"
                placeholder="Adicione observações sobre o exercício..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1 border-blue-200 text-blue-700 hover:bg-blue-50" disabled={loading}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Salvar Registro'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
