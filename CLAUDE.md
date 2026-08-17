# Portal Duo Marketing

## Quem é quem

Rafael é dono da Duo Marketing, agência de marketing digital. Ele é editor e
filmmaker — **não é programador e não sabe banco de dados**. Gabriele, sua sócia,
cuida de social media e design. Cliente atual: Brownie Brasileiro (confeitaria).

**Fale sempre em português do Brasil.** Explique o que você está fazendo em
linguagem comum, sem jargão. Quando precisar que ele rode um comando, escreva o
comando exato e diga onde colar. Nunca assuma que ele sabe o que é terminal,
build, dependência ou variável de ambiente — explique na primeira vez.

## O que é este projeto

Um portal onde os clientes da agência acompanham o trabalho: calendário de posts,
aprovação de conteúdo, métricas do Instagram, e contratos para assinar.

Estado atual: **protótipo de front-end pronto, sem back-end**. Todos os dados
estão em memória dentro do próprio arquivo React — ao recarregar a página, tudo
volta ao ponto inicial. O próximo passo é ligar no Supabase.

## Arquivos

- `portal-duo-marketing.jsx` — o portal inteiro em um único arquivo (~143 KB),
  `export default function PortalDuo()`. Inclui o CSS como template string no fim.
- `banco-duo.sql` — esquema completo do Supabase (versão 2). Ainda não foi rodado.
- `como-colocar-no-ar.md` — guia de deploy escrito para leigo.
- `COMO-RODAR.md` — como abrir o portal na máquina dele, os dois jeitos abaixo.

## Como rodar

**O Rafael não escreve código — quem programa é você.** Ele só dá dois cliques no
`ABRIR-PORTAL.bat` para ver o resultado. Não passe comando de terminal para ele
executar: rode você mesmo. Se precisar da conta dele em algum serviço, aí sim
peça, explicando o porquê.

Node 24.19.0 instalado via `winget --scope user` (sem admin), em
`%LOCALAPPDATA%\Microsoft\WinGet\Packages\OpenJS.NodeJS.LTS_*`. Sessões novas do
Claude Code podem não ter o `npm` no PATH ainda; nesse caso, recarregue com
`$env:Path = [Environment]::GetEnvironmentVariable("Path","User") + ";" + [Environment]::GetEnvironmentVariable("Path","Machine")`.

- **Padrão — Vite:** `npm run dev` na porta **5174**. Não é a 5173 padrão porque
  nesta máquina a 5173 está na lista de portas excluídas do Windows (confira com
  `netsh int ipv4 show excludedportrange protocol=tcp`) e não aceita bind.
- **Plano B — sem Node:** `ABRIR-SEM-NODE.bat` → `servidor.ps1` (servidor
  estático em PowerShell puro, porta 5173 via HTTP.sys, que ignora a exclusão) →
  `sem-instalar.html`, que busca React 18 + Babel no unpkg e transpila o `.jsx`
  no navegador. Para mostrar o portal em máquina alheia. Se mexer no `.jsx` de um
  jeito que dependa de build, confira que esse caminho continua de pé.

O `servidor.ps1` responde `sem-instalar.html` na raiz de propósito — o
`index.html` pertence ao Vite e quebra sem o bundler.

`npm install` avisa que o postinstall do esbuild foi bloqueado (npm 11 barra
scripts por padrão). Pode ignorar: o binário vem pelas dependências opcionais e
o `vite build` funciona.

## Como trabalhar no .jsx

O arquivo é grande. Não leia inteiro nem reescreva do zero. Use `grep -n` para
achar a linha, `sed -n` para ler o trecho, e edite cirurgicamente. Reescrever o
arquivo já quebrou coisas antes.

Valide a sintaxe depois de editar (`esbuild --loader=jsx` resolve rápido).

## Regras de design que não se negociam

- **Fonte do site: Poppins.** Única exceção: a marca "DUO" e o campo de
  assinatura, que usam Jost.
