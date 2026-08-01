import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import { findFreePort, writeServerPort } from "./ports.mjs";

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const serverDir = path.resolve(rootDir, "../server");
const nodeBin = process.execPath;
function readArg(name, fallback) {
  const match = process.argv.find((value) => value.startsWith(`--${name}=`));
  if (!match) {
    return fallback;
  }

  const [, value] = match.split("=");
  return Number(value) || fallback;
}

const serverPort = await findFreePort(readArg("server-port", 5000));

await writeServerPort(serverPort);

const child = spawn(nodeBin, ["src/server.js"], {
  cwd: serverDir,
  stdio: "inherit",
  env: {
    ...process.env,
    PORT: String(serverPort),
  },
});

child.on("exit", (code) => {
  process.exit(code ?? 0);
});
