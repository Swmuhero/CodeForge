import compression from "compression";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import authRoutes from "./routes/authRoutes.js";
import problemRoutes from "./routes/problemRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

const app = express();
const defaultAllowedOrigins = ["http://localhost:3000", "http://127.0.0.1:3000"];
const allowedOrigins = new Set(
  (process.env.CLIENT_ORIGIN?.split(",") || defaultAllowedOrigins)
    .map((origin) => origin.trim())
    .filter(Boolean)
);

app.use(helmet());
app.use(compression());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: false
  })
);
app.use(express.json({ limit: "1mb" }));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 600,
  standardHeaders: "draft-8",
  legacyHeaders: false
});

const executionLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  standardHeaders: "draft-8",
  legacyHeaders: false
});

app.use("/api", apiLimiter);
app.use("/api/problems/:slug/run", executionLimiter);
app.use("/api/problems/:slug/submit", executionLimiter);

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "leetclone-api" });
});

app.use("/api/auth", authRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/users", userRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
