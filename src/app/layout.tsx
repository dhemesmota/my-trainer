import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

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
      <body className={inter.className}>{children}</body>
    </html>
  )
}
