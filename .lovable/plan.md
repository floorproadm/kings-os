

# Gestão de Projetos — Full MVP

## Resumo

Criar o módulo completo de Gestão de Projetos no Kings OS com 4 tabelas principais: **Projects**, **Material Costs**, **Labor Payroll**, **Invoices/Payments** e **Measurements**. O Projects PRO funciona como hub central com rollups calculados no frontend (margem, saldo, status de pagamento).

---

## 1. Database — Novas tabelas (5 migrações)

### 1.1 `projects`
O coração do sistema. Cada linha = 1 job.

| Coluna | Tipo | Notas |
|--------|------|-------|
| id | uuid PK | |
| org_id | uuid | default HK org |
| lead_id | uuid FK → leads | cliente de origem |
| title | text | nome do projeto |
| status | text | `planning`, `in_progress`, `completed`, `awaiting_payment`, `paid`, `archived` |
| address | text | endereço do job |
| scheduled_date | date | data agendada |
| completed_date | date | |
| total_value | numeric | valor do contrato |
| notes | text | |
| created_at / updated_at | timestamptz | |

RLS: org-scoped (read/insert/update/delete para authenticated via `get_user_org_id()`).

### 1.2 `measurements`
Medições do job.

| Coluna | Tipo |
|--------|------|
| id | uuid PK |
| org_id | uuid |
| project_id | uuid FK → projects |
| sqft | numeric |
| stairs_count | integer |
| handrail_ft | numeric |
| extras_value | numeric |
| total_value | numeric (formula no frontend) |
| notes | text |
| created_at | timestamptz |

### 1.3 `material_costs`
Custos de material por projeto.

| Coluna | Tipo |
|--------|------|
| id | uuid PK |
| org_id | uuid |
| project_id | uuid FK → projects |
| description | text |
| vendor | text |
| amount | numeric |
| purchased_at | date |
| receipt_url | text |
| created_at | timestamptz |

### 1.4 `labor_payroll`
Registros de mão de obra.

| Coluna | Tipo |
|--------|------|
| id | uuid PK |
| org_id | uuid |
| project_id | uuid FK → projects |
| worker_name | text |
| days_worked | numeric |
| daily_rate | numeric |
| total_cost | numeric (computed) |
| work_date | date |
| notes | text |
| created_at | timestamptz |

### 1.5 `invoices` + `payments`

**invoices:**
| Coluna | Tipo |
|--------|------|
| id | uuid PK |
| org_id | uuid |
| project_id | uuid FK → projects |
| invoice_number | text |
| amount | numeric |
| due_date | date |
| status | text | `draft`, `sent`, `paid`, `overdue` |
| created_at | timestamptz |

**payments:**
| Coluna | Tipo |
|--------|------|
| id | uuid PK |
| org_id | uuid |
| invoice_id | uuid FK → invoices |
| amount | numeric |
| payment_date | date |
| method | text |
| notes | text |
| created_at | timestamptz |

Todas com RLS org-scoped + realtime habilitado para `projects`.

---

## 2. Frontend — Páginas e componentes

### 2.1 Rota e navegação
- Nova rota `/admin/projects` no `App.tsx`
- Novo item "Projects" no `AdminSidebar.tsx` (ícone `FolderKanban`) entre Dashboard e Leads

### 2.2 Página principal: `src/pages/admin/Projects.tsx`
- **Pipeline Board** (view padrão): colunas Kanban com drag-and-drop por status (Planning → In Progress → Completed → Awaiting Payment → Paid)
- **List View**: tabela com colunas (Title, Client, Status, Value, Margin, Balance Due)
- Toggle board/list (mesmo padrão da página de Leads)
- Busca e filtro por status
- Botão "New Project"

### 2.3 Modal/Painel de detalhes: `ProjectDetailPanel.tsx`
Sheet lateral (padrão AXO OS) com abas:
- **Overview**: dados do projeto, link com lead, status, valor, datas
- **Measurements**: lista de medições com formulário inline
- **Costs**: Material Costs + Labor Payroll em sub-abas
- **Invoices**: lista de invoices com payments aninhados
- **KPIs calculados no topo**: Total Value, Total Costs (materials + labor), Net Profit, Margin %, Balance Due

### 2.4 Formulários modais
- `NewProjectDialog.tsx` — criar projeto (com select de Lead existente)
- Formulários inline para measurements, costs, labor, invoices dentro do painel de detalhes

### 2.5 Dashboard update
- Novo KPI card "Active Projects" no dashboard principal
- Mini seção "Projects needing attention" (sem invoice, overdue, etc.)

---

## 3. Cálculos no frontend (simula rollups do Notion)

```
Total Materials = SUM(material_costs.amount) WHERE project_id = X
Total Labor = SUM(labor_payroll.total_cost) WHERE project_id = X
Total Costs = Total Materials + Total Labor
Net Profit = project.total_value - Total Costs
Margin % = (Net Profit / total_value) * 100
Total Invoiced = SUM(invoices.amount)
Total Received = SUM(payments.amount)
Balance Due = Total Invoiced - Total Received
```

Semáforo de margem: 🟢 ≥30% / 🟡 15-29% / 🔴 <15%

---

## 4. Estrutura de arquivos

```text
src/pages/admin/Projects.tsx          — página principal
src/components/admin/projects/
  ProjectPipelineBoard.tsx            — kanban board
  ProjectListView.tsx                 — tabela
  ProjectDetailPanel.tsx              — sheet de detalhes
  NewProjectDialog.tsx                — modal criar projeto
  MeasurementsTab.tsx                 — aba medições
  CostsTab.tsx                        — aba custos (materials + labor)
  InvoicesTab.tsx                     — aba invoices/payments
  ProjectKPIBar.tsx                   — barra de KPIs calculados
src/hooks/admin/useProjectsData.ts    — fetch + mutations
src/hooks/admin/useProjectDetails.ts  — fetch detalhes + sub-dados
```

---

## 5. Ordem de implementação

1. Criar todas as tabelas via migrations (1 migration com tudo)
2. Rota + sidebar + página Projects com pipeline board
3. NewProjectDialog + integração com leads
4. ProjectDetailPanel com Overview
5. Tabs de Measurements, Costs, Invoices
6. KPIs calculados + semáforo de margem
7. Update no Dashboard principal

