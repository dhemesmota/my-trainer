# 💪 My Trainer

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3-38B2AC?style=for-the-badge&logo=tailwind-css)
![Shadcn/ui](https://img.shields.io/badge/Shadcn/ui-0.0.1-000000?style=for-the-badge)

**Acompanhe seus treinos da semana com uma interface moderna e intuitiva!**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/dhemesmota/my-trainer)

</div>

---

## 🚀 Sobre o Projeto

O **My Trainer** é uma aplicação web moderna desenvolvida para ajudar você a acompanhar seus treinos da semana de forma eficiente e visualmente atrativa. Com uma interface intuitiva e funcionalidades avançadas, você pode:

- 📊 **Visualizar progresso** em tempo real
- ✅ **Marcar exercícios** como completados
- 📈 **Acompanhar séries** e repetições
- 📁 **Upload de treinos** via arquivo JSON
- 📱 **Interface responsiva** para qualquer dispositivo
- 🎨 **Design moderno** com animações suaves

## ✨ Funcionalidades

### 🏋️ Gerenciamento de Treinos
- **Visualização por dia**: Organize seus treinos por dias da semana
- **Grupos musculares**: Identificação clara dos grupos trabalhados
- **Detalhes completos**: Séries, repetições, técnicas e observações
- **Alternativas**: Sugestões de exercícios alternativos

### 📊 Acompanhamento de Progresso
- **Progresso geral**: Visualização do progresso da semana
- **Progresso por dia**: Acompanhamento individual de cada dia
- **Contador de séries**: Controle de séries completadas
- **Estatísticas**: Métricas detalhadas do seu treino

### 🔄 Sistema de Upload
- **Upload JSON**: Importe novos treinos via arquivo JSON
- **Validação**: Verificação automática do formato do arquivo
- **Download**: Exporte seu treino atual
- **Persistência**: Dados salvos automaticamente no navegador

### 🎯 Interface Moderna
- **Cards interativos**: Design limpo e organizado
- **Animações**: Transições suaves e feedback visual
- **Responsividade**: Funciona perfeitamente em mobile e desktop
- **Tema consistente**: Design system unificado

## 🛠️ Tecnologias Utilizadas

### Frontend
- **[Next.js 14](https://nextjs.org/)** - Framework React com App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utilitário
- **[Shadcn/ui](https://ui.shadcn.com/)** - Componentes UI modernos
- **[Lucide React](https://lucide.dev/)** - Ícones bonitos e consistentes

### Estado e Dados
- **[React Context](https://react.dev/reference/react/createContext)** - Gerenciamento de estado
- **[LocalStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)** - Persistência de dados
- **JSON** - Formato de dados para treinos

### Desenvolvimento
- **[ESLint](https://eslint.org/)** - Linting de código
- **[Prettier](https://prettier.io/)** - Formatação de código
- **[Git](https://git-scm.com/)** - Controle de versão

## 📦 Instalação e Uso

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### 1. Clone o repositório
```bash
git clone https://github.com/dhemesmota/my-trainer.git
cd my-trainer
```

### 2. Instale as dependências
```bash
npm install
# ou
yarn install
```

### 3. Execute o projeto
```bash
npm run dev
# ou
yarn dev
```

### 4. Acesse a aplicação
Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 📁 Estrutura do Projeto

```
my-trainer/
├── src/
│   ├── app/                 # App Router (Next.js 14)
│   │   ├── globals.css      # Estilos globais
│   │   ├── layout.tsx       # Layout principal
│   │   └── page.tsx         # Página inicial
│   ├── components/          # Componentes React
│   │   ├── ui/             # Componentes Shadcn/ui
│   │   ├── DayCard.tsx     # Card de dia de treino
│   │   ├── ExerciseCard.tsx # Card de exercício
│   │   └── UploadWorkout.tsx # Componente de upload
│   ├── contexts/           # Contextos React
│   │   └── WorkoutContext.tsx # Contexto de treinos
│   ├── data/               # Dados estáticos
│   │   └── default-workout.ts # Treino padrão
│   ├── lib/                # Utilitários
│   │   └── utils.ts        # Funções utilitárias
│   └── types/              # Tipos TypeScript
│       └── workout.ts      # Tipos de treino
├── public/                 # Arquivos estáticos
├── components.json         # Configuração Shadcn/ui
├── tailwind.config.js      # Configuração Tailwind
├── tsconfig.json           # Configuração TypeScript
└── package.json            # Dependências e scripts
```

## 📋 Formato do JSON

Para fazer upload de um novo treino, use o seguinte formato JSON:

```json
{
  "week": 2,
  "days": [
    {
      "day": 1,
      "group": "Bíceps + Tríceps",
      "exercises": [
        {
          "name": "Rosca Direta Barra W",
          "sets": 4,
          "reps": "8–10",
          "technique": "Drop set na última série",
          "notes": "Cotovelos fixos",
          "alternatives": [
            "Rosca direta halteres",
            "Rosca direta polia"
          ]
        }
      ]
    }
  ]
}
```

### Campos Obrigatórios
- `week`: Número da semana
- `days`: Array de dias de treino
- `day`: Número do dia
- `group`: Grupo muscular
- `exercises`: Array de exercícios
- `name`: Nome do exercício
- `sets`: Número de séries
- `reps`: Número de repetições
- `technique`: Técnica de execução
- `notes`: Observações
- `alternatives`: Exercícios alternativos

## 🎨 Componentes Principais

### DayCard
- Exibe informações do dia de treino
- Progresso visual do dia
- Lista de exercícios expansível
- Ícones por grupo muscular

### ExerciseCard
- Detalhes completos do exercício
- Controle de séries e progresso
- Modal com informações detalhadas
- Botões de ação (completar série/exercício)

### UploadWorkout
- Interface de upload de arquivo JSON
- Validação de formato
- Download do treino atual
- Feedback visual de status

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build para produção
npm run start        # Inicia servidor de produção
npm run lint         # Executa ESLint
```

## 🚀 Deploy

### Vercel (Recomendado)
1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente (se necessário)
3. Deploy automático a cada push

### Outras Plataformas
- **Netlify**: Compatível com Next.js
- **Railway**: Deploy simples e rápido
- **Heroku**: Suporte a Node.js

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**Daniel Hemes** - [GitHub](https://github.com/dhemesmota)

## 🙏 Agradecimentos

- [Shadcn/ui](https://ui.shadcn.com/) pelos componentes incríveis
- [Lucide](https://lucide.dev/) pelos ícones bonitos
- [Tailwind CSS](https://tailwindcss.com/) pelo framework CSS
- [Next.js](https://nextjs.org/) pelo framework React

---

<div align="center">

**⭐ Se este projeto te ajudou, considere dar uma estrela!**

</div>
