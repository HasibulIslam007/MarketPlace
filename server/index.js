const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

// Allow the deployed storefront (and local dev) to call the API.
// Set CLIENT_URL=https://your-store.vercel.app in production.
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:3000",
  "http://127.0.0.1:3000",
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Allow server-to-server / curl / SSLCOMMERZ callbacks with no Origin header.
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "70mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Health check for Render / Vercel / uptime monitors.
app.get("/api/health", (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

app.use("/api/products", require("./routes/products"));
app.use("/api/uploads", require("./routes/uploads"));
app.use("/api/categories", require("./routes/categories"));
app.use("/api/homepage-settings", require("./routes/homepage-settings"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/payments", require("./routes/payments"));
app.use("/api/orders", require("./routes/orders"));

const PORT = process.env.PORT || 5000;

// Export for serverless (Vercel) — only listen when run directly.
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;