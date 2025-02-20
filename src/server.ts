import express from "express";
import cors from "cors";
import featureFlagRoutes from "./routes/featureFlagRoutes";
import authRoutes from "./routes/authRoutes";

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL,
  methods: "GET, POST, PUT, DELETE, OPTIONS",
  allowedHeaders: "Content-Type, Authorization",
  credentials: true
}));

app.use(express.json());

app.options("*", cors());

app.use("/api/auth", authRoutes);
app.use("/api", featureFlagRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
