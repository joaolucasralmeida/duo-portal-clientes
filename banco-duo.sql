-- ===================================================================
--  PORTAL DUO MARKETING — BANCO DE DADOS  ·  versão 2
--
--  Cole este arquivo inteiro no SQL Editor do Supabase e clique em RUN.
--  Você não precisa entender o código. Ele cria as "gavetas" onde o
--  site guarda cliente, post, métrica e documento — e as regras que
--  impedem um cliente de ver os dados do outro.
--
--  NOVO NESTA VERSÃO: depois que o post foi ao ar no Instagram, você
--  apaga o material bruto pelo próprio site e recupera o espaço.
--  O post continua registrado — some só o arquivo pesado.
--
--  Rode em um projeto novo, vazio. Se você já rodou a versão 1,
--  veja o bloco "SE VOCÊ JÁ RODOU A VERSÃO 1" no final do arquivo.
-- ===================================================================


-- -------------------------------------------------------------------
-- 1. PERFIS  (quem é quem: equipe Duo ou cliente)
-- -------------------------------------------------------------------
create table perfis (
  id          uuid primary key references auth.users on delete cascade,
  nome        text not null,
  cargo       text,
  tipo        text not null check (tipo in ('adm', 'cliente')),
  cliente_id  uuid,
  criado_em   timestamptz default now()
);


-- -------------------------------------------------------------------
-- 2. CLIENTES  (as empresas atendidas)
-- -------------------------------------------------------------------
create table clientes (
  id         uuid primary key default gen_random_uuid(),
  nome       text not null,
  prefixo    text not null,
  foto_url   text,
  razao      text,
  cnpj       text,
  segmento   text,
  contato    text,
  telefone   text,
  email      text,
  instagram  text,
  endereco   text,
  inicio     date,
  plano      text,
  obs        text,
  criado_em  timestamptz default now()
);

alter table perfis
  add constraint perfis_cliente_fk
  foreign key (cliente_id) references clientes(id) on delete cascade;


-- -------------------------------------------------------------------
-- 3. SEMANAS  (os calendários, um conjunto por cliente)
-- -------------------------------------------------------------------
create table semanas (
  id         uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references clientes(id) on delete cascade,
  inicio     date not null,
  criado_em  timestamptz default now(),
  unique (cliente_id, inicio)
);


-- -------------------------------------------------------------------
-- 4. POSTS  (cada entrega do calendário)
--
--  As quatro últimas colunas são a novidade: quando foi ao ar, o link
--  no Instagram, e o registro de quando o material foi apagado.
-- -------------------------------------------------------------------
create table posts (
  id         uuid primary key default gen_random_uuid(),
  codigo     text not null,
  cliente_id uuid not null references clientes(id) on delete cascade,
  semana_id  uuid not null references semanas(id)   on delete cascade,
  dia        int  not null check (dia between 0 and 6),
  hora       text not null,
  tipo       text not null check (tipo in ('Carrossel','Reels','Story','Gravação')),
  titulo     text not null,
  formato    text,
  legenda    text,
  obs        text,
  versao     int  not null default 1,
  status     text not null default 'rascunho'
             check (status in ('rascunho','aguardando','aprovado','ajuste','publicado','agendado')),
  pacote_url  text,
  pacote_nome text,
  pacote_caminho text,               -- onde o .zip está guardado no Storage
  pacote_tamanho bigint default 0,   -- peso do .zip em bytes

  publicado_em          timestamptz, -- preenchido sozinho ao marcar publicado
  link_post             text,        -- link da publicação no Instagram
  arquivos_liberados_em timestamptz, -- quando o material foi apagado
  bytes_liberados       bigint default 0,

  criado_em   timestamptz default now()
);

create index posts_cliente_idx on posts (cliente_id, semana_id);
create index posts_status_idx  on posts (status, publicado_em);

-- Carimba a data automaticamente quando o post vira "publicado".
create or replace function marca_publicacao()
returns trigger language plpgsql as $$
begin
  if new.status = 'publicado' and (old.status is distinct from 'publicado') then
    new.publicado_em := coalesce(new.publicado_em, now());
  end if;
  return new;
end;
$$;

create trigger trg_marca_publicacao
  before update on posts
  for each row execute function marca_publicacao();


