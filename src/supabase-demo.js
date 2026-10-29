// Modo demonstração: um "Supabase de mentira" que roda no navegador.
//
// Substitui o src/supabase.js só no build de demonstração (vite.demo.config.js).
// Responde às mesmas chamadas que o portal faz (from().select().eq()...,
// auth, storage e rpc) usando tabelas em memória com dados fictícios. Nada sai
// do navegador e nada é gravado: ao recarregar a página, tudo volta ao início.
//
// Para imitar a segurança do banco real (RLS), quem entra como cliente só
// recebe as linhas do próprio cliente, e nunca vê post ou documento rascunho.

const hoje = new Date();
const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const somaDias = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const segunda = somaDias(hoje, -((hoje.getDay() + 6) % 7));
const quando = (dias, hora = "10:00") => {
  const d = somaDias(hoje, dias);
  const [h, m] = hora.split(":").map(Number);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
};

let seq = 1000;
const novoId = () => `demo-${++seq}`;

// Imagem de exemplo para os carrosséis, desenhada aqui mesmo.
const card = (n, titulo, sub, marca) =>
  "data:image/svg+xml;utf8," + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350">' +
    '<rect width="1080" height="1350" fill="#F3EAE0"/><circle cx="880" cy="180" r="230" fill="#E4D3C0"/>' +
    '<rect x="90" y="1090" width="900" height="4" fill="#7A4A22"/>' +
    '<text x="90" y="260" font-family="Georgia,serif" font-size="120" fill="#7A4A22">0' + n + "</text>" +
    '<text x="90" y="640" font-family="Georgia,serif" font-size="86" fill="#2E2823">' + titulo + "</text>" +
    '<text x="90" y="740" font-family="Helvetica,sans-serif" font-size="44" fill="#6B6259">' + sub + "</text>" +
    '<text x="90" y="1180" font-family="Helvetica,sans-serif" font-size="34" letter-spacing="6" fill="#7A4A22">' + marca + "</text></svg>"
  );

/* ------------------------------ dados ------------------------------ */

const USUARIOS = [
  { id: "u-equipe", email: "equipe@demo.com", nome: "Gabriele", cargo: "Social Media · Design", tipo: "adm", cliente_id: null },
  { id: "u-editor", email: "editor@demo.com", nome: "João", cargo: "Editor · Filmmaker", tipo: "adm", cliente_id: null },
  { id: "u-cliente", email: "cliente@demo.com", nome: "Doceria Aurora", cargo: "Cliente", tipo: "cliente", cliente_id: "c1" },
  { id: "u-cliente2", email: "cafe@demo.com", nome: "Café da Serra", cargo: "Cliente", tipo: "cliente", cliente_id: "c2" },
];

