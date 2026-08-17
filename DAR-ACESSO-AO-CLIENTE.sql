-- ===================================================================
--  DAR ACESSO A UM CLIENTE
--
--  Rode este arquivo inteiro UMA VEZ no SQL Editor. Ele cria a funcao
--  que liga uma conta de e-mail a um cliente, e ja libera o acesso do
--  Brownie Brasileiro.
--
--  Depois disso, para cada cliente novo, basta a parte de baixo.
-- ===================================================================


-- ---------------------------------------------------------------
--  A funcao
--
--  Ela existe porque o portal, rodando no navegador, nao consegue
--  (e nao deve) enxergar a lista de contas de e-mail do sistema.
--  Entao quem faz a ligacao e o proprio banco.
--
--  O "security definer" faz a funcao rodar com poderes elevados, o
--  que e necessario para ler auth.users. Por isso a PRIMEIRA coisa
--  que ela faz e conferir se quem chamou e da equipe da Duo. Sem
--  essa checagem, qualquer visitante do site poderia se dar acesso
--  aos dados de qualquer cliente.
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
--  Liberar o Brownie Brasileiro
--
--  Procura o cliente pelo nome, entao nao e preciso saber o codigo
--  interno dele.
-- ---------------------------------------------------------------

select vincular_acesso(
  'cliente@exemplo.com',
  (select id from clientes where nome = 'Brownie Brasileiro' limit 1),
  'Brownie Brasileiro'
);


-- ---------------------------------------------------------------
--  Conferencia: tem que aparecer duas linhas, a sua como adm e a do
--  Brownie como cliente, com o nome do cliente preenchido na ultima
--  coluna.
-- ---------------------------------------------------------------

select u.email, p.nome, p.tipo, c.nome as cliente_vinculado
from perfis p
join auth.users u on u.id = p.id
left join clientes c on c.id = p.cliente_id
order by p.tipo;
