import { createClient } from "@supabase/supabase-js";

// Projeto DuoMarketingBanco (SEU-PROJETO).
//
// Estes dois valores ficam no código de propósito. A chave abaixo é a
// "publishable": ela é pública por natureza e já vai junto com o site para o
// navegador de quem acessa — guardá-la fora do repositório não esconderia
// nada de ninguém. Quem realmente protege os dados são as políticas de RLS do
// banco, que barram leitura e escrita de quem não tem permissão.
//
// A chave "service_role" NUNCA entra aqui. Ela ignora todas as políticas de
// segurança, e num site estático ficaria visível para qualquer visitante.
//
// O arquivo .env, quando existe, tem prioridade — serve para apontar o portal
// para outro projeto (um de testes, por exemplo) sem mexer no código.

const URL_PADRAO = "https://SEU-PROJETO.supabase.co";
const CHAVE_PADRAO = "";

const url = import.meta.env.VITE_SUPABASE_URL || URL_PADRAO;
const chaveAnon = import.meta.env.VITE_SUPABASE_ANON_KEY || CHAVE_PADRAO;

export const supabase = createClient(url, chaveAnon);