-- -------------------------------------------------------------------
-- 5. ARQUIVOS DO POST  (jpg, mp4 — o conteúdo do .zip já descompactado)
--
--  ATENÇÃO à ideia central: quando você apaga o material, a LINHA
--  desta tabela NÃO some. Ela fica com "removido_em" preenchido.
--  Assim o histórico continua sabendo que existiram 5 fotos e quanto
--  pesavam, mas o arquivo em si já saiu do servidor.
-- -------------------------------------------------------------------
create table post_arquivos (
  id        uuid primary key default gen_random_uuid(),
  post_id   uuid not null references posts(id) on delete cascade,
  nome      text not null,
  tipo      text not null check (tipo in ('imagem','video','outro')),
  url       text,
  caminho   text,                 -- endereço dentro do bucket "conteudo"
  tamanho   bigint default 0,     -- peso em bytes
  ordem     int  default 0,
  removido_em  timestamptz,       -- vazio = arquivo ainda está no servidor
  removido_por uuid references auth.users,
  criado_em timestamptz default now()
);

create index arquivos_post_idx on post_arquivos (post_id) where removido_em is null;


-- -------------------------------------------------------------------
-- 6. SOLICITAÇÕES DE ALTERAÇÃO  (aqui mora o limite de 3)
-- -------------------------------------------------------------------
create table alteracoes (
  id        uuid primary key default gen_random_uuid(),
  post_id   uuid not null references posts(id) on delete cascade,
  numero    int  not null check (numero between 1 and 3),
  motivo    text not null,
  pedido    text not null,
  criado_em timestamptz default now(),
  unique (post_id, numero)
);

-- Trava de verdade: o banco recusa a 4ª solicitação, mesmo que
-- alguém tente burlar a tela.
create or replace function checa_limite_alteracoes()
returns trigger language plpgsql as $$
begin
  if (select count(*) from alteracoes where post_id = new.post_id) >= 3 then
    raise exception 'Limite de 3 solicitações de alteração já atingido neste post';
  end if;
  return new;
end;
$$;

create trigger trg_limite_alteracoes
  before insert on alteracoes
  for each row execute function checa_limite_alteracoes();


-- -------------------------------------------------------------------
-- 7. HISTÓRICO DO POST  (a linha do tempo)
-- -------------------------------------------------------------------
create table post_historico (
  id        uuid primary key default gen_random_uuid(),
  post_id   uuid not null references posts(id) on delete cascade,
  texto     text not null,
  autor     text,
  criado_em timestamptz default now()
);


-- -------------------------------------------------------------------
-- 8. LIMPEZAS  (o caderninho de quem apagou o quê, e quanto liberou)
-- -------------------------------------------------------------------
create table limpezas (
  id         uuid primary key default gen_random_uuid(),
  post_id    uuid references posts(id) on delete set null,
  cliente_id uuid references clientes(id) on delete cascade,
  post_codigo text,               -- guardado em texto, sobrevive à exclusão
  post_titulo text,
  quantidade int    not null default 0,
  bytes      bigint not null default 0,
  feito_por  uuid references auth.users,
  feito_em   timestamptz default now()
);

create index limpezas_cliente_idx on limpezas (cliente_id, feito_em desc);


-- -------------------------------------------------------------------
-- 9. MÉTRICAS
-- -------------------------------------------------------------------
create table metricas (
  id         uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references clientes(id) on delete cascade,
  nome       text not null,
  unidade    text,
  ordem      int default 0
);

create table metrica_periodos (
  id         uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references clientes(id) on delete cascade,
  periodo    text not null,
  data       date not null,
  criado_em  timestamptz default now()
);

create table metrica_valores (
  id         uuid primary key default gen_random_uuid(),
  periodo_id uuid not null references metrica_periodos(id) on delete cascade,
  metrica_id uuid not null references metricas(id)         on delete cascade,
  valor      numeric,
  unique (periodo_id, metrica_id)
);


