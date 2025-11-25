# BernyFlow - Sistema de Gestão para Assistência Técnica

Sistema web para gerenciamento de clientes, produtos, serviços, ordens de serviço e financeiro, desenvolvido para empresas de informática.

## Tecnologias Utilizadas

- **Frontend**: React, Vite, Tailwind CSS, Lucide React
- **Backend**: Node.js, Express
- **Banco de Dados**: SQLite, Prisma ORM

## Pré-requisitos

- Node.js (versão 18 ou superior)
- NPM (gerenciador de pacotes do Node)

### Usando Docker (Recomendado)

1. Certifique-se de ter o Docker e Docker Compose instalados.

2. Na raiz do projeto, execute:
   ```bash
   docker compose up --build
   ```

3. Acesse a aplicação:
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:3000`

### Instalação Manual (Sem Docker)

### 1. Backend (API)

1. Navegue até a pasta do backend:
   ```bash
   cd backend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure o banco de dados e execute as migrações:
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

4. Inicie o servidor:
   ```bash
   npm run dev
   ```
   O servidor rodará em `http://localhost:3000`.

### 2. Frontend (Interface)

1. Abra um novo terminal e navegue até a pasta do frontend:
   ```bash
   cd frontend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
   Acesse a aplicação em `http://localhost:5173`.

## Funcionalidades Principais

- **Dashboard**: Visão geral rápida.
- **Clientes**: Cadastro completo (CRUD).
- **Produtos**: Controle de estoque e preços.
- **Serviços**: Tabela de preços de serviços.
- **Ordens de Serviço**:
  - Abertura e acompanhamento de status.
  - Adição de produtos (baixa automática no estoque).
  - Adição de serviços (cálculo de 1ª hora diferenciada).
  - Custo de deslocamento.
- **Financeiro**:
  - Registro automático de receitas ao finalizar OS.
  - Resumo de receitas, despesas e saldo.
