import express from "express";
import cors from "cors";
import featureFlagRoutes from "./routes/featureFlagRoutes";
import authRoutes from "./routes/authRoutes";

const app = express();

const allowedOrigins = [process.env.CLIENT_URL || "http://localhost:5173"];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET, POST, PUT, DELETE, OPTIONS",
  allowedHeaders: "Content-Type, Authorization",
  credentials: true
}));

app.use(express.json());

// ✅ Explicitly handle preflight requests (important for CORS!)
app.options("*", (req, res) => {
  res.set("Access-Control-Allow-Origin", process.env.CLIENT_URL);
  res.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.set("Access-Control-Allow-Credentials", "true");
  res.status(200).end();
});

app.use("/api/auth", authRoutes);
app.use("/api", featureFlagRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
