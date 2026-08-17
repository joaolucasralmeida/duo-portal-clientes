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

## Sobre a pasta

O projeto está dentro do **OneDrive do hospital**. Vale mover para uma pasta
pessoal, tipo `C:\Users\usuario\Documentos\portal-duo`. Dois motivos:

1. É projeto da sua agência guardado em conta do trabalho.
2. A pasta `node_modules` tem milhares de arquivos que o OneDrive fica tentando
   sincronizar. Deixa o computador lento e ocupa seu espaço na nuvem à toa.

Se quiser mover, me avise que eu movo — ou recorte e cole a pasta inteira, nada
quebra.
