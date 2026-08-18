-- ===================================================================
--  CORRIGIR OS 3 AVISOS DE SEGURANÇA DO SUPABASE
--
--  Rode este arquivo inteiro no SQL Editor.
--
--  O QUE ESTAVA ERRADO
--
--  As três views de controle de espaço liam as tabelas "clientes" e
--  "posts" com os poderes de quem as criou, e não com os poderes de
--  quem está consultando. Na prática, elas passavam por cima das
--  regras de isolamento entre clientes.
--
--  Isso significa que um cliente logado no portal poderia consultar
--  essas views e obter o NOME e o CONSUMO DE ESPAÇO DE TODOS OS
--  OUTROS CLIENTES da Duo. Nenhuma tela do portal faz isso, mas a
--  porta estava aberta para quem soubesse pedir.
--
--  A CORREÇÃO
--
--  "security_invoker" faz a view rodar com os poderes de quem
--  consulta. Assim as regras de isolamento voltam a valer dentro
--  dela, e cada um só enxerga o que é seu.
-- ===================================================================

alter view v_posts_espaco       set (security_invoker = on);
alter view v_limpeza_pendente   set (security_invoker = on);
alter view v_espaco_por_cliente set (security_invoker = on);


-- ---------------------------------------------------------------
--  Conferência: as três devem aparecer com security_invoker=true
-- ---------------------------------------------------------------

select c.relname as view,
       coalesce(
         (select option_value from pg_options_to_table(c.reloptions)
          where option_name = 'security_invoker'),
         'não definido'
       ) as security_invoker
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relkind = 'v'
order by c.relname;
