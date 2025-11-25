# BernyFlow 🚀

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

**BernyFlow** é um sistema de gestão completo e open-source projetado para assistências técnicas e prestadores de serviços de TI. Ele simplifica o controle de ordens de serviço, clientes, estoque e finanças em uma interface moderna e intuitiva.

---

## ✨ Funcionalidades Principais

### 🛠️ Gestão de Ordens de Serviço (OS)
- **Ciclo de Vida Completo**: Abertura, execução, finalização e reabertura de OS.
- **Controle de Custos**: Adição de produtos (com baixa automática de estoque) e serviços.
- **Cálculo Inteligente**: Diferenciação de preço para a 1ª hora técnica e custos de deslocamento.
- **Reabertura Segura**: Lógica automática para estorno de transações financeiras ao reabrir uma OS.

### 💰 Controle Financeiro Avançado
- **Contas a Pagar e Receber**: Gestão completa do fluxo de caixa.
- **Transações Recorrentes**: Criação automática de parcelas ou mensalidades (ex: contratos de manutenção).
- **Filtros Poderosos**: Visualize por status (Pago/Pendente), tipo (Receita/Despesa) e período personalizado.
- **Dashboard Financeiro**: Resumo claro de receitas, despesas e saldo em tempo real.

### 📦 Gestão de Produtos e Serviços
- **Precificação Automática**: Cálculo de preço de venda baseado em custos (frete, impostos) e margem de lucro desejada.
- **Controle de Estoque**: Atualização automática conforme o uso em ordens de serviço.

### 👥 Gestão de Clientes
- Cadastro completo com histórico de serviços prestados.
- Integração direta com a abertura de novas OS.

---

## 🚀 Tecnologias Utilizadas

O projeto foi construído com uma stack moderna focada em performance e experiência do desenvolvedor:

- **Frontend**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Estilização**: [Tailwind CSS](https://tailwindcss.com/) + [Lucide React](https://lucide.dev/) (Ícones)
- **Backend**: [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/)
- **Banco de Dados**: [SQLite](https://www.sqlite.org/) (Fácil setup) + [Prisma ORM](https://www.prisma.io/)
- **Containerização**: [Docker](https://www.docker.com/) + Docker Compose

---

## 🏁 Como Executar o Projeto

### Pré-requisitos
- Git
- Docker e Docker Compose (Recomendado)
- Node.js v18+ (para execução manual)

### Opção 1: Rodando com Docker (Recomendado) 🐳

A maneira mais rápida de testar o BernyFlow:

1. **Clone o repositório**
   ```bash
   git clone https://github.com/SEU_USUARIO/BernyFlow.git
   cd BernyFlow
   ```

2. **Suba os containers**
   ```bash
   docker compose up --build
   ```

3. **Acesse a aplicação**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:3000`

### Opção 2: Instalação Manual 🛠️

#### Backend
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 🤝 Como Contribuir

Contribuições são o que fazem a comunidade open-source um lugar incrível para aprender, inspirar e criar. Qualquer contribuição que você fizer será **muito apreciada**.

1. Faça um Fork do projeto
2. Crie uma Branch para sua Feature (`git checkout -b feature/MinhaFeature`)
3. Faça o Commit de suas mudanças (`git commit -m 'Adicionando uma nova feature incrível'`)
4. Faça o Push para a Branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.

---

Desenvolvido com ❤️ por **BernyFlow Team**.