const tabelas = {
  perfis: USUARIOS.map(({ id, nome, cargo, tipo, cliente_id }) => ({ id, nome, cargo, tipo, cliente_id })),

  clientes: [
    { id: "c1", nome: "Doceria Aurora", prefixo: "DA", foto_url: null, razao: "Doceria Aurora LTDA (fictícia)",
      cnpj: "00.000.000/0001-00", segmento: "Confeitaria artesanal e delivery", contato: "Ana Souza",
      telefone: "(31) 90000-0000", email: "contato@exemplo.com.br", instagram: "@doceria.aurora",
      endereco: "Belo Horizonte · MG", inicio: "2026-03-02", plano: "Social + vídeo · 12 posts e 1 diária por mês",
      obs: "Aprovação sempre com a Ana.", criado_em: quando(-200) },
    { id: "c2", nome: "Café da Serra", prefixo: "CS", foto_url: null, razao: "Café da Serra ME (fictícia)",
      cnpj: "", segmento: "Cafeteria", contato: "Bruno Lima", telefone: "(31) 90000-0001",
      email: "oi@exemplo.com", instagram: "@cafe.daserra", endereco: "Nova Lima · MG",
      inicio: "2026-07-01", plano: "Social · 8 posts por mês", obs: "", criado_em: quando(-120) },
  ],

  semanas: [
    { id: "s1", cliente_id: "c1", inicio: iso(segunda) },
    { id: "s2", cliente_id: "c1", inicio: iso(somaDias(segunda, 7)) },
    { id: "s3", cliente_id: "c2", inicio: iso(segunda) },
  ],

  posts: [
    { id: "p1", codigo: "DA-041", cliente_id: "c1", semana_id: "s1", dia: 0, hora: "18:30", tipo: "Carrossel",
      titulo: "5 sinais de que o brownie é de verdade", formato: "1080 × 1350 · 6 cards", versao: 1, status: "aguardando",
      legenda: "Casquinha que quebra, miolo que puxa. Se não tem isso, não é brownie — é bolinho de chocolate.",
      obs: "Publicar junto com o story de bastidor.", criado_em: quando(-3) },
    { id: "p2", codigo: "DA-042", cliente_id: "c1", semana_id: "s1", dia: 1, hora: "12:00", tipo: "Reels",
      titulo: "Bastidores: a hora do corte", formato: "1080 × 1920 · 24s", versao: 2, status: "ajuste",
      legenda: "O barulho da faca entrando no brownie ainda quente. Sobe o som.", obs: "", criado_em: quando(-4) },
    { id: "p3", codigo: "DA-043", cliente_id: "c1", semana_id: "s1", dia: 2, hora: "10:00", tipo: "Story",
      titulo: "Enquete: nozes sim ou nozes não", formato: "1080 × 1920 · 3 telas", versao: 1, status: "aprovado",
      legenda: "Responde aí que a gente decide o sabor do mês pela enquete.", obs: "", criado_em: quando(-3) },
    { id: "p4", codigo: "DA-044", cliente_id: "c1", semana_id: "s1", dia: 3, hora: "19:00", tipo: "Reels",
      titulo: "Recheio em close · 4K", formato: "1080 × 1920 · 18s", versao: 1, status: "rascunho",
      legenda: "Sem trilha, sem corte rápido. Só o recheio escorrendo em câmera lenta.", obs: "Gravar com a luz da tarde.", criado_em: quando(-1) },
    { id: "p5", codigo: "DA-039", cliente_id: "c1", semana_id: "s1", dia: 4, hora: "18:30", tipo: "Carrossel",
      titulo: "Como conservar por 5 dias", formato: "1080 × 1350 · 5 cards", versao: 3, status: "publicado",
      legenda: "Geladeira não. Explicamos o porquê no card 3.", obs: "", criado_em: quando(-8) },
    { id: "p6", codigo: "DA-045", cliente_id: "c1", semana_id: "s1", dia: 5, hora: "09:00 – 13:00", tipo: "Gravação",
      titulo: "Diária de gravação na loja", formato: "Presencial · 4h", versao: 1, status: "agendado",
      legenda: "Pauta: linha nova de recheios, 2 receitas em bancada e depoimento de cliente.", obs: "Levar 6 unidades de cada sabor.", criado_em: quando(-6) },
    { id: "p7", codigo: "DA-046", cliente_id: "c1", semana_id: "s2", dia: 1, hora: "18:00", tipo: "Carrossel",
      titulo: "Linha nova de recheios", formato: "1080 × 1350 · 4 cards", versao: 1, status: "rascunho",
      legenda: "Apresentação dos três sabores novos, um card por sabor.", obs: "", criado_em: quando(0) },
    { id: "p8", codigo: "CS-012", cliente_id: "c2", semana_id: "s3", dia: 2, hora: "08:00", tipo: "Reels",
      titulo: "O primeiro café da manhã", formato: "1080 × 1920 · 15s", versao: 1, status: "aguardando",
      legenda: "Vapor subindo da xícara na varanda, som ambiente da serra.", obs: "", criado_em: quando(0) },
  ],

  alteracoes: [
    { id: "a1", post_id: "p2", numero: 1, motivo: "Marca aparece errada", pedido: "A embalagem no segundo 8 é a antiga. Trocar pela nova e deixar a logo maior no final." },
    { id: "a2", post_id: "p5", numero: 1, motivo: "Texto confuso", pedido: "O card 3 ficou técnico demais. Falar mais simples." },
    { id: "a3", post_id: "p5", numero: 2, motivo: "Erro de informação", pedido: "São 5 dias, não 7. Corrigir no card 1 e na legenda." },
  ],

  post_arquivos: [
    { id: "f1", post_id: "p1", ordem: 1, nome: "01_capa.jpg", tipo: "imagem", tamanho: 1400000, caminho: "demo/p1/01.svg", removido_em: null },
    { id: "f2", post_id: "p1", ordem: 2, nome: "02_miolo.jpg", tipo: "imagem", tamanho: 1300000, caminho: "demo/p1/02.svg", removido_em: null },
    { id: "f3", post_id: "p1", ordem: 3, nome: "03_corte.jpg", tipo: "imagem", tamanho: 1350000, caminho: "demo/p1/03.svg", removido_em: null },
  ],

  post_historico: [
    { id: "h1", post_id: "p1", texto: "Versão 1 enviada para aprovação", autor: "Gabriele", criado_em: quando(-2, "14:20") },
    { id: "h2", post_id: "p2", texto: "Versão 1 enviada para aprovação", autor: "João", criado_em: quando(-4, "09:10") },
    { id: "h3", post_id: "p2", texto: "Alteração 1 solicitada pelo cliente", autor: "Doceria Aurora", criado_em: quando(-4, "19:44") },
    { id: "h4", post_id: "p3", texto: "Aprovado pelo cliente", autor: "Doceria Aurora", criado_em: quando(-3, "15:30") },
    { id: "h5", post_id: "p5", texto: "Publicado no Instagram", autor: "Gabriele", criado_em: quando(-5, "18:30") },
  ],

  documentos: [
    { id: "d1", cliente_id: "c1", nome: "Contrato de prestação de serviços", tipo: "Contrato", exige_assinatura: true,
      status: "assinado", arquivo_nome: "contrato-demo.pdf", arquivo_caminho: null, enviado_em: "2026-03-02",
      assinado_em: "2026-03-04T10:22:00", assinante_nome: "Ana Souza", assinatura_codigo: "DUO-3F91A7C2",
      recusa_motivo: null, criado_em: quando(-200) },
    { id: "d2", cliente_id: "c1", nome: "Aditivo · diária extra de gravação", tipo: "Aditivo", exige_assinatura: true,
      status: "aguardando", arquivo_nome: "aditivo-demo.pdf", arquivo_caminho: null, enviado_em: iso(somaDias(hoje, -2)),
      assinado_em: null, assinante_nome: null, assinatura_codigo: null, recusa_motivo: null, criado_em: quando(-2) },
    { id: "d3", cliente_id: "c2", nome: "Contrato de prestação de serviços", tipo: "Contrato", exige_assinatura: true,
      status: "aguardando", arquivo_nome: "contrato-cafe-demo.pdf", arquivo_caminho: null, enviado_em: iso(somaDias(hoje, -5)),
      assinado_em: null, assinante_nome: null, assinatura_codigo: null, recusa_motivo: null, criado_em: quando(-5) },
  ],

  metricas: ["c1", "c2"].flatMap((c) =>
    ["Seguidores", "Visualizações", "Visitas ao perfil", "Toques no link da bio"].map((nome, i) => ({
      id: `${c}-m${i}`, cliente_id: c, nome, unidade: null, ordem: i,
    }))),

  metrica_periodos: [
    { id: "r1", cliente_id: "c1", periodo: "Início do contrato", data: "2026-03-02" },
    { id: "r2", cliente_id: "c1", periodo: "Maio 2026", data: "2026-05-31" },
    { id: "r3", cliente_id: "c1", periodo: "Julho 2026", data: "2026-07-31" },
    { id: "r4", cliente_id: "c1", periodo: "Setembro 2026", data: "2026-09-30" },
    { id: "r5", cliente_id: "c2", periodo: "Início do contrato", data: "2026-07-01" },
    { id: "r6", cliente_id: "c2", periodo: "Setembro 2026", data: "2026-09-30" },
  ],

  metrica_valores: [
    ["r1", "c1", [2840, 11200, 640, 48]],
    ["r2", "c1", [5120, 34600, 1890, 173]],
    ["r3", "c1", [8930, 72400, 3410, 386]],
    ["r4", "c1", [11480, 98100, 4620, 512]],
    ["r5", "c2", [1210, 5400, 310, 22]],
    ["r6", "c2", [2060, 13900, 720, 61]],
  ].flatMap(([periodo_id, c, valores]) =>
    valores.map((valor, i) => ({ periodo_id, metrica_id: `${c}-m${i}`, valor }))),
};

