import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

// Build do modo demonstração: o mesmo portal, com o Supabase trocado por
// tabelas em memória (src/supabase-demo.js). Gera a pasta dist-demo, que é
// publicada no GitHub Pages. Nada nele fala com o banco de verdade.
//
//   npx vite build --config vite.demo.config.js

const demo = fileURLToPath(new URL("./src/supabase-demo.js", import.meta.url));

const AVISO = `
<div id="aviso-demo" style="position:fixed;left:50%;bottom:14px;transform:translateX(-50%);z-index:9999;
  font:500 12.5px/1.45 Poppins,system-ui,sans-serif;color:#EAE4DE;background:#35302B;border-radius:999px;
  padding:8px 16px;white-space:nowrap;box-shadow:0 6px 18px rgba(0,0,0,.18);text-align:center">
  Demonstração · dados fictícios · equipe: <b>equipe@demo.com</b> · cliente: <b>cliente@demo.com</b> · qualquer senha
</div>`;

export default defineConfig({
  base: "./",
  plugins: [
    react(),
    {
      name: "supabase-de-demonstracao",
      enforce: "pre",
      resolveId(id) {
        if (id.endsWith("src/supabase.js")) return demo;
      },
    },
    {
      name: "aviso-de-demonstracao",
      transformIndexHtml: (html) =>
        html.replace("<title>Portal Duo Marketing</title>", "<title>Portal Duo · demonstração</title>")
            .replace("<body>", "<body>" + AVISO),
    },
  ],
  build: { outDir: "dist-demo" },
});
