import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import useRouter from "./routes/auth.routes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/api/v1/user", useRouter);

// Fix for ES modules __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("__dirname", __dirname);

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  // Correct path: backend -> root -> frontend/dist
  const frontendDistPath = path.join(__dirname, "../frontend/dist");
  console.log("Frontend dist path:", frontendDistPath);

  app.use(express.static(frontendDistPath));

  // Catch-all route for SPA
  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendDistPath, "index.html"));
  });
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`app is running on ${port}`);
});
