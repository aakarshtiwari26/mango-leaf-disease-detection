import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import { findFreePort } from "./ports.mjs";

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const aiServiceDir = path.resolve(rootDir, "../ai-service");
const venvUvicorn = path.resolve(aiServiceDir, ".venv/bin/uvicorn");
function readArg(name, fallback) {
  const match = process.argv.find((value) => value.startsWith(`--${name}=`));
  if (!match) {
    return fallback;
  }

  const [, value] = match.split("=");
  return Number(value) || fallback;
}

const startPort = readArg("ai-port", 8000);
const port = await findFreePort(startPort);

const child = spawn(
  venvUvicorn,
  ["app:app", "--reload", "--host", "127.0.0.1", "--port", String(port)],
  {
    cwd: aiServiceDir,
    stdio: "inherit",
    env: {
      ...process.env,
      PORT: String(port),
    },
  },
);

child.on("exit", (code) => {
  process.exit(code ?? 0);
});