-- -------------------------------------------------------------------
-- 10. DOCUMENTOS E ASSINATURA
--
--  Contrato NUNCA entra na limpeza. Fica guardado para sempre.
-- -------------------------------------------------------------------
create table documentos (
  id                uuid primary key default gen_random_uuid(),
  cliente_id        uuid not null references clientes(id) on delete cascade,
  nome              text not null,
  tipo              text not null default 'Contrato',
  arquivo_url       text,
  arquivo_nome      text,
  arquivo_caminho   text,
  arquivo_tamanho   bigint default 0,
  exige_assinatura  boolean default true,
  status            text not null default 'rascunho'
                    check (status in ('rascunho','enviado','aguardando','assinado','recusado')),
  enviado_em        timestamptz,
  assinado_em       timestamptz,
  assinante_nome    text,
  assinatura_codigo text,
  assinatura_ip     text,
  recusa_motivo     text,
  criado_em         timestamptz default now()
);

create table documento_historico (
  id           uuid primary key default gen_random_uuid(),
  documento_id uuid not null references documentos(id) on delete cascade,
  texto        text not null,
  criado_em    timestamptz default now()
);


-- -------------------------------------------------------------------
-- 11. NOTIFICAÇÕES
-- -------------------------------------------------------------------
create table notificacoes (
  id         uuid primary key default gen_random_uuid(),
  para_tipo  text not null check (para_tipo in ('adm','cliente')),
  cliente_id uuid references clientes(id) on delete cascade,
  texto      text not null,
  lida       boolean default false,
  criado_em  timestamptz default now()
);


-- ===================================================================
--  LIBERAR ESPAÇO — o coração do que você pediu
-- ===================================================================

-- Quanto cada post está ocupando agora, e se já foi limpo.
create or replace view v_posts_espaco as
select
  p.id,
  p.codigo,
  p.cliente_id,
  p.titulo,
  p.tipo,
  p.status,
  p.publicado_em,
  coalesce(sum(a.tamanho) filter (where a.removido_em is null), 0)
    + coalesce(p.pacote_tamanho, 0)                        as bytes_no_servidor,
  count(a.id) filter (where a.removido_em is null)          as arquivos_no_servidor,
  count(a.id) filter (where a.removido_em is not null)      as arquivos_ja_removidos,
  p.arquivos_liberados_em,
  p.bytes_liberados
from posts p
left join post_arquivos a on a.post_id = p.id
group by p.id;

-- A FILA DE LIMPEZA: posts que já foram ao ar e ainda estão
-- ocupando espaço. É esta lista que aparece no site para você
-- escolher o que apagar.
create or replace view v_limpeza_pendente as
select
  v.*,
  c.nome as cliente_nome,
  extract(day from (now() - v.publicado_em))::int as dias_no_ar
from v_posts_espaco v
join clientes c on c.id = v.cliente_id
where v.status = 'publicado'
  and v.bytes_no_servidor > 0
order by v.publicado_em asc;

-- Resumo por cliente: quanto ocupa, quanto dá para recuperar hoje.
create or replace view v_espaco_por_cliente as
select
  c.id   as cliente_id,
  c.nome as cliente_nome,
  coalesce(sum(v.bytes_no_servidor), 0)                                        as bytes_ocupados,
  coalesce(sum(v.bytes_no_servidor) filter (where v.status = 'publicado'), 0)  as bytes_liberaveis,
  coalesce(sum(v.bytes_liberados), 0)                                          as bytes_ja_liberados
from clientes c
left join v_posts_espaco v on v.cliente_id = c.id
group by c.id, c.nome;


-- A FUNÇÃO QUE FAZ A LIMPEZA.
--
--  Como funciona na prática, quando você clica "Liberar espaço":
--    1. O site chama esta função passando o código do post.
--    2. Ela confere se o post realmente já foi publicado.
--    3. Marca os arquivos como removidos, soma quanto foi liberado,
--       grava no histórico e no caderninho de limpezas.
--    4. DEVOLVE a lista de endereços dos arquivos.
--    5. O site então manda o Supabase apagar esses endereços do
--       Storage — é esse último passo que recupera o espaço de fato.
--
--  O banco guarda o registro; o Storage guarda o arquivo. Por isso
--  são dois passos.
create or replace function liberar_espaco_post(p_post uuid)
returns table (caminho text)
language plpgsql security definer as $$
declare
  v_post   posts%rowtype;
  v_bytes  bigint;
  v_qtd    int;
  v_autor  text;
  v_caminhos text[];
