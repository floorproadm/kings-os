

# Invoice Settings — Customização do Invoice no Settings

## Problema atual

O InvoicePreview tem dados da empresa **hardcoded** ("Hardwood Kings", "Premium Hardwood Flooring", "hardwoodkings.com"). Não há como customizar logo, tagline, website, endereço da empresa, nem termos padrão de pagamento.

## O que adicionar

Uma nova seção **"Invoice Settings"** na página de Settings com:

### 1. Database — Nova tabela `invoice_settings`

| Coluna | Tipo | Default |
|--------|------|---------|
| id | uuid PK | |
| org_id | uuid | HK org |
| logo_url | text | null |
| company_name | text | org.name |
| tagline | text | null (ex: "Premium Hardwood Flooring") |
| website | text | null |
| company_address | text | null |
| company_phone | text | null |
| company_email | text | null |
| accent_color | text | '#c9a84c' (gold) |
| default_notes | text | null (termos padrão que aparecem em todo invoice) |
| footer_text | text | 'Thank you for choosing Hardwood Kings!' |

RLS: org-scoped (mesmo padrão).

### 2. Settings Page — Card "Invoice Branding"

Novo card na página de Settings com:
- **Upload de logo** (upload para Supabase Storage → salva URL)
- **Company name, tagline, website, endereço, phone, email** — inputs editáveis
- **Accent color** — color picker (cor da barra e títulos do invoice)
- **Default payment terms/notes** — textarea com termos padrão
- **Footer message** — texto do rodapé do invoice
- **Preview mini** — pequena pré-visualização ao lado mostrando como fica

### 3. InvoicePreview — Usar dados dinâmicos

Substituir os valores hardcoded por dados da `invoice_settings`:
- Logo da empresa no header (se configurado)
- Nome, tagline, website, endereço vindos do settings
- Cor de destaque dinâmica (barra, títulos)
- Notes padrão pré-preenchidos ao criar novo invoice
- Footer text customizado

### 4. InvoiceEditorDialog — Auto-fill notes

Ao criar novo invoice, pré-preencher o campo `notes` com o `default_notes` do settings.

## Ordem de implementação

1. Migration: criar `invoice_settings` + storage bucket para logos
2. Card "Invoice Branding" no Settings com upload + inputs + save
3. Atualizar InvoicePreview para buscar e usar invoice_settings
4. Atualizar InvoiceEditorDialog para auto-fill default_notes

## Arquivos afetados

- `supabase/migrations/` — nova migration
- `src/pages/admin/Settings.tsx` — novo card Invoice Branding
- `src/components/admin/projects/InvoicePreview.tsx` — dados dinâmicos
- `src/components/admin/projects/InvoiceEditorDialog.tsx` — auto-fill notes