const arquivosDemo = {
  "demo/p1/01.svg": card(1, "A casquinha", "Ela quebra. Sempre.", "DOCERIA AURORA"),
  "demo/p1/02.svg": card(2, "O miolo", "Úmido, nunca cru.", "DOCERIA AURORA"),
  "demo/p1/03.svg": card(3, "O corte", "Sem farelo pelo prato.", "DOCERIA AURORA"),
};

/* ------------------------------ sessão ----------------------------- */

const CHAVE = "portal-duo-demo-sessao";
const lerSessao = () => {
  try { return JSON.parse(sessionStorage.getItem(CHAVE) || "null"); } catch { return null; }
};
let sessao = lerSessao();
const gravarSessao = (s) => {
  sessao = s;
  try { s ? sessionStorage.setItem(CHAVE, JSON.stringify(s)) : sessionStorage.removeItem(CHAVE); } catch { /* sem storage */ }
};

// O que um cliente enxerga. No banco real, quem faz isso são as políticas RLS.
const visivel = (tabela, linha) => {
  const u = sessao && USUARIOS.find((x) => x.id === sessao.user.id);
  if (!u || u.tipo === "adm") return true;
  const c = u.cliente_id;
  const postOk = (id) => { const p = tabelas.posts.find((x) => x.id === id); return p && p.cliente_id === c && p.status !== "rascunho"; };
  switch (tabela) {
    case "perfis": return linha.id === u.id;
    case "clientes": return linha.id === c;
    case "posts": return linha.cliente_id === c && linha.status !== "rascunho";
    case "documentos": return linha.cliente_id === c && linha.status !== "rascunho";
    case "alteracoes": case "post_arquivos": case "post_historico": return postOk(linha.post_id);
    case "metrica_valores": return tabelas.metrica_periodos.some((p) => p.id === linha.periodo_id && p.cliente_id === c);
    default: return linha.cliente_id === undefined || linha.cliente_id === c;
  }
};

