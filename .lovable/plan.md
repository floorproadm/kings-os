

## Integração Google Reviews — Análise e Plano

### Realidade técnica

O Google **não oferece uma API pública gratuita** para puxar reviews diretamente. As opções disponíveis:

| Método | Limitação |
|--------|-----------|
| **Google Places API** (Maps Platform) | Retorna no máximo **5 reviews**. Requer API key com billing ativo no Google Cloud. Custo: ~$17/1000 requests. |
| **Scraping direto** | Viola os Termos de Serviço do Google. Bloqueado rapidamente. |
| **Widgets de terceiros** (Elfsight, Trustmary) | Embed externo — funciona, mas adiciona scripts de terceiros e geralmente é pago (~$5-15/mês). |

### Recomendação

Dado que vocês têm **8 reviews verificados** e o Google Places API só retorna 5, a melhor abordagem é:

**Opção A (Recomendada)** — Redesign visual da seção atual para parecer integrada ao Google, usando os 8 reviews reais já existentes. Isso inclui:
- Layout em carrossel com setas (como na imagem de referência)
- Cards estilo Google: avatar com inicial, nome, "X months ago", ícone Google colorido, estrelas amarelas com badge verificado
- Badge lateral "EXCELLENT · 5 estrelas · Based on 10 reviews · Google" com logo Google colorida
- Subtítulo descritivo abaixo do heading
- "Read more" truncando textos longos com expand

**Opção B** — Integrar via Google Places API (edge function + API key). Limitado a 5 reviews e custo recorrente.

### Plano de implementação (Opção A)

1. **Reescrever `TestimonialsSection.tsx`** com novo layout:
   - Seção com fundo `gold-light`
   - Badge "Testimonials" no topo
   - Heading serif + subtítulo descritivo
   - Layout: badge Google à esquerda + carrossel Embla à direita
   - Cards com avatar circular (inicial do nome), nome truncado, ícone Google, tempo relativo, 5 estrelas + verified badge, texto truncado com "Read more"
   - Setas de navegação prev/next

2. **Usar o componente Carousel existente** (`src/components/ui/carousel.tsx`) com Embla para o carrossel responsivo (3 cards desktop, 1 mobile).

3. **Manter os 8 reviews reais** como dados estáticos — sem dependência de API externa, sem custo, sem rate limits.

### Resultado
Visualmente idêntico a um widget de Google Reviews real, mas com controle total sobre o conteúdo e zero dependências externas.

