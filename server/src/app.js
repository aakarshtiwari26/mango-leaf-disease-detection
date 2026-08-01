import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import compression from "compression";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import predictionRoutes from "./routes/predictionRoutes.js";
import historyRoutes from "./routes/historyRoutes.js";
import diseaseRoutes from "./routes/diseaseRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createApp() {
  const app = express();

  const explicitOrigins = process.env.CLIENT_URL
    ? process.env.CLIENT_URL.split(",")
        .map((origin) => origin.trim())
        .filter(Boolean)
    : [];

  app.use(helmet());
  app.use(
    cors({
      origin(origin, callback) {
        if (!origin) {
          return callback(null, true);
        }

        if (
          explicitOrigins.includes(origin) ||
          /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
        ) {
          return callback(null, true);
        }

        return callback(new Error("Not allowed by CORS"));
      },
      credentials: true,
    }),
  );
  app.use(compression());
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use((req, _res, next) => {
    if (req.body) {
      req.body = mongoSanitize.sanitize(req.body);
    }

    if (req.params) {
      req.params = mongoSanitize.sanitize(req.params);
    }

    next();
  });
  app.use(hpp());
  app.use(morgan("dev"));

  app.use(
    rateLimit({
      windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000),
      max: Number(process.env.RATE_LIMIT_MAX || 100),
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );

  app.use(
    "/uploads",
    express.static(
      path.resolve(process.cwd(), process.env.UPLOAD_DIR || "uploads"),
    ),
  );

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", service: "server" });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/profile", profileRoutes);
  app.use("/api/predictions", predictionRoutes);
  app.use("/api/history", historyRoutes);
  app.use("/api/diseases", diseaseRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
