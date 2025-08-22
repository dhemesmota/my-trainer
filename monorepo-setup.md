# Configuração de Monorepo com React Native 0.80.2

## Estrutura do Projeto

```
my-trainer/
├── apps/
│   ├── web/                 # Seu projeto Next.js atual
│   └── mobile/              # App React Native
├── packages/
│   ├── shared/              # Código compartilhado
│   ├── ui/                  # Componentes UI compartilhados
│   └── utils/               # Utilitários compartilhados
├── package.json             # Root package.json
├── metro.config.js          # Configuração Metro para RN
├── babel.config.js          # Configuração Babel
└── tsconfig.json            # Configuração TypeScript root
```

## Passo 1: Configurar o Root package.json

```json
{
  "name": "my-trainer-monorepo",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "web": "npm run dev --workspace=apps/web",
    "mobile": "npm run start --workspace=apps/mobile",
    "build:web": "npm run build --workspace=apps/web",
    "build:mobile": "npm run build --workspace=apps/mobile",
    "lint": "npm run lint --workspaces",
    "test": "npm run test --workspaces"
  },
  "devDependencies": {
    "@babel/core": "^7.24.0",
    "@babel/preset-env": "^7.24.0",
    "@babel/preset-react": "^7.23.3",
    "@babel/preset-typescript": "^7.23.3",
    "@react-native/babel-preset": "^0.80.2",
    "@types/react": "^18.3.12",
    "@types/react-native": "^0.73.0",
    "typescript": "^5.4.2"
  }
}
```

## Passo 2: Configurar Metro para React Native

```javascript
// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Configurar resolução de módulos para monorepo
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
  path.resolve(__dirname, 'packages'),
];

// Configurar watchman para monitorar todas as pastas
config.watchFolders = [
  path.resolve(__dirname, 'packages'),
  path.resolve(__dirname, 'apps'),
];

module.exports = config;
```

## Passo 3: Configurar Babel

```javascript
// babel.config.js
module.exports = {
  presets: ['@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@shared': './packages/shared',
          '@ui': './packages/ui',
          '@utils': './packages/utils',
        },
      },
    ],
  ],
};
```

## Passo 4: Configurar TypeScript

```json
// tsconfig.json (root)
{
  "compilerOptions": {
    "target": "es2020",
    "lib": ["es2020"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@shared/*": ["packages/shared/src/*"],
      "@ui/*": ["packages/ui/src/*"],
      "@utils/*": ["packages/utils/src/*"]
    }
  },
  "include": [
    "apps/**/*",
    "packages/**/*"
  ],
  "exclude": [
    "node_modules"
  ]
}
```

## Passo 5: Criar o App React Native

### 5.1 Instalar React Native CLI
```bash
npm install -g @react-native-community/cli
```

### 5.2 Criar o projeto React Native
```bash
npx react-native@0.80.2 init mobile --directory apps/mobile
```

### 5.3 Configurar package.json do mobile
```json
{
  "name": "@my-trainer/mobile",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "android": "react-native run-android",
    "ios": "react-native run-ios",
    "start": "react-native start",
    "test": "jest",
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx"
  },
  "dependencies": {
    "react": "18.3.1",
    "react-native": "0.80.2",
    "@my-trainer/shared": "workspace:*",
    "@my-trainer/ui": "workspace:*",
    "@my-trainer/utils": "workspace:*"
  },
  "devDependencies": {
    "@babel/core": "^7.24.0",
    "@babel/preset-env": "^7.24.0",
    "@babel/runtime": "^7.24.0",
    "@react-native/eslint-config": "^0.80.2",
    "@react-native/metro-config": "^0.80.2",
    "@react-native/typescript-config": "^0.80.2",
    "@types/react": "^18.3.12",
    "@types/react-test-renderer": "^18.3.0",
    "babel-jest": "^29.7.0",
    "eslint": "^8.57.0",
    "jest": "^29.7.0",
    "prettier": "3.1.1",
    "react-test-renderer": "18.3.1",
    "typescript": "5.4.2"
  }
}
```

## Passo 6: Criar Pacotes Compartilhados

### 6.1 Pacote Shared
```json
// packages/shared/package.json
{
  "name": "@my-trainer/shared",
  "version": "1.0.0",
  "main": "src/index.ts",
  "types": "src/index.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch"
  },
  "dependencies": {
    "react": "^18.3.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.12",
    "typescript": "^5.4.2"
  }
}
```

