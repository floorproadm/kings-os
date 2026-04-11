

# Invoice Maker PRO — Plano de Implementação

## O que muda

Transformar a aba simples de Invoices em um **Invoice Maker completo** com line items detalhados, preview profissional, exportação PDF, edição inline e status automático.

---

## 1. Database — Nova tabela `invoice_items`

Nova tabela para line items de cada invoice:

| Coluna | Tipo | Notas |
|--------|------|-------|
| id | uuid PK | |
| org_id | uuid | default HK org |
| invoice_id | uuid FK → invoices | |
| description | text | Ex: "Hardwood Installation" |
| quantity | numeric | Ex: 500 (sqft) |
| unit | text | Ex: "sqft", "unit", "hour" |
| unit_price | numeric | Ex: 6.50 |
| total | numeric | qty x unit_price (calculado no frontend) |
| display_order | integer | ordem das linhas |

Também adicionar colunas na tabela `invoices` existente:
- `notes` (text) — termos de pagamento, observações
- `client_name` (text) — nome do cliente (auto-preenchido do lead)
- `client_email` (text)
- `client_address` (text)

RLS: org-scoped (mesmo padrão das demais tabelas).

---

## 2. Frontend — Componentes novos

### 2.1 InvoicesTab refatorada
- Lista de invoices com **status badges coloridos** e progress bar (paid/total)
- Botão de **editar** (lápis) em cada invoice — abre o Invoice Editor
- Status automático: badge "OVERDUE" se `due_date < hoje` e status != paid
- Cálculo `amount` = soma dos line items

### 2.2 InvoiceEditorDialog (novo)
Modal/Dialog grande para criar e editar invoices:
- **Header**: Invoice #, status selector, due date
- **Client info**: nome, email, endereço (auto-fill do projeto/lead)
- **Line items table**: description, qty, unit, unit price, total (calculado)
  - Botão "+ Add Line" para adicionar linhas
  - Trash para remover
  - Drag ou setas para reordenar
- **Footer**: Subtotal, Notes/Terms, botões Save e Preview

### 2.3 InvoicePreview (novo)
Preview estilizado do invoice como documento profissional:
- Logo da empresa (Hardwood Kings)
- Dados da empresa (nome, phone, email do SiteConfig)
- Dados do cliente
- Tabela de line items formatada
- Subtotal e Total
- Termos de pagamento
- Botão **"Export PDF"** que usa `window.print()` com CSS `@media print` para gerar PDF limpo

### 2.4 Status automático
- No hook `useProjectDetails`, ao carregar invoices, checar se `due_date < hoje` e `status != 'paid'` → marcar visualmente como overdue
- Semáforo visual: Draft (cinza), Sent (azul), Paid (verde), Overdue (vermelho pulsante)

---

## 3. Estrutura de arquivos

```text
src/components/admin/projects/
  InvoicesTab.tsx              — refatorada (lista + status)
  InvoiceEditorDialog.tsx      — modal de criação/edição com line items
  InvoicePreview.tsx           — preview profissional + PDF export
src/hooks/admin/useProjectDetails.ts  — novos métodos (CRUD invoice_items, update invoice)
```

---

## 4. Ordem de implementação

1. Migration: criar `invoice_items` + adicionar colunas em `invoices`
2. Hook: CRUD de invoice_items + updateInvoice
3. InvoiceEditorDialog com line items
4. InvoicePreview com dados da empresa e export PDF
5. Refatorar InvoicesTab com edição, status automático e progress bar