- A marca "DUO" **não é imagem** — é texto CSS com efeito de relevo
  (neumorfismo, Jost weight 300 + text-shadow). Não troque por imagem.
- A logo do Brownie Brasileiro está embutida como base64 na constante `LOGO_BB`.
  Se precisar reconstruir algo, preserve essa constante.
- Paleta, tirada da cor de fundo da logo. Variáveis CSS já definidas:
  `--base #DBD4CE`, `--tinta #35302B`, `--tinta2 #706860`, `--cacau #7A4A22`,
  `--ardosia #4C5A66`, `--sage #55684F`, `--brasa #A4522F`, `--mel #8C6D2E`.
- Estilo visual: neumorfismo. Classes `.rel` (saliente) e `.baixo` (afundado),
  com sombra dupla — luz branca de um lado, sombra bege do outro.
- Cores identificam o **tipo** de post, não o status: Carrossel = cacau,
  Reels = ardósia, Story = sage, Gravação = brasa. Status aparece como pastilha.
- Métricas: **exatamente quatro**. Seguidores, Visualizações, Visitas ao perfil,
  Toques no link da bio. Não adicione outras sem ele pedir.

## Regras de negócio

- Dois tipos de usuário: `adm` (equipe Duo) e `cliente`.
- **Isolamento por cliente é sagrado.** Cliente nunca pode ver dado de outro
  cliente. Isso vale na tela e no banco (RLS). Ao mexer em qualquer consulta,
  confira que o filtro por `cliente_id` continua lá.
- Limite de **3 solicitações de alteração** por post. A quarta é bloqueada na
  tela e também por trigger no banco.
- Fluxo do post: Rascunho → Enviado para aprovação → Aprovado / Alteração
  solicitada / Limite atingido → Publicado.
- Post rascunho é invisível para o cliente. Documento rascunho também.
- **Liberar espaço:** depois de publicado, o adm apaga o material bruto pelo
  botão "Liberar espaço". Os arquivos somem do Storage, mas o post continua
  registrado — título, legenda, versões, alterações e datas ficam. Isso existe
  porque o Storage do Supabase grátis tem só 1 GB e vídeo enche rápido.
- Contrato **nunca** entra na limpeza. Fica guardado para sempre.

## Acessos de teste (dados falsos do protótipo)

| usuário  | senha         | papel                        |
|----------|---------------|------------------------------|
| gabriele | demo-equipe      | adm, Social Media            |
| joao     | demo-equipe      | adm, Editor                  |
| brownie  | demo-cliente  | cliente c1, Brownie Brasileiro |
| cafe     | demo-cliente2     | cliente c2, Café da Serra    |

O login e as senhas do protótipo são simbólicos, sem segurança real. Na versão
com Supabase isso vira Supabase Auth de verdade.

## Para onde o projeto vai

Stack decidida: **Supabase** (banco + login + storage) + hospedagem estática +
domínio no Registro.br.

Sobre a hospedagem, o `como-colocar-no-ar.md` recomendava Vercel — **corrigido
para Cloudflare Pages** (ver `SUBIR-DE-GRACA.md`). O plano gratuito da Vercel é
só para uso não comercial, e um portal de clientes pagantes é uso comercial. O
free do Cloudflare Pages permite uso comercial e não limita banda. Não mude essa
recomendação de volta sem falar com ele.

O trabalho que falta é trocar os dados em memória por chamadas ao Supabase, tela
por tela. Ordem sugerida: login → clientes → calendário/posts → arquivos no
Storage → aprovações → métricas → documentos.

A assinatura eletrônica do protótipo é simbólica e **não tem validade jurídica**.
Para contrato real, integrar ZapSign, Clicksign ou D4Sign.

## Cuidados

- Nunca invente credencial nem chave do Supabase. Peça a ele.
- Antes de mudar login, permissões ou qualquer coisa ligada a contrato, explique
  o risco e espere ele confirmar.
- Se uma mudança apagar dados, avise antes. Ele testa com dados reais de cliente.
