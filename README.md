# My Trainer - Aplicativo de Acompanhamento de Treinos

Um aplicativo moderno para acompanhar seus treinos da semana, com sistema de autenticação e registro de progresso de peso.

## 🚀 Funcionalidades

### ✅ Sistema de Autenticação
- Login com email e senha
- Cadastro de novos usuários
- Logout seguro
- Proteção de rotas

### ✅ Acompanhamento de Treinos
- Visualização de treinos da semana
- Marcação de exercícios completados
- Progresso em tempo real
- Timer de descanso

### ✅ Sistema de Peso
- Adicionar peso aos exercícios
- Visualizar progresso de peso
- Histórico de treinos
- Estatísticas de progresso

### ✅ Interface Moderna
- Design responsivo
- Componentes reutilizáveis
- Animações suaves
- UX otimizada

## 🛠️ Tecnologias

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI, Lucide Icons
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Deploy**: Vercel (recomendado)

## 📦 Instalação

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd my-trainer
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure o Supabase**
   - Siga as instruções em [README-SUPABASE.md](./README-SUPABASE.md)
   - Crie um arquivo `.env.local` com suas credenciais

4. **Execute o projeto**
```bash
npm run dev
```

## 🔧 Configuração do Supabase

### 1. Criar projeto no Supabase
1. Acesse [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Anote a URL e chave anônima

### 2. Configurar banco de dados
1. Execute o script `supabase-setup.sql` no SQL Editor
2. Configure as políticas de segurança

### 3. Configurar variáveis de ambiente
Crie um arquivo `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=sua_project_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_aqui
```

## 📁 Estrutura do Projeto

```
src/
├── app/                    # App Router (Next.js 15)
├── components/             # Componentes React
│   ├── Auth/              # Componentes de autenticação
│   ├── WeightTracker/     # Componentes de peso
│   └── ui/                # Componentes UI base
├── contexts/              # Contextos React
├── lib/                   # Utilitários e configurações
├── types/                 # Tipos TypeScript
└── data/                  # Dados estáticos
```

## 🎯 Como Usar

### 1. Primeiro Acesso
1. Acesse o aplicativo
2. Clique em "Criar Conta"
3. Preencha seus dados
4. Confirme o email

### 2. Acompanhar Treinos
1. Faça login
2. Visualize seus treinos da semana
3. Marque exercícios como completados
4. Use o timer de descanso

### 3. Registrar Peso
1. Clique no ícone de peso no exercício
2. Preencha peso, repetições e séries
3. Adicione observações (opcional)
4. Salve o registro

### 4. Ver Progresso
1. Clique em "Progresso" no menu
2. Visualize estatísticas gerais
3. Acompanhe evolução por exercício

## 🔒 Segurança

- **Row Level Security (RLS)** habilitado
- Usuários só acessam seus próprios dados
- Autenticação segura com Supabase Auth
- Validações no frontend e backend

## 🚀 Deploy

### Vercel (Recomendado)
1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático

### Outras plataformas
- Netlify
- Railway
- Heroku

## 📈 Próximas Funcionalidades

- [ ] Gráficos de progresso
- [ ] Notificações push
- [ ] Compartilhamento de treinos
- [ ] Modo offline
- [ ] Integração com wearables

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🆘 Suporte

- **Issues**: [GitHub Issues](link-para-issues)
- **Documentação**: [README-SUPABASE.md](./README-SUPABASE.md)
- **Email**: seu-email@exemplo.com

---

Desenvolvido com ❤️ usando Next.js, Supabase e TypeScript
