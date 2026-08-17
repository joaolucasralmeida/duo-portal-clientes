# Subir o portal sem pagar nada

Dá para deixar tudo no ar por **R$ 0 por mês**. Mas existem duas coisas
diferentes que podem "subir", e elas custam esforços muito diferentes.

---

## As duas coisas

**1. O protótipo, como demonstração.** É o que existe hoje. Sobe em uns 20
minutos. Serve para mandar o link para o Brownie Brasileiro e dizer "olha como
vai ser". Os dados continuam sumindo quando atualiza a página, e o login é
de mentira.

**2. O portal funcionando de verdade.** Precisa da ligação com o Supabase antes
— aquele trabalho de tela por tela. A hospedagem em si continua de graça; o que
custa é o tempo de programação.

A hospedagem é a mesma nos dois casos. Então nada do que a gente montar agora
é retrabalho.

---

## O que custa o quê

| Peça | Serviço | Custo |
|---|---|---|
| Hospedagem do site | Cloudflare Pages | **R$ 0**, sem limite de visitas |
| Banco, login e arquivos | Supabase (plano free) | **R$ 0** até 500 MB de banco e 1 GB de arquivos |
| Endereço na internet | `portal-duo.pages.dev` | **R$ 0** |
| Endereço próprio (opcional) | `portal.duomarketing.com.br` | R$ 40/ano no Registro.br |

Total de verdade: **zero**, se aceitar o endereço `.pages.dev`. O domínio próprio
é a única coisa que custa, e é opcional — dá para adicionar depois sem refazer
nada.

---

## Por que Cloudflare e não Vercel

O guia antigo (`como-colocar-no-ar.md`) recomendava a Vercel. Vale corrigir:

**O plano gratuito da Vercel é só para uso não comercial.** Está nos termos de
uso deles. Um portal onde clientes que te pagam acompanham o trabalho é uso
comercial — então, na Vercel, o caminho certo seria o plano pago, US$ 20/mês.

O plano gratuito do **Cloudflare Pages permite uso comercial** e não tem limite
de banda. Para o seu caso é melhor e é de graça de verdade. A Netlify também
serve, com a mesma regra.

Isso não muda nada no código. O projeto que está montado funciona igual nos três.

---

## Onde o "grátis" aperta

Vale saber antes, não depois:

- **Vídeo é o problema, não o site.** 1 GB de arquivos acaba rápido com Reels em
  4K. O botão "Liberar espaço" do portal existe justamente por isso. Quando
  apertar, os US$ 25/mês do Supabase dão 100 GB.
- **O Supabase tem limite de tráfego de 5 GB por mês** no plano free. Cliente
  assistindo vídeo consome isso. Com dois clientes, folgado; com dez, não.
- **Projeto Supabase gratuito hiberna depois de 7 dias sem ninguém acessar.**
  Volta com um clique, mas o cliente pega tela de erro nesse meio tempo. Com
  cliente usando toda semana, não acontece.

---

## O que só você pode fazer

Eu faço a configuração toda, mas **não posso criar conta no seu nome nem digitar
senha sua**. Então preciso que você crie três contas — todas gratuitas, todas
com "entrar com o Google" usando seu Gmail:

1. **GitHub** (github.com) — é onde o código fica guardado. É daqui que a
   hospedagem puxa o site.
2. **Cloudflare** (dash.cloudflare.com) — a hospedagem.
3. **Supabase** (supabase.com) — o banco. Só precisa quando formos para a etapa 2;
   na hora de criar o projeto, escolha a região **São Paulo**.

Nenhuma delas pede cartão de crédito no plano gratuito.

Quando as duas primeiras estiverem criadas, me avise. Eu subo o código, ligo a
hospedagem no repositório e te mando o link funcionando. Depois disso, toda vez
que eu mexer no portal, o site no ar se atualiza sozinho.

---

## Antes de mandar o link para um cliente

Se for só para você ver, tanto faz. Mas se for mandar para o Brownie
Brasileiro, pense em duas coisas:

- **A tela de login mostra as senhas de teste.** É proposital, ajuda a demonstrar.
  Mas se você quiser que pareça um sistema de verdade, eu tiro esse quadro antes
  de subir. É rápido.
- **O link é público para quem tiver o endereço.** Não tem senha de verdade
  protegendo. Como os dados são todos fictícios, não é um risco — mas não coloque
  nada real ali enquanto for protótipo.
