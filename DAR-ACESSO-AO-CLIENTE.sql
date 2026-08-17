-- ===================================================================
--  DAR ACESSO A UM CLIENTE
--
--  Rode este arquivo inteiro no SQL Editor. Ele cria a funcao que o
--  portal vai usar, e libera o acesso do Brownie Brasileiro.
-- ===================================================================


-- ---------------------------------------------------------------
--  1. A funcao que o PORTAL vai chamar
--
--  Ela existe porque o portal, rodando no navegador, nao consegue
--  (e nao deve) enxergar a lista de contas de e-mail do sistema.
--
--  O "security definer" faz a funcao rodar com poderes elevados, o
--  que e necessario para ler auth.users. Por isso a PRIMEIRA coisa
--  que ela faz e conferir se quem chamou e da equipe da Duo. Sem
--  essa checagem, qualquer visitante do site poderia se dar acesso
--  aos dados de qualquer cliente.
--
--  ATENCAO: por causa dessa checagem, esta funcao NAO funciona aqui
--  no SQL Editor -- aqui nao existe usuario logado, a consulta roda
--  como dono do banco. Ela e para ser chamada pelo portal. A
--  liberacao manual esta no passo 2, logo abaixo.
-- ---------------------------------------------------------------

create or replace function vincular_acesso(
  p_email      text,
  p_cliente_id uuid,
  p_nome       text
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid;
begin
  if not eh_adm() then
    raise exception 'Somente a equipe da Duo pode dar acesso a um cliente.';
  end if;

  select id into v_uid
  from auth.users
  where lower(email) = lower(trim(p_email));

  if v_uid is null then
    raise exception 'Nao existe conta com o e-mail %. Crie ou convide a pessoa em Authentication > Users primeiro.', p_email;
  end if;

  insert into perfis (id, nome, cargo, tipo, cliente_id)
  values (v_uid, p_nome, 'Cliente', 'cliente', p_cliente_id)
  on conflict (id) do update
    set nome       = excluded.nome,
        cargo      = 'Cliente',
        tipo       = 'cliente',
        cliente_id = excluded.cliente_id;
end;
$$;


-- ---------------------------------------------------------------
--  2. Antes de liberar: conferir se as duas pontas existem
--
--  Tem que aparecer UMA linha, com as duas colunas preenchidas.
--  Se "conta_existe" vier vazia, a conta nao foi criada em
--  Authentication > Users. Se "cliente_existe" vier vazia, o cadastro
--  do cliente nao chegou a ser gravado pelo portal.
-- ---------------------------------------------------------------

select
  (select id from auth.users where lower(email) = 'cliente@exemplo.com') as conta_existe,
  (select id from clientes where nome = 'Brownie Brasileiro' limit 1)            as cliente_existe;


-- ---------------------------------------------------------------
--  3. Liberar o acesso
--
--  Insercao direta, sem passar pela funcao: aqui no SQL Editor a
--  permissao ja e de administrador do banco.
-- ---------------------------------------------------------------

insert into perfis (id, nome, cargo, tipo, cliente_id)
select u.id, 'Brownie Brasileiro', 'Cliente', 'cliente', c.id
from auth.users u
cross join (select id from clientes where nome = 'Brownie Brasileiro' limit 1) c
where lower(u.email) = 'cliente@exemplo.com'
on conflict (id) do update
  set nome       = excluded.nome,
      cargo      = 'Cliente',
      tipo       = 'cliente',
      cliente_id = excluded.cliente_id;


-- ---------------------------------------------------------------
--  4. Conferencia final
--
--  Tem que aparecer DUAS linhas: voce como adm, e o Brownie como
--  cliente com o nome preenchido em "cliente_vinculado".
-- ---------------------------------------------------------------

select u.email, p.nome, p.tipo, c.nome as cliente_vinculado
from perfis p
join auth.users u on u.id = p.id
left join clientes c on c.id = p.cliente_id
order by p.tipo;
