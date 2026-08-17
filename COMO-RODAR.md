# Como abrir o Portal Duo no seu computador

## O que você faz

Dois cliques em **`ABRIR-PORTAL.bat`**.

Abre uma janela preta com letras — é o motor do portal, deixe aberta. Alguns
segundos depois o navegador abre sozinho no portal. Entre com um dos acessos de
teste, por exemplo `gabriele` / `demo-equipe`.

Para desligar, feche a janela preta.

É isso. Você não precisa digitar comando nenhum.

---

## O que já está instalado

O Node.js já foi instalado nesta máquina (versão 24.19.0), na sua conta de
usuário — não precisou de senha de administrador. É o programa que monta o site
a partir do código. Você não interage com ele; quem usa sou eu.

As bibliotecas do projeto também já foram baixadas, na pasta `node_modules`.
Ela tem milhares de arquivos e não vai para o GitHub.

---

## O que esperar quando abrir

- **Os dados somem quando você atualiza a página.** Não é defeito. É o estado do
  projeto: nada está gravado em banco ainda. É exatamente isso que a próxima
  etapa resolve.
- **A tela atualiza sozinha quando eu mexo no código.** Se você deixar o portal
  aberto enquanto trabalhamos, cada mudança aparece na hora, sem você fechar e
  abrir nada.

---

## Se der errado

| O que aparece | O que fazer |
|---|---|
| "Nao encontrei o Node.js" | Me avise. O Node saiu do lugar e eu reinstalo. |
| A janela preta abre e fecha na hora | Me avise e diga o que apareceu escrito, mesmo que rápido. |
| "Port 5174 is already in use" | Já tem outra janela preta aberta. Feche a antiga. |
| O navegador não abre sozinho | Digite `localhost:5174` na barra de endereço. |

Em qualquer caso: tire uma foto ou print da janela preta e me mande. O texto de
erro dela diz exatamente o que houve.

---

## O plano B

Existe um segundo atalho, **`ABRIR-SEM-NODE.bat`**. Ele abre o portal em um
computador que não tem o Node instalado — o da Gabriele, ou um notebook que você
leve para mostrar a um cliente. É mais lento, precisa de internet, mas não
instala nada na máquina do outro.

Você não precisa dele aqui. Está guardado para quando fizer falta.

---

## Onde o projeto mora

`C:\Users\usuario\Documents\portal-duo` — uma pasta local, fora do OneDrive.

Saiu do OneDrive porque a sincronização atrapalhava de verdade: ela segurava
arquivos abertos e travou duas ferramentas do projeto. Além disso, a pasta
`node_modules` tem milhares de arquivos que o OneDrive tentava sincronizar à toa.

---

## Trabalhar de casa

**Para só ver o portal, não precisa de nada.** Ele está na internet:
https://portal-duo-marketing.joaolucasralmeida.workers.dev — abre de qualquer
computador ou celular.

**Para mexer no projeto de casa**, o lugar dos arquivos é o **GitHub**, não uma
pasta sincronizada. Ele já guarda tudo, com histórico de cada alteração:
https://github.com/joaolucasralmeida/portal-duo-marketing

Não use Google Drive, Dropbox ou OneDrive para isso. Não é preciosismo — esses
serviços sincronizam arquivo por arquivo, e o projeto tem milhares deles. Pior:
se as duas máquinas mexerem ao mesmo tempo, o histórico do projeto corrompe. O
GitHub foi feito exatamente para esse problema.

No computador de casa, uma vez só:

1. Instalar o Node (mesmo comando: `winget install OpenJS.NodeJS.LTS`)
2. Instalar o Git e o Claude Code
3. Baixar o projeto: `git clone https://github.com/joaolucasralmeida/portal-duo-marketing.git`

Me chame na hora de fazer isso que eu conduzo — é a mesma sequência que rodamos
aqui.

**Um detalhe que vai te pegar:** o arquivo `.env`, com as chaves do Supabase,
**não vai para o GitHub de propósito** — chave não se guarda em repositório. Em
casa ele não vai existir, e o portal reclama. É rápido de resolver: eu gero um
novo lá, buscando as chaves pela ferramenta do Supabase, igual fiz aqui.

---

## A pasta velha

Sobrou `...\OneDrive\Claude Code` com um arquivo de
configuração dentro. Pode apagar quando quiser — não tem nada do projeto ali.
