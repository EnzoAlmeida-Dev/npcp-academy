import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Testes de integracao contra o Supabase LOCAL (RLS e funcoes SQL).
// Requer `npx supabase start` e `.env.development.local`.
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["test/integration/**/*.test.ts"],
    // Os testes compartilham o banco local; rodar em serie evita interferencia.
    fileParallelism: false,
    testTimeout: 30_000,
    hookTimeout: 60_000,
  },
});
