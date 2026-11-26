require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const apiRoutes = require("./routes/apiRoutes");

const app = express();
const PORT = process.env.PORT || 3001;
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim().replace(/\/+$/, ""))
  .filter(Boolean);

app.set("trust proxy", 1);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const cleanOrigin = origin.replace(/\/+$/, "");
      if (
        allowedOrigins.includes(cleanOrigin) ||
        cleanOrigin.endsWith("management.vercel.app")
      ) {
        return callback(null, true);
      }
      console.warn("CORS blocked origin:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// MongoDB Connection
const mongouser = process.env.MONGO_DB_USER;
const mongopass = process.env.MONGO_DB_PASS;
const mongoUri =
  process.env.MONGO_URI ||
  (mongouser && mongopass
    ? `mongodb+srv://${mongouser}:${mongopass}@e-waste.boytdoj.mongodb.net/App?appName=E-waste`
    : "mongodb://127.0.0.1:27017/e-waste");

mongoose
  .connect(mongoUri)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ Mongo Error:", err.message));

// Health check
app.get("/", (req, res) => {
  res.json({ ok: true, service: "ecobin-backend" });
});

app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "ecobin-backend" });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api", apiRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "API route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
