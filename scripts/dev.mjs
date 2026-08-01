import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import { findFreePort } from "./ports.mjs";

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const concurrentlyBin = path.resolve(
  rootDir,
  "../node_modules/.bin/concurrently",
);

const clientPort = await findFreePort(Number(process.env.CLIENT_PORT || 5173));
const serverPort = await findFreePort(
  Math.max(Number(process.env.SERVER_PORT || 5000), clientPort + 1),
);
const aiPort = await findFreePort(
  Math.max(Number(process.env.AI_PORT || 8000), serverPort + 1, clientPort + 1),
);

const commands = [
  `node scripts/run-client.mjs --client-port ${clientPort} --server-port ${serverPort}`,
  `AI_SERVICE_URL=http://127.0.0.1:${aiPort} node scripts/run-server.mjs --server-port ${serverPort} --ai-port ${aiPort}`,
  `node scripts/run-ai.mjs --ai-port ${aiPort}`,
];

const child = spawn(
  concurrentlyBin,
  ["-k", "-n", "client,server,ai", ...commands],
  {
    cwd: path.resolve(rootDir, ".."),
    stdio: "inherit",
    env: process.env,
  },
);

child.on("exit", (code) => {
  process.exit(code ?? 0);
});
