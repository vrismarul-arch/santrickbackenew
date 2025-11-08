import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import entryRoutes from "./routes/entryRoutes.js";

dotenv.config();
const app = express();

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

app.use("/api/entries", entryRoutes);

// ✅ Serverless-safe MongoDB connection
let isConnected = false;
async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });
  isConnected = true;
  console.log("✅ MongoDB Connected (Serverless Safe)");
}
connectDB().catch((err) => console.error("❌ Mongo DB Error:", err));

app.get("/", (req, res) => res.send("Backend running ✅"));

app.listen(process.env.PORT, () =>
  console.log(`✅ Server running on port ${process.env.PORT}`)
);
