-- ===================================================================
--  AUDITORIA DE SEGURANÇA
--
--  Rode no SQL Editor. São três verificações. O resultado esperado
--  está escrito acima de cada uma — se vier diferente, me avise.
-- ===================================================================


-- ---------------------------------------------------------------
--  1. Toda tabela tem a separação por cliente ligada?
--
--  ESPERADO: todas com protegida = SIM e politicas maior que zero.
--  Uma tabela com "NAO" é uma porta aberta: qualquer pessoa logada
--  conseguiria ler os dados de todos os clientes dali.
-- ---------------------------------------------------------------

select
  c.relname                                   as tabela,
  case when c.relrowsecurity then 'SIM' else 'NAO' end as protegida,
  count(p.polname)                            as politicas
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
left join pg_policy p on p.polrelid = c.oid
where n.nspname = 'public' and c.relkind = 'r'
group by c.relname, c.relrowsecurity
order by c.relrowsecurity, c.relname;


-- ---------------------------------------------------------------
--  2. As views respeitam a separação?
--
--  ESPERADO: as três com security_invoker = true. Sem isso elas
--  leem as tabelas ignorando as regras, e vazam dados de todos os
--  clientes -- foi o problema que o Supabase apontou e corrigimos.
-- ---------------------------------------------------------------

select
  c.relname as view,
  coalesce(
    (select option_value from pg_options_to_table(c.reloptions)
     where option_name = 'security_invoker'), 'NAO DEFINIDO'
  ) as security_invoker
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relkind = 'v'
order by c.relname;


-- ---------------------------------------------------------------
--  3. As funções com poderes elevados conferem quem chamou?
--
--  ESPERADO: as que aparecem aqui devem ter confere_quem_chamou = SIM.
--  Uma função com poderes elevados SEM essa checagem pode ser chamada
--  por qualquer visitante do site para fazer o que ela faz.
-- ---------------------------------------------------------------

select
  p.proname                                             as funcao,
  case when p.prosecdef then 'poderes elevados' else 'normal' end as tipo,
  case when pg_get_functiondef(p.oid) ilike '%eh_adm()%'
       then 'SIM' else 'nao tem checagem' end           as confere_quem_chamou
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public' and p.prosecdef
order by p.proname;
