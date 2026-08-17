import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // 5174 e nao a 5173 padrao: nesta maquina a 5173 esta na lista de portas
  // excluidas do Windows (netsh int ipv4 show excludedportrange) e nao aceita bind.
  server: { port: 5174, strictPort: true, open: true },
});
