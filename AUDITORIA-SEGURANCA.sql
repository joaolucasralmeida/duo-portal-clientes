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
--  3. As funções com poderes elevados são seguras?
--
--  ESPERADO: nenhuma linha com "REVISAR".
--
--  Função com poderes elevados ignora as regras de isolamento, então
--  precisa se proteger de alguma forma. Há duas maneiras válidas:
--
--    - exigir que quem chamou seja da equipe (eh_adm)
--    - não aceitar parâmetro nenhum e só olhar a identidade de quem
--      chamou (auth.uid) -- assim ela não tem como ser apontada para
--      outra pessoa, e um visitante sem login não obtém nada
--
--  Só é problema quem não faz nem uma nem outra.
-- ---------------------------------------------------------------

select
  p.proname as funcao,
  coalesce(nullif(pg_get_function_identity_arguments(p.oid), ''), 'sem parâmetro') as parametros,
  case
    when pg_get_functiondef(p.oid) ilike '%eh_adm()%'
         and p.proname <> 'eh_adm'                      then 'ok — exige ser da equipe'
    when pg_get_function_identity_arguments(p.oid) = ''
         and pg_get_functiondef(p.oid) ilike '%auth.uid()%' then 'ok — só devolve dado de quem chamou'
    else 'REVISAR'
  end as veredito
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public' and p.prosecdef
order by p.proname;
