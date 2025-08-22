'use client';

import { DashboardContent } from '@/components/DashboardContent';
import { useAuth } from '@/contexts/AuthContext';
import { WorkoutProvider } from '@/contexts/WorkoutContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardRoute() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Se não está autenticado, redirecionar para login
    if (!isAuthenticated && !loading) {
      router.push('/auth');
    }
  }, [isAuthenticated, loading, router]);

  // Se está carregando, mostrar loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando sessão...</p>
        </div>
      </div>
    );
  }

  // Se não está autenticado, mostrar loading enquanto redireciona
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecionando...</p>
        </div>
      </div>
    );
  }

  // Se está autenticado, mostrar dashboard
  return (
    <WorkoutProvider>
      <DashboardContent />
    </WorkoutProvider>
  );
}
