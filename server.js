import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import entryRoutes from "./routes/entries.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---

// CORS (handle preflight OPTIONS automatically)
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://santricksnewform.vercel.app"
  ],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Parse JSON and URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/entries", entryRoutes);

// Simple test route
app.get("/", (req, res) => res.send("API is running"));

// --- MongoDB ---
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB Connection Error:", err));

// --- Start server ---
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
