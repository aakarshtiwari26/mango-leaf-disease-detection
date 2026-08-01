import { spawn } from "child_process";
import net from "net";
import path from "path";
import { fileURLToPath } from "url";
import { findFreePort, waitForServerPort } from "./ports.mjs";

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const clientDir = path.resolve(rootDir, "../client");
const viteBin = path.resolve(clientDir, "node_modules/.bin/vite");
function readArg(name, fallback) {
  const match = process.argv.find((value) => value.startsWith(`--${name}=`));
  if (!match) {
    return fallback;
  }

  const [, value] = match.split("=");
  return Number(value) || fallback;
}

const clientPort = await findFreePort(readArg("client-port", 5173));

async function canConnectToPort(port) {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host: "127.0.0.1", port });

    const finish = (result) => {
      socket.removeAllListeners();
      socket.destroy();
      resolve(result);
    };

    socket.setTimeout(300);
    socket.once("connect", () => finish(true));
    socket.once("timeout", () => finish(false));
    socket.once("error", () => finish(false));
  });
}

async function resolveServerPort() {
  const explicitPort =
    Number(process.env.VITE_SERVER_PORT || process.env.SERVER_PORT) || null;

  if (
    explicitPort &&
    explicitPort !== clientPort &&
    (await canConnectToPort(explicitPort))
  ) {
    return explicitPort;
  }

  const discoveredPort = await waitForServerPort();
  if (
    discoveredPort &&
    discoveredPort !== clientPort &&
    (await canConnectToPort(discoveredPort))
  ) {
    return discoveredPort;
  }

  return 5000;
}

const discoveredServerPort = await resolveServerPort();

const child = spawn(
  viteBin,
  ["--host", "127.0.0.1", "--port", String(clientPort)],
  {
    cwd: clientDir,
    stdio: "inherit",
    env: {
      ...process.env,
      SERVER_PORT: String(discoveredServerPort),
      VITE_SERVER_PORT: String(discoveredServerPort),
      VITE_CLIENT_PORT: String(clientPort),
    },
  },
);

child.on("exit", (code) => {
  process.exit(code ?? 0);
});
