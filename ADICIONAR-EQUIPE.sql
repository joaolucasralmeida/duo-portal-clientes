-- ===================================================================
--  ADICIONAR ALGUÉM DA EQUIPE DUO
--
--  ANTES de rodar: a pessoa precisa ter conta no Supabase.
--  Vá em Authentication > Users > Add user > "Invite user" e mande o
--  convite para o e-mail dela. Ela recebe um e-mail e define a própria
--  senha -- assim a senha não passa por você nem por ninguém.
--
--  Depois disso, rode este arquivo.
-- ===================================================================


-- ---------------------------------------------------------------
--  1. A função que o PORTAL vai usar mais pra frente
--
--  Mesma ideia da vincular_acesso, mas para a equipe. Roda com
--  poderes elevados para conseguir ler auth.users, e por isso a
--  primeira coisa que faz é exigir que quem chamou seja adm.
--
--  Ela NÃO funciona aqui no SQL Editor -- aqui não existe usuário
--  logado. A inclusão manual está no passo 2.
-- ---------------------------------------------------------------

create or replace function vincular_equipe(
  p_email text,
  p_nome  text,
  p_cargo text
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid;
begin
  if not eh_adm() then
    raise exception 'Somente a equipe da Duo pode incluir outra pessoa na equipe.';
  end if;

  select id into v_uid
  from auth.users
  where lower(email) = lower(trim(p_email));

  if v_uid is null then
    raise exception 'Não existe conta com o e-mail %. Convide a pessoa em Authentication > Users primeiro.', p_email;
  end if;

  insert into perfis (id, nome, cargo, tipo, cliente_id)
  values (v_uid, p_nome, p_cargo, 'adm', null)
  on conflict (id) do update
    set nome       = excluded.nome,
        cargo      = excluded.cargo,
        tipo       = 'adm',
        cliente_id = null;
end;
$$;


-- ---------------------------------------------------------------
--  2. Incluir a pessoa
--
--  Troque as TRÊS informações abaixo para cada pessoa nova.
--  Se a conta ainda não existir, nada é inserido e o passo 3 mostra
--  isso -- não fica erro silencioso.
-- ---------------------------------------------------------------

insert into perfis (id, nome, cargo, tipo, cliente_id)
select u.id, 'Gabriele Gomes', 'Social Media', 'adm', null
from auth.users u
where lower(u.email) = lower('social@exemplo.com')
on conflict (id) do update
  set nome       = excluded.nome,
      cargo      = excluded.cargo,
      tipo       = 'adm',
      cliente_id = null;


-- ---------------------------------------------------------------
--  3. Conferência
--
--  Deve aparecer a Gabriele como adm. Se ela não aparecer, é porque
--  a conta dela ainda não foi criada em Authentication > Users.
-- ---------------------------------------------------------------

select u.email, p.nome, p.cargo, p.tipo, c.nome as cliente_vinculado
from perfis p
join auth.users u on u.id = p.id
left join clientes c on c.id = p.cliente_id
order by p.tipo, p.nome;
