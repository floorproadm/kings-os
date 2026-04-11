

# Página dedicada de Invoices no Admin

## O que será feito

Criar uma nova página `/admin/invoices` que lista **todos os invoices de todos os projetos** em uma visão centralizada, com filtros, busca e acesso rápido a preview/edição. Adicionar o link na sidebar e bottom nav.

## Arquivos a criar/editar

### 1. `src/pages/admin/Invoices.tsx` (novo)
- Busca todos os invoices via Supabase join com `projects` (para pegar título do projeto e cliente)
- KPI strip no topo: Total Invoiced, Total Received, Outstanding, Overdue count
- Filtros: status (draft/sent/paid/overdue), busca por número ou cliente
- Tabela/lista com: #número, projeto, cliente, valor, status badge, due date, progress bar de pagamento
- Ações: preview, editar, deletar
- Integra os componentes existentes `InvoiceEditorDialog` e `InvoicePreview`

### 2. `src/components/admin/AdminSidebar.tsx`
- Adicionar item "Invoices" com ícone `Receipt` entre Projects e Leads

### 3. `src/components/admin/AdminBottomNav.tsx`
- Considerar adicionar Invoices ou manter o layout atual (5 itens é o limite ideal para mobile)

### 4. `src/App.tsx`
- Adicionar rota lazy `/admin/invoices`

### 5. Hook de dados
- Criar `src/hooks/admin/useInvoicesData.ts` — busca todos invoices + payments com join no projeto, cálculo de KPIs globais, funções de delete/update status

## Estrutura da página

```text
┌─────────────────────────────────┐
│ KPI: Invoiced | Received | Due  │
├─────────────────────────────────┤
│ [Search] [Status filter]        │
├─────────────────────────────────┤
│ #001 | Project X | $2,500 | Sent│
│ #002 | Project Y | $1,200 | Paid│
│ ...                             │
└─────────────────────────────────┘
```

## Ordem de implementação

1. Hook `useInvoicesData` — query all invoices com join projects
2. Página `Invoices.tsx` com lista, filtros e KPIs
3. Rota no App.tsx + item na sidebar
4. Integrar InvoiceEditorDialog e InvoicePreview existentes

