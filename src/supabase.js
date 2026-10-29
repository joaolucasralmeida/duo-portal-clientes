import { createClient } from "@supabase/supabase-js";

// Conexão com o Supabase.
//
// Os dois valores vêm do arquivo .env (veja .env.example). A chave usada aqui
// é a "publishable": ela vai junto com o site para o navegador de quem acessa,
// então quem realmente protege os dados são as políticas de RLS do banco, que
// barram leitura e escrita de quem não tem permissão.
//
// A chave "service_role" NUNCA entra aqui. Ela ignora todas as políticas de
// segurança, e num site estático ficaria visível para qualquer visitante.

const url = import.meta.env.VITE_SUPABASE_URL;
const chaveAnon = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !chaveAnon) {
  console.warn("Supabase não configurado: crie o arquivo .env a partir do .env.example.");
}

export const supabase = createClient(url || "https://exemplo.supabase.co", chaveAnon || "chave-ausente");
