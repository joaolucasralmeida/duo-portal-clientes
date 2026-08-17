import React, { useState, useEffect, useMemo } from "react";

/* ------------------------------------------------------------------ */
/*  DUO MARKETING — Portal do Cliente                                  */
/*  Protótipo navegável. Dados em memória (reinicia ao recarregar).    */
/* ------------------------------------------------------------------ */

const LOGO_BB = "data:image/png;base64,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";

const MAX_AJUSTES = 3;
const MAX_TENTATIVAS = 5;
const BLOQUEIO_SEG = 60;

const SIGLAS = ["SEG", "TER", "QUA", "QUI", "SEX", "SÁB", "DOM"];
const MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

const TIPOS = [
  { nome: "Carrossel", formato: "1080 × 1350 · 6 cards" },
  { nome: "Reels", formato: "1080 × 1920 · 20s" },
  { nome: "Story", formato: "1080 × 1920 · 3 telas" },
  { nome: "Gravação", formato: "Presencial · 4h" },
];

const STATUS_LABEL = {
  rascunho: "Rascunho",
  aguardando: "Enviado para aprovação",
  aprovado: "Aprovado",
  ajuste: "Alteração solicitada",
  limite: "Limite de alterações atingido",
  publicado: "Publicado",
  agendado: "Agendado",
};

const DOC_LABEL = {
  rascunho: "Rascunho",
  enviado: "Enviado",
  aguardando: "Aguardando assinatura",
  assinado: "Assinado",
  recusado: "Recusado",
};

const MOTIVOS = ["Erro de informação", "Marca aparece errada", "Texto confuso", "Ritmo / corte do vídeo", "Não combina com a marca"];

const statusVisivel = (i) =>
  i.status === "aguardando" && i.ajustes.length >= MAX_AJUSTES ? "limite" : i.status;

/* ---------------------------- datas -------------------------------- */

const paraData = (iso) => { const [a, m, d] = iso.split("-").map(Number); return new Date(a, m - 1, d); };
const paraIso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const somaDias = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const segundaDe = (d) => somaDias(d, -((d.getDay() + 6) % 7));
const dataCurta = (iso) => { if (!iso) return "—"; const d = paraData(iso); return `${d.getDate()} ${MESES[d.getMonth()].slice(0, 3)} ${d.getFullYear()}`; };

const diasDaSemana = (semana) =>
  !semana ? [] : Array.from({ length: 7 }, (_, i) => {
    const d = somaDias(paraData(semana.inicio), i);
    return { sigla: SIGLAS[i], num: String(d.getDate()).padStart(2, "0"), data: d };
  });

const tituloSemana = (semana) => {
  if (!semana) return "";
  const a = paraData(semana.inicio), b = somaDias(a, 6);
  return a.getMonth() === b.getMonth()
    ? `Semana de ${a.getDate()} a ${b.getDate()} de ${MESES[a.getMonth()]}`
    : `Semana de ${a.getDate()} de ${MESES[a.getMonth()]} a ${b.getDate()} de ${MESES[b.getMonth()]}`;
};
const semanaCurta = (s) => { const a = paraData(s.inicio), b = somaDias(a, 6); return `${a.getDate()}–${b.getDate()} ${MESES[b.getMonth()].slice(0, 3)}`; };
const contemHoje = (s) => { const a = paraData(s.inicio), b = somaDias(a, 7); const h = new Date(); const hoje = new Date(h.getFullYear(), h.getMonth(), h.getDate()); return hoje >= a && hoje < b; };
const slug = (t) => t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s/g, "");
const num = (v) => (v === null || v === undefined || v === "" ? "—" : Number(v).toLocaleString("pt-BR"));

/* --------------------------- dados iniciais ------------------------- */

const SEM_ATUAL = paraIso(segundaDe(new Date()));
const SEM_PROX = paraIso(somaDias(segundaDe(new Date()), 7));

const CLIENTES_INICIAIS = [
  {
    id: "c1", nome: "Brownie Brasileiro", prefixo: "BB", foto: LOGO_BB,
    razao: "Brownie Brasileiro Confeitaria LTDA", cnpj: "00.000.000/0001-00",
    segmento: "Confeitaria artesanal e delivery", contato: "Ana Souza",
    telefone: "(31) 90000-0000", email: "contato@exemplo.com.br",
    instagram: "@browniebrasileiro", endereco: "Belo Horizonte · MG",
    inicio: "2026-03-02", plano: "Social + vídeo · 12 posts e 1 diária por mês",
    obs: "Nunca usar a embalagem antiga em material novo. Aprovação sempre com o Rafael.",
  },
  {
    id: "c2", nome: "Café da Serra", prefixo: "CS", foto: null,
    razao: "Café da Serra Torrefação ME", cnpj: "—", segmento: "Cafeteria",
    contato: "Bruno Lima", telefone: "(31) 90000-0001", email: "oi@exemplo.com",
    instagram: "@cafedaserra", endereco: "Nova Lima · MG",
    inicio: "2026-07-01", plano: "Social · 8 posts por mês", obs: "",
  },
];

const USUARIOS_INICIAIS = [
  { id: "u1", nome: "Gabriele", cargo: "Social Media · Design", tipo: "adm", usuario: "gabriele", senha: "demo-equipe", ativo: true, trocarSenha: false, ultimo: "hoje · 09:12", clienteId: null },
  { id: "u2", nome: "João", cargo: "Editor · Filmmaker", tipo: "adm", usuario: "joao", senha: "demo-equipe", ativo: true, trocarSenha: false, ultimo: "hoje · 08:40", clienteId: null },
  { id: "u3", nome: "Brownie Brasileiro", cargo: "Cliente", tipo: "cliente", usuario: "brownie", senha: "demo-cliente", ativo: true, trocarSenha: true, ultimo: "—", clienteId: "c1" },
  { id: "u4", nome: "Café da Serra", cargo: "Cliente", tipo: "cliente", usuario: "cafe", senha: "demo-cliente2", ativo: true, trocarSenha: false, ultimo: "—", clienteId: "c2" },
];

const SEMANAS_INICIAIS = [
  { id: "s1", clienteId: "c1", inicio: SEM_ATUAL },
  { id: "s2", clienteId: "c1", inicio: SEM_PROX },
  { id: "s3", clienteId: "c2", inicio: SEM_ATUAL },
];

const METRICAS_PADRAO = [
  { nome: "Seguidores", unidade: "" },
  { nome: "Visualizações", unidade: "" },
  { nome: "Visitas ao perfil", unidade: "" },
  { nome: "Toques no link da bio", unidade: "" },
];

const criarMetricas = (clienteId) =>
  METRICAS_PADRAO.map((m, i) => ({ id: `${clienteId}-m${i}`, clienteId, ...m }));

const METRICAS_INICIAIS = [...criarMetricas("c1"), ...criarMetricas("c2")];

const REGISTROS_INICIAIS = [
  { id: "r1", clienteId: "c1", periodo: "Início do contrato", data: "2026-03-02",
    valores: { "c1-m0": 2840, "c1-m1": 11200, "c1-m2": 640, "c1-m3": 48 } },
  { id: "r2", clienteId: "c1", periodo: "Maio 2026", data: "2026-05-31",
    valores: { "c1-m0": 5120, "c1-m1": 34600, "c1-m2": 1890, "c1-m3": 173 } },
  { id: "r3", clienteId: "c1", periodo: "Julho 2026", data: "2026-07-31",
    valores: { "c1-m0": 8930, "c1-m1": 72400, "c1-m2": 3410, "c1-m3": 386 } },
];

const cardDemo = (n, titulo, sub) =>
  "data:image/svg+xml;utf8," + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350">' +
    '<rect width="1080" height="1350" fill="#F3EAE0"/><circle cx="880" cy="180" r="230" fill="#E4D3C0"/>' +
    '<rect x="90" y="1090" width="900" height="4" fill="#7A4A22"/>' +
    '<text x="90" y="260" font-family="Georgia,serif" font-size="120" fill="#7A4A22">0' + n + "</text>" +
    '<text x="90" y="640" font-family="Georgia,serif" font-size="86" fill="#2E2823">' + titulo + "</text>" +
    '<text x="90" y="740" font-family="Helvetica,sans-serif" font-size="44" fill="#6B6259">' + sub + "</text>" +
    '<text x="90" y="1180" font-family="Helvetica,sans-serif" font-size="34" letter-spacing="6" fill="#7A4A22">BROWNIE BRASILEIRO</text></svg>'
  );

const ITENS_INICIAIS = [
  { id: "BB-041", clienteId: "c1", semanaId: "s1", dia: 0, hora: "18:30", tipo: "Carrossel",
    titulo: "5 sinais de que o brownie é de verdade", formato: "1080 × 1350 · 6 cards", versao: 1, status: "aguardando",
    legenda: "Casquinha que quebra, miolo que puxa. Se não tem isso, não é brownie — é bolinho de chocolate.",
    obs: "Publicar junto com o story de bastidor.", ajustes: [],
    pacote: { nome: "BB-041_carrossel_v1.zip", tam: "8,4 MB" },
    arquivos: [
      { nome: "01_capa.jpg", tipo: "imagem", url: cardDemo(1, "A casquinha", "Ela quebra. Sempre.") },
      { nome: "02_miolo.jpg", tipo: "imagem", url: cardDemo(2, "O miolo", "Úmido, nunca cru.") },
      { nome: "03_final.jpg", tipo: "imagem", url: cardDemo(3, "O corte", "Sem farelo pelo prato.") },
    ],
    historico: [{ quando: "há 2 dias · 14:20", texto: "Versão 1 enviada para aprovação" }] },
  { id: "BB-042", clienteId: "c1", semanaId: "s1", dia: 1, hora: "12:00", tipo: "Reels",
    titulo: "Bastidores: a hora do corte", formato: "1080 × 1920 · 24s", versao: 2, status: "ajuste",
    legenda: "O barulho da faca entrando no brownie ainda quente. Sobe o som.", obs: "",
    ajustes: [{ n: 1, motivo: "Marca aparece errada", pedido: "A embalagem no segundo 8 é a antiga. Trocar pela nova e deixar a logo maior no final." }],
    pacote: null, arquivos: [],
    historico: [{ quando: "há 4 dias · 09:10", texto: "Versão 1 enviada para aprovação" }, { quando: "há 4 dias · 19:44", texto: "Alteração 1 solicitada pelo cliente" }] },
  { id: "BB-043", clienteId: "c1", semanaId: "s1", dia: 2, hora: "10:00", tipo: "Story",
    titulo: "Enquete: nozes sim ou nozes não", formato: "1080 × 1920 · 3 telas", versao: 1, status: "aprovado",
    legenda: "Responde aí que a gente decide o sabor do mês pela enquete.", obs: "", ajustes: [], pacote: null, arquivos: [],
    historico: [{ quando: "há 3 dias · 15:30", texto: "Aprovado pelo cliente" }] },
  { id: "BB-044", clienteId: "c1", semanaId: "s1", dia: 3, hora: "19:00", tipo: "Reels",
    titulo: "Recheio em close · 4K", formato: "1080 × 1920 · 18s", versao: 1, status: "rascunho",
    legenda: "Sem trilha, sem corte rápido. Só o recheio escorrendo em câmera lenta.", obs: "Gravar com a luz da tarde.",
    ajustes: [], pacote: null, arquivos: [],
    historico: [{ quando: "há 1 dia · 16:05", texto: "Post criado no calendário" }] },
  { id: "BB-045", clienteId: "c1", semanaId: "s1", dia: 5, hora: "09:00 – 13:00", tipo: "Gravação",
    titulo: "Diária de gravação na loja", formato: "Presencial · 4h", versao: 1, status: "agendado",
    legenda: "Pauta: linha nova de recheios, 2 receitas em bancada e depoimento de cliente.", obs: "Levar 6 unidades de cada sabor.",
    ajustes: [], pacote: null, arquivos: [],
    historico: [{ quando: "há 6 dias · 10:00", texto: "Data confirmada com o cliente" }] },
  { id: "BB-039", clienteId: "c1", semanaId: "s1", dia: 4, hora: "18:30", tipo: "Carrossel",
    titulo: "Como conservar por 5 dias", formato: "1080 × 1350 · 5 cards", versao: 3, status: "publicado",
    legenda: "Geladeira não. Explicamos o porquê no card 3.", obs: "",
    ajustes: [
      { n: 1, motivo: "Texto confuso", pedido: "O card 3 ficou técnico demais. Falar mais simples." },
      { n: 2, motivo: "Erro de informação", pedido: "São 5 dias, não 7. Corrigir no card 1 e na legenda." },
    ],
    pacote: null, arquivos: [],
    liberado: { quando: "há 4 dias · 09:12", qtd: 5, bytes: 18874368, por: "Gabriele" },
    historico: [
      { quando: "há 5 dias · 18:30", texto: "Publicado no Instagram" },
      { quando: "há 4 dias · 09:12", texto: "Arquivos removidos do servidor · 5 arquivo(s) · 18,0 MB liberados" },
    ] },
  { id: "BB-046", clienteId: "c1", semanaId: "s2", dia: 1, hora: "18:00", tipo: "Carrossel",
    titulo: "Linha nova de recheios", formato: "1080 × 1350 · 4 cards", versao: 1, status: "rascunho",
    legenda: "Apresentação dos três sabores novos, um card por sabor.", obs: "", ajustes: [], pacote: null, arquivos: [],
    historico: [{ quando: "hoje · 08:10", texto: "Post criado no calendário" }] },
  { id: "CS-012", clienteId: "c2", semanaId: "s3", dia: 2, hora: "08:00", tipo: "Reels",
    titulo: "O primeiro café da manhã", formato: "1080 × 1920 · 15s", versao: 1, status: "rascunho",
    legenda: "Vapor subindo da xícara na varanda, som ambiente da serra.", obs: "", ajustes: [], pacote: null, arquivos: [],
    historico: [{ quando: "hoje · 09:00", texto: "Post criado no calendário" }] },
];

const DOCUMENTOS_INICIAIS = [
  { id: "d1", clienteId: "c1", nome: "Contrato de prestação de serviços", tipo: "Contrato",
    status: "assinado", exigeAssinatura: true, arquivoNome: "contrato-duo-bb.pdf", url: null,
    enviadoEm: "2026-03-02", assinadoEm: "2026-03-04",
    assinatura: { nome: "Ana Souza", codigo: "DUO-3F91A7C2", quando: "04 mar 2026 · 10:22" }, recusa: null,
    historico: [{ quando: "02 mar 2026", texto: "Enviado para assinatura" }, { quando: "04 mar 2026", texto: "Assinado por Ana Souza" }] },
  { id: "d2", clienteId: "c1", nome: "Aditivo · diária extra de gravação", tipo: "Aditivo",
    status: "aguardando", exigeAssinatura: true, arquivoNome: "aditivo-diaria.pdf", url: null,
    enviadoEm: paraIso(somaDias(new Date(), -2)), assinadoEm: null, assinatura: null, recusa: null,
    historico: [{ quando: "há 2 dias", texto: "Enviado para assinatura" }] },
  { id: "d3", clienteId: "c2", nome: "Contrato de prestação de serviços", tipo: "Contrato",
    status: "aguardando", exigeAssinatura: true, arquivoNome: "contrato-duo-cafe.pdf", url: null,
    enviadoEm: paraIso(somaDias(new Date(), -5)), assinadoEm: null, assinatura: null, recusa: null,
    historico: [{ quando: "há 5 dias", texto: "Enviado para assinatura" }] },
];

/* --------------------------- leitor de zip -------------------------- */

const mimeDe = (nome) => {
  const e = nome.toLowerCase().split(".").pop();
  if (["jpg", "jpeg"].includes(e)) return ["image/jpeg", "imagem"];
  if (e === "png") return ["image/png", "imagem"];
  if (e === "webp") return ["image/webp", "imagem"];
  if (e === "mp4") return ["video/mp4", "video"];
  if (e === "mov") return ["video/quicktime", "video"];
  return ["application/octet-stream", "outro"];
};

async function lerZip(buffer) {
  const dv = new DataView(buffer), u8 = new Uint8Array(buffer);
  let eocd = -1;
  const limite = Math.max(0, buffer.byteLength - 66000);
  for (let i = buffer.byteLength - 22; i >= limite; i--) if (dv.getUint32(i, true) === 0x06054b50) { eocd = i; break; }
  if (eocd < 0) throw new Error("zip");
  const total = dv.getUint16(eocd + 10, true);
  let off = dv.getUint32(eocd + 16, true);
  const entradas = [];
  for (let n = 0; n < total; n++) {
    if (dv.getUint32(off, true) !== 0x02014b50) break;
    const metodo = dv.getUint16(off + 10, true), compSize = dv.getUint32(off + 20, true);
    const nomeLen = dv.getUint16(off + 28, true), extraLen = dv.getUint16(off + 30, true), comLen = dv.getUint16(off + 32, true);
    const localOff = dv.getUint32(off + 42, true);
    const nome = new TextDecoder().decode(u8.subarray(off + 46, off + 46 + nomeLen));
    entradas.push({ nome, metodo, compSize, localOff });
    off += 46 + nomeLen + extraLen + comLen;
  }
  const saida = [];
  for (const it of entradas) {
    if (it.nome.endsWith("/") || it.nome.startsWith("__MACOSX") || it.nome.split("/").pop().startsWith(".")) continue;
    const lo = it.localOff;
    if (dv.getUint32(lo, true) !== 0x04034b50) continue;
    const ini = lo + 30 + dv.getUint16(lo + 26, true) + dv.getUint16(lo + 28, true);
    let bytes = u8.slice(ini, ini + it.compSize);
    if (it.metodo === 8) {
      if (typeof DecompressionStream === "undefined") continue;
      try {
        const fluxo = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
        bytes = new Uint8Array(await new Response(fluxo).arrayBuffer());
      } catch (e) { continue; }
    } else if (it.metodo !== 0) continue;
    const [mime, tipo] = mimeDe(it.nome);
    if (tipo === "outro") { saida.push({ nome: it.nome.split("/").pop(), tipo, url: null, tam: bytes.length }); continue; }
    saida.push({ nome: it.nome.split("/").pop(), tipo, tam: bytes.length, url: URL.createObjectURL(new Blob([bytes], { type: mime })) });
  }
  saida.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR", { numeric: true }));
  return saida;
}

