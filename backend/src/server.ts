import cors from "cors";
import "dotenv/config";
import express from "express";
import connectDB from "./config/db";
import { errorHandler, notFound } from "./middleware/error.middleware";

// ─── Route imports ────────────────────────────────────────────────────────────
import path from "path";
import adminRoutes from "./routes/admin.routes";
import authRoutes from "./routes/auth.routes";
import cartRoutes from "./routes/cart.routes";
import categoryRoutes from "./routes/category.routes";
import contactRoutes from "./routes/contact.routes";
import jobRoutes from "./routes/job.routes";
import jobApplicationRoutes from "./routes/jobApplication.routes";
import orderRoutes from "./routes/order.routes";
import productRoutes from "./routes/product.routes";
import promoCodeRoutes from "./routes/promoCode.routes";
import reviewRoutes from "./routes/review.routes";
import statsRoutes from "./routes/stats.routes";

// ─── Connect to MongoDB Atlas ─────────────────────────────────────────────────
connectDB();

// ─── Express app setup ────────────────────────────────────────────────────────
const app = express();

// CORS — allow localhost, *.vercel.app, and any origins in CLIENT_URL (comma-separated)
const allowedOrigins = (process.env.CLIENT_URL ?? "")
  .split(",")
  .map((u) => u.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, Postman, server-to-server)
      if (!origin) return callback(null, true);
      // Allow any localhost / 127.0.0.1 origin regardless of port
      if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
        return callback(null, true);
      }
      // Allow all Vercel deployment URLs (*.vercel.app)
      if (/^https:\/\/[^.]+\.vercel\.app$/.test(origin)) {
        return callback(null, true);
      }
      // Allow any explicitly listed origin
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
  }),
);

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Static uploads (CV files)
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ─── Health check ─────────────────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "ShajSutro API is running",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ─── API routes ───────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/promo-codes", promoCodeRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/job-applications", jobApplicationRoutes);
app.use("/api/stats", statsRoutes);

// ─── Error handling ───────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Start server ─────────────────────────────────────────────────────────────
const PORT = parseInt(process.env.PORT ?? "4000", 10);
const server = app.listen(PORT, () => {
  console.log(
    `✓ Server running on http://localhost:${PORT} [${process.env.NODE_ENV}]`,
  );
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received — shutting down gracefully");
  server.close(() => process.exit(0));
});

process.on("unhandledRejection", (err: Error) => {
  console.error("Unhandled rejection:", err.message);
  server.close(() => process.exit(1));
});

export default app;
