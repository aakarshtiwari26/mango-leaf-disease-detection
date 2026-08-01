import net from "net";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const runtimeDir = path.resolve(rootDir, "../.runtime");
const serverPortFile = path.resolve(runtimeDir, "server-port.json");

export function findFreePort(startPort) {
  return new Promise((resolve) => {
    const tryPort = (port) => {
      const server = net.createServer();
      server.unref();

      server.once("error", () => {
        server.close(() => tryPort(port + 1));
      });

      server.listen({ port, host: "0.0.0.0", exclusive: true }, () => {
        server.close(() => resolve(port));
      });
    };

    tryPort(startPort);
  });
}

export async function writeServerPort(port) {
  await fs.mkdir(runtimeDir, { recursive: true });
  await fs.writeFile(serverPortFile, JSON.stringify({ port }), "utf8");
}

export async function readServerPort() {
  try {
    const contents = await fs.readFile(serverPortFile, "utf8");
    const parsed = JSON.parse(contents);
    return Number(parsed.port);
  } catch {
    return null;
  }
}

export async function waitForServerPort(timeoutMs = 5000) {
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    const port = await readServerPort();
    if (port) {
      return port;
    }

    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  return null;
}
