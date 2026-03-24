

## Plano: Gerar Planilha de Auditoria Kings OS

Gerar um arquivo Excel (`Kings_OS_Audit.xlsx`) com 3 abas usando openpyxl:

### Aba 1 — Paginas Publicas (20 rotas)
Colunas: Rota | Pagina | Arquivo | Tipo | CTA Principal | Formulario | Supabase | Status

Todas as 20 rotas publicas do App.tsx mapeadas com detalhes de funcionalidade.

### Aba 2 — Paginas Admin (7 rotas)
Colunas: Rota | Pagina | Arquivo | Protegida | Funcionalidade | Supabase | Status

Todas as 7 rotas admin protegidas.

### Aba 3 — Observacoes
- Arquivos sem rota: `Demolition.tsx`, `Wash.tsx` (existem em `/services/` mas nao estao no App.tsx)
- Links externos pendentes na pagina `/links`
- Componentes compartilhados principais

### Detalhes Tecnicos
- Script Python com openpyxl
- Formatacao profissional: headers em negrito com fundo dourado, colunas ajustadas, bordas
- Output: `/mnt/documents/Kings_OS_Audit.xlsx`