/* --------------------------- consultas ----------------------------- */

class Consulta {
  constructor(tabela) {
    this.tabela = tabela;
    this.op = "select";
    this.filtros = [];
    this.ordem = null;
    this.umSo = false;
    this.dados = null;
    this.devolver = false;
  }
  select() { if (this.op !== "select") this.devolver = true; return this; }
  insert(linhas) { this.op = "insert"; this.dados = [].concat(linhas); return this; }
  upsert(linhas) { this.op = "upsert"; this.dados = [].concat(linhas); return this; }
  update(campos) { this.op = "update"; this.dados = campos; return this; }
  delete() { this.op = "delete"; return this; }
  eq(col, val) { this.filtros.push((l) => l[col] === val); return this; }
  neq(col, val) { this.filtros.push((l) => l[col] !== val); return this; }
  is(col, val) { this.filtros.push((l) => (l[col] ?? null) === val); return this; }
  in(col, vals) { this.filtros.push((l) => vals.includes(l[col])); return this; }
  order(col, { ascending = true } = {}) { this.ordem = { col, ascending }; return this; }
  single() { this.umSo = true; return this; }
  maybeSingle() { this.umSo = true; return this; }

  executar() {
    const t = (tabelas[this.tabela] ||= []);
    const passa = (l) => this.filtros.every((f) => f(l));
    let linhas = [];

    if (this.op === "select") {
      linhas = t.filter((l) => visivel(this.tabela, l) && passa(l));
      if (this.ordem) {
        const { col, ascending } = this.ordem;
        linhas = [...linhas].sort((a, b) => String(a[col] ?? "").localeCompare(String(b[col] ?? ""), "pt-BR", { numeric: true }) * (ascending ? 1 : -1));
      }
    } else if (this.op === "insert") {
      linhas = this.dados.map((d) => ({ id: novoId(), criado_em: new Date().toISOString(), ...d }));
      if (this.tabela === "posts") linhas.forEach((l) => { l.codigo ||= `DEMO-${String(seq).slice(-3)}`; l.versao ||= 1; });
      t.push(...linhas);
    } else if (this.op === "upsert") {
      this.dados.forEach((d) => {
        const i = t.findIndex((l) => l.periodo_id === d.periodo_id && l.metrica_id === d.metrica_id);
        if (i >= 0) t[i] = { ...t[i], ...d }; else t.push({ ...d });
      });
      linhas = this.dados;
    } else if (this.op === "update") {
      t.forEach((l, i) => { if (passa(l)) { t[i] = { ...l, ...this.dados }; linhas.push(t[i]); } });
    } else if (this.op === "delete") {
      linhas = t.filter(passa);
      tabelas[this.tabela] = t.filter((l) => !passa(l));
    }

    const data = this.op === "select" || this.devolver ? (this.umSo ? linhas[0] ?? null : linhas) : null;
    return { data, error: null };
  }

