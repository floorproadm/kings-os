

## Sugestoes de Melhoria — StatsBar + DualCTABar

Analisando o screenshot e o codigo atual, aqui estao melhorias que elevariam o design:

### StatsBar (bloco branco)

1. **Separadores verticais entre stats** — Adicionar linhas divisorias douradas sutis (`border-r border-gold/20`) entre os 3 blocos para criar separacao visual clara e mais estrutura.

2. **Icone dedicado para cada stat** — Substituir o numero puro por um pequeno icone acima (ex: escudo para experiencia, check-circle para projetos), dando mais hierarquia visual.

3. **Fundo com textura sutil** — Trocar o `bg-white` puro por um leve pattern ou gradiente (`bg-gradient-to-b from-white to-gold/5`) para criar mais profundidade e conexao com a paleta dourada.

4. **Tipografia com mais contraste** — Aumentar o peso visual dos numeros (tracking mais aberto, tamanho maior no mobile) e usar uppercase nos labels para um look mais premium.

### DualCTABar (bloco escuro)

5. **Botoes empilhados no mobile com largura total** — Atualmente os botoes sao compactos. No mobile (390px), fazer `w-full` para ambos os CTAs, criando mais impacto e area de toque.

6. **Glow sutil no botao dourado** — Adicionar `shadow-[0_0_20px_rgba(201,168,76,0.3)]` no botao principal para um efeito de brilho premium que destaca o CTA.

7. **Label acima com tipografia refinada** — O "Ready to transform your floors?" poderia usar `uppercase tracking-[0.2em] text-xs` para ficar mais sofisticado, alinhado com o brand.

### Transicao entre blocos

8. **Remover separacao abrupta** — O corte branco/preto e muito duro. Adicionar uma faixa de gradiente de transicao ou unificar ambos num unico bloco com fundo escuro (stats com texto dourado sobre fundo preto).

---

### Implementacao sugerida

**Arquivos a editar:**
- `src/components/home/StatsBar.tsx` — separadores, tipografia, fundo
- `src/components/shared/DualCTABar.tsx` — botoes full-width mobile, glow, label styling

Nenhuma mudanca em outros componentes, rotas ou backend.

Qual dessas melhorias voce quer que eu implemente? Posso aplicar todas ou apenas as que preferir.