begin
  if not eh_adm() then
    raise exception 'Apenas a equipe Duo pode liberar espaço';
  end if;

  select * into v_post from posts where id = p_post;
  if not found then
    raise exception 'Post não encontrado';
  end if;

  if v_post.status <> 'publicado' then
    raise exception 'Só dá para apagar o material depois que o post foi publicado. Status atual: %', v_post.status;
  end if;

  select coalesce(sum(tamanho), 0), count(*)
    into v_bytes, v_qtd
    from post_arquivos
   where post_id = p_post and removido_em is null;

  v_bytes := v_bytes + coalesce(v_post.pacote_tamanho, 0);

  if v_qtd = 0 and coalesce(v_post.pacote_tamanho, 0) = 0 then
    raise exception 'Este post já está limpo, não há arquivo para apagar';
  end if;

  select nome into v_autor from perfis where id = auth.uid();

  -- anota os endereços ANTES de limpar, para devolver ao site no fim
  select array_agg(a.caminho) into v_caminhos
    from post_arquivos a
   where a.post_id = p_post and a.removido_em is null and a.caminho is not null;

  if v_post.pacote_caminho is not null then
    v_caminhos := coalesce(v_caminhos, '{}'::text[]) || v_post.pacote_caminho;
  end if;

  update post_arquivos
     set removido_em = now(), removido_por = auth.uid(), url = null
   where post_id = p_post and removido_em is null;

  update posts
     set arquivos_liberados_em = now(),
         bytes_liberados = coalesce(bytes_liberados, 0) + v_bytes,
         pacote_url = null, pacote_caminho = null, pacote_tamanho = 0
   where id = p_post;

  insert into limpezas (post_id, cliente_id, post_codigo, post_titulo, quantidade, bytes, feito_por)
  values (p_post, v_post.cliente_id, v_post.codigo, v_post.titulo, v_qtd, v_bytes, auth.uid());

  insert into post_historico (post_id, texto, autor)
  values (p_post,
          'Arquivos removidos do servidor · ' || v_qtd || ' arquivo(s) · ' ||
          round(v_bytes / 1048576.0, 1) || ' MB liberados',
          coalesce(v_autor, 'Equipe Duo'));

  return query select unnest(coalesce(v_caminhos, '{}'::text[]));
end;
$$;


-- ===================================================================
--  SEGURANÇA — a parte que impede um cliente de ver o outro.
--  Sem isto, qualquer pessoa com conhecimento técnico consegue pedir
--  os dados dos outros clientes direto pela API, mesmo sem ver na tela.
-- ===================================================================

-- Funções auxiliares: "quem está logado é da equipe?" e "de qual cliente?"
create or replace function eh_adm()
returns boolean language sql stable security definer as $$
  select exists (select 1 from perfis where id = auth.uid() and tipo = 'adm');
$$;

create or replace function meu_cliente()
returns uuid language sql stable security definer as $$
  select cliente_id from perfis where id = auth.uid();
$$;

-- Liga a proteção em todas as tabelas
alter table perfis              enable row level security;
alter table clientes            enable row level security;
alter table semanas             enable row level security;
alter table posts               enable row level security;
alter table post_arquivos       enable row level security;
alter table alteracoes          enable row level security;
alter table post_historico      enable row level security;
alter table limpezas            enable row level security;
alter table metricas            enable row level security;
alter table metrica_periodos    enable row level security;
alter table metrica_valores     enable row level security;
alter table documentos          enable row level security;
alter table documento_historico enable row level security;
alter table notificacoes        enable row level security;

-- Perfis: cada um vê o próprio; a equipe vê todos
create policy perfis_ler on perfis for select
  using (id = auth.uid() or eh_adm());

-- Clientes: equipe faz tudo; cliente só lê o próprio cadastro
create policy clientes_adm on clientes for all
  using (eh_adm()) with check (eh_adm());
create policy clientes_ler on clientes for select
  using (id = meu_cliente());

-- Semanas, posts, arquivos, histórico: equipe faz tudo,
-- cliente só lê o que é dele
create policy semanas_adm on semanas for all
  using (eh_adm()) with check (eh_adm());
