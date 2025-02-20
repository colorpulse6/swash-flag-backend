import express from "express";
import cors from "cors";
import featureFlagRoutes from "./routes/featureFlagRoutes";
import authRoutes from "./routes/authRoutes";

const app = express();

app.use(cors({
  origin: [
    "https://swash-flag-dashboard.vercel.app",
    "http://localhost:5173",

  ],
  methods: "GET, POST, PUT, DELETE, OPTIONS",
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.options("*", cors()); // Handle preflight requests

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api", featureFlagRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
