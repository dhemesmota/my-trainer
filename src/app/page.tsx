'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        // Se está logado, redirecionar para dashboard
        router.push('/dashboard');
      } else {
        // Se não está logado, redirecionar para auth
        router.push('/auth');
      }
    }
  }, [isAuthenticated, loading, router]);

  // Mostrar loading enquanto verifica a sessão
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Verificando sessão...</p>
      </div>
    </div>
  );
}