### 6.2 Pacote UI
```json
// packages/ui/package.json
{
  "name": "@my-trainer/ui",
  "version": "1.0.0",
  "main": "src/index.ts",
  "types": "src/index.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-native": "^0.80.2",
    "@my-trainer/shared": "workspace:*"
  },
  "devDependencies": {
    "@types/react": "^18.3.12",
    "@types/react-native": "^0.73.0",
    "typescript": "^5.4.2"
  }
}
```

### 6.3 Pacote Utils
```json
// packages/utils/package.json
{
  "name": "@my-trainer/utils",
  "version": "1.0.0",
  "main": "src/index.ts",
  "types": "src/index.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch"
  },
  "devDependencies": {
    "typescript": "^5.4.2"
  }
}
```

## Passo 7: Configurar Metro para o Monorepo

### 7.1 Metro Config para Mobile
```javascript
// apps/mobile/metro.config.js
const { getDefaultConfig } = require('@react-native/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Configurar resolução de módulos para monorepo
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
  path.resolve(__dirname, '../../node_modules'),
  path.resolve(__dirname, '../../packages'),
];

// Configurar watchman para monitorar todas as pastas
config.watchFolders = [
  path.resolve(__dirname, '../../packages'),
  path.resolve(__dirname, '../../apps'),
];

module.exports = config;
```

## Passo 8: Configurar Babel para Mobile

```javascript
// apps/mobile/babel.config.js
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

## Passo 9: Configurar TypeScript para Mobile

```json
// apps/mobile/tsconfig.json
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

## Passo 10: Scripts de Desenvolvimento

### 10.1 Adicionar scripts no root package.json
```json
{
  "scripts": {
    "dev:web": "npm run dev --workspace=apps/web",
    "dev:mobile": "npm run start --workspace=apps/mobile",
    "android": "npm run android --workspace=apps/mobile",
    "ios": "npm run ios --workspace=apps/mobile",
    "build:all": "npm run build --workspaces",
    "build:web": "npm run build --workspace=apps/web",
    "build:mobile": "npm run build --workspace=apps/mobile",
    "lint": "npm run lint --workspaces",
    "test": "npm run test --workspaces",
    "clean": "rm -rf node_modules && npm install"
  }
}
```

## Passo 11: Configurar ESLint para Monorepo

```javascript
// .eslintrc.js (root)
module.exports = {
  root: true,
  extends: ['@react-native/eslint-config'],
  rules: {
    'import/no-unresolved': 'off',
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
};
```

## Passo 12: Configurar Jest para Monorepo

```javascript
// jest.config.js (root)
module.exports = {
  projects: [
    '<rootDir>/apps/web/jest.config.js',
    '<rootDir>/apps/mobile/jest.config.js',
  ],
  collectCoverageFrom: [
    'packages/**/*.{js,jsx,ts,tsx}',
    'apps/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
};
```

## Comandos para Executar

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Executar web:**
   ```bash
   npm run dev:web
   ```

3. **Executar mobile:**
   ```bash
   npm run dev:mobile
   ```

4. **Executar no Android:**
   ```bash
   npm run android
   ```

5. **Executar no iOS:**
   ```bash
   npm run ios
   ```

## Estrutura de Arquivos Exemplo

### packages/shared/src/index.ts
```typescript
export interface User {
  id: string;
  name: string;
  email: string;
}

export const formatName = (name: string): string => {
  return name.trim();
};
```

### packages/ui/src/Button.tsx
```typescript
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
}

export const Button: React.FC<ButtonProps> = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
  },
  text: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
});
```

### apps/mobile/App.tsx
```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '@ui/Button';
import { formatName } from '@shared/index';

const App = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Olá, {formatName('Meu Treinador')}!
      </Text>
      <Button title="Iniciar Treino" onPress={() => {}} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default App;
```

## Considerações Importantes

1. **Versão do React Native:** 0.80.2 é uma versão estável e recente
2. **Compatibilidade:** Certifique-se de que todas as dependências sejam compatíveis
3. **Metro:** Configuração essencial para resolução de módulos no monorepo
4. **TypeScript:** Configuração de paths para facilitar imports
5. **Workspaces:** Uso de npm workspaces para gerenciar dependências
6. **Hot Reload:** Metro configurado para detectar mudanças em todos os pacotes

Esta configuração permite que você desenvolva tanto o app web (Next.js) quanto o mobile (React Native) compartilhando código entre eles através dos pacotes compartilhados.
