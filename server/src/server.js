import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { createApp } from "./app.js";
import { syncDiseases } from "./seed/diseaseSeeder.js";

dotenv.config();

const START_PORT = Number(process.env.PORT || 5000);
const HOST = process.env.HOST || "0.0.0.0";

async function startServer() {
  await connectDB();
  await syncDiseases();

  const app = createApp();
  const listen = (port) => {
    const server = app.listen(port, HOST, () => {
      console.log(`Server running on port ${port}`);
    });

    server.on("error", (error) => {
      if (error.code === "EADDRINUSE") {
        listen(port + 1);
        return;
      }

      console.error("Failed to start server:", error);
      process.exit(1);
    });
  };

  listen(START_PORT);
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
