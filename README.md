# Portal Duo — portal de clientes para agência de marketing

Portal onde os clientes de uma agência de marketing digital acompanham o
trabalho da semana: calendário de posts, aprovação de conteúdo, pedidos de
alteração, métricas do Instagram e contratos para assinar.

Está publicado no Cloudflare Workers e ligado a um banco Supabase de verdade,
com login, armazenamento de arquivos e permissões por cliente.

> **Feito do zero em 4 dias** (17 a 20 ago 2026, 63 commits), com o
> [Claude Code](https://claude.com/claude-code) como par de programação.
> Eu defini o produto, as regras de negócio e o design e revisei cada entrega.
> O agente escreveu o código, guiado pelo [`CLAUDE.md`](CLAUDE.md) do projeto.

---

## O que ele resolve

Tira a aprovação de conteúdo da conversa solta e coloca num fluxo com regra:

- **Um lugar só para aprovar.** Cada post tem versões, histórico e status.
- **Limite de 3 alterações por post.** A quarta é barrada na tela e também
  no banco, por trigger. Não depende de alguém lembrar a regra.
- **Aviso automático no WhatsApp** quando sai conteúdo novo para aprovar ou
  quando o cliente responde. Isso é feito por uma Edge Function disparada por
  webhook do banco, então funciona mesmo com o portal fechado.

## O que tem dentro

| Área | O que faz |
| --- | --- |
| Calendário | Semana por cliente, posts por tipo (Carrossel, Reels, Story, Gravação) |
| Aprovação | Rascunho → Enviado → Aprovado / Alteração solicitada / Limite atingido → Publicado |
| Arquivos | Upload de imagem e vídeo para o Supabase Storage |
| Liberar espaço | Depois de publicado, apaga o material bruto e preserva o registro (o plano grátis tem 1 GB) |
| Métricas | Quatro indicadores do Instagram, com gráficos (Recharts) em painel escuro |
| Documentos | Contratos com assinatura no portal, guardados para sempre |
| Acessos | Dois papéis, `adm` (equipe) e `cliente`, com login pelo Supabase Auth |

## Decisões que importam

**Isolamento por cliente fica no banco, não na tela.** Toda tabela tem RLS
filtrando por `cliente_id`. Um cliente não vê dado de outro nem chamando a
API direto. O [`AUDITORIA-SEGURANCA.sql`](AUDITORIA-SEGURANCA.sql) confere
isso política por política.

**Regra de negócio crítica vive em trigger e função SQL.** O limite de
alterações e a limpeza do Storage são funções no Postgres. Assim o front e o
banco não podem discordar.

**Hospedagem no Cloudflare Workers (plano grátis).** O plano gratuito da
Vercel proíbe uso comercial, e um portal de clientes pagantes é uso comercial.
A análise está em [`SUBIR-DE-GRACA.md`](SUBIR-DE-GRACA.md).

**Um Design DNA versionado.** O [`DESIGN-DNA.json`](DESIGN-DNA.json)
registra paleta, tipografia, relevo (neumorfismo) e regras de uso. Depois ele
foi aplicado como régua sobre o próprio código para corrigir os desvios
(commit "Aplica o próprio DNA como régua").

## Como a IA entrou no processo

- **[`CLAUDE.md`](CLAUDE.md)** é o "contrato" com o agente: quem é o usuário,
  regras de design e de negócio que não se negociam, cuidados com dados
  reais e como editar um arquivo de 200 KB sem quebrar nada.
- **Commits pequenos e descritivos**, um por mudança, para cada passo poder
  ser revisado e desfeito.
- **Documentação escrita para leigo** ([`COMO-RODAR.md`](COMO-RODAR.md),
  [`como-colocar-no-ar.md`](como-colocar-no-ar.md)), porque quem opera o
  portal na agência não é programador.

## Stack

React 18 · Vite · Recharts · Supabase (Postgres, Auth, Storage, RLS, Edge
Functions em Deno) · WhatsApp Cloud API · Cloudflare Workers

## Rodando localmente

```bash
npm install
cp .env.example .env   # preencha com a URL e a chave "publishable" do seu Supabase
npm run dev            # http://localhost:5174
```

O esquema do banco está em [`RODAR-NO-SUPABASE.sql`](RODAR-NO-SUPABASE.sql),
para colar no SQL Editor do Supabase.

---

*Os dados de clientes, e-mails e identificadores do projeto foram trocados por
valores de exemplo nesta versão pública.*
