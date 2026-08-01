import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const serverPort = Number(
    process.env.SERVER_PORT || env.VITE_SERVER_PORT || 5000,
  );
  const clientPort = Number(env.VITE_CLIENT_PORT || 5173);

  return {
    plugins: [react()],
    server: {
      host: "127.0.0.1",
      port: clientPort,
      proxy: {
        "/api": `http://127.0.0.1:${serverPort}`,
        "/uploads": `http://127.0.0.1:${serverPort}`,
      },
    },
  };
});
