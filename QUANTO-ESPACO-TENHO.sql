-- ===================================================================
--  QUANTO ESPAÇO AINDA TENHO
--
--  Rode no SQL Editor sempre que quiser saber. São três consultas:
--  o total, o detalhe por arquivo e o peso do banco.
--
--  O plano gratuito do Supabase dá 1 GB de arquivos (1024 MB) e
--  500 MB de banco de dados. São limites separados: encher um não
--  afeta o outro.
-- ===================================================================


-- ---------------------------------------------------------------
--  1. O número que importa: quanto sobrou de arquivo
-- ---------------------------------------------------------------

select
  count(*)                                                              as arquivos,
  round(coalesce(sum((metadata->>'size')::bigint), 0) / 1048576.0, 2)   as usado_mb,
  round((1073741824 - coalesce(sum((metadata->>'size')::bigint), 0)) / 1048576.0, 2) as disponivel_mb,
  round(coalesce(sum((metadata->>'size')::bigint), 0) * 100.0 / 1073741824, 1)       as usado_porcento
from storage.objects;


-- ---------------------------------------------------------------
--  2. Detalhe: quais arquivos estão pesando, do maior para o menor
--
--  Serve para achar o vilão. Vídeo em 4K costuma ocupar mais que
--  todas as imagens somadas.
-- ---------------------------------------------------------------

select
  bucket_id                                            as balde,
  name                                                 as caminho,
  round((metadata->>'size')::bigint / 1048576.0, 2)    as mb,
  created_at                                           as enviado_em
from storage.objects
order by (metadata->>'size')::bigint desc nulls last;


-- ---------------------------------------------------------------
--  3. O banco de dados (texto, datas, status) — limite separado
--
--  Este quase nunca é problema: post é texto, e texto é leve.
-- ---------------------------------------------------------------

select
  round(pg_database_size(current_database()) / 1048576.0, 2) as banco_usado_mb,
  500                                                        as banco_limite_mb;
