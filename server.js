import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import entryRoutes from "./routes/entries.js";

dotenv.config();

const app = express();

// CORS
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://santricksnewform.vercel.app"
  ],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection — Prevent Multiple Connections
if (!global._mongooseConnected) {
  mongoose
    .connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 20000,
    })
    .then(() => {
      console.log("✅ MongoDB Connected");
      global._mongooseConnected = true;
    })
    .catch((err) => {
      console.error("❌ MongoDB Connection Error:", err);
    });
}

// Routes
app.use("/api/entries", entryRoutes);

app.get("/", (req, res) => res.send("✅ API is running..."));

export default app; // 🚀 IMPORTANT FOR VERCEL
