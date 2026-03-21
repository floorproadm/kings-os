

## 4 Correções Cirúrgicas — Plano de Implementação

### FIX 1 — Contact form salvar lead no Supabase
**Arquivo:** `src/pages/Contact.tsx`
- Adicionar imports: `supabase` client e `HK_ORG_ID`
- Tornar `handleSubmit` async
- Inserir lead na tabela `leads` antes do redirect, com `source: "contact-page"`
- Mostrar toast de erro se falhar, só redirecionar após sucesso

### FIX 2 — Criar 3 páginas de serviço faltantes
**Arquivos novos:**
- `src/pages/services/Demolition.tsx` — Demolition & Replacement
- `src/pages/services/Deck.tsx` — Deck & Handrail Refinishing
- `src/pages/services/Wash.tsx` — Wash & Polish

Cada página seguirá a mesma estrutura de `Hardwood.tsx`: hero com gradient, seção de benefits, features cards, steps de processo, e CTA final. Conteúdo estático (sem dependência de `useSiteConfig`).

**Arquivo editado:** `src/App.tsx` — registrar 3 novas rotas (`/services/demolition`, `/services/deck`, `/services/wash`)

### FIX 3 — Deletar arquivos legados inseguros
**Arquivos deletados:**
- `src/pages/Admin.tsx`
- `src/pages/AdminLogin.tsx`
- `src/contexts/AdminAuthContext.tsx`

Nenhum arquivo ativo importa deles (confirmado via search). Remoção segura.

### FIX 4 — Footer usar logo oficial
**Arquivo:** `src/components/Footer.tsx`
- Substituir import `Crown` por `import logoCrown from "@/assets/logo-crown.webp"`
- Trocar `<Crown className="w-8 h-8 text-gold" />` por `<img src={logoCrown} alt="Hardwood Kings" className="h-8 w-auto" />`

---

### Resumo de arquivos
| Ação | Arquivo |
|------|---------|
| Editado | `src/pages/Contact.tsx` |
| Editado | `src/App.tsx` |
| Editado | `src/components/Footer.tsx` |
| Criado | `src/pages/services/Demolition.tsx` |
| Criado | `src/pages/services/Deck.tsx` |
| Criado | `src/pages/services/Wash.tsx` |
| Deletado | `src/pages/Admin.tsx` |
| Deletado | `src/pages/AdminLogin.tsx` |
| Deletado | `src/contexts/AdminAuthContext.tsx` |

