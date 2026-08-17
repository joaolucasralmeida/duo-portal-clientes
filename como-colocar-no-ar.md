# Como colocar o Portal Duo no ar

## Primeiro, a verdade sobre onde você está

O arquivo que construímos é o **site inteiro por fora**: todas as telas, todos os botões, todas as regras de negócio. Isso costuma ser 60–70% do trabalho de um projeto desses, e já está feito.

O que falta é o **por dentro**: hoje os dados vivem na memória do navegador e somem quando você atualiza a página. Para o cliente usar de verdade, cada botão precisa deixar de mexer numa lista em memória e passar a gravar num banco de dados na internet.

Isso não é um ajuste — é a etapa de programação de verdade. Seja honesto consigo mesmo sobre isso na hora de escolher o caminho abaixo.

---

## O que é banco de dados (em 30 segundos)

Pense num arquivo do Excel guardado na nuvem, com uma aba para cada coisa: uma aba "clientes", uma "posts", uma "documentos". Quando o cliente clica em Aprovar, o site vai lá e muda uma célula. Quando ele abre o portal amanhã, o site lê essas abas de novo — por isso a informação não some.

A diferença para o Excel é que o banco tem **regras de quem pode ver o quê**. É isso que impede o Brownie Brasileiro de conseguir os dados do Café da Serra.

Você não vai escrever essas regras: o arquivo `banco-duo.sql` já tem todas elas prontas.

---

## As três peças

| Peça | Serve para | Custo |
|---|---|---|
| **Supabase** | Banco de dados, login e armazenamento dos vídeos e PDFs | Grátis até 500 MB de banco e 1 GB de arquivos. Depois, US$ 25/mês |
| **Vercel** | Hospedar o site e deixá-lo no ar | Grátis para esse tamanho |
| **Domínio** | `portal.duomarketing.com.br` | R$ 40/ano no Registro.br |

Nos primeiros meses, com 1 ou 2 clientes, você provavelmente não paga nada além do domínio. O ponto de atenção é vídeo: 1 GB acaba rápido com Reels em 4K. Quando apertar, os US$ 25/mês dão 100 GB.

---

## Caminho A — Contratar um desenvolvedor (recomendado)

É o mais seguro, porque contrato assinado e dados de cliente não são lugar para aprender.

**O que você entrega para ele:**
1. O arquivo `portal-duo-marketing.jsx` — as telas prontas
2. O arquivo `banco-duo.sql` — a estrutura do banco
3. Esta frase: *"Preciso que você conecte esse front ao Supabase, com autenticação, upload no Storage e as políticas de RLS que já estão no SQL. O layout não deve mudar."*

**O que esperar:** 2 a 4 semanas de trabalho, algo entre **R$ 4.000 e R$ 9.000** com um freelancer pleno no Brasil. Peça para ele deixar tudo no *seu* GitHub e na *sua* conta Supabase — não na dele. Isso é o que garante que você não fique refém.

Onde procurar: Workana, GetNinjas, grupos de dev no LinkedIn, ou indicação. Peça para ver dois projetos React que ele já pôs no ar.

---

## Caminho B — Você mesmo, com IA escrevendo o código

Viável, e não é loucura. Mas conte com **algumas semanas de noites** e a certeza de que vai travar em coisas que não vai entender.

1. Crie conta no Supabase (supabase.com), projeto novo, região São Paulo.
2. Menu **SQL Editor** → cole o `banco-duo.sql` inteiro → **Run**. Está criado o banco.
3. Siga o rodapé do arquivo: crie os dois buckets em Storage e o seu usuário administrador.
4. Instale o **Claude Code** ou use o **Cursor**. Abra a pasta do projeto e peça, uma tela por vez: *"conecte a tela de Clientes ao Supabase usando as tabelas que já existem"*. Uma por vez, testando cada uma — não peça tudo de uma vez, você não vai conseguir achar o erro.
5. Publique na Vercel conectando o GitHub. A partir daí, todo commit vai pro ar sozinho.

**O aviso sério:** só coloque cliente real no sistema depois que alguém que entende do assunto olhar as regras de acesso. Um vazamento de contrato de cliente é um problema de outra ordem.

---

## Caminho C — Enquanto isso não acontece

Não deixe o Brownie Brasileiro esperando três meses. Um meio-termo que funciona hoje:

- **Notion** ou **Trello** para o calendário e as aprovações (o cliente comenta no card)
- **Google Drive** com uma pasta por cliente para as artes
- **ZapSign** ou **Clicksign** para os contratos — aqui não improvise, contrato precisa de assinatura com validade jurídica, e o plano básico sai por volta de R$ 50/mês

Isso segura a operação e ainda te ensina o que o portal precisa ter de verdade, com cliente usando.

---

## Sobre a assinatura eletrônica

Vale repetir: a assinatura do protótipo registra nome, data e um código. Isso serve como aceite interno e prova de que a pessoa clicou. **Não substitui** uma assinatura com validade jurídica plena.

Para contrato de prestação de serviço, use ZapSign, Clicksign ou D4Sign. Todos têm API, então o portal continua sendo o lugar onde o cliente clica — quem carimba por trás é o provedor.

---

## Uma sugestão de ordem

Não tente subir tudo de uma vez. Nessa ordem você tem algo útil no ar em uma ou duas semanas:

1. **Login + Clientes + Calendário + Aprovações** — é o coração, e é o que o cliente mais usa
2. **Documentos** — depois, junto com o provedor de assinatura
3. **Métricas** — por último, porque enquanto isso você preenche numa planilha sem prejuízo nenhum

O portal já existe. Agora é só ligá-lo na tomada.
