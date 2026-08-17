-- ===================================================================
--  RODE ISTO SO DEPOIS de criar seu usuario em Authentication > Users
--
--  Isto te transforma no primeiro administrador do portal. Sem isso,
--  o login funciona mas voce entra sem permissao nenhuma.
-- ===================================================================

insert into perfis (id, nome, cargo, tipo)
select id, 'João', 'Editor · Filmmaker', 'adm'
from auth.users
where email = 'dona@exemplo.com'
on conflict (id) do nothing;

-- Confere se deu certo: tem que aparecer uma linha com tipo = adm
select p.nome, p.cargo, p.tipo, u.email
from perfis p
join auth.users u on u.id = p.id;
