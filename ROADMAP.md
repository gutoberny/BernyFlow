# Roadmap do Projeto BernyFlow

Este documento rastrea o progresso do desenvolvimento e os planos futuros.

## ✅ Fase 1: Core (Implementado)
O núcleo do sistema parece estar completo com base na estrutura atual:

- [x] **Autenticação**: Login, Registro, Proteção de Rotas (`LoginPage`, `RegisterPage`).
- [x] **Gestão de Clientes**: CRUD completo (`Clients.jsx`).
- [x] **Catálogo**: Produtos e Serviços com precificação (`Products.jsx`, `Services.jsx`).
- [x] **Ordens de Serviço**:
    - Ciclo de vida (Abertura, Execução, Finalização).
    - Adição de itens e cálculo de custos (`OrderDetails.jsx`).
- [x] **Financeiro**:
    - Transações de Receita/Despesa.
    - Fluxo de caixa (`Financial.jsx`).
- [x] **Dashboard**: Visão geral (`Dashboard.jsx`).
- [x] **Configurações**: Perfil e Empresa (`CompanySettings.jsx`, `UserProfile.jsx`).

## 🚧 Fase 2: Transformação SaaS (Em Andamento)
Foco em transformar o sistema em um produto comercializável (SaaS).

- [ ] **Integração com Pagamentos**:
    - Integração com Stripe ou Asaas para assinaturas.
    - Bloqueio automático de inadimplentes (`SubscriptionStatus`).
- [ ] **Painel Super Admin**:
    - Visão global de todas as empresas cadastradas.
    - Capacidade de suspender/ativar tenants.
- [ ] **Planos e Limites**:
    - Implementar limites por plano (ex: Free = 100 clientes, Pro = Ilimitado).
- [ ] **Landing Page**:
    - Página pública de vendas e planos.

## 🚀 Fase 3: Refinamento e Estabilidade
Garantir robustez e escalabilidade.

- [ ] **Testes Automatizados**: Criar testes unitários e de integração.
- [ ] **Validação de Dados**: Melhorar mensagens de erro (Zod/Yup).
- [ ] **Melhorias de UI/UX**: Skeletons, animações.
- [ ] **Infraestrutura**:
    - Deploy automatizado (CI/CD).
    - Monitoramento de erros (Sentry).

## 📝 Notas
- O deploy em Windows foi documentado em `docs/DEPLOY_WINDOWS.md`.
- O sistema já possui isolamento de dados por `companyId` (Multi-tenant nativo).