/* --------------------------- utilidades ----------------------------- */

const agora = () =>
  new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }) + " · " +
  new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

/* peso dos arquivos — usado para saber quanto espaço um post ocupa
   e quanto se recupera ao apagar o material depois de publicado */
const pesoLegivel = (b) => {
  if (!b) return "0 MB";
  if (b < 1048576) return (b / 1024).toFixed(0) + " KB";
  if (b < 1073741824) return (b / 1048576).toFixed(1).replace(".", ",") + " MB";
  return (b / 1073741824).toFixed(2).replace(".", ",") + " GB";
};

const pesoDoPost = (i) =>
  (i.arquivos || []).reduce((s, a) => s + (a.tam || 0), 0) + (i.pacote && i.pacote.bytes ? i.pacote.bytes : 0);

const podeLiberar = (i) => i.status === "publicado" && !i.liberado && pesoDoPost(i) > 0;

const gerarSenha = () => {
  const mai = "ABCDEFGHJKLMNPQRSTUVWXYZ", min = "abcdefghijkmnopqrstuvwxyz", n = "23456789", sim = "!@#$&*";
  const p = (s) => s[Math.floor(Math.random() * s.length)];
  const s = [p(mai), p(min), p(n), p(sim)];
  for (let i = 0; i < 8; i++) s.push(p(mai + min + n));
  return s.sort(() => Math.random() - 0.5).join("");
};

const regrasSenha = (s) => [
  { ok: s.length >= 8, txt: "Pelo menos 8 caracteres" },
  { ok: /[A-Z]/.test(s), txt: "Uma letra maiúscula" },
  { ok: /[a-z]/.test(s), txt: "Uma letra minúscula" },
  { ok: /[0-9]/.test(s), txt: "Um número" },
];

const iniciais = (n) => n.split(" ").slice(0, 2).map((p) => p[0]).join("").toUpperCase();
const lerArquivo = (file) => new Promise((res) => { const fr = new FileReader(); fr.onload = () => res(fr.result); fr.readAsDataURL(file); });
const codigoAssinatura = () => "DUO-" + Math.random().toString(16).slice(2, 10).toUpperCase();

function Marca({ tamanho = "p" }) { return <span className={`marca marca-${tamanho}`}>DUO</span>; }

function Olho({ cortado }) {
  return (
    <svg viewBox="0 0 24 24" className="icone-olho" aria-hidden="true">
      <path d="M2 12s3.8-6.5 10-6.5S22 12 22 12s-3.8 6.5-10 6.5S2 12 2 12z" />
      <circle cx="12" cy="12" r="3.2" />
      {cortado && <line x1="4" y1="20" x2="20" y2="4" className="olho-risco" />}
    </svg>
  );
}

function Foto({ cliente, tamanho = 28 }) {
  if (cliente && cliente.foto) return <img src={cliente.foto} alt="" className="foto" style={{ width: tamanho, height: tamanho }} />;
  return <span className="foto foto-vazia rel" style={{ width: tamanho, height: tamanho, fontSize: tamanho / 2.8 }}>{cliente ? iniciais(cliente.nome) : "?"}</span>;
}

/* ------------------------------- app -------------------------------- */

