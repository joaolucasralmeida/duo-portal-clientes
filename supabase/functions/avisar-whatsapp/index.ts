// Avisa no WhatsApp quando algo acontece no portal.
//
// Roda no servidor do Supabase, disparado por um webhook do banco. É por isso
// que funciona mesmo com o portal fechado -- o site sozinho não conseguiria,
// porque só existe enquanto alguém está com a página aberta.
//
// As credenciais vêm das variáveis de ambiente configuradas no painel do
// Supabase (Edge Functions > Secrets). Nunca ficam no código nem no GitHub.

const TOKEN = Deno.env.get("WHATSAPP_TOKEN");           // token da Meta
const NUMERO_ID = Deno.env.get("WHATSAPP_NUMERO_ID");   // id do numero remetente
const AVISAR_DUO = Deno.env.get("WHATSAPP_NUMERO_DUO"); // celular da equipe, com DDI: 5528999999999

// Envia usando um MODELO aprovado pela Meta. Mensagem iniciada por empresa
// exige modelo aprovado -- texto livre so e permitido dentro de 24h apos a
// pessoa ter escrito para voce.
async function enviar(paraNumero: string, modelo: string, variaveis: string[]) {
  if (!TOKEN || !NUMERO_ID) {
    console.error("Faltam WHATSAPP_TOKEN ou WHATSAPP_NUMERO_ID nos secrets.");
    return { ok: false, motivo: "credenciais ausentes" };
  }
  if (!paraNumero) return { ok: false, motivo: "sem numero de destino" };

  const resposta = await fetch(`https://graph.facebook.com/v21.0/${NUMERO_ID}/messages`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: paraNumero.replace(/\D/g, ""),
      type: "template",
      template: {
        name: modelo,
        language: { code: "pt_BR" },
        components: [{ type: "body", parameters: variaveis.map((t) => ({ type: "text", text: t })) }],
      },
    }),
  });

  const corpo = await resposta.text();
  if (!resposta.ok) console.error("WhatsApp recusou:", resposta.status, corpo);
  return { ok: resposta.ok, corpo };
}

Deno.serve(async (req) => {
  try {
    const evento = await req.json();
    const novo = evento.record ?? {};
    const velho = evento.old_record ?? {};

    // So interessa quando o status muda. Edicao de titulo ou legenda nao
    // deve gerar aviso, senao vira spam e a pessoa silencia a conversa.
    if (novo.status === velho.status) return new Response("sem mudanca de status", { status: 200 });

    const titulo = novo.titulo ?? "conteudo";
    const codigo = novo.codigo ?? "";

    // Para o cliente: saiu material novo para ele olhar.
    if (novo.status === "aguardando") {
      const tel = await telefoneDoCliente(novo.cliente_id);
      await enviar(tel, "conteudo_para_aprovar", [titulo, codigo]);
    }

    // Para a Duo: o cliente respondeu. Esta e a metade que o portal sozinho
    // nao conseguia entregar, porque depende do cliente e nao de quem envia.
    if (novo.status === "aprovado") {
      await enviar(AVISAR_DUO ?? "", "cliente_respondeu", [titulo, "aprovou"]);
    }
    if (novo.status === "ajuste") {
      await enviar(AVISAR_DUO ?? "", "cliente_respondeu", [titulo, "pediu alteracao"]);
    }

    return new Response("ok", { status: 200 });
  } catch (e) {
    console.error("Falhou:", e);
    // Devolve 200 de proposito: se devolvesse erro, o banco tentaria de novo
    // e o cliente receberia a mesma mensagem varias vezes.
    return new Response("erro tratado", { status: 200 });
  }
});

async function telefoneDoCliente(clienteId: string): Promise<string> {
  const url = Deno.env.get("SUPABASE_URL");
  const chave = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !chave || !clienteId) return "";
  const r = await fetch(`${url}/rest/v1/clientes?id=eq.${clienteId}&select=telefone`, {
    headers: { apikey: chave, Authorization: `Bearer ${chave}` },
  });
  const linhas = await r.json();
  return linhas?.[0]?.telefone ?? "";
}
