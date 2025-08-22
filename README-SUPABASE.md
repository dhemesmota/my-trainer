# Configuração do Supabase para My Trainer

Este guia explica como configurar o Supabase para o aplicativo My Trainer.

## 1. Criar projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Faça login ou crie uma conta
3. Clique em "New Project"
4. Preencha as informações:
   - **Name**: My Trainer
   - **Database Password**: Escolha uma senha forte
   - **Region**: Escolha a região mais próxima
5. Clique em "Create new project"

## 2. Configurar o banco de dados

1. No painel do Supabase, vá para **SQL Editor**
2. Copie e cole o conteúdo do arquivo `supabase-setup.sql`
3. Clique em "Run" para executar o script

## 3. Configurar autenticação

1. No painel do Supabase, vá para **Authentication > Settings**
2. Em **Site URL**, adicione: `http://localhost:3000` (para desenvolvimento)
3. Em **Redirect URLs**, adicione: `http://localhost:3000`
4. Salve as configurações

## 4. Obter as credenciais

1. No painel do Supabase, vá para **Settings > API**
2. Copie:
   - **Project URL** (ex: `https://your-project.supabase.co`)
   - **anon public** key (ex: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

## 5. Configurar variáveis de ambiente

1. Crie um arquivo `.env.local` na raiz do projeto
2. Adicione as seguintes variáveis:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_project_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_aqui
```

## 6. Testar a configuração

1. Execute o projeto: `npm run dev`
2. Acesse `http://localhost:3000`
3. Tente criar uma conta e fazer login
4. Teste adicionar registros de peso nos exercícios

## Funcionalidades implementadas

### ✅ Sistema de Autenticação
- Login com email e senha
- Cadastro de novos usuários
- Logout
- Proteção de rotas

### ✅ Sistema de Peso
- Adicionar peso aos exercícios
- Visualizar progresso de peso
- Histórico de treinos
- Estatísticas de progresso

### ✅ Integração com Supabase
- Banco de dados PostgreSQL
- Row Level Security (RLS)
- Políticas de acesso
- Triggers automáticos

## Estrutura do banco de dados

### Tabela: `weight_records`
- `id`: UUID (chave primária)
- `user_id`: UUID (referência ao usuário)
- `exercise_name`: TEXT (nome do exercício)
- `weight`: DECIMAL (peso em kg)
- `reps`: INTEGER (repetições)
- `sets`: INTEGER (séries)
- `date`: DATE (data do treino)
- `notes`: TEXT (observações)
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

## Políticas de segurança

- Usuários só podem ver seus próprios registros
- Usuários só podem inserir/atualizar/deletar seus próprios registros
- Row Level Security (RLS) habilitado
- Validações de dados no banco

## Próximos passos

1. **Deploy**: Configure as variáveis de ambiente no seu servidor de produção
2. **Backup**: Configure backups automáticos no Supabase
3. **Monitoramento**: Use o dashboard do Supabase para monitorar o uso
4. **Escalabilidade**: O Supabase escala automaticamente conforme necessário
