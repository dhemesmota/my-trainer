# My Trainer - Monorepo

Este é um monorepo que contém tanto a aplicação web (Next.js) quanto a aplicação mobile (React Native 0.80.2), permitindo compartilhamento de código entre as plataformas.

## 🏗️ Estrutura do Projeto

```
my-trainer/
├── apps/
│   ├── web/                 # Aplicação Next.js
│   └── mobile/              # Aplicação React Native
├── packages/
│   ├── shared/              # Código compartilhado (tipos, funções)
│   ├── ui/                  # Componentes UI compartilhados
│   └── utils/               # Utilitários compartilhados
├── package.json             # Root package.json com workspaces
├── metro.config.js          # Configuração Metro para RN
├── babel.config.js          # Configuração Babel
└── tsconfig.json            # Configuração TypeScript root
```

## 🚀 Configuração Rápida

### Opção 1: Script Automatizado (Recomendado)

```bash
# Executar o script de configuração
./setup-monorepo.sh

# Instalar dependências
npm install

# Criar projeto React Native
npx react-native@0.80.2 init mobile --directory apps/mobile
```

### Opção 2: Configuração Manual

Siga o guia detalhado no arquivo `monorepo-setup.md`.

## 📦 Pacotes Compartilhados

### @my-trainer/shared
Código compartilhado entre web e mobile:
- Interfaces e tipos TypeScript
- Funções de validação
- Constantes globais

### @my-trainer/ui
Componentes UI reutilizáveis:
- Componentes React Native
- Estilos compartilhados
- Sistema de design

### @my-trainer/utils
Utilitários e helpers:
- Formatação de dados
- Funções auxiliares
- Debounce, throttle, etc.

## 🛠️ Scripts Disponíveis

### Desenvolvimento
```bash
# Executar aplicação web
npm run dev:web

# Executar Metro bundler para mobile
npm run dev:mobile

# Executar no Android
npm run android

# Executar no iOS
npm run ios
```

### Build
```bash
# Build de todas as aplicações
npm run build:all

# Build apenas web
npm run build:web

# Build apenas mobile
npm run build:mobile
```

### Qualidade de Código
```bash
# Lint em todos os workspaces
npm run lint

# Testes em todos os workspaces
npm run test

# Limpar node_modules e reinstalar
npm run clean
```

## 🔧 Configurações Importantes

### Metro (React Native)
O Metro está configurado para:
- Resolver módulos dos pacotes compartilhados
- Monitorar mudanças em todas as pastas
- Suportar hot reload em todo o monorepo

### TypeScript
Configurado com:
- Path mapping para imports limpos
- Configuração compartilhada entre workspaces
- Suporte a React Native e Next.js

### Babel
Configurado com:
- Module resolver para aliases
- `@react-native/babel-preset` (versão atualizada)
- Suporte a TypeScript

## 📱 Desenvolvimento Mobile

### Pré-requisitos
- Node.js 18+
- React Native CLI
- Android Studio (para Android)
- Xcode (para iOS, apenas macOS)

### Configuração do App Mobile

Após criar o projeto React Native, configure:

1. **Metro Config** (`apps/mobile/metro.config.js`):
```javascript
const { getDefaultConfig } = require('@react-native/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
  path.resolve(__dirname, '../../node_modules'),
  path.resolve(__dirname, '../../packages'),
];

config.watchFolders = [
  path.resolve(__dirname, '../../packages'),
  path.resolve(__dirname, '../../apps'),
];

module.exports = config;
```

2. **Babel Config** (`apps/mobile/babel.config.js`):
```javascript
module.exports = {
  presets: ['@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@shared': '../../packages/shared/src',
          '@ui': '../../packages/ui/src',
          '@utils': '../../packages/utils/src',
        },
      },
    ],
  ],
};
```

3. **TypeScript Config** (`apps/mobile/tsconfig.json`):
```json
{
  "extends": "@react-native/typescript-config/tsconfig.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@shared/*": ["../../packages/shared/src/*"],
      "@ui/*": ["../../packages/ui/src/*"],
      "@utils/*": ["../../packages/utils/src/*"]
    }
  },
  "include": [
    "src/**/*",
    "../../packages/**/*"
  ]
}
```

## 🌐 Desenvolvimento Web

O projeto web (Next.js) já está configurado e pode usar os pacotes compartilhados através dos aliases configurados no TypeScript.

## 📝 Exemplo de Uso

### Importando código compartilhado no mobile:
```typescript
// apps/mobile/App.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { Button } from '@ui/Button';
import { formatName, User } from '@shared/index';
import { formatCurrency } from '@utils/index';

const App = () => {
  const user: User = {
    id: '1',
    name: 'João Silva',
    email: 'joao@example.com'
  };

  return (
    <View>
      <Text>Olá, {formatName(user.name)}!</Text>
      <Text>Preço: {formatCurrency(99.99)}</Text>
      <Button title="Iniciar Treino" onPress={() => {}} />
    </View>
  );
};
```

### Importando código compartilhado no web:
```typescript
// apps/web/src/app/page.tsx
import { formatName, User } from '@shared/index';
import { formatCurrency } from '@utils/index';

export default function HomePage() {
  const user: User = {
    id: '1',
    name: 'João Silva',
    email: 'joao@example.com'
  };

  return (
    <div>
      <h1>Olá, {formatName(user.name)}!</h1>
      <p>Preço: {formatCurrency(99.99)}</p>
    </div>
  );
}
```

## 🔍 Troubleshooting

### Problemas comuns:

1. **Metro não encontra módulos**:
   - Verifique se o `metro.config.js` está configurado corretamente
   - Reinicie o Metro: `npx react-native start --reset-cache`

2. **TypeScript não resolve imports**:
   - Verifique se os paths estão configurados no `tsconfig.json`
   - Reinicie o TypeScript server no VS Code

3. **Dependências não encontradas**:
   - Execute `npm install` na raiz do projeto
   - Verifique se os workspaces estão configurados corretamente

4. **Hot reload não funciona**:
   - Verifique se o `watchFolders` está configurado no Metro
   - Reinicie o Metro bundler

## 📚 Recursos Adicionais

- [Documentação React Native 0.80.2](https://reactnative.dev/docs/0.80/getting-started)
- [Guia de Monorepo com NPM Workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces)
- [Metro Bundler Documentation](https://facebook.github.io/metro/)
- [TypeScript Path Mapping](https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping)

## 🤝 Contribuição

1. Faça suas alterações nos pacotes compartilhados
2. Teste tanto no web quanto no mobile
3. Execute `npm run lint` e `npm run test`
4. Commit suas mudanças

## 🔄 Atualizações Importantes

### Babel Preset
- **Antigo**: `metro-react-native-babel-preset` (descontinuado)
- **Novo**: `@react-native/babel-preset` (recomendado)

Esta configuração usa o preset atualizado conforme a documentação oficial do React Native.

---

**Nota**: Este monorepo está configurado especificamente para React Native 0.80.2. Para outras versões, ajuste as dependências e configurações conforme necessário.
