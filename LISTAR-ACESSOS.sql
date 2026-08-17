-- ===================================================================
--  A TELA DE ACESSOS
--
--  Rode este arquivo inteiro no SQL Editor, uma vez.
--
--  O portal precisa mostrar quem tem acesso e com que e-mail. Só que o
--  e-mail mora em auth.users, uma tabela protegida que o navegador não
--  alcança -- e não deve alcançar, senão qualquer visitante do site
--  leria os e-mails de todos os seus clientes.
--
--  Esta função é a ponte: ela roda dentro do banco, com permissão para
--  ler aquela tabela, e só devolve alguma coisa se quem perguntou for
--  da equipe da Duo. Para um cliente, ou para um visitante sem login,
--  ela devolve lista vazia.
-- ===================================================================

create or replace function listar_acessos()
returns table (
  id            uuid,
  email         text,
  nome          text,
  cargo         text,
  tipo          text,
  cliente_id    uuid,
  ultimo_acesso timestamptz
)
language sql
security definer
set search_path = public
as $$
  select p.id, u.email::text, p.nome, p.cargo, p.tipo, p.cliente_id, u.last_sign_in_at
  from perfis p
  join auth.users u on u.id = p.id
  where eh_adm()
  order by p.tipo, p.nome;
$$;


-- ---------------------------------------------------------------
--  Conferência: aqui no SQL Editor não existe usuário logado, então
--  o resultado abaixo vem VAZIO de propósito -- é a prova de que a
--  proteção está funcionando. Quem vai ver a lista cheia é o portal,
--  com você logado como adm.
-- ---------------------------------------------------------------

select * from listar_acessos();