create policy semanas_ler on semanas for select
  using (cliente_id = meu_cliente());

create policy posts_adm on posts for all
  using (eh_adm()) with check (eh_adm());
create policy posts_ler on posts for select
  using (cliente_id = meu_cliente() and status <> 'rascunho');
-- O cliente só pode mudar o status de um post que está com ele
create policy posts_responder on posts for update
  using (cliente_id = meu_cliente() and status = 'aguardando')
  with check (cliente_id = meu_cliente() and status in ('aprovado','ajuste'));

create policy arquivos_adm on post_arquivos for all
  using (eh_adm()) with check (eh_adm());
create policy arquivos_ler on post_arquivos for select
  using (exists (select 1 from posts p
                 where p.id = post_id and p.cliente_id = meu_cliente()));

create policy hist_adm on post_historico for all
  using (eh_adm()) with check (eh_adm());
create policy hist_ler on post_historico for select
  using (exists (select 1 from posts p
                 where p.id = post_id and p.cliente_id = meu_cliente()));
create policy hist_inserir on post_historico for insert
  with check (exists (select 1 from posts p
                      where p.id = post_id and p.cliente_id = meu_cliente()));

-- Limpezas: só a equipe. O cliente não precisa ver essa contabilidade.
create policy limpezas_adm on limpezas for all
  using (eh_adm()) with check (eh_adm());

-- Alterações: a equipe lê, o cliente lê as próprias e cria novas
create policy alt_adm on alteracoes for all
  using (eh_adm()) with check (eh_adm());
create policy alt_ler on alteracoes for select
  using (exists (select 1 from posts p
                 where p.id = post_id and p.cliente_id = meu_cliente()));
create policy alt_criar on alteracoes for insert
  with check (exists (select 1 from posts p
                      where p.id = post_id and p.cliente_id = meu_cliente()
                        and p.status = 'aguardando'));

-- Métricas: equipe escreve, cliente só lê
create policy met_adm on metricas for all
  using (eh_adm()) with check (eh_adm());
create policy met_ler on metricas for select
  using (cliente_id = meu_cliente());

create policy per_adm on metrica_periodos for all
  using (eh_adm()) with check (eh_adm());
create policy per_ler on metrica_periodos for select
  using (cliente_id = meu_cliente());

create policy val_adm on metrica_valores for all
  using (eh_adm()) with check (eh_adm());
create policy val_ler on metrica_valores for select
  using (exists (select 1 from metrica_periodos mp
                 where mp.id = periodo_id and mp.cliente_id = meu_cliente()));

-- Documentos: equipe faz tudo; cliente vê os enviados e pode assinar
create policy doc_adm on documentos for all
  using (eh_adm()) with check (eh_adm());
create policy doc_ler on documentos for select
  using (cliente_id = meu_cliente() and status <> 'rascunho');
create policy doc_assinar on documentos for update
  using (cliente_id = meu_cliente() and status = 'aguardando')
  with check (cliente_id = meu_cliente() and status in ('assinado','recusado'));

create policy dhist_adm on documento_historico for all
  using (eh_adm()) with check (eh_adm());
create policy dhist_ler on documento_historico for select
  using (exists (select 1 from documentos d
                 where d.id = documento_id and d.cliente_id = meu_cliente()));
create policy dhist_inserir on documento_historico for insert
  with check (exists (select 1 from documentos d
                      where d.id = documento_id and d.cliente_id = meu_cliente()));

-- Notificações
create policy notif_adm on notificacoes for all
  using (eh_adm()) with check (eh_adm());
create policy notif_ler on notificacoes for select
  using (para_tipo = 'cliente' and cliente_id = meu_cliente());
create policy notif_marcar on notificacoes for update
  using (para_tipo = 'cliente' and cliente_id = meu_cliente())
  with check (para_tipo = 'cliente' and cliente_id = meu_cliente());


-- ===================================================================
--  SEGURANÇA DOS ARQUIVOS (Storage)
--
--  Rode esta parte DEPOIS de criar os dois buckets (instruções no fim).
--  A regra é simples: o arquivo mora numa pasta com o nome do cliente,
--  e só aquele cliente — ou a equipe — consegue abrir.
--    conteudo/<id-do-cliente>/<id-do-post>/foto1.jpg
--    documentos/<id-do-cliente>/contrato.pdf
-- ===================================================================

