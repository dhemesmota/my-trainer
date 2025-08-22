import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { WeightProvider } from '@/contexts/WeightContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'My Trainer - Acompanhe seus Treinos',
  description: 'Aplicativo para acompanhar seus treinos da semana com interface moderna e funcional',
  keywords: ['treino', 'fitness', 'exercícios', 'academia', 'saúde'],
  authors: [{ name: 'My Trainer' }],
  robots: 'index, follow',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider>
          <WeightProvider>
            {children}
          </WeightProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
