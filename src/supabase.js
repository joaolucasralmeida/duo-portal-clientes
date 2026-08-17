import { createClient } from "@supabase/supabase-js";

// Os dois valores abaixo vêm do arquivo .env, que fica só nesta máquina e
// nunca vai para o GitHub. Veja .env.example para saber onde encontrá-los.
//
// A chave usada aqui é a "anon public". Ela é pública por natureza: vai junto
// com o site para o navegador de quem acessa. Quem protege os dados não é ela,
// e sim as políticas de RLS do banco — por isso o filtro por cliente_id em
// banco-duo.sql é o que realmente isola um cliente do outro.
//
// A chave "service_role" NUNCA entra aqui. Ela ignora todas as políticas de
// segurança, e num site estático ficaria visível para qualquer visitante.

const url = import.meta.env.VITE_SUPABASE_URL;
const chaveAnon = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !chaveAnon) {
  throw new Error(
    "Faltam as credenciais do Supabase. Crie um arquivo .env na raiz do " +
      "projeto com VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY, copiando o " +
      "modelo de .env.example."
  );
}

export const supabase = createClient(url, chaveAnon);