  then(ok, falha) { return Promise.resolve().then(() => this.executar()).then(ok, falha); }
}

/* ------------------------------ cliente ---------------------------- */

const ouvintes = new Set();

export const supabase = {
  from: (tabela) => new Consulta(tabela),

  rpc: async (nome, args = {}) => {
    if (nome === "listar_acessos") {
      return {
        data: USUARIOS.map((u) => ({ id: u.id, nome: u.nome, cargo: u.cargo, tipo: u.tipo, email: u.email, cliente_id: u.cliente_id, ultimo_acesso: quando(-1, "09:12") })),
        error: null,
      };
    }
    if (nome === "liberar_espaco_post") {
      const arqs = tabelas.post_arquivos.filter((a) => a.post_id === args.p_post && !a.removido_em);
      arqs.forEach((a) => { a.removido_em = new Date().toISOString(); });
      return { data: arqs.map((a) => a.caminho), error: null };
    }
    return { data: null, error: null };
  },

  storage: {
    from: () => ({
      upload: async (caminho, arquivo) => {
        try { arquivosDemo[caminho] = URL.createObjectURL(arquivo); } catch { /* ignora */ }
        return { data: { path: caminho }, error: null };
      },
      remove: async () => ({ data: [], error: null }),
      createSignedUrls: async (caminhos) => ({
        data: caminhos.map((path) => ({ path, signedUrl: arquivosDemo[path] || null })),
        error: null,
      }),
    }),
  },

  auth: {
    getSession: async () => ({ data: { session: sessao }, error: null }),
    onAuthStateChange: (fn) => {
      ouvintes.add(fn);
      return { data: { subscription: { unsubscribe: () => ouvintes.delete(fn) } } };
    },
    // Na demonstração qualquer senha serve: o que decide o papel é o e-mail.
    signInWithPassword: async ({ email }) => {
      const u = USUARIOS.find((x) => x.email === email);
      if (!u) return { data: null, error: { status: 400, message: "Use um dos e-mails da demonstração." } };
      const s = { user: { id: u.id, email: u.email, user_metadata: { full_name: u.nome } } };
      gravarSessao(s);
      ouvintes.forEach((f) => f("SIGNED_IN", s));
      return { data: { user: s.user, session: s }, error: null };
    },
    signOut: async () => { gravarSessao(null); ouvintes.forEach((f) => f("SIGNED_OUT", null)); return { error: null }; },
    updateUser: async () => ({ data: {}, error: null }),
    resetPasswordForEmail: async () => ({ data: {}, error: null }),
  },
};
