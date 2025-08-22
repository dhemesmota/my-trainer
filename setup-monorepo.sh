#!/bin/bash

# Script para configurar monorepo com React Native 0.80.2
# Baseado na documentação oficial do React Native

set -e

echo "🚀 Iniciando configuração do monorepo com React Native 0.80.2..."

# Criar estrutura de pastas
echo "📁 Criando estrutura de pastas..."
mkdir -p apps/mobile
mkdir -p packages/shared/src
mkdir -p packages/ui/src
mkdir -p packages/utils/src

# Mover projeto web atual para apps/web
if [ -d "src" ] && [ -f "package.json" ]; then
    echo "📦 Movendo projeto web atual para apps/web..."
    mkdir -p apps/web
    cp -r src apps/web/
    cp package.json apps/web/
    cp tsconfig.json apps/web/
    cp next.config.ts apps/web/
    cp postcss.config.mjs apps/web/
    cp tailwind.config.js apps/web/ 2>/dev/null || true
    cp components.json apps/web/ 2>/dev/null || true
    cp eslint.config.mjs apps/web/ 2>/dev/null || true
    cp -r public apps/web/ 2>/dev/null || true
fi

# Criar root package.json
echo "📝 Criando root package.json..."
cat > package.json << 'EOF'
{
  "name": "my-trainer-monorepo",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
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
EOF

# Criar metro.config.js
echo "⚙️ Criando metro.config.js..."
cat > metro.config.js << 'EOF'
const { getDefaultConfig } = require('@react-native/metro-config');
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
EOF

# Criar babel.config.js
echo "⚙️ Criando babel.config.js..."
cat > babel.config.js << 'EOF'
module.exports = {
  presets: ['@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@shared': './packages/shared/src',
          '@ui': './packages/ui/src',
          '@utils': './packages/utils/src',
        },
      },
    ],
  ],
};
EOF

# Criar tsconfig.json root
echo "⚙️ Criando tsconfig.json root..."
cat > tsconfig.json << 'EOF'
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
EOF

# Criar .eslintrc.js
echo "⚙️ Criando .eslintrc.js..."
cat > .eslintrc.js << 'EOF'
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
EOF

# Criar jest.config.js
echo "⚙️ Criando jest.config.js..."
cat > jest.config.js << 'EOF'
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
EOF

# Criar pacotes compartilhados
echo "📦 Criando pacotes compartilhados..."

# Shared package
cat > packages/shared/package.json << 'EOF'
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
EOF

cat > packages/shared/tsconfig.json << 'EOF'
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
EOF

cat > packages/shared/src/index.ts << 'EOF'
export interface User {
  id: string;
  name: string;
  email: string;
}

export const formatName = (name: string): string => {
  return name.trim();
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
EOF

# UI package
cat > packages/ui/package.json << 'EOF'
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
EOF

cat > packages/ui/tsconfig.json << 'EOF'
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
EOF

cat > packages/ui/src/Button.tsx << 'EOF'
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  title, 
  onPress, 
  variant = 'primary',
  disabled = false 
}) => {
  return (
    <TouchableOpacity 
      style={[styles.button, styles[variant], disabled && styles.disabled]} 
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.text, styles[`${variant}Text`]]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: '#007AFF',
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontWeight: '600',
  },
  primaryText: {
    color: 'white',
  },
  secondaryText: {
    color: '#007AFF',
  },
});
EOF

cat > packages/ui/src/index.ts << 'EOF'
export { Button } from './Button';
EOF

# Utils package
cat > packages/utils/package.json << 'EOF'
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
EOF

cat > packages/utils/tsconfig.json << 'EOF'
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
EOF

cat > packages/utils/src/index.ts << 'EOF'
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('pt-BR').format(date);
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
EOF

echo "✅ Estrutura do monorepo criada com sucesso!"
echo ""
echo "📋 Próximos passos:"
echo "1. Instalar dependências: npm install"
echo "2. Criar projeto React Native: npx react-native@0.80.2 init mobile --directory apps/mobile"
echo "3. Configurar Metro e Babel no app mobile"
echo "4. Executar: npm run dev:web (para web) ou npm run dev:mobile (para mobile)"
echo ""
echo "📚 Consulte o arquivo monorepo-setup.md para detalhes completos da configuração."