create policy conteudo_adm on storage.objects for all
  using (bucket_id = 'conteudo' and eh_adm())
  with check (bucket_id = 'conteudo' and eh_adm());

create policy conteudo_cliente on storage.objects for select
  using (bucket_id = 'conteudo'
         and (storage.foldername(name))[1] = meu_cliente()::text);

create policy documentos_adm on storage.objects for all
  using (bucket_id = 'documentos' and eh_adm())
  with check (bucket_id = 'documentos' and eh_adm());

create policy documentos_cliente on storage.objects for select
  using (bucket_id = 'documentos'
         and (storage.foldername(name))[1] = meu_cliente()::text);


-- ===================================================================
--  PASSO A PASSO DEPOIS DE RODAR ISTO
--
--  1. Vá em Storage e crie dois buckets:
--       "conteudo"    (privado) — artes e vídeos dos posts
--       "documentos"  (privado) — contratos
--     Buckets privados exigem link temporário, o que evita que o
--     arquivo de um cliente vaze por URL.
--
--  2. Vá em Authentication > Users e crie seu primeiro usuário
--     (o seu e-mail e uma senha).
--
--  3. Volte no SQL Editor e rode, trocando o e-mail:
--
--     insert into perfis (id, nome, cargo, tipo)
--     select id, 'João', 'Editor · Filmmaker', 'adm'
--     from auth.users where email = 'seu@email.com';
--
--  Pronto: você é o primeiro administrador e pode cadastrar o resto
--  pela tela do site.
-- ===================================================================


-- ===================================================================
--  CONSULTAS ÚTEIS PARA O DIA A DIA
--  Cole no SQL Editor quando quiser saber como está o espaço.
-- ===================================================================

--  Quanto cada cliente está ocupando, em MB:
--
--    select cliente_nome,
--           round(bytes_ocupados   / 1048576.0, 1) as ocupado_mb,
--           round(bytes_liberaveis / 1048576.0, 1) as pode_liberar_mb,
--           round(bytes_ja_liberados / 1048576.0, 1) as ja_liberado_mb
--    from v_espaco_por_cliente
--    order by bytes_ocupados desc;

--  O que está no ar há mais de 7 dias e ainda ocupa espaço:
--
--    select cliente_nome, codigo, titulo, dias_no_ar,
--           round(bytes_no_servidor / 1048576.0, 1) as mb
--    from v_limpeza_pendente
--    where dias_no_ar >= 7;

--  Total do projeto (compare com 1 GB do plano grátis = 1073741824):
--
--    select round(sum(bytes_ocupados) / 1048576.0, 1) as total_mb
--    from v_espaco_por_cliente;


-- ===================================================================
--  SE VOCÊ JÁ RODOU A VERSÃO 1
--
--  Não rode o arquivo inteiro de novo — ele daria erro dizendo que as
--  tabelas já existem. Rode SÓ o bloco abaixo, que acrescenta as
--  novidades ao que você já tem. Está comentado de propósito: apague
--  os dois traços do começo de cada linha antes de executar.
--
--    alter table posts
--      add column if not exists pacote_caminho text,
--      add column if not exists pacote_tamanho bigint default 0,
--      add column if not exists publicado_em timestamptz,
--      add column if not exists link_post text,
--      add column if not exists arquivos_liberados_em timestamptz,
--      add column if not exists bytes_liberados bigint default 0;
--
--    alter table post_arquivos
--      add column if not exists caminho text,
--      add column if not exists tamanho bigint default 0,
--      add column if not exists removido_em timestamptz,
--      add column if not exists removido_por uuid references auth.users;
--
--    alter table post_arquivos alter column url drop not null;
--
--    alter table documentos
--      add column if not exists arquivo_caminho text,
--      add column if not exists arquivo_tamanho bigint default 0;
--
--  Depois disso, rode também: a tabela "limpezas", as três views
--  (v_posts_espaco, v_limpeza_pendente, v_espaco_por_cliente), a
--  função liberar_espaco_post, o trigger trg_marca_publicacao, a
--  policy limpezas_adm e o bloco de Storage.
-- ===================================================================