export default function PortalDuo() {
  const [clientes, setClientes] = useState(CLIENTES_INICIAIS);
  const [usuarios, setUsuarios] = useState(USUARIOS_INICIAIS);
  const [semanas, setSemanas] = useState(SEMANAS_INICIAIS);
  const [itens, setItens] = useState(ITENS_INICIAIS);
  const [metricas, setMetricas] = useState(METRICAS_INICIAIS);
  const [registrosM, setRegistrosM] = useState(REGISTROS_INICIAIS);
  const [documentos, setDocumentos] = useState(DOCUMENTOS_INICIAIS);
  const [notificacoes, setNotificacoes] = useState([
    { id: "n1", para: "adm", texto: "Café da Serra ainda não acessou o portal", quando: "ontem · 18:00", lida: true },
  ]);

  const [sessao, setSessao] = useState(null);
  const [clienteId, setClienteId] = useState("c1");
  const [semanaId, setSemanaId] = useState(null);
  const [tela, setTela] = useState("clientes");
  const [abertoId, setAbertoId] = useState(null);
  const [editando, setEditando] = useState(null);
  const [aviso, setAviso] = useState(null);
  const [log, setLog] = useState([
    { quando: "hoje · 09:12", quem: "Gabriele", texto: "Entrou no portal" },
    { quando: "ontem · 16:05", quem: "João", texto: "Criou o post BB-044" },
  ]);

  const adm = sessao && sessao.tipo === "adm";
  const cliente = clientes.find((c) => c.id === clienteId) || null;
  const minhasSemanas = useMemo(
    () => semanas.filter((s) => s.clienteId === clienteId).sort((a, b) => a.inicio.localeCompare(b.inicio)),
    [semanas, clienteId]
  );
  const semana = minhasSemanas.find((s) => s.id === semanaId) || minhasSemanas[0] || null;

  useEffect(() => {
    const lista = semanas.filter((s) => s.clienteId === clienteId).sort((a, b) => a.inicio.localeCompare(b.inicio));
    const atual = lista.find(contemHoje) || lista[lista.length - 1] || null;
    setSemanaId(atual ? atual.id : null);
  }, [clienteId]); // eslint-disable-line

  useEffect(() => { if (!aviso) return; const t = setTimeout(() => setAviso(null), 3400); return () => clearTimeout(t); }, [aviso]);

  const registrar = (quem, texto) => setLog((r) => [{ quando: agora(), quem, texto }, ...r].slice(0, 60));
  const notificar = (para, texto) =>
    setNotificacoes((n) => [{ id: "n" + Date.now() + Math.random(), para, texto, quando: agora(), lida: false }, ...n].slice(0, 40));
  const atualizar = (id, fn) => setItens((p) => p.map((i) => (i.id === id ? fn(i) : i)));

  /* ---- sessão ---- */
  const entrar = (u) => {
    setUsuarios((p) => p.map((x) => (x.id === u.id ? { ...x, ultimo: agora() } : x)));
    setSessao(u);
    setClienteId(u.tipo === "cliente" ? u.clienteId : "c1");
    setTela(u.tipo === "adm" ? "clientes" : "agenda");
    registrar(u.nome, "Entrou no portal");
  };
  const sair = () => { registrar(sessao.nome, "Saiu do portal"); setSessao(null); setAbertoId(null); };

  const definirSenha = (id, nova) => {
    setUsuarios((p) => p.map((u) => (u.id === id ? { ...u, senha: nova, trocarSenha: false } : u)));
    setSessao((s) => (s && s.id === id ? { ...s, senha: nova, trocarSenha: false } : s));
    setAviso({ tom: "ok", texto: "Senha alterada." });
  };

  /* ---- posts ---- */
  const aprovar = (id) => {
    const it = itens.find((i) => i.id === id);
    atualizar(id, (i) => ({ ...i, status: "aprovado", historico: [...i.historico, { quando: agora(), texto: "Aprovado pelo cliente" }] }));
    registrar(sessao.nome, `Aprovou ${id}`);
    notificar("adm", `${cliente.nome} aprovou ${id} — ${it.titulo}`);
    setAbertoId(null);
    setAviso({ tom: "ok", texto: "Aprovado. A Duo já foi avisada." });
  };

  const pedirAjuste = (id, motivo, pedido) => {
    const it = itens.find((i) => i.id === id);
    const n = it.ajustes.length + 1;
    atualizar(id, (i) => {
      const hist = [...i.historico, { quando: agora(), texto: `Alteração ${n} solicitada pelo cliente` }];
      if (n >= MAX_AJUSTES) hist.push({ quando: agora(), texto: `Limite de ${MAX_AJUSTES} alterações atingido neste post` });
      return { ...i, status: "ajuste", ajustes: [...i.ajustes, { n, motivo, pedido }], historico: hist };
    });
    registrar(sessao.nome, `Solicitou alteração ${n} em ${id}`);
    notificar("adm", `${cliente.nome} pediu alteração ${n}/${MAX_AJUSTES} em ${id}${n >= MAX_AJUSTES ? " — limite atingido" : ""}`);
    setAbertoId(null);
    setAviso({ tom: "alerta", texto: n >= MAX_AJUSTES ? "Enviado. Esse foi o último ajuste deste post." : "Alteração enviada para a Duo." });
  };

  const enviarVersao = (id) => {
    const it = itens.find((i) => i.id === id);
    atualizar(id, (i) => {
      const v = i.status === "rascunho" ? i.versao : i.versao + 1;
      return { ...i, status: "aguardando", versao: v, historico: [...i.historico, { quando: agora(), texto: `Versão ${v} enviada para aprovação` }] };
    });
    registrar(sessao.nome, `Enviou ${id} para aprovação`);
    notificar(it.clienteId, `Novo conteúdo para aprovar: ${it.titulo}`);
    setAviso({ tom: "ok", texto: "Enviado para o cliente." });
  };

  const publicar = (id) => {
    atualizar(id, (i) => ({ ...i, status: "publicado", historico: [...i.historico, { quando: agora(), texto: "Publicado" }] }));
    registrar(sessao.nome, `Marcou ${id} como publicado`);
  };

  /* Depois que o post já foi ao ar, o material bruto não precisa mais ficar
     no servidor. Isto apaga os arquivos e mantém o post inteiro no histórico:
     título, legenda, versões, pedidos de alteração e datas continuam lá. */
  const liberarEspaco = (id, semPerguntar) => {
    const it = itens.find((i) => i.id === id);
    if (!it) return;
    const bytes = pesoDoPost(it);
    const qtd = (it.arquivos || []).length;
    if (!semPerguntar && !window.confirm(
      `Apagar os arquivos de "${it.titulo}"?\n\n` +
      `${qtd} arquivo(s) · ${pesoLegivel(bytes)} serão removidos do servidor.\n\n` +
      `O post continua registrado no histórico com legenda, versões e alterações. ` +
      `Só o material bruto some — e não tem como desfazer.`
    )) return;
    (it.arquivos || []).forEach((a) => { if (a.url) { try { URL.revokeObjectURL(a.url); } catch (e) {} } });
    if (it.pacote && it.pacote.url) { try { URL.revokeObjectURL(it.pacote.url); } catch (e) {} }
    atualizar(id, (i) => ({
      ...i, arquivos: [], pacote: null,
      liberado: { quando: agora(), qtd, bytes, por: sessao.nome },
      historico: [...i.historico, { quando: agora(), texto: `Arquivos removidos do servidor · ${qtd} arquivo(s) · ${pesoLegivel(bytes)} liberados` }],
    }));
    registrar(sessao.nome, `Liberou ${pesoLegivel(bytes)} em ${id}`);
    setAviso({ tom: "ok", texto: `${pesoLegivel(bytes)} liberados. O post segue no histórico.` });
  };

  const anexar = async (id, fileList) => {
    const arquivos = []; let pacote = null;
    for (const f of Array.from(fileList)) {
      if (f.name.toLowerCase().endsWith(".zip")) {
        pacote = { nome: f.name, bytes: f.size, tam: (f.size / 1048576).toFixed(1).replace(".", ",") + " MB", url: URL.createObjectURL(f) };
        try { arquivos.push(...(await lerZip(await f.arrayBuffer()))); }
        catch (e) { setAviso({ tom: "alerta", texto: "Não consegui abrir o .zip. Anexe os arquivos soltos." }); }
      } else {
        const [mime, tipo] = mimeDe(f.name);
        arquivos.push({ nome: f.name, tipo, tam: f.size, url: URL.createObjectURL(f) });
      }
    }
    atualizar(id, (i) => ({ ...i, pacote: pacote || i.pacote, arquivos: [...i.arquivos, ...arquivos] }));
    registrar(sessao.nome, `Anexou ${arquivos.length} arquivo(s) em ${id}`);
    setAviso({ tom: "ok", texto: `${arquivos.length} arquivo(s) prontos.` });
  };

  const salvarPost = (dados) => {
    if (dados.id) {
      atualizar(dados.id, (i) => ({ ...i, ...dados }));
      registrar(sessao.nome, `Editou ${dados.id}`);
      setAviso({ tom: "ok", texto: "Post atualizado." });
    } else {
      const cl = clientes.find((c) => c.id === dados.clienteId);
      const nums = itens.filter((i) => i.clienteId === cl.id).map((i) => Number(i.id.split("-")[1]) || 0);
      const novo = `${cl.prefixo}-${String(Math.max(0, ...nums) + 1).padStart(3, "0")}`;
      setItens((p) => [...p, {
        ...dados, id: novo, versao: 1,
        status: dados.tipo === "Gravação" ? "agendado" : "rascunho",
        ajustes: [], pacote: null, arquivos: [],
        historico: [{ quando: agora(), texto: "Post criado no calendário" }],
      }]);
      registrar(sessao.nome, `Criou ${novo} para ${cl.nome}`);
      setAviso({ tom: "ok", texto: `${novo} criado.` });
    }
    setEditando(null);
  };

  const excluirPost = (id) => {
    setItens((p) => p.filter((i) => i.id !== id));
    registrar(sessao.nome, `Excluiu ${id}`);
    setEditando(null); setAbertoId(null);
    setAviso({ tom: "alerta", texto: "Post removido do calendário." });
  };

  /* ---- semanas ---- */
  const criarSemana = (inicioIso) => {
    const jaTem = minhasSemanas.find((s) => s.inicio === inicioIso);
    if (jaTem) { setSemanaId(jaTem.id); return; }
    const id = "s" + Date.now().toString().slice(-6);
    setSemanas((p) => [...p, { id, clienteId, inicio: inicioIso }]);
    setSemanaId(id);
    registrar(sessao.nome, `Abriu a semana de ${inicioIso} para ${cliente.nome}`);
  };
  const moverSemana = (inicioIso) => {
    setSemanas((p) => p.map((s) => (s.id === semana.id ? { ...s, inicio: inicioIso } : s)));
    setAviso({ tom: "ok", texto: "Datas da semana atualizadas." });
  };

  /* ---- clientes ---- */
  const salvarCliente = async (dados, arquivoFoto) => {
    let foto = dados.foto;
    if (arquivoFoto) foto = await lerArquivo(arquivoFoto);
    if (dados.id) {
      setClientes((p) => p.map((c) => (c.id === dados.id ? { ...c, ...dados, foto } : c)));
      registrar(sessao.nome, `Editou os dados de ${dados.nome}`);
      setAviso({ tom: "ok", texto: "Dados do cliente salvos." });
    } else {
      const cid = "c" + Date.now().toString().slice(-6);
      const prefixo = (dados.nome.split(" ").slice(0, 2).map((p) => p[0]).join("") || "CL").toUpperCase();
      setClientes((p) => [...p, { ...dados, id: cid, prefixo, foto }]);
      setUsuarios((p) => [...p, {
        id: "u" + Date.now().toString().slice(-6), nome: dados.nome, cargo: "Cliente", tipo: "cliente",
        usuario: dados.usuario, senha: dados.senha, ativo: true, trocarSenha: true, ultimo: "—", clienteId: cid,
      }]);
      setSemanas((p) => [...p, { id: "s" + Date.now().toString().slice(-6), clienteId: cid, inicio: SEM_ATUAL }]);
      setMetricas((p) => [...p, ...criarMetricas(cid)]);
      registrar(sessao.nome, `Cadastrou o cliente ${dados.nome}`);
      setAviso({ tom: "ok", texto: `${dados.nome} cadastrado. Senha temporária: ${dados.senha}` });
    }
    setEditando(null);
  };

  const excluirCliente = (id) => {
    const c = clientes.find((x) => x.id === id);
    setClientes((p) => p.filter((x) => x.id !== id));
    setUsuarios((p) => p.filter((u) => u.clienteId !== id));
    setSemanas((p) => p.filter((s) => s.clienteId !== id));
    setItens((p) => p.filter((i) => i.clienteId !== id));
    setMetricas((p) => p.filter((m) => m.clienteId !== id));
    setRegistrosM((p) => p.filter((r) => r.clienteId !== id));
    setDocumentos((p) => p.filter((d) => d.clienteId !== id));
    if (clienteId === id) setClienteId(clientes.find((x) => x.id !== id).id);
    registrar(sessao.nome, `Excluiu o cliente ${c.nome}`);
    setAviso({ tom: "alerta", texto: "Cliente e todos os dados removidos." });
  };

  /* ---- documentos ---- */
  const salvarDoc = async (dados, arquivo) => {
    let url = dados.url, arquivoNome = dados.arquivoNome;
    if (arquivo) { url = URL.createObjectURL(arquivo); arquivoNome = arquivo.name; }
    if (dados.id) {
      setDocumentos((p) => p.map((d) => (d.id === dados.id ? { ...d, ...dados, url, arquivoNome } : d)));
    } else {
      setDocumentos((p) => [...p, {
        ...dados, id: "d" + Date.now().toString().slice(-6), url, arquivoNome,
        status: "rascunho", enviadoEm: null, assinadoEm: null, assinatura: null, recusa: null,
        historico: [{ quando: agora(), texto: "Documento criado" }],
      }]);
      registrar(sessao.nome, `Subiu o documento ${dados.nome}`);
    }
    setEditando(null);
    setAviso({ tom: "ok", texto: "Documento salvo." });
  };

  const enviarDoc = (id) => {
    const d = documentos.find((x) => x.id === id);
    const novoStatus = d.exigeAssinatura ? "aguardando" : "enviado";
    setDocumentos((p) => p.map((x) => x.id === id ? {
      ...x, status: novoStatus, enviadoEm: paraIso(new Date()),
      historico: [...x.historico, { quando: agora(), texto: d.exigeAssinatura ? "Enviado para assinatura" : "Enviado ao cliente" }],
    } : x));
    notificar(d.clienteId, d.exigeAssinatura ? `Documento aguardando sua assinatura: ${d.nome}` : `Novo documento disponível: ${d.nome}`);
    notificar("adm", `${clientes.find((c) => c.id === d.clienteId).nome} — ${d.nome} aguardando assinatura`);
    registrar(sessao.nome, `Enviou ${d.nome}`);
    setAviso({ tom: "ok", texto: "Documento enviado ao cliente." });
  };

  const assinarDoc = (id, nome) => {
    const d = documentos.find((x) => x.id === id);
    const codigo = codigoAssinatura();
    setDocumentos((p) => p.map((x) => x.id === id ? {
      ...x, status: "assinado", assinadoEm: paraIso(new Date()),
      assinatura: { nome, codigo, quando: agora() },
      historico: [...x.historico, { quando: agora(), texto: `Assinado por ${nome} · ${codigo}` }],
    } : x));
    notificar("adm", `${cliente.nome} assinou ${d.nome}`);
    registrar(sessao.nome, `Assinou ${d.nome}`);
    setAviso({ tom: "ok", texto: "Documento assinado." });
  };

  const recusarDoc = (id, motivo) => {
    const d = documentos.find((x) => x.id === id);
    setDocumentos((p) => p.map((x) => x.id === id ? {
      ...x, status: "recusado", recusa: { motivo, quando: agora() },
      historico: [...x.historico, { quando: agora(), texto: `Recusado — ${motivo}` }],
    } : x));
    notificar("adm", `${cliente.nome} recusou ${d.nome}`);
    setAviso({ tom: "alerta", texto: "Recusa registrada." });
  };

  /* ---- métricas ---- */
  const salvarPeriodo = (dados) => {
    if (dados.id) setRegistrosM((p) => p.map((r) => (r.id === dados.id ? { ...r, ...dados } : r)));
    else setRegistrosM((p) => [...p, { ...dados, id: "r" + Date.now().toString().slice(-6), clienteId }]);
    registrar(sessao.nome, `Registrou métricas de ${cliente.nome} · ${dados.periodo}`);
    setEditando(null);
    setAviso({ tom: "ok", texto: "Período salvo." });
  };
  const excluirPeriodo = (id) => { setRegistrosM((p) => p.filter((r) => r.id !== id)); setEditando(null); };
  const criarMetrica = (nome, unidade) => {
    setMetricas((p) => [...p, { id: "m" + Date.now().toString().slice(-6), clienteId, nome, unidade }]);
    setAviso({ tom: "ok", texto: "Métrica criada." });
  };

  /* ---- telas sem sessão ---- */
  if (!sessao) return (<div className="duo duo-auth"><style>{CSS}</style><Login usuarios={usuarios} onEntrar={entrar} /></div>);
  if (sessao.trocarSenha) return (<div className="duo duo-auth"><style>{CSS}</style><TrocaObrigatoria usuario={sessao} onSalvar={(n) => definirSenha(sessao.id, n)} onSair={sair} /></div>);

  const aberto = itens.find((i) => i.id === abertoId) || null;
  const daSemana = itens.filter((i) => i.clienteId === clienteId && semana && i.semanaId === semana.id);
  const doCliente = itens.filter((i) => i.clienteId === clienteId);
  const paraAprovar = doCliente.filter((i) => i.status === "aguardando");
  const docsCliente = documentos.filter((d) => d.clienteId === clienteId && (adm || d.status !== "rascunho"));
  const docsAssinar = docsCliente.filter((d) => d.status === "aguardando").length;
  const minhasNotif = notificacoes.filter((n) => (adm ? n.para === "adm" : n.para === clienteId));

  const abas = adm
    ? [["clientes", "Clientes"], ["agenda", "Calendário"], ["entregas", "Aprovações"], ["metricas", "Métricas"], ["documentos", "Documentos"], ["perfil", "Perfil"], ["acessos", "Acessos"]]
    : [["agenda", "Calendário"], ["aprovar", `Para aprovar (${paraAprovar.length})`], ["metricas", "Métricas"],
       ["documentos", `Documentos${docsAssinar > 0 ? ` (${docsAssinar})` : ""}`], ["historico", "Histórico"], ["perfil", "Perfil"]];

  return (
    <div className="duo">
      <style>{CSS}</style>

      <header className="topo">
        <Marca />
        <span className="topo-sep" />
        <span className="topo-nome">Portal do cliente</span>

        <div className="topo-dir">
          <Sino notificacoes={minhasNotif} onLer={() => setNotificacoes((p) => p.map((n) => ({ ...n, lida: true })))} />
          {adm ? (
            <SeletorCliente clientes={clientes} atual={cliente} onTrocar={setClienteId} />
          ) : (
            <div className="chip-cliente rel"><Foto cliente={cliente} tamanho={28} /><span>{cliente ? cliente.nome : ""}</span></div>
          )}
          <div className="chip-user">
            <span className="avatar rel">{iniciais(sessao.nome)}</span>
            <span className="user-txt"><strong>{sessao.nome}</strong><em>{sessao.cargo}</em></span>
          </div>
          <button className="btn btn-leve btn-mini" onClick={sair}>Sair</button>
        </div>
      </header>

      <nav className="abas">
        {abas.map(([k, r]) => (
          <button key={k} className={tela === k ? "aba aba-on" : "aba"} onClick={() => setTela(k)}>{r}</button>
        ))}
      </nav>

      <main className="corpo">
        {(tela === "agenda" || tela === "entregas") && (
          <NavSemana semana={semana} semanas={minhasSemanas} adm={adm} onTrocar={setSemanaId} onCriar={criarSemana} onMover={moverSemana} />
        )}

        {tela === "clientes" && adm && (
          <Clientes
            clientes={clientes} usuarios={usuarios} itens={itens} documentos={documentos}
            onAbrir={(id) => { setClienteId(id); setTela("agenda"); }}
            onNovo={() => setEditando({ tipo: "cliente", senha: gerarSenha() })}
            onEditar={(c) => setEditando({ tipo: "cliente", ...c })}
            onExcluir={excluirCliente}
          />
        )}

        {tela === "agenda" && (
          <Agenda
            dias={diasDaSemana(semana)} itens={daSemana} adm={adm} onAbrir={setAbertoId}
            onNova={(dia) => setEditando({ tipo: "post", clienteId, semanaId: semana.id, dia, hora: "18:00", tipoPost: "Carrossel", titulo: "", legenda: "", obs: "", formato: TIPOS[0].formato })}
          />
        )}

        {tela === "aprovar" && (
          <section>
            <Cabecalho titulo="Para aprovar" apoio="Enquanto estiver aqui, nada vai ao ar. Abra, veja os arquivos e responda." />
            {paraAprovar.length === 0 ? <div className="nada baixo">Tudo aprovado. A Duo assume daqui.</div> : (
              <div className="grade">
                {paraAprovar.map((i) => (
                  <Cartao key={i.id} item={i} dias={diasDaSemana(semanas.find((s) => s.id === i.semanaId))} onAbrir={() => setAbertoId(i.id)} />
                ))}
              </div>
            )}
          </section>
        )}

        {tela === "historico" && (
          <section>
            <Cabecalho titulo="Histórico" apoio="Tudo que já passou por aqui, com data e motivo." />
            <ul className="lista baixo">
              {doCliente.filter((i) => ["aprovado", "publicado", "ajuste"].includes(i.status)).map((i) => (
                <li key={i.id}>
                  <button className="linha" onClick={() => setAbertoId(i.id)}>
                    <span className="cod">{i.id}</span>
                    <span className="linha-titulo">{i.titulo}</span>
                    <span className={`pill pill-${statusVisivel(i)}`}>{STATUS_LABEL[statusVisivel(i)]}</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {tela === "entregas" && (
          <Entregas
            itens={daSemana} dias={diasDaSemana(semana)} cliente={cliente} semana={semana}
            onAbrir={setAbertoId} onAnexar={anexar} onEnviar={enviarVersao} onPublicar={publicar} onLiberar={liberarEspaco}
            onEditar={(i) => setEditando({ tipo: "post", ...i, tipoPost: i.tipo })}
          />
        )}

        {tela === "metricas" && (
          <Metricas
            adm={adm} cliente={cliente}
            metricas={metricas.filter((m) => m.clienteId === clienteId)}
            registros={registrosM.filter((r) => r.clienteId === clienteId).sort((a, b) => a.data.localeCompare(b.data))}
            onNovoPeriodo={() => setEditando({ tipo: "periodo", periodo: "", data: paraIso(new Date()), valores: {} })}
            onEditarPeriodo={(r) => setEditando({ tipo: "periodo", ...r })}
            onCriarMetrica={criarMetrica}
          />
        )}

        {tela === "documentos" && (
          <Documentos
            adm={adm} cliente={cliente} documentos={docsCliente}
            onNovo={() => setEditando({ tipo: "documento", clienteId, nome: "", docTipo: "Contrato", exigeAssinatura: true })}
            onEnviar={enviarDoc}
            onAssinar={(d) => setEditando({ tipo: "assinar", doc: d })}
            onRecusar={(d) => setEditando({ tipo: "recusar", doc: d })}
          />
        )}

        {tela === "perfil" && <Perfil cliente={cliente} adm={adm} onEditar={() => setEditando({ tipo: "cliente", ...cliente })} />}

        {tela === "acessos" && (
          <Acessos
            clientes={clientes} setClientes={setClientes} usuarios={usuarios} setUsuarios={setUsuarios}
            sessao={sessao} log={log} onLog={registrar} onAviso={setAviso} onTrocarPropria={definirSenha}
          />
        )}
      </main>

      {aviso && <div className={`aviso aviso-${aviso.tom}`}>{aviso.texto}</div>}

      {aberto && (
        <Painel
          item={aberto} adm={adm} dias={diasDaSemana(semanas.find((s) => s.id === aberto.semanaId))}
          onFechar={() => setAbertoId(null)} onAprovar={() => aprovar(aberto.id)} onAjuste={(m, p) => pedirAjuste(aberto.id, m, p)}
          onEditar={() => { setEditando({ tipo: "post", ...aberto, tipoPost: aberto.tipo }); setAbertoId(null); }}
        />
      )}

      {editando && editando.tipo === "post" && (
        <FormPost dados={editando} clientes={clientes} semanas={semanas} onSalvar={salvarPost} onExcluir={excluirPost} onFechar={() => setEditando(null)} />
      )}
      {editando && editando.tipo === "cliente" && (
        <FormCliente dados={editando} onSalvar={salvarCliente} onFechar={() => setEditando(null)} />
      )}
      {editando && editando.tipo === "periodo" && (
        <FormPeriodo dados={editando} metricas={metricas.filter((m) => m.clienteId === clienteId)} onSalvar={salvarPeriodo} onExcluir={excluirPeriodo} onFechar={() => setEditando(null)} />
      )}
      {editando && editando.tipo === "documento" && (
        <FormDocumento dados={editando} onSalvar={salvarDoc} onFechar={() => setEditando(null)} />
      )}
      {editando && editando.tipo === "assinar" && (
        <Assinar doc={editando.doc} cliente={cliente} onAssinar={(nome) => { assinarDoc(editando.doc.id, nome); setEditando(null); }} onFechar={() => setEditando(null)} />
      )}
      {editando && editando.tipo === "recusar" && (
        <Recusar doc={editando.doc} onRecusar={(m) => { recusarDoc(editando.doc.id, m); setEditando(null); }} onFechar={() => setEditando(null)} />
      )}
    </div>
  );
}

/* --------------------------- notificações --------------------------- */

function Sino({ notificacoes, onLer }) {
  const [aberto, setAberto] = useState(false);
  const naoLidas = notificacoes.filter((n) => !n.lida).length;
  useEffect(() => {
    if (!aberto) return;
    const f = () => setAberto(false);
    window.addEventListener("click", f);
    return () => window.removeEventListener("click", f);
  }, [aberto]);
  return (
    <div className="seletor" onClick={(e) => e.stopPropagation()}>
      <button className="sino rel" onClick={() => { setAberto(!aberto); if (!aberto) onLer(); }} aria-label="Notificações">
        ◔
        {naoLidas > 0 && <span className="badge">{naoLidas}</span>}
      </button>
      {aberto && (
        <div className="menu rel menu-largo">
          <p className="rotulo">Notificações</p>
          {notificacoes.length === 0 && <p className="meta">Nada por enquanto.</p>}
          {notificacoes.slice(0, 8).map((n) => (
            <div key={n.id} className="notif">
              <span className="meta">{n.quando}</span>
              <span className="notif-txt">{n.texto}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SeletorCliente({ clientes, atual, onTrocar }) {
  const [aberto, setAberto] = useState(false);
  useEffect(() => {
    if (!aberto) return;
    const f = () => setAberto(false);
    window.addEventListener("click", f);
    return () => window.removeEventListener("click", f);
  }, [aberto]);
  return (
    <div className="seletor" onClick={(e) => e.stopPropagation()}>
      <button className="chip-cliente rel" onClick={() => setAberto(!aberto)}>
        <Foto cliente={atual} tamanho={28} />
        <span>{atual ? atual.nome : "Escolher cliente"}</span>
        <span className="seta-baixo">▾</span>
      </button>
      {aberto && (
        <div className="menu rel">
          <p className="rotulo">Trocar de cliente</p>
          {clientes.map((c) => (
            <button key={c.id} className={c.id === (atual && atual.id) ? "menu-item menu-on" : "menu-item"}
              onClick={() => { onTrocar(c.id); setAberto(false); }}>
              <Foto cliente={c} tamanho={24} /><span>{c.nome}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------ login ------------------------------- */

function Login({ usuarios, onEntrar }) {
  const [u, setU] = useState(""); const [s, setS] = useState("");
  const [ver, setVer] = useState(false); const [erro, setErro] = useState("");
  const [tentativas, setTentativas] = useState(0); const [bloqueio, setBloqueio] = useState(0);

  useEffect(() => { if (bloqueio <= 0) return; const t = setTimeout(() => setBloqueio((b) => b - 1), 1000); return () => clearTimeout(t); }, [bloqueio]);

  const enviar = () => {
    if (bloqueio > 0) return;
    const achado = usuarios.find((x) => x.usuario.toLowerCase() === u.trim().toLowerCase() && x.senha === s);
    if (!achado) {
      const t = tentativas + 1; setTentativas(t);
      if (t >= MAX_TENTATIVAS) { setBloqueio(BLOQUEIO_SEG); setTentativas(0); setErro("Acesso bloqueado por tentativas seguidas."); }
      else setErro(`Usuário ou senha não conferem. Restam ${MAX_TENTATIVAS - t} tentativas.`);
      return;
    }
    if (!achado.ativo) { setErro("Este acesso está desativado. Fale com a Duo."); return; }
    setErro(""); onEntrar(achado);
  };

  return (
    <div className="entrada">
      <div className="entrada-caixa rel">
        <div className="entrada-marca"><Marca tamanho="g" /></div>
        <p className="entrada-sub">Portal do cliente</p>
        <label className="rotulo-2" htmlFor="lg-u">Usuário</label>
        <input id="lg-u" className="campo baixo" value={u} autoComplete="off" onChange={(e) => setU(e.target.value)} onKeyDown={(e) => e.key === "Enter" && enviar()} />
        <label className="rotulo-2" htmlFor="lg-s">Senha</label>
        <div className="campo-linha">
          <input id="lg-s" className="campo baixo" type={ver ? "text" : "password"} value={s} onChange={(e) => setS(e.target.value)} onKeyDown={(e) => e.key === "Enter" && enviar()} />
          <button className="olho" onClick={() => setVer(!ver)} aria-label={ver ? "Ocultar senha" : "Ver senha"} title={ver ? "Ocultar" : "Ver"}>
            <Olho cortado={ver} />
          </button>
        </div>
        {erro && <p className="erro">{erro}</p>}
        {bloqueio > 0 && <p className="erro">Tente de novo em {bloqueio}s.</p>}
        <button className="btn btn-forte largo" onClick={enviar} disabled={bloqueio > 0 || !u || !s}>Entrar</button>
      </div>
    </div>
  );
}

function TrocaObrigatoria({ usuario, onSalvar, onSair }) {
  const [n1, setN1] = useState(""); const [n2, setN2] = useState("");
  const regras = regrasSenha(n1);
  const ok = regras.every((r) => r.ok) && n1 === n2;
  return (
    <div className="entrada">
      <div className="entrada-caixa rel">
        <div className="entrada-marca"><Marca tamanho="g" /></div>
        <p className="entrada-sub">Primeiro acesso, {usuario.nome}</p>
        <p className="apoio">A senha que a Duo enviou é temporária. Crie a sua agora — só você vai saber.</p>
        <label className="rotulo-2">Nova senha</label>
        <input className="campo baixo" type="password" value={n1} onChange={(e) => setN1(e.target.value)} />
        <label className="rotulo-2">Repita a nova senha</label>
        <input className="campo baixo" type="password" value={n2} onChange={(e) => setN2(e.target.value)} />
        <ul className="regras">
          {regras.map((r, i) => (<li key={i} className={r.ok ? "ok" : ""}>{r.ok ? "✓" : "○"} {r.txt}</li>))}
          <li className={n1 && n1 === n2 ? "ok" : ""}>{n1 && n1 === n2 ? "✓" : "○"} As duas iguais</li>
        </ul>
        <button className="btn btn-forte largo" disabled={!ok} onClick={() => onSalvar(n1)}>Salvar e entrar</button>
        <button className="btn btn-leve largo" onClick={onSair}>Sair</button>
      </div>
    </div>
  );
}

/* ---------------------------- estrutura ----------------------------- */

function Cabecalho({ titulo, apoio, acao }) {
  return (
    <div className="cab">
      <div className="cab-linha">
        <h2 className="titulo">{titulo}</h2>
        {acao}
      </div>
      {apoio && <p className="apoio">{apoio}</p>}
    </div>
  );
}

function NavSemana({ semana, semanas, adm, onTrocar, onCriar, onMover }) {
  const [editar, setEditar] = useState(false);
  if (!semana) return null;
  const idx = semanas.findIndex((s) => s.id === semana.id);
  const inicio = paraData(semana.inicio);
  const futura = inicio > new Date();
  const irPara = (delta) => {
    const alvo = semanas[idx + delta];
    if (alvo) { onTrocar(alvo.id); return; }
    if (adm) onCriar(paraIso(somaDias(inicio, delta * 7)));
  };
  return (
    <div className="nav-semana">
      <div className="nav-linha">
        <button className="btn btn-leve btn-mini" onClick={() => irPara(-1)} disabled={!adm && idx === 0}>‹</button>
        <div className="nav-centro">
          <h2 className="titulo">{tituloSemana(semana)}</h2>
          <span className="meta">{contemHoje(semana) ? "semana atual" : futura ? "programação prévia" : "semana encerrada"}</span>
        </div>
        <button className="btn btn-leve btn-mini" onClick={() => irPara(1)} disabled={!adm && idx === semanas.length - 1}>›</button>
      </div>
      <div className="nav-atalhos">
        {semanas.map((s) => (
          <button key={s.id} className={s.id === semana.id ? "atalho baixo" : "atalho rel"} onClick={() => onTrocar(s.id)}>{semanaCurta(s)}</button>
        ))}
        {adm && (
          <>
            <button className="atalho rel" onClick={() => onCriar(paraIso(somaDias(paraData(semanas[semanas.length - 1].inicio), 7)))}>+ semana</button>
            <button className="atalho rel" onClick={() => setEditar(!editar)}>datas</button>
          </>
        )}
      </div>
      {adm && editar && (
        <div className="editar-semana baixo">
          <label className="rotulo">Primeiro dia desta semana (segunda-feira)</label>
          <div className="campo-linha">
            <input type="date" className="campo baixo" value={semana.inicio} onChange={(e) => e.target.value && onMover(e.target.value)} />
            <button className="btn btn-leve btn-mini" onClick={() => setEditar(false)}>pronto</button>
          </div>
          <p className="meta">Mudar aqui move os sete dias junto. O cliente entra sempre na semana que contém o dia de hoje.</p>
        </div>
      )}
    </div>
  );
}

/* ----------------------------- clientes ----------------------------- */

function Clientes({ clientes, usuarios, itens, documentos, onAbrir, onNovo, onEditar, onExcluir }) {
  const [confirmar, setConfirmar] = useState(null);
  return (
    <section>
      <Cabecalho
        titulo="Clientes"
        apoio="Todos os clientes da Duo. Abra um para entrar no painel dele: calendário, aprovações, métricas e documentos."
        acao={<button className="btn btn-forte" onClick={onNovo}>Cadastrar cliente</button>}
      />
      <div className="grade">
        {clientes.map((c) => {
          const u = usuarios.find((x) => x.clienteId === c.id);
          const pend = itens.filter((i) => i.clienteId === c.id && i.status === "aguardando").length;
          const alt = itens.filter((i) => i.clienteId === c.id && i.status === "ajuste").length;
          const docs = documentos.filter((d) => d.clienteId === c.id && d.status === "aguardando").length;
          return (
            <div className="card rel" key={c.id}>
              <div className="card-topo">
                <Foto cliente={c} tamanho={52} />
                <span className="cod">desde {dataCurta(c.inicio)}</span>
              </div>
              <h3 className="card-titulo">{c.nome}</h3>
              <p className="meta">{c.segmento || "—"}</p>
              <p className="meta">{c.contato || "—"} · {u ? u.usuario : "sem acesso"}</p>
              <div className="mini-placar">
                <span className={pend ? "mp mp-alerta" : "mp"}>{pend} aguardando</span>
                <span className={alt ? "mp mp-alerta" : "mp"}>{alt} com alteração</span>
                <span className={docs ? "mp mp-alerta" : "mp"}>{docs} doc. p/ assinar</span>
              </div>
              <div className="acoes">
                <button className="btn btn-forte btn-mini" onClick={() => onAbrir(c.id)}>Abrir painel</button>
                <button className="btn btn-leve btn-mini" onClick={() => onEditar(c)}>Editar</button>
                {confirmar === c.id ? (
                  <button className="btn btn-leve btn-mini apagar" onClick={() => { onExcluir(c.id); setConfirmar(null); }}>Confirmar exclusão</button>
                ) : (
                  <button className="btn btn-leve btn-mini apagar" onClick={() => setConfirmar(c.id)}>Excluir</button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function FormCliente({ dados, onSalvar, onFechar }) {
  const novo = !dados.id;
  const [f, setF] = useState({
    id: dados.id || null, nome: dados.nome || "", razao: dados.razao || "", cnpj: dados.cnpj || "",
    segmento: dados.segmento || "", contato: dados.contato || "", telefone: dados.telefone || "",
    email: dados.email || "", instagram: dados.instagram || "", endereco: dados.endereco || "",
    inicio: dados.inicio || paraIso(new Date()), plano: dados.plano || "", obs: dados.obs || "",
    foto: dados.foto || null, usuario: dados.usuario || "", senha: dados.senha || gerarSenha(),
  });
  const [arquivo, setArquivo] = useState(null);
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const valido = f.nome.trim().length >= 2 && (!novo || f.usuario.trim().length >= 3);

  return (
    <div className="fundo" onClick={onFechar}>
      <div className="painel estreito" onClick={(e) => e.stopPropagation()}>
        <div className="painel-topo">
          <div>
            <span className="cod">{novo ? "Novo cliente" : `Editando ${f.nome}`}</span>
            <h3 className="painel-titulo">Dados da empresa</h3>
          </div>
          <button className="fechar" onClick={onFechar}>×</button>
        </div>
        <div className="painel-corpo bloco-unico">
          <label className="rotulo-2">Nome que aparece no portal</label>
          <input className="campo baixo" value={f.nome} onChange={(e) => set("nome", e.target.value)} />

          <label className="rotulo-2">Foto / logo</label>
          <input type="file" accept="image/*" className="campo baixo arquivo" onChange={(e) => setArquivo(e.target.files[0] || null)} />

          <div className="duas">
            <div><label className="rotulo-2">Razão social</label><input className="campo baixo" value={f.razao} onChange={(e) => set("razao", e.target.value)} /></div>
            <div><label className="rotulo-2">CNPJ</label><input className="campo baixo" value={f.cnpj} onChange={(e) => set("cnpj", e.target.value)} /></div>
          </div>
          <div className="duas">
            <div><label className="rotulo-2">Segmento</label><input className="campo baixo" value={f.segmento} onChange={(e) => set("segmento", e.target.value)} /></div>
            <div><label className="rotulo-2">Cidade / estado</label><input className="campo baixo" value={f.endereco} onChange={(e) => set("endereco", e.target.value)} /></div>
          </div>
          <div className="duas">
            <div><label className="rotulo-2">Pessoa de contato</label><input className="campo baixo" value={f.contato} onChange={(e) => set("contato", e.target.value)} /></div>
            <div><label className="rotulo-2">Telefone</label><input className="campo baixo" value={f.telefone} onChange={(e) => set("telefone", e.target.value)} /></div>
          </div>
          <div className="duas">
            <div><label className="rotulo-2">E-mail</label><input className="campo baixo" value={f.email} onChange={(e) => set("email", e.target.value)} /></div>
            <div><label className="rotulo-2">Instagram</label><input className="campo baixo" value={f.instagram} onChange={(e) => set("instagram", e.target.value)} /></div>
          </div>
          <div className="duas">
            <div><label className="rotulo-2">Início do contrato</label><input type="date" className="campo baixo" value={f.inicio} onChange={(e) => set("inicio", e.target.value)} /></div>
            <div><label className="rotulo-2">Plano contratado</label><input className="campo baixo" value={f.plano} onChange={(e) => set("plano", e.target.value)} /></div>
          </div>

          <label className="rotulo-2">Observações internas</label>
          <textarea className="campo baixo" rows={3} value={f.obs} onChange={(e) => set("obs", e.target.value)} placeholder="Regras da marca, quem aprova, o que nunca usar." />

          {novo && (
            <>
              <p className="rotulo">Acesso do cliente</p>
              <div className="duas">
                <div><label className="rotulo-2">Usuário</label>
                  <input className="campo baixo" value={f.usuario} onChange={(e) => set("usuario", e.target.value.replace(/\s/g, "").toLowerCase())} /></div>
                <div><label className="rotulo-2">Senha temporária</label>
                  <div className="campo-linha">
                    <input className="campo baixo" value={f.senha} readOnly />
                    <button className="olho" onClick={() => set("senha", gerarSenha())}>gerar</button>
                  </div></div>
              </div>
              <p className="meta">O cliente é obrigado a trocar essa senha no primeiro acesso.</p>
            </>
          )}

          <div className="acoes">
            <button className="btn btn-forte" disabled={!valido} onClick={() => onSalvar(f, arquivo)}>{novo ? "Cadastrar cliente" : "Salvar dados"}</button>
            <button className="btn btn-leve" onClick={onFechar}>Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Perfil({ cliente, adm, onEditar }) {
  if (!cliente) return null;
  const linhas = [
    ["Razão social", cliente.razao], ["CNPJ", cliente.cnpj], ["Segmento", cliente.segmento],
    ["Cidade", cliente.endereco], ["Contato", cliente.contato], ["Telefone", cliente.telefone],
    ["E-mail", cliente.email], ["Instagram", cliente.instagram],
    ["Início do contrato", dataCurta(cliente.inicio)], ["Plano", cliente.plano],
  ];
  return (
    <section>
      <Cabecalho titulo="Perfil" apoio={adm ? "Dados cadastrais e regras da conta." : "Se algum dado estiver errado, avise a Duo."}
        acao={adm ? <button className="btn btn-leve" onClick={onEditar}>Editar dados</button> : null} />
      <div className="perfil-topo card rel">
        <Foto cliente={cliente} tamanho={72} />
        <div>
          <h3 className="card-titulo grande">{cliente.nome}</h3>
          <p className="meta">{cliente.segmento} · desde {dataCurta(cliente.inicio)}</p>
        </div>
      </div>
      <div className="grade dois">
        {linhas.map(([k, v]) => (
          <div className="dado baixo" key={k}>
            <span className="rotulo sem-topo">{k}</span>
            <span className="dado-valor">{v || "—"}</span>
          </div>
        ))}
      </div>
      {adm && cliente.obs && (
        <div className="nota baixo"><p className="rotulo sem-topo">Observações internas (o cliente não vê)</p><p>{cliente.obs}</p></div>
      )}
    </section>
  );
}

/* ----------------------------- calendário --------------------------- */

function Agenda({ dias, itens, adm, onAbrir, onNova }) {
  return (
    <section>
      <p className="apoio topo-apoio">
        {adm ? "Toque em um bloco para editar, ou no + para criar um post no dia." : "Cada bloco é um post da semana. Toque para ver os arquivos e responder."}
      </p>
      <div className="legenda-tipos">
        {TIPOS.map((t) => (<span key={t.nome} className="lt"><span className={`lt-cor tipo-${slug(t.nome)}`} />{t.nome}</span>))}
      </div>
      <div className="trilha baixo">
        {dias.map((dia, d) => {
          const doDia = itens.filter((i) => i.dia === d);
          return (
            <div className="dia" key={dia.sigla}>
              <div className="dia-cab"><span className="dia-sigla">{dia.sigla}</span><span className="dia-num">{dia.num}</span></div>
              <div className="dia-pista">
                {doDia.length === 0 && !adm && <span className="vazio">livre</span>}
                {doDia.map((i) => (
                  <button key={i.id} className={`clipe rel tipo-${slug(i.tipo)}`} onClick={() => onAbrir(i.id)}>
                    <span className="clipe-hora">{i.hora}</span>
                    <span className="clipe-tipo">{i.tipo}</span>
                    <span className="clipe-titulo">{i.titulo}</span>
                    <span className={`ponto ponto-${statusVisivel(i)}`} />
                  </button>
                ))}
                {adm && <button className="add" onClick={() => onNova(d)}>+</button>}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Ajustes({ usados }) {
  const restam = MAX_AJUSTES - usados;
  return (
    <div className="perf-wrap">
      <div className="perf-row" role="img" aria-label={`${restam} de ${MAX_AJUSTES} alterações restantes`}>
        {Array.from({ length: MAX_AJUSTES }).map((_, i) => (<span key={i} className={i < usados ? "perf baixo" : "perf rel"} />))}
      </div>
      <span className="perf-txt">{restam === 0 ? "Limite atingido" : `${restam} de ${MAX_AJUSTES} alterações restantes`}</span>
    </div>
  );
}

function Capa({ item }) {
  const img = item.arquivos.find((a) => a.tipo === "imagem");
  if (img) return <img src={img.url} alt="" className="capa" />;
  return <div className="capa capa-vazia baixo">{item.tipo}</div>;
}

function Cartao({ item, dias, onAbrir }) {
  const d = dias && dias[item.dia];
  const sv = statusVisivel(item);
  return (
    <button className="card rel" onClick={onAbrir}>
      <div className="card-topo">
        <span className="cod">{item.id}</span>
        <span className={`pill pill-${sv}`}>{STATUS_LABEL[sv]}</span>
      </div>
      <div className="card-corpo">
        <Capa item={item} />
        <div>
          <h3 className="card-titulo">{item.titulo}</h3>
          <p className="meta">{item.tipo} · v{item.versao} · {item.formato}</p>
          {d && <p className="meta">Vai ao ar {d.sigla} {d.num}, {item.hora}</p>}
          <p className="meta">{item.arquivos.length > 0 ? `${item.arquivos.length} arquivo(s)` : "sem arquivos ainda"}</p>
        </div>
      </div>
      <Ajustes usados={item.ajustes.length} />
    </button>
  );
}

/* ---------------------------- aprovações ---------------------------- */

function Entregas({ itens, dias, cliente, semana, onAbrir, onAnexar, onEnviar, onPublicar, onEditar, onLiberar }) {
  const [filtro, setFiltro] = useState(null);
  const conta = (s) => itens.filter((i) => statusVisivel(i) === s).length;
  const todos = itens.filter((i) => i.tipo !== "Gravação");
  const lista = filtro ? todos.filter((i) => statusVisivel(i) === filtro) : todos;
  const ocupado = todos.reduce((s, i) => s + pesoDoPost(i), 0);
  const soltos = todos.filter(podeLiberar);
  const liberavel = soltos.reduce((s, i) => s + pesoDoPost(i), 0);
  const painéis = [
    ["rascunho", "em rascunho"],
    ["aguardando", "na mão do cliente"],
    ["ajuste", "para refazer"],
    ["aprovado", "prontos para subir"],
    ["publicado", "publicados"],
  ];
  return (
    <section>
      <Cabecalho titulo="Aprovações"
        apoio={`${cliente ? cliente.nome : ""} · ${semana ? tituloSemana(semana).toLowerCase() : ""}. Toque em um número para ver só aquele grupo; toque de novo para voltar a ver todos.`} />
      <div className="placar">
        {painéis.map(([chave, t]) => (
          <button className={filtro === chave ? "placar-item baixo ativo" : "placar-item rel"} key={chave}
            onClick={() => setFiltro(filtro === chave ? null : chave)}>
            <span className="placar-num">{conta(chave)}</span>
            <span className="placar-txt">{t}</span>
          </button>
        ))}
      </div>
      {ocupado > 0 && (
        <div className="espaco baixo">
          <div className="espaco-txt">
            <b>{pesoLegivel(ocupado)}</b> de material nesta semana
            {liberavel > 0
              ? <> · <b>{pesoLegivel(liberavel)}</b> em {soltos.length} post(s) já publicado(s), prontos para apagar</>
              : <> · nada pendente de limpeza aqui</>}
          </div>
          {liberavel > 0 && (
            <button className="btn btn-leve btn-mini" onClick={() => {
              if (window.confirm(
                `Apagar os arquivos de ${soltos.length} post(s) já publicado(s)?\n\n` +
                `${pesoLegivel(liberavel)} serão removidos do servidor.\n\n` +
                `Os posts continuam no histórico. Não tem como desfazer.`
              )) soltos.forEach((i) => onLiberar(i.id, true));
            }}>
              Liberar tudo que já foi ao ar
            </button>
          )}
        </div>
      )}
      {filtro && (
        <div className="filtro-aviso">
          <span>Mostrando apenas: <b>{STATUS_LABEL[filtro]}</b></span>
          <button className="btn btn-leve btn-mini" onClick={() => setFiltro(null)}>Ver todos</button>
        </div>
      )}
      {lista.length === 0 ? (
        <div className="nada baixo">
          {filtro ? "Nenhum post neste grupo nesta semana." : `Nenhum post nesta semana para ${cliente ? cliente.nome : "este cliente"}. Crie na aba Calendário.`}
        </div>
      ) : (
        <div className="grade">
          {lista.map((item) => {
            const d = dias[item.dia];
            const sv = statusVisivel(item);
            return (
              <div className={`card rel borda-${slug(item.tipo)}`} key={item.id}>
                <div className="card-topo">
                  <span className="cod">{item.id} · v{item.versao}</span>
                  <span className={`pill pill-${sv}`}>{STATUS_LABEL[sv]}</span>
                </div>
                <h3 className="card-titulo">{item.titulo}</h3>
                <p className="meta">{item.tipo} · {d ? `${d.sigla} ${d.num}` : ""} {item.hora} · {item.formato}</p>
                {item.ajustes.length > 0 && (
                  <div className="pedido">
                    <span className="pedido-tag">Alteração {item.ajustes[item.ajustes.length - 1].n} · {item.ajustes[item.ajustes.length - 1].motivo}</span>
                    <p className="pedido-txt">{item.ajustes[item.ajustes.length - 1].pedido}</p>
                  </div>
                )}
                <div className="anexo baixo">
                  <span className="anexo-titulo">
                    {item.liberado ? "Arquivos removidos do servidor" : item.pacote ? item.pacote.nome : "Nenhum pacote anexado"}
                    {!item.liberado && pesoDoPost(item) > 0 && <span className="peso">{pesoLegivel(pesoDoPost(item))}</span>}
                  </span>
                  <span className="meta">
                    {item.liberado
                      ? `${item.liberado.quando} · ${item.liberado.qtd} arquivo(s) · ${pesoLegivel(item.liberado.bytes)} liberados`
                      : item.arquivos.length > 0
                        ? item.arquivos.map((a) => a.nome).join(" · ")
                        : "Aceita .zip com jpg/png/mp4, ou arquivos soltos"}
                  </span>
                  <input id={`up-${item.id}`} type="file" multiple className="oculto" accept=".zip,.jpg,.jpeg,.png,.webp,.mp4,.mov"
                    onChange={(e) => { if (e.target.files.length) onAnexar(item.id, e.target.files); e.target.value = ""; }} />
                  <label className="btn btn-leve btn-mini" htmlFor={`up-${item.id}`}>Anexar arquivos</label>
                </div>
                <Ajustes usados={item.ajustes.length} />
                <div className="acoes">
                  {(item.status === "rascunho" || item.status === "ajuste") && (
                    <button className="btn btn-forte" disabled={item.arquivos.length === 0} onClick={() => onEnviar(item.id)}>
                      {item.status === "rascunho" ? "Enviar para aprovação" : `Enviar versão ${item.versao + 1}`}
                    </button>
                  )}
                  {item.status === "aprovado" && <button className="btn btn-forte" onClick={() => onPublicar(item.id)}>Marcar como publicado</button>}
                  {item.status === "aguardando" && <span className="espera">Aguardando o cliente</span>}
                  {item.status === "publicado" && <span className="espera">Encerrado</span>}
                  {podeLiberar(item) && (
                    <button className="btn btn-limpar btn-mini" onClick={() => onLiberar(item.id)}>
                      Liberar espaço · {pesoLegivel(pesoDoPost(item))}
                    </button>
                  )}
                  <button className="btn btn-leve btn-mini" onClick={() => onEditar(item)}>Editar</button>
                  <button className="btn btn-leve btn-mini" onClick={() => onAbrir(item.id)}>Abrir</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function FormPost({ dados, clientes, semanas, onSalvar, onExcluir, onFechar }) {
  const [f, setF] = useState({
    id: dados.id || null, clienteId: dados.clienteId, semanaId: dados.semanaId, dia: dados.dia,
    hora: dados.hora || "18:00", tipo: dados.tipoPost || "Carrossel", titulo: dados.titulo || "",
    legenda: dados.legenda || "", obs: dados.obs || "", formato: dados.formato || TIPOS[0].formato,
  });
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const semanasCliente = semanas.filter((s) => s.clienteId === f.clienteId).sort((a, b) => a.inicio.localeCompare(b.inicio));
  const semanaSel = semanasCliente.find((s) => s.id === f.semanaId) || semanasCliente[0];
  const diasSel = diasDaSemana(semanaSel);

  useEffect(() => { if (semanaSel && f.semanaId !== semanaSel.id) set("semanaId", semanaSel.id); }, [f.clienteId]); // eslint-disable-line

  const trocarTipo = (t) => {
    const info = TIPOS.find((x) => x.nome === t);
    setF((p) => ({ ...p, tipo: t, formato: p.id ? p.formato : info.formato }));
  };
  const valido = f.titulo.trim().length >= 3 && f.hora.trim() && semanaSel;

  return (
    <div className="fundo" onClick={onFechar}>
      <div className="painel estreito" onClick={(e) => e.stopPropagation()}>
        <div className="painel-topo">
          <div><span className="cod">{f.id ? `Editando ${f.id}` : "Novo post"}</span><h3 className="painel-titulo">Calendário da semana</h3></div>
          <button className="fechar" onClick={onFechar}>×</button>
        </div>
        <div className="painel-corpo bloco-unico">
          <label className="rotulo-2">Cliente</label>
          <select className="campo baixo" value={f.clienteId} onChange={(e) => set("clienteId", e.target.value)} disabled={!!f.id}>
            {clientes.map((c) => (<option key={c.id} value={c.id}>{c.nome}</option>))}
          </select>
          {f.id && <p className="meta">Um post já criado não muda de cliente.</p>}

          <label className="rotulo-2">Calendário / semana</label>
          <select className="campo baixo" value={semanaSel ? semanaSel.id : ""} onChange={(e) => set("semanaId", e.target.value)}>
            {semanasCliente.map((s) => (<option key={s.id} value={s.id}>{tituloSemana(s)}</option>))}
          </select>

          <label className="rotulo-2">Formato do conteúdo</label>
          <div className="motivos">
            {TIPOS.map((t) => (
              <button key={t.nome} className={f.tipo === t.nome ? `motivo baixo tipo-txt-${slug(t.nome)}` : "motivo rel"} onClick={() => trocarTipo(t.nome)}>
                <span className={`lt-cor tipo-${slug(t.nome)}`} />{t.nome}
              </button>
            ))}
          </div>

          <div className="duas">
            <div><label className="rotulo-2">Dia</label>
              <select className="campo baixo" value={f.dia} onChange={(e) => set("dia", Number(e.target.value))}>
                {diasSel.map((d, i) => (<option key={i} value={i}>{d.sigla} · dia {d.num}</option>))}
              </select></div>
            <div><label className="rotulo-2">Horário</label>
              <input className="campo baixo" value={f.hora} onChange={(e) => set("hora", e.target.value)} placeholder="18:30" /></div>
          </div>

          <label className="rotulo-2">Título</label>
          <input className="campo baixo" value={f.titulo} onChange={(e) => set("titulo", e.target.value)} placeholder="O que é esse conteúdo" />

          <label className="rotulo-2">Especificação técnica (o cliente vê)</label>
          <input className="campo baixo" value={f.formato} onChange={(e) => set("formato", e.target.value)} />

          <label className="rotulo-2">Legenda</label>
          <textarea className="campo baixo" rows={4} value={f.legenda} onChange={(e) => set("legenda", e.target.value)} placeholder="A legenda que vai no post." />

          <label className="rotulo-2">Outras observações</label>
          <textarea className="campo baixo" rows={2} value={f.obs} onChange={(e) => set("obs", e.target.value)} placeholder="Hashtags, marcações, ordem de publicação, o que for." />

          <div className="acoes">
            <button className="btn btn-forte" disabled={!valido} onClick={() => onSalvar({ ...f, semanaId: semanaSel.id })}>{f.id ? "Salvar alterações" : "Criar post"}</button>
            <button className="btn btn-leve" onClick={onFechar}>Cancelar</button>
            {f.id && <button className="btn btn-leve btn-mini apagar" onClick={() => onExcluir(f.id)}>Excluir</button>}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- métricas ----------------------------- */

const CORES = ["#7A4A22", "#4C5A66", "#55684F", "#8C6D2E", "#A4522F", "#706860"];
const W = 620, H = 220;

function Dica({ dica }) {
  if (!dica) return null;
  return (
    <div className="dica" style={{ left: `${dica.x}%`, top: `${dica.y}%` }}>
      <span className="dica-rot">{dica.rotulo}</span>
      <span className="dica-val">{dica.valor}</span>
    </div>
  );
}

function GraficoLinha({ pontos, nome, aoPassar }) {
  const pl = 24, pr = 24, pt = 26, pb = 36;
  const vals = pontos.map((p) => p.valor);
  const max = Math.max(...vals), min = Math.min(...vals, 0);
  const x = (i) => pl + (i * (W - pl - pr)) / (pontos.length - 1 || 1);
  const y = (v) => H - pb - ((v - min) / (max - min || 1)) * (H - pt - pb);
  const linha = pontos.map((p, i) => `${i ? "L" : "M"}${x(i)},${y(p.valor)}`).join(" ");
  const area = `${linha} L${x(pontos.length - 1)},${H - pb} L${x(0)},${H - pb} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="grafico" onMouseLeave={() => aoPassar(null)}>
      <path d={area} className="g-area" />
      <path d={linha} className="g-linha" />
      {pontos.map((p, i) => (
        <g key={i}>
          <circle cx={x(i)} cy={y(p.valor)} r="14" className="g-alvo"
            onMouseEnter={() => aoPassar({ rotulo: `${nome} · ${p.rotulo}`, valor: num(p.valor), x: (x(i) / W) * 100, y: (y(p.valor) / H) * 100 })} />
          <circle cx={x(i)} cy={y(p.valor)} r="4.5" className="g-ponto" />
          <text x={x(i)} y={H - 12} className="g-rotulo" textAnchor="middle">{p.rotulo}</text>
        </g>
      ))}
    </svg>
  );
}

function GraficoBarras({ pontos, nome, aoPassar }) {
  const pl = 24, pr = 24, pt = 26, pb = 36;
  const max = Math.max(...pontos.map((p) => p.valor), 1);
  const larg = (W - pl - pr) / pontos.length;
  const bw = Math.min(76, larg * 0.56);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="grafico" onMouseLeave={() => aoPassar(null)}>
      {pontos.map((p, i) => {
        const alt = (p.valor / max) * (H - pt - pb);
        const bx = pl + i * larg + larg / 2 - bw / 2;
        const by = H - pb - alt;
        return (
          <g key={i}>
            <rect x={bx} y={by} width={bw} height={alt} rx="6" className="g-barra"
              onMouseEnter={() => aoPassar({ rotulo: `${nome} · ${p.rotulo}`, valor: num(p.valor), x: ((bx + bw / 2) / W) * 100, y: (by / H) * 100 })} />
            <text x={bx + bw / 2} y={H - 12} className="g-rotulo" textAnchor="middle">{p.rotulo}</text>
          </g>
        );
      })}
    </svg>
  );
}

function GraficoPizza({ pontos, nome, aoPassar }) {
  const total = pontos.reduce((s, p) => s + p.valor, 0) || 1;
  const cx = 110, cy = 110, r = 92;
  let ang = -Math.PI / 2;
  const fatias = pontos.map((p) => {
    const passo = (p.valor / total) * Math.PI * 2;
    const ini = ang; ang += passo;
    const x1 = cx + r * Math.cos(ini), y1 = cy + r * Math.sin(ini);
    const x2 = cx + r * Math.cos(ang), y2 = cy + r * Math.sin(ang);
    const meio = ini + passo / 2;
    return {
      p, pct: (p.valor / total) * 100,
      d: `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${passo > Math.PI ? 1 : 0} 1 ${x2},${y2} Z`,
      mx: cx + (r * 0.6) * Math.cos(meio), my: cy + (r * 0.6) * Math.sin(meio),
    };
  });
  return (
    <div className="pizza-linha">
      <svg viewBox="0 0 220 220" className="grafico pizza" onMouseLeave={() => aoPassar(null)}>
        {fatias.map((f, i) => (
          <path key={i} d={f.d} fill={CORES[i % CORES.length]} className="g-fatia"
            onMouseEnter={() => aoPassar({
              rotulo: `${nome} · ${f.p.rotulo}`, valor: `${num(f.p.valor)} · ${f.pct.toFixed(0)}%`,
              x: (f.mx / 220) * 100, y: (f.my / 220) * 100,
            })} />
        ))}
        <circle cx={cx} cy={cy} r="42" className="pizza-miolo" />
      </svg>
      <div className="pizza-legenda">
        {fatias.map((f, i) => (
          <div className="pl-item" key={i}>
            <span className="pl-cor" style={{ background: CORES[i % CORES.length] }} />
            <span className="pl-nome">{f.p.rotulo}</span>
            <span className="pl-valor">{num(f.p.valor)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Metricas({ adm, cliente, metricas, registros, onNovoPeriodo, onEditarPeriodo, onCriarMetrica }) {
  const [sel, setSel] = useState(metricas[0] ? metricas[0].id : null);
  const [nova, setNova] = useState(null);
  const [vis, setVis] = useState("linha");
  const [dica, setDica] = useState(null);
  const metrica = metricas.find((m) => m.id === sel) || metricas[0];

  const pontos = registros
    .filter((r) => r.valores[metrica ? metrica.id : ""] !== undefined && r.valores[metrica.id] !== "")
    .map((r) => ({ rotulo: r.periodo.length > 12 ? r.periodo.slice(0, 11) + "…" : r.periodo, valor: Number(r.valores[metrica.id]) }));

  const variacao = (m) => {
    const comValor = registros.filter((r) => r.valores[m.id] !== undefined && r.valores[m.id] !== "");
    if (comValor.length < 2) return null;
    const ini = Number(comValor[0].valores[m.id]), fim = Number(comValor[comValor.length - 1].valores[m.id]);
    if (!ini) return { abs: fim - ini, pct: null };
    return { abs: fim - ini, pct: ((fim - ini) / ini) * 100 };
  };

  return (
    <section>
      <Cabecalho titulo="Métricas" apoio={`Resultados de ${cliente ? cliente.nome : ""} por período. ${adm ? "Cadastre um período novo a cada fechamento de mês." : "Números registrados pela Duo."}`}
        acao={adm ? <button className="btn btn-forte" onClick={onNovoPeriodo}>Novo período</button> : null} />

      {registros.length === 0 ? (
        <div className="nada baixo">Nenhum período cadastrado ainda.</div>
      ) : (
        <>
          <div className="barra-visual">
            <div className="chips-metrica">
              {metricas.map((m) => (
                <button key={m.id} className={m.id === (metrica && metrica.id) ? "atalho baixo" : "atalho rel"}
                  onClick={() => setSel(m.id)} disabled={vis === "tabela"}>{m.nome}</button>
              ))}
            </div>
            <div className="chips-metrica">
              {[["linha", "Linha"], ["barras", "Barras"], ["pizza", "Pizza"], ["tabela", "Tabela"]].map(([k, r]) => (
                <button key={k} className={vis === k ? "atalho baixo" : "atalho rel"} onClick={() => { setVis(k); setDica(null); }}>{r}</button>
              ))}
            </div>
          </div>

          {vis !== "tabela" && metrica && (
            pontos.length < 2 && vis !== "pizza" ? (
              <div className="nada baixo">Cadastre pelo menos dois períodos para ver a evolução.</div>
            ) : (
              <div className="gcaixa baixo">
                <p className="g-titulo">{metrica.nome}</p>
                <div className="g-area-hover">
                  {vis === "linha" && <GraficoLinha pontos={pontos} nome={metrica.nome} aoPassar={setDica} />}
                  {vis === "barras" && <GraficoBarras pontos={pontos} nome={metrica.nome} aoPassar={setDica} />}
                  {vis === "pizza" && <GraficoPizza pontos={pontos} nome={metrica.nome} aoPassar={setDica} />}
                  <Dica dica={dica} />
                </div>
                <p className="meta centro">Passe o mouse sobre o gráfico para ver os números.</p>
              </div>
            )
          )}

          {vis === "tabela" && (
            <div className="tabela-rolagem baixo">
              <table className="tabela">
                <thead>
                  <tr>
                    <th>Métrica</th>
                    {registros.map((r) => (<th key={r.id}>{r.periodo}<span className="th-data">{dataCurta(r.data)}</span></th>))}
                    <th>Variação</th>
                  </tr>
                </thead>
                <tbody>
                  {metricas.map((m) => {
                    const v = variacao(m);
                    return (
                      <tr key={m.id}>
                        <td className="td-nome">{m.nome}{m.unidade ? ` (${m.unidade})` : ""}</td>
                        {registros.map((r) => (<td key={r.id}>{num(r.valores[m.id])}</td>))}
                        <td className={v && v.abs > 0 ? "td-sobe" : v && v.abs < 0 ? "td-desce" : ""}>
                          {v ? `${v.abs > 0 ? "+" : ""}${num(v.abs)}${v.pct !== null ? ` · ${v.pct > 0 ? "+" : ""}${v.pct.toFixed(0)}%` : ""}` : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {vis !== "tabela" && (
            <div className="resumo-metricas">
              {metricas.map((m) => {
                const v = variacao(m);
                const ultimo = [...registros].reverse().find((r) => r.valores[m.id] !== undefined && r.valores[m.id] !== "");
                return (
                  <div className="resumo baixo" key={m.id}>
                    <span className="rotulo sem-topo">{m.nome}</span>
                    <span className="resumo-num">{ultimo ? num(ultimo.valores[m.id]) : "—"}</span>
                    <span className={v && v.abs > 0 ? "resumo-var td-sobe" : v && v.abs < 0 ? "resumo-var td-desce" : "resumo-var"}>
                      {v ? `${v.abs > 0 ? "+" : ""}${num(v.abs)} desde o início` : "sem comparativo"}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {adm && (
            <div className="acoes">
              {registros.map((r) => (
                <button key={r.id} className="btn btn-leve btn-mini" onClick={() => onEditarPeriodo(r)}>Editar {r.periodo}</button>
              ))}
            </div>
          )}
        </>
      )}

      {adm && (
        <>
          <h3 className="sub">Criar métrica</h3>
          {nova === null ? (
            <button className="btn btn-leve" onClick={() => setNova({ nome: "", unidade: "" })}>Nova métrica</button>
          ) : (
            <div className="card rel max-form">
              <label className="rotulo-2">Nome da métrica</label>
              <input className="campo baixo" value={nova.nome} onChange={(e) => setNova({ ...nova, nome: e.target.value })} placeholder="Ex: Pedidos pelo WhatsApp" />
              <label className="rotulo-2">Unidade (opcional)</label>
              <input className="campo baixo" value={nova.unidade} onChange={(e) => setNova({ ...nova, unidade: e.target.value })} placeholder="%, R$, un" />
              <div className="acoes">
                <button className="btn btn-forte btn-mini" disabled={!nova.nome.trim()} onClick={() => { onCriarMetrica(nova.nome, nova.unidade); setNova(null); }}>Criar</button>
                <button className="btn btn-leve btn-mini" onClick={() => setNova(null)}>Cancelar</button>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}

function FormPeriodo({ dados, metricas, onSalvar, onExcluir, onFechar }) {
  const [f, setF] = useState({
    id: dados.id || null, periodo: dados.periodo || "", data: dados.data || paraIso(new Date()),
    valores: { ...(dados.valores || {}) },
  });
  const setValor = (mid, v) => setF((p) => ({ ...p, valores: { ...p.valores, [mid]: v } }));
  return (
    <div className="fundo" onClick={onFechar}>
      <div className="painel estreito" onClick={(e) => e.stopPropagation()}>
        <div className="painel-topo">
          <div><span className="cod">{f.id ? "Editando período" : "Novo período"}</span><h3 className="painel-titulo">Métricas</h3></div>
          <button className="fechar" onClick={onFechar}>×</button>
        </div>
        <div className="painel-corpo bloco-unico">
          <div className="duas">
            <div><label className="rotulo-2">Nome do período</label>
              <input className="campo baixo" value={f.periodo} onChange={(e) => setF({ ...f, periodo: e.target.value })} placeholder="Início do contrato, Agosto 2026…" /></div>
            <div><label className="rotulo-2">Data de referência</label>
              <input type="date" className="campo baixo" value={f.data} onChange={(e) => setF({ ...f, data: e.target.value })} /></div>
          </div>
          <p className="rotulo">Números do período</p>
          {metricas.map((m) => (
            <div className="linha-metrica" key={m.id}>
              <span className="lm-nome">{m.nome}{m.unidade ? ` (${m.unidade})` : ""}</span>
              <input className="campo baixo lm-campo" type="number" value={f.valores[m.id] !== undefined ? f.valores[m.id] : ""}
                onChange={(e) => setValor(m.id, e.target.value)} placeholder="—" />
            </div>
          ))}
          <div className="acoes">
            <button className="btn btn-forte" disabled={!f.periodo.trim()} onClick={() => onSalvar(f)}>Salvar período</button>
            <button className="btn btn-leve" onClick={onFechar}>Cancelar</button>
            {f.id && <button className="btn btn-leve btn-mini apagar" onClick={() => onExcluir(f.id)}>Excluir período</button>}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------- documentos ---------------------------- */

function Documentos({ adm, cliente, documentos, onNovo, onEnviar, onAssinar, onRecusar }) {
  const conta = (s) => documentos.filter((d) => d.status === s).length;
  return (
    <section>
      <Cabecalho titulo="Documentos"
        apoio={adm ? `Contratos e aditivos de ${cliente ? cliente.nome : ""}. O assinado fica guardado no perfil.` : "Contratos e documentos enviados pela Duo."}
        acao={adm ? <button className="btn btn-forte" onClick={onNovo}>Enviar documento</button> : null} />

      {adm && (
        <div className="placar">
          {[[conta("rascunho"), "em rascunho"], [conta("aguardando"), "aguardando assinatura"], [conta("assinado"), "assinados"], [conta("recusado"), "recusados"]].map(([n, t]) => (
            <div className="placar-item rel" key={t}><span className="placar-num">{n}</span><span className="placar-txt">{t}</span></div>
          ))}
        </div>
      )}

      {!adm && documentos.some((d) => d.status === "aguardando") && (
        <div className="chamada rel">
          <span className="chamada-tag">Precisa de você</span>
          <p className="chamada-txt">
            {documentos.filter((d) => d.status === "aguardando").length === 1
              ? "Há 1 documento aguardando a sua assinatura."
              : `Há ${documentos.filter((d) => d.status === "aguardando").length} documentos aguardando a sua assinatura.`}
            {" "}Abra o arquivo, confira e use o botão Assinar no cartão correspondente.
          </p>
        </div>
      )}

      {documentos.length === 0 ? (
        <div className="nada baixo">Nenhum documento por aqui ainda.</div>
      ) : (
        <div className="grade">
          {documentos.map((d) => (
            <div className="card rel" key={d.id}>
              <div className="card-topo">
                <span className="cod">{d.tipo}</span>
                <span className={`pill doc-${d.status}`}>{DOC_LABEL[d.status]}</span>
              </div>
              <h3 className="card-titulo">{d.nome}</h3>
              <p className="meta">{d.arquivoNome || "sem arquivo"}</p>
              <p className="meta">Enviado em {dataCurta(d.enviadoEm)} · Assinado em {dataCurta(d.assinadoEm)}</p>

              {d.assinatura && (
                <div className="pedido assinatura">
                  <span className="pedido-tag">Assinado eletronicamente</span>
                  <p className="pedido-txt">{d.assinatura.nome} · {d.assinatura.quando}<br /><span className="cod">código {d.assinatura.codigo}</span></p>
                </div>
              )}
              {d.recusa && (
                <div className="pedido">
                  <span className="pedido-tag">Recusado · {d.recusa.quando}</span>
                  <p className="pedido-txt">{d.recusa.motivo}</p>
                </div>
              )}

              <div className="acoes">
                {d.url && <a className="btn btn-leve btn-mini" href={d.url} target="_blank" rel="noreferrer">Abrir arquivo</a>}
                {adm && d.status === "rascunho" && <button className="btn btn-forte btn-mini" onClick={() => onEnviar(d.id)}>Enviar ao cliente</button>}
                {adm && d.status === "aguardando" && <span className="espera">Aguardando assinatura</span>}
                {!adm && d.status === "aguardando" && (
                  <>
                    <button className="btn btn-forte btn-mini" onClick={() => onAssinar(d)}>Assinar</button>
                    <button className="btn btn-leve btn-mini apagar" onClick={() => onRecusar(d)}>Recusar</button>
                  </>
                )}
              </div>

              <details className="detalhes">
                <summary>Histórico</summary>
                <ol className="tempo">
                  {d.historico.map((h, i) => (
                    <li key={i}><span className="tempo-quando">{h.quando}</span><span className="tempo-txt">{h.texto}</span></li>
                  ))}
                </ol>
              </details>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function FormDocumento({ dados, onSalvar, onFechar }) {
  const [f, setF] = useState({
    clienteId: dados.clienteId, nome: dados.nome || "", tipo: dados.docTipo || "Contrato",
    exigeAssinatura: dados.exigeAssinatura !== false, url: null, arquivoNome: null,
  });
  const [arquivo, setArquivo] = useState(null);
  return (
    <div className="fundo" onClick={onFechar}>
      <div className="painel estreito" onClick={(e) => e.stopPropagation()}>
        <div className="painel-topo">
          <div><span className="cod">Novo documento</span><h3 className="painel-titulo">Enviar ao cliente</h3></div>
          <button className="fechar" onClick={onFechar}>×</button>
        </div>
        <div className="painel-corpo bloco-unico">
          <label className="rotulo-2">Nome do documento</label>
          <input className="campo baixo" value={f.nome} onChange={(e) => setF({ ...f, nome: e.target.value })} placeholder="Contrato de prestação de serviços" />
          <label className="rotulo-2">Tipo</label>
          <select className="campo baixo" value={f.tipo} onChange={(e) => setF({ ...f, tipo: e.target.value })}>
            {["Contrato", "Aditivo", "Proposta", "Briefing", "Outro"].map((t) => (<option key={t}>{t}</option>))}
          </select>
          <label className="rotulo-2">Arquivo</label>
          <input type="file" className="campo baixo arquivo" accept=".pdf,.doc,.docx,.jpg,.png"
            onChange={(e) => setArquivo(e.target.files[0] || null)} />
          <label className="check">
            <input type="checkbox" checked={f.exigeAssinatura} onChange={(e) => setF({ ...f, exigeAssinatura: e.target.checked })} />
            Exige assinatura eletrônica do cliente
          </label>
          <p className="meta">O documento nasce como rascunho. Ele só aparece para o cliente quando você clicar em "Enviar ao cliente".</p>
          <div className="acoes">
            <button className="btn btn-forte" disabled={!f.nome.trim()} onClick={() => onSalvar(f, arquivo)}>Salvar documento</button>
            <button className="btn btn-leve" onClick={onFechar}>Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Assinar({ doc, cliente, onAssinar, onFechar }) {
  const [nome, setNome] = useState("");
  const [ok, setOk] = useState(false);
  const valido = nome.trim().length >= 5 && ok;
  return (
    <div className="fundo" onClick={onFechar}>
      <div className="painel estreito" onClick={(e) => e.stopPropagation()}>
        <div className="painel-topo">
          <div><span className="cod">{doc.tipo}</span><h3 className="painel-titulo">Assinar {doc.nome}</h3></div>
          <button className="fechar" onClick={onFechar}>×</button>
        </div>
        <div className="painel-corpo bloco-unico">
          <p className="apoio">Leia o documento antes de assinar. A assinatura registra seu nome, a data e um código de verificação no histórico.</p>
          {doc.url && <a className="btn btn-leve btn-mini" href={doc.url} target="_blank" rel="noreferrer">Abrir o documento</a>}
          <label className="rotulo-2">Nome completo de quem assina</label>
          <input className="campo baixo assinatura-campo" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Seu nome completo" />
          <label className="check">
            <input type="checkbox" checked={ok} onChange={(e) => setOk(e.target.checked)} />
            Li o documento e concordo com os termos, em nome de {cliente ? cliente.nome : "minha empresa"}.
          </label>
          <div className="acoes">
            <button className="btn btn-forte" disabled={!valido} onClick={() => onAssinar(nome.trim())}>Assinar documento</button>
            <button className="btn btn-leve" onClick={onFechar}>Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Recusar({ doc, onRecusar, onFechar }) {
  const [m, setM] = useState("");
  return (
    <div className="fundo" onClick={onFechar}>
      <div className="painel estreito" onClick={(e) => e.stopPropagation()}>
        <div className="painel-topo">
          <div><span className="cod">{doc.tipo}</span><h3 className="painel-titulo">Recusar {doc.nome}</h3></div>
          <button className="fechar" onClick={onFechar}>×</button>
        </div>
        <div className="painel-corpo bloco-unico">
          <label className="rotulo-2">Por que está recusando?</label>
          <textarea className="campo baixo" rows={4} value={m} onChange={(e) => setM(e.target.value)}
            placeholder="Explique o que precisa mudar no documento." />
          <div className="acoes">
            <button className="btn btn-forte" disabled={m.trim().length < 10} onClick={() => onRecusar(m.trim())}>Enviar recusa</button>
            <button className="btn btn-leve" onClick={onFechar}>Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- acessos ------------------------------ */

function Acessos({ clientes, setClientes, usuarios, setUsuarios, sessao, log, onLog, onAviso, onTrocarPropria }) {
  const [temp, setTemp] = useState(null);
  const [trocando, setTrocando] = useState(false);
  const equipe = usuarios.filter((u) => u.tipo === "adm");
  const contas = usuarios.filter((u) => u.tipo === "cliente");

  const trocarFoto = async (clienteId, file) => {
    const url = await lerArquivo(file);
    setClientes((p) => p.map((c) => (c.id === clienteId ? { ...c, foto: url } : c)));
    onAviso({ tom: "ok", texto: "Foto atualizada. Só este cliente vê a dele." });
  };
  const redefinir = (u) => {
    const nova = gerarSenha();
    setUsuarios((p) => p.map((x) => (x.id === u.id ? { ...x, senha: nova, trocarSenha: true } : x)));
    setTemp({ usuario: u.usuario, senha: nova });
    onLog(sessao.nome, `Redefiniu a senha de ${u.nome}`);
  };
  const alternar = (u) => {
    setUsuarios((p) => p.map((x) => (x.id === u.id ? { ...x, ativo: !x.ativo } : x)));
    onLog(sessao.nome, `${u.ativo ? "Desativou" : "Reativou"} o acesso de ${u.nome}`);
  };
  const copiar = async (txt) => {
    try { await navigator.clipboard.writeText(txt); onAviso({ tom: "ok", texto: "Copiado." }); }
    catch (e) { onAviso({ tom: "alerta", texto: "Selecione e copie manualmente." }); }
  };

  return (
    <section>
      <Cabecalho titulo="Acessos" apoio="Quem entra no portal, com que senha e desde quando." />
      {temp && (
        <div className="temp rel">
          <p className="rotulo sem-topo">Senha temporária — aparece uma única vez</p>
          <p className="temp-linha"><span className="temp-user">{temp.usuario}</span><code className="temp-senha">{temp.senha}</code></p>
          <p className="meta">Envie por um canal seguro. No primeiro acesso o cliente é obrigado a criar a senha dele.</p>
          <div className="acoes">
            <button className="btn btn-forte btn-mini" onClick={() => copiar(temp.senha)}>Copiar senha</button>
            <button className="btn btn-leve btn-mini" onClick={() => setTemp(null)}>Já guardei</button>
          </div>
        </div>
      )}

      <h3 className="sub">Equipe Duo</h3>
      <div className="grade">
        {equipe.map((u) => (
          <div className="card rel" key={u.id}>
            <div className="card-topo">
              <span className="avatar rel">{iniciais(u.nome)}</span>
              <span className={u.ativo ? "pill pill-aprovado" : "pill pill-publicado"}>{u.ativo ? "Ativo" : "Desativado"}</span>
            </div>
            <h3 className="card-titulo">{u.nome}</h3>
            <p className="meta">{u.cargo}</p>
            <p className="meta">usuário: {u.usuario} · último acesso: {u.ultimo}</p>
            <div className="acoes">
              {u.id === sessao.id ? <button className="btn btn-leve btn-mini" onClick={() => setTrocando(true)}>Alterar minha senha</button>
                : <span className="espera">Só o próprio dono altera a senha</span>}
            </div>
          </div>
        ))}
      </div>

      {trocando && <TrocaPropria usuario={sessao} onFechar={() => setTrocando(false)} onSalvar={(nova) => { onTrocarPropria(sessao.id, nova); setTrocando(false); }} />}

      <h3 className="sub">Acessos de cliente</h3>
      <div className="grade">
        {contas.map((u) => {
          const c = clientes.find((x) => x.id === u.clienteId);
          return (
            <div className="card rel" key={u.id}>
              <div className="card-topo">
                <Foto cliente={c} tamanho={46} />
                <span className={u.ativo ? "pill pill-aprovado" : "pill pill-publicado"}>{u.ativo ? "Ativo" : "Desativado"}</span>
              </div>
              <h3 className="card-titulo">{c ? c.nome : u.nome}</h3>
              <p className="meta">usuário: {u.usuario} · último acesso: {u.ultimo}</p>
              <p className="meta">{u.trocarSenha ? "Senha temporária — troca pendente" : "Senha definida pelo cliente"}</p>
              <div className="acoes">
                <input id={`foto-${u.id}`} type="file" accept="image/*" className="oculto"
                  onChange={(e) => { if (e.target.files[0]) trocarFoto(u.clienteId, e.target.files[0]); e.target.value = ""; }} />
                <label className="btn btn-leve btn-mini" htmlFor={`foto-${u.id}`}>{c && c.foto ? "Trocar foto" : "Colocar foto"}</label>
                <button className="btn btn-leve btn-mini" onClick={() => redefinir(u)}>Redefinir senha</button>
                <button className="btn btn-leve btn-mini" onClick={() => alternar(u)}>{u.ativo ? "Desativar" : "Reativar"}</button>
              </div>
            </div>
          );
        })}
      </div>

      <h3 className="sub">Registro de atividade</h3>
      <ul className="lista baixo">
        {log.map((r, i) => (
          <li key={i}><div className="estatica"><span className="cod">{r.quando}</span><span className="linha-titulo"><b>{r.quem}</b> — {r.texto}</span></div></li>
        ))}
      </ul>

      <div className="nota baixo">
        <p className="rotulo sem-topo">Sobre a segurança deste protótipo</p>
        <p>
          Aqui as senhas ficam na memória do navegador e a assinatura eletrônica é simbólica, só para testar o fluxo.
          Na versão publicada, senhas precisam de hash no servidor, a separação entre clientes precisa existir no banco
          (Row Level Security) e a assinatura, para valer juridicamente, precisa de um provedor com carimbo de tempo —
          Clicksign, ZapSign ou D4Sign resolvem isso e têm API.
        </p>
      </div>
    </section>
  );
}

function TrocaPropria({ usuario, onFechar, onSalvar }) {
  const [atual, setAtual] = useState(""); const [n1, setN1] = useState(""); const [n2, setN2] = useState("");
  const [erro, setErro] = useState("");
  const regras = regrasSenha(n1);
  const ok = regras.every((r) => r.ok) && n1 === n2 && atual;
  return (
    <div className="fundo" onClick={onFechar}>
      <div className="painel estreito" onClick={(e) => e.stopPropagation()}>
        <div className="painel-topo"><h3 className="painel-titulo">Alterar minha senha</h3><button className="fechar" onClick={onFechar}>×</button></div>
        <div className="painel-corpo bloco-unico">
          <label className="rotulo-2">Senha atual</label>
          <input className="campo baixo" type="password" value={atual} onChange={(e) => setAtual(e.target.value)} />
          <label className="rotulo-2">Nova senha</label>
          <input className="campo baixo" type="password" value={n1} onChange={(e) => setN1(e.target.value)} />
          <label className="rotulo-2">Repita a nova senha</label>
          <input className="campo baixo" type="password" value={n2} onChange={(e) => setN2(e.target.value)} />
          <ul className="regras">{regras.map((r, i) => (<li key={i} className={r.ok ? "ok" : ""}>{r.ok ? "✓" : "○"} {r.txt}</li>))}</ul>
          {erro && <p className="erro">{erro}</p>}
          <div className="acoes">
            <button className="btn btn-forte" disabled={!ok}
              onClick={() => { if (atual !== usuario.senha) { setErro("A senha atual não confere."); return; } onSalvar(n1); }}>Salvar senha</button>
            <button className="btn btn-leve" onClick={onFechar}>Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------- galeria ------------------------------- */

function Galeria({ item }) {
  const [i, setI] = useState(0);
  const imagens = item.arquivos.filter((a) => a.tipo === "imagem");
  const videos = item.arquivos.filter((a) => a.tipo === "video");
  if (item.arquivos.length === 0) return (
    <div className="visor baixo vazio-visor">
      {item.liberado
        ? `Este post já foi publicado e os arquivos foram removidos do servidor em ${item.liberado.quando}. O registro completo — legenda, versões e alterações — continua abaixo.`
        : "A Duo ainda não anexou os arquivos deste post."}
    </div>
  );
  return (
    <div className="galeria">
      {imagens.length > 0 && (
        <>
          <div className="visor baixo">
            <img src={imagens[i].url} alt={imagens[i].nome} />
            {imagens.length > 1 && (
              <>
                <button className="seta seta-esq rel" onClick={() => setI((i - 1 + imagens.length) % imagens.length)}>‹</button>
                <button className="seta seta-dir rel" onClick={() => setI((i + 1) % imagens.length)}>›</button>
              </>
            )}
          </div>
          <p className="meta centro">{imagens[i].nome} · {i + 1} de {imagens.length}</p>
          {imagens.length > 1 && (
            <div className="tiras">
              {imagens.map((a, k) => (
                <button key={k} className={k === i ? "tira tira-on" : "tira"} onClick={() => setI(k)}><img src={a.url} alt="" /></button>
              ))}
            </div>
          )}
        </>
      )}
      {videos.map((v, k) => (<div key={k} className="visor baixo"><video src={v.url} controls playsInline /></div>))}
      {item.pacote && item.pacote.url && (
        <a className="btn btn-leve btn-mini" href={item.pacote.url} download={item.pacote.nome}>Baixar {item.pacote.nome}</a>
      )}
    </div>
  );
}

/* ----------------------------- painel ------------------------------- */

function Painel({ item, adm, dias, onFechar, onAprovar, onAjuste, onEditar }) {
  const [modo, setModo] = useState("ver");
  const [motivo, setMotivo] = useState(""); const [pedido, setPedido] = useState("");
  const restantes = MAX_AJUSTES - item.ajustes.length;
  const bloqueado = restantes <= 0;
  const valido = motivo && pedido.trim().length >= 15;
  const d = dias && dias[item.dia];
  const sv = statusVisivel(item);

  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onFechar();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onFechar]);

  return (
    <div className="fundo" onClick={onFechar}>
      <div className="painel" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="painel-topo">
          <div><span className="cod">{item.id} · versão {item.versao}</span><h3 className="painel-titulo">{item.titulo}</h3></div>
          <button className="fechar" onClick={onFechar}>×</button>
        </div>
        <div className="painel-corpo">
          <div className="painel-esq"><Galeria item={item} /></div>
          <div className="painel-dir">
            <span className={`pill pill-${sv}`}>{STATUS_LABEL[sv]}</span>
            <p className="rotulo">Quando e o quê</p>
            <p className="meta">{item.tipo} · {d ? `${d.sigla} ${d.num}` : ""} às {item.hora}</p>
            <p className="meta">{item.formato}</p>
            <p className="rotulo">Legenda</p>
            <p className="legenda">{item.legenda}</p>
            {item.obs && (<><p className="rotulo">Observações</p><p className="legenda">{item.obs}</p></>)}
            {item.ajustes.length > 0 && (
              <>
                <p className="rotulo">Alterações solicitadas</p>
                {item.ajustes.map((a) => (
                  <div className="pedido" key={a.n}>
                    <span className="pedido-tag">Alteração {a.n} · {a.motivo}</span>
                    <p className="pedido-txt">{a.pedido}</p>
                  </div>
                ))}
              </>
            )}
            <p className="rotulo">Linha do tempo</p>
            <ol className="tempo">
              {item.historico.map((h, i) => (
                <li key={i}><span className="tempo-quando">{h.quando}</span><span className="tempo-txt">{h.texto}</span></li>
              ))}
            </ol>
            {adm && <div className="acoes"><button className="btn btn-leve btn-mini" onClick={onEditar}>Editar post</button></div>}
          </div>
        </div>

        {!adm && item.status === "aguardando" && (
          <div className="painel-pe">
            {modo === "ver" ? (
              <>
                <Ajustes usados={item.ajustes.length} />
                <div className="acoes">
                  <button className="btn btn-forte" onClick={onAprovar}>Aprovar</button>
                  <button className="btn btn-leve" disabled={bloqueado} onClick={() => setModo("ajuste")}>Solicitar alterações</button>
                </div>
                {bloqueado && (
                  <p className="trava">
                    Limite de {MAX_AJUSTES} solicitações atingido neste post. Isso está registrado no histórico.
                    Para mudar mais alguma coisa, fale com a Duo — vira um novo pedido e pode mexer na data de publicação.
                  </p>
                )}
              </>
            ) : (
              <div className="form">
                <p className="rotulo sem-topo">Solicitação {item.ajustes.length + 1} de {MAX_AJUSTES} — depois desta, restam {restantes - 1}</p>
                <p className="rotulo-2">Qual é o problema?</p>
                <div className="motivos">
                  {MOTIVOS.map((m) => (<button key={m} className={motivo === m ? "motivo baixo" : "motivo rel"} onClick={() => setMotivo(m)}>{m}</button>))}
                </div>
                <p className="rotulo-2">O que precisa mudar, exatamente?</p>
                <textarea className="campo baixo" rows={4} value={pedido} onChange={(e) => setPedido(e.target.value)}
                  placeholder="Diga o trecho e a mudança. Ex: no segundo 8, trocar a embalagem antiga pela nova." />
                <div className="contagem">{pedido.trim().length < 15 ? `Faltam ${15 - pedido.trim().length} caracteres para enviar` : "Pronto para enviar"}</div>
                <div className="acoes">
                  <button className="btn btn-forte" disabled={!valido} onClick={() => onAjuste(motivo, pedido)}>Enviar solicitação</button>
                  <button className="btn btn-leve" onClick={() => setModo("ver")}>Voltar</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------- css -------------------------------- */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600&family=Jost:wght@300&display=swap');

.duo {
  --base: #DBD4CE;
  --luz: rgba(255,255,255,0.92);
  --sombra: rgba(150,136,124,0.42);
  --tinta: #35302B;
  --tinta2: #706860;
  --cacau: #7A4A22;
  --ardosia: #4C5A66;
  --sage: #55684F;
  --brasa: #A4522F;
  --mel: #8C6D2E;

  background: var(--base);
  color: var(--tinta);
  font-family: 'Poppins', system-ui, sans-serif;
  min-height: 100vh;
  padding-bottom: 90px;
}
/* login e troca de senha nao tem a barra de navegacao de baixo, entao nao
   precisam reservar espaco para ela — sem isso sobra rolagem na tela toda */
.duo-auth { padding-bottom: 0; }
.duo *, .duo *::before, .duo *::after { box-sizing: border-box; }
.duo button { font: inherit; cursor: pointer; }
.duo :focus-visible { outline: 2px solid var(--cacau); outline-offset: 3px; }
.oculto { position: absolute; width: 1px; height: 1px; opacity: 0; pointer-events: none; }

.rel { box-shadow: -4px -4px 9px var(--luz), 4px 4px 11px var(--sombra); background: var(--base); border: 0; }
.baixo { box-shadow: inset 3px 3px 6px var(--sombra), inset -3px -3px 6px var(--luz); background: var(--base); border: 0; }

/* marca — única coisa fora da Poppins */
.marca {
  font-family: 'Jost', sans-serif; font-weight: 300; color: var(--base);
  display: inline-block; user-select: none;
  text-shadow: -1px -1px 1px rgba(255,255,255,0.95), -2px -2px 4px rgba(255,255,255,0.65),
               1px 1px 1px rgba(150,136,124,0.55), 2px 2px 5px rgba(150,136,124,0.4);
}
.marca-p { font-size: 30px; letter-spacing: 0.14em; }
.marca-g { font-size: 54px; letter-spacing: 0.16em; }

/* topo */
.topo { display: flex; align-items: center; gap: 14px; padding: 18px 26px; flex-wrap: wrap; }
.topo-sep { width: 1px; height: 22px; background: var(--sombra); }
.topo-nome { font-weight: 300; font-size: 12px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--tinta2); }
.topo-dir { margin-left: auto; display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.chip-cliente { display: flex; align-items: center; gap: 9px; padding: 6px 14px 6px 6px; border-radius: 999px; font-size: 13px; font-weight: 500; color: var(--tinta); }
.seta-baixo { font-size: 10px; color: var(--tinta2); }
.foto { border-radius: 50%; object-fit: cover; display: block; }
.foto-vazia { display: inline-flex; align-items: center; justify-content: center; color: var(--tinta2); font-weight: 400; }
.chip-user { display: flex; align-items: center; gap: 9px; }
.avatar { width: 34px; height: 34px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; color: var(--tinta2); }
.user-txt { display: flex; flex-direction: column; line-height: 1.25; }
.user-txt strong { font-size: 13px; font-weight: 500; }
.user-txt em { font-style: normal; font-size: 10px; color: var(--tinta2); }
.sino { width: 38px; height: 38px; border-radius: 50%; font-size: 16px; color: var(--tinta2); position: relative; }
.badge { position: absolute; top: -3px; right: -3px; background: var(--brasa); color: #fff; font-size: 10px; min-width: 17px; height: 17px; border-radius: 999px; display: flex; align-items: center; justify-content: center; padding: 0 4px; }

/* menus */
.seletor { position: relative; }
.menu { position: absolute; right: 0; top: 48px; z-index: 40; border-radius: 14px; padding: 12px; min-width: 230px; }
.menu-largo { min-width: 300px; max-height: 340px; overflow-y: auto; }
.menu-item { display: flex; align-items: center; gap: 10px; width: 100%; padding: 9px 10px; border: 0; background: transparent; border-radius: 10px; font-size: 13px; color: var(--tinta); text-align: left; }
.menu-item:hover, .menu-on { box-shadow: inset 2px 2px 4px var(--sombra), inset -2px -2px 4px var(--luz); }
.notif { padding: 9px 4px; border-top: 1px solid rgba(150,136,124,0.22); }
.notif-txt { font-size: 13px; display: block; line-height: 1.45; }

/* abas */
.abas { display: flex; gap: 6px; padding: 0 26px 4px; flex-wrap: wrap; }
.aba { font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; padding: 9px 16px; border-radius: 999px; background: transparent; border: 0; color: var(--tinta2); }
.aba-on { color: var(--tinta); box-shadow: inset 3px 3px 6px var(--sombra), inset -3px -3px 6px var(--luz); }

/* estrutura */
.corpo { max-width: 1160px; margin: 0 auto; padding: 22px 26px 0; }
.cab { margin-bottom: 18px; }
.cab-linha { display: flex; align-items: center; justify-content: space-between; gap: 14px; flex-wrap: wrap; }
.titulo { font-weight: 300; font-size: clamp(21px, 3.4vw, 30px); margin: 0; letter-spacing: -0.01em; }
.sub { font-weight: 400; font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--tinta2); margin: 36px 0 14px; }
.apoio { margin: 8px 0 0; color: var(--tinta2); font-size: 14px; max-width: 68ch; line-height: 1.55; }
.topo-apoio { margin-bottom: 12px; }
.rotulo { font-size: 10px; text-transform: uppercase; letter-spacing: 0.16em; color: var(--tinta2); margin: 18px 0 6px; }
.rotulo.sem-topo { margin-top: 0; }
.rotulo-2 { display: block; font-size: 13px; font-weight: 500; margin: 14px 0 7px; }
.cod { font-size: 11px; color: var(--tinta2); }
.meta { font-size: 11px; color: var(--tinta2); margin: 4px 0 0; line-height: 1.55; }
.centro { text-align: center; }

/* nav semana */
.nav-semana { margin-bottom: 20px; }
.nav-linha { display: flex; align-items: center; gap: 14px; }
.nav-centro { flex: 1; text-align: center; }
.nav-atalhos, .chips-metrica { display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; margin-top: 12px; }
.chips-metrica { justify-content: flex-start; margin-bottom: 16px; }
.atalho { border: 0; border-radius: 999px; padding: 7px 14px; font-size: 11px; color: var(--tinta2); }
.atalho.baixo { color: var(--cacau); }
.editar-semana { border-radius: 14px; padding: 16px; margin-top: 14px; }

/* trilha */
.legenda-tipos { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 12px; }
.lt { display: inline-flex; align-items: center; gap: 6px; font-size: 10px; color: var(--tinta2); letter-spacing: 0.06em; text-transform: uppercase; }
.lt-cor { width: 9px; height: 9px; border-radius: 3px; display: inline-block; background: var(--tinta2); }
.tipo-carrossel { background: var(--cacau); }
.tipo-reels { background: var(--ardosia); }
.tipo-story { background: var(--sage); }
.tipo-gravacao { background: var(--brasa); }

.trilha { display: grid; grid-template-columns: repeat(7, minmax(142px, 1fr)); overflow-x: auto; border-radius: 16px; padding: 8px; }
.dia { min-width: 142px; padding: 4px; }
.dia-cab { display: flex; align-items: baseline; justify-content: space-between; padding: 8px 8px 10px; }
.dia-sigla { font-size: 10px; letter-spacing: 0.18em; color: var(--tinta2); }
.dia-num { font-weight: 300; font-size: 19px; }
.dia-pista { display: flex; flex-direction: column; gap: 9px; min-height: 150px; }
.vazio { font-size: 10px; color: var(--tinta2); opacity: 0.5; padding-left: 4px; }
.add { border: 0; background: transparent; color: var(--tinta2); font-size: 17px; font-weight: 200; padding: 6px; border-radius: 10px; opacity: 0.55; }
.add:hover { opacity: 1; box-shadow: inset 2px 2px 4px var(--sombra), inset -2px -2px 4px var(--luz); }

.clipe { text-align: left; padding: 10px 11px 10px 14px; border-radius: 12px; display: flex; flex-direction: column; gap: 3px; position: relative; overflow: hidden; transition: transform .14s ease; background: var(--base); }
.clipe::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: var(--tinta2); }
.clipe.tipo-carrossel::before { background: var(--cacau); }
.clipe.tipo-reels::before { background: var(--ardosia); }
.clipe.tipo-story::before { background: var(--sage); }
.clipe.tipo-gravacao::before { background: var(--brasa); }
.clipe:hover { transform: translateY(-2px); }
.clipe-hora { font-size: 10px; color: var(--tinta2); }
.clipe-tipo { font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; }
.clipe-titulo { font-size: 12px; line-height: 1.35; font-weight: 300; }
.ponto { position: absolute; right: 9px; top: 10px; width: 7px; height: 7px; border-radius: 50%; background: var(--tinta2); opacity: 0.35; }
.ponto-aguardando { background: var(--mel); opacity: 1; }
.ponto-ajuste, .ponto-limite { background: var(--brasa); opacity: 1; }
.ponto-aprovado { background: var(--sage); opacity: 1; }

/* cartões */
.grade { display: grid; grid-template-columns: repeat(auto-fill, minmax(310px, 1fr)); gap: 18px; }
.grade.dois { grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); }
.card { border-radius: 16px; padding: 18px; display: flex; flex-direction: column; gap: 11px; text-align: left; position: relative; overflow: hidden; }
.card.max-form { max-width: 420px; }
.card.borda-carrossel::after, .card.borda-reels::after, .card.borda-story::after, .card.borda-gravacao::after { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; }
.card.borda-carrossel::after { background: var(--cacau); }
.card.borda-reels::after { background: var(--ardosia); }
.card.borda-story::after { background: var(--sage); }
.card.borda-gravacao::after { background: var(--brasa); }
button.card { transition: transform .14s ease; }
button.card:hover { transform: translateY(-2px); }
.card-topo { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.card-corpo { display: flex; gap: 14px; align-items: flex-start; }
.card-titulo { font-weight: 400; font-size: 16px; margin: 0; line-height: 1.35; }
.card-titulo.grande { font-size: 22px; font-weight: 300; }
.capa { width: 64px; height: 80px; object-fit: cover; border-radius: 8px; flex: 0 0 64px; }
.capa-vazia { display: flex; align-items: center; justify-content: center; font-size: 9px; color: var(--tinta2); text-align: center; }
.novo { align-items: center; justify-content: center; gap: 8px; min-height: 170px; color: var(--tinta2); font-size: 13px; }
.mini-placar { display: flex; gap: 7px; flex-wrap: wrap; }
.mp { font-size: 10px; padding: 4px 9px; border-radius: 999px; color: var(--tinta2); box-shadow: inset 2px 2px 4px var(--sombra), inset -2px -2px 4px var(--luz); }
.mp-alerta { color: var(--brasa); }

.pill { font-size: 9px; letter-spacing: 0.06em; text-transform: uppercase; padding: 5px 10px; border-radius: 999px; white-space: nowrap; color: var(--tinta2); box-shadow: inset 2px 2px 4px var(--sombra), inset -2px -2px 4px var(--luz); }
.pill-aguardando { color: var(--mel); }
.pill-ajuste, .pill-limite { color: var(--brasa); }
.pill-aprovado { color: var(--sage); }
.doc-aguardando { color: var(--mel); }
.doc-assinado { color: var(--sage); }
.doc-recusado { color: var(--brasa); }

/* perfil */
.perfil-topo { flex-direction: row; align-items: center; gap: 18px; margin-bottom: 18px; }
.dado { border-radius: 12px; padding: 13px 15px; display: flex; flex-direction: column; gap: 4px; }
.dado-valor { font-size: 14px; }

/* alterações */
.perf-wrap { display: flex; align-items: center; gap: 10px; }
.perf-row { display: flex; gap: 6px; }
.perf { width: 20px; height: 11px; border-radius: 4px; display: block; }
.perf-txt { font-size: 10px; color: var(--tinta2); }

/* listas */
.lista { list-style: none; margin: 0; padding: 8px 14px; border-radius: 14px; }
.linha { width: 100%; display: flex; align-items: center; gap: 12px; padding: 13px 4px; background: transparent; border: 0; text-align: left; }
.lista li + li .linha, .lista li + li .estatica { border-top: 1px solid rgba(150,136,124,0.22); }
.estatica { width: 100%; display: flex; align-items: center; gap: 12px; padding: 12px 4px; }
.linha-titulo { flex: 1; font-size: 13px; }
.nada { border-radius: 14px; padding: 34px; text-align: center; color: var(--tinta2); font-size: 14px; }
.nota { border-radius: 14px; padding: 18px 20px; font-size: 13px; line-height: 1.65; color: var(--tinta2); max-width: 74ch; margin-top: 18px; }

/* placar */
.placar { display: flex; gap: 12px; margin-bottom: 22px; flex-wrap: wrap; }
.placar-item { border-radius: 14px; padding: 15px 20px; flex: 1 1 120px; }
.placar-num { font-weight: 200; font-size: 34px; display: block; line-height: 1.1; }
.placar-txt { font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--tinta2); }

/* pedido */
.pedido { border-radius: 12px; padding: 11px 13px; box-shadow: inset 2px 2px 5px var(--sombra), inset -2px -2px 5px var(--luz); }
.pedido-tag { font-size: 10px; color: var(--brasa); text-transform: uppercase; letter-spacing: 0.06em; }
.assinatura .pedido-tag { color: var(--sage); }
.pedido-txt { margin: 6px 0 0; font-size: 13px; line-height: 1.5; }

/* anexo */
.anexo { border-radius: 12px; padding: 13px; display: flex; flex-direction: column; gap: 6px; align-items: flex-start; }
.anexo-titulo { font-size: 13px; font-weight: 500; word-break: break-all; }
.peso { display: inline-block; margin-left: 8px; font-size: 10px; font-weight: 500; letter-spacing: 0.06em;
        color: var(--tinta2); border: 1px solid rgba(112,104,96,0.28); border-radius: 20px; padding: 2px 8px; white-space: nowrap; }

/* espaço em disco */
.espaco { display: flex; align-items: center; justify-content: space-between; gap: 14px; flex-wrap: wrap;
          border-radius: 14px; padding: 12px 16px; margin: -4px 0 20px; }
.espaco-txt { font-size: 12.5px; color: var(--tinta2); line-height: 1.5; }
.espaco-txt b { color: var(--tinta); font-weight: 500; }

/* tabela de métricas */
.tabela-rolagem { border-radius: 14px; padding: 6px; overflow-x: auto; }
.tabela { width: 100%; border-collapse: collapse; font-size: 13px; min-width: 520px; }
.tabela th { text-align: right; font-weight: 500; font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--tinta2); padding: 12px 10px; }
.tabela th:first-child, .tabela td:first-child { text-align: left; }
.th-data { display: block; font-size: 9px; opacity: 0.7; text-transform: none; letter-spacing: 0; }
.tabela td { text-align: right; padding: 11px 10px; border-top: 1px solid rgba(150,136,124,0.2); }
.td-nome { font-weight: 400; }
.td-sobe { color: var(--sage); }
.td-desce { color: var(--brasa); }

/* gráfico */
.barra-visual { display: flex; justify-content: space-between; gap: 16px; flex-wrap: wrap; align-items: flex-start; }
.gcaixa { border-radius: 14px; padding: 16px; }
.g-titulo { margin: 0 0 6px; font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--tinta2); text-align: center; }
.g-area-hover { position: relative; }
.grafico { width: 100%; height: auto; display: block; overflow: visible; }
.grafico.pizza { max-width: 260px; }
.g-linha { fill: none; stroke: #7A4A22; stroke-width: 2; }
.g-area { fill: rgba(122,74,34,0.12); stroke: none; }
.g-ponto { fill: #7A4A22; pointer-events: none; }
.g-alvo { fill: transparent; cursor: pointer; }
.g-barra { fill: #7A4A22; opacity: 0.82; cursor: pointer; transition: opacity .12s ease; }
.g-barra:hover { opacity: 1; }
.g-fatia { cursor: pointer; stroke: #DBD4CE; stroke-width: 2; transition: opacity .12s ease; }
.g-fatia:hover { opacity: 0.82; }
.pizza-miolo { fill: #DBD4CE; pointer-events: none; }
.g-rotulo { font-size: 11px; fill: #706860; font-family: 'Poppins', sans-serif; }
.pizza-linha { display: flex; gap: 22px; align-items: center; flex-wrap: wrap; justify-content: center; }
.pizza-legenda { display: flex; flex-direction: column; gap: 9px; min-width: 190px; }
.pl-item { display: flex; align-items: center; gap: 9px; font-size: 13px; }
.pl-cor { width: 11px; height: 11px; border-radius: 3px; flex: 0 0 11px; }
.pl-nome { flex: 1; color: var(--tinta2); }
.pl-valor { font-weight: 500; }
.dica { position: absolute; transform: translate(-50%, -125%); background: var(--tinta); color: var(--base); padding: 8px 12px; border-radius: 10px; pointer-events: none; white-space: nowrap; box-shadow: 0 6px 16px rgba(53,48,43,0.3); z-index: 5; }
.dica-rot { display: block; font-size: 10px; opacity: 0.75; }
.dica-val { display: block; font-size: 15px; font-weight: 500; }
.resumo-metricas { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 12px; margin-top: 16px; }
.resumo { border-radius: 12px; padding: 14px 16px; display: flex; flex-direction: column; gap: 3px; }
.resumo-num { font-size: 26px; font-weight: 200; line-height: 1.2; }
.resumo-var { font-size: 11px; color: var(--tinta2); }

/* filtro de aprovações */
.placar-item.ativo { color: var(--cacau); }
.filtro-aviso { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; margin: -8px 0 18px; font-size: 13px; color: var(--tinta2); }

/* olho */
.icone-olho { width: 20px; height: 20px; fill: none; stroke: var(--tinta2); stroke-width: 1.6; stroke-linecap: round; display: block; }
.olho-risco { stroke: var(--brasa); stroke-width: 1.8; }

/* chamada */
.chamada { border-radius: 14px; padding: 16px 20px; margin-bottom: 20px; border-left: 3px solid var(--mel); }
.chamada-tag { font-size: 10px; text-transform: uppercase; letter-spacing: 0.14em; color: var(--mel); }
.chamada-txt { margin: 6px 0 0; font-size: 14px; line-height: 1.55; }
.linha-metrica { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
.lm-nome { flex: 1; font-size: 13px; }
.lm-campo { width: 130px; }

/* ações */
.acoes { display: flex; gap: 9px; flex-wrap: wrap; align-items: center; margin-top: 12px; }
.btn { border: 0; padding: 11px 20px; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; border-radius: 999px; color: var(--tinta); background: var(--base); box-shadow: -3px -3px 7px var(--luz), 3px 3px 9px var(--sombra); display: inline-block; text-decoration: none; }
.btn:hover { box-shadow: -2px -2px 5px var(--luz), 2px 2px 6px var(--sombra); }
.btn:active { box-shadow: inset 3px 3px 6px var(--sombra), inset -3px -3px 6px var(--luz); }
.btn-forte { color: var(--cacau); font-weight: 500; }
.btn-limpar { color: var(--brasa); font-weight: 500; }
.btn-mini { padding: 8px 15px; font-size: 10px; }
.apagar { color: var(--brasa); }
.largo { width: 100%; margin-top: 12px; text-align: center; }
.btn:disabled { opacity: 0.4; cursor: not-allowed; box-shadow: inset 2px 2px 5px var(--sombra), inset -2px -2px 5px var(--luz); }
.espera { font-size: 11px; color: var(--tinta2); }
.trava { font-size: 12px; color: var(--brasa); line-height: 1.55; margin: 12px 0 0; max-width: 56ch; }

/* campos */
.campo { width: 100%; border: 0; border-radius: 10px; padding: 12px 14px; font-family: 'Poppins', sans-serif; font-size: 14px; color: var(--tinta); resize: vertical; }
select.campo { appearance: none; }
.campo.arquivo { font-size: 11px; padding: 10px; }
.assinatura-campo { font-family: 'Jost', sans-serif; font-size: 20px; letter-spacing: 0.02em; }
.campo-linha { display: flex; gap: 8px; align-items: center; }
.duas { display: flex; gap: 12px; }
.duas > div { flex: 1; }
.check { display: flex; align-items: flex-start; gap: 9px; font-size: 13px; line-height: 1.5; margin-top: 16px; color: var(--tinta2); }
.check input { margin-top: 3px; }
.olho { border: 0; background: transparent; font-size: 11px; color: var(--tinta2); padding: 8px; }
.contagem { font-size: 10px; color: var(--tinta2); margin-top: 7px; }
.erro { color: var(--brasa); font-size: 13px; margin: 12px 0 0; }
.regras { list-style: none; padding: 0; margin: 14px 0 0; font-size: 11px; color: var(--tinta2); line-height: 1.9; }
.regras .ok { color: var(--sage); }
.detalhes { margin-top: 6px; }
.detalhes summary { font-size: 11px; color: var(--tinta2); cursor: pointer; }

/* login */
.entrada { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 30px 20px; }
.entrada-caixa { width: 100%; max-width: 380px; border-radius: 22px; padding: 34px 30px 30px; }
.entrada-marca { text-align: center; }
.entrada-sub { text-align: center; font-weight: 300; letter-spacing: 0.24em; text-transform: uppercase; font-size: 10px; color: var(--tinta2); margin: 12px 0 22px; }

/* senha temporária */
.temp { border-radius: 14px; padding: 18px 20px; margin-bottom: 22px; }
.temp-linha { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; margin: 4px 0 0; }
.temp-user { font-size: 14px; font-weight: 500; }
.temp-senha { font-family: 'Poppins', monospace; font-size: 16px; letter-spacing: 0.08em; color: var(--cacau); user-select: all; }

/* painel */
.fundo { position: fixed; inset: 0; background: rgba(53,48,43,0.45); display: flex; align-items: center; justify-content: center; z-index: 50; padding: 16px; backdrop-filter: blur(3px); }
.painel { background: var(--base); width: 100%; max-width: 860px; max-height: 92vh; overflow-y: auto; border-radius: 20px; box-shadow: 0 20px 50px rgba(53,48,43,0.35); animation: sobe .2s ease; }
.painel.estreito { max-width: 470px; }
@keyframes sobe { from { transform: translateY(18px); opacity: 0; } to { transform: none; opacity: 1; } }
.painel-topo { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; padding: 22px 26px 14px; position: sticky; top: 0; background: var(--base); z-index: 2; }
.painel-titulo { font-weight: 300; font-size: 21px; margin: 6px 0 0; line-height: 1.3; }
.fechar { background: transparent; border: 0; font-size: 26px; line-height: 1; color: var(--tinta2); padding: 0 4px; }
.painel-corpo { display: flex; gap: 26px; padding: 6px 26px 22px; flex-wrap: wrap; }
.painel-corpo.bloco-unico { display: block; }
.painel-esq { flex: 1 1 300px; }
.painel-dir { flex: 1 1 280px; }
.legenda { font-size: 14px; line-height: 1.6; margin: 0; }
.tempo { list-style: none; margin: 0; padding: 0 0 0 14px; border-left: 1px solid rgba(150,136,124,0.35); }
.tempo li { padding: 6px 0; position: relative; }
.tempo li::before { content: ''; position: absolute; left: -18px; top: 13px; width: 7px; height: 7px; background: var(--base); border-radius: 50%; box-shadow: inset 1px 1px 2px var(--sombra); }
.tempo-quando { font-size: 10px; color: var(--tinta2); display: block; }
.tempo-txt { font-size: 13px; }
.painel-pe { padding: 18px 26px 26px; }

/* galeria */
.galeria { display: flex; flex-direction: column; gap: 10px; }
.visor { border-radius: 14px; padding: 12px; position: relative; display: flex; align-items: center; justify-content: center; min-height: 190px; }
.visor img, .visor video { max-width: 100%; max-height: 330px; border-radius: 8px; display: block; }
.vazio-visor { font-size: 11px; color: var(--tinta2); text-align: center; line-height: 1.7; }
.seta { position: absolute; top: 50%; transform: translateY(-50%); width: 36px; height: 36px; border-radius: 50%; font-size: 20px; line-height: 1; color: var(--tinta2); }
.seta-esq { left: 8px; } .seta-dir { right: 8px; }
.tiras { display: flex; gap: 8px; overflow-x: auto; padding: 2px; }
.tira { border: 0; background: transparent; padding: 0; border-radius: 8px; opacity: 0.5; flex: 0 0 auto; }
.tira img { width: 46px; height: 58px; object-fit: cover; border-radius: 8px; display: block; }
.tira-on { opacity: 1; box-shadow: 0 0 0 2px var(--cacau); }

/* chips */
.form { max-width: 580px; }
.motivos { display: flex; flex-wrap: wrap; gap: 8px; }
.motivo { border: 0; padding: 9px 15px; font-size: 12px; border-radius: 999px; color: var(--tinta2); display: inline-flex; align-items: center; gap: 7px; }
.motivo.baixo { color: var(--cacau); }
.tipo-txt-reels { color: var(--ardosia); }
.tipo-txt-story { color: var(--sage); }
.tipo-txt-gravacao { color: var(--brasa); }

/* aviso */
.aviso { position: fixed; left: 50%; bottom: 26px; transform: translateX(-50%); padding: 13px 24px; font-size: 13px; border-radius: 999px; z-index: 60; background: var(--tinta); color: var(--base); box-shadow: 0 10px 24px rgba(53,48,43,0.3); max-width: 90vw; text-align: center; }
.aviso-alerta { background: var(--brasa); }

@media (max-width: 720px) {
  .topo { padding: 14px 16px; gap: 10px; }
  .topo-nome, .topo-sep { display: none; }
  .marca-p { font-size: 24px; }
  .topo-dir { margin-left: auto; gap: 8px; }
  .user-txt em { display: none; }
  .abas { padding: 0 16px; }
  .corpo { padding: 18px 16px 0; }
  .painel-corpo { padding: 6px 16px 18px; }
  .painel-pe { padding: 16px; }
  .duas { flex-direction: column; gap: 0; }
  .perfil-topo { flex-direction: column; align-items: flex-start; }
}
@media (prefers-reduced-motion: reduce) {
  .duo *, .painel { animation: none !important; transition: none !important; }
}
`;
