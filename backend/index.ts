import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Application, Request, Response } from "express";
import path from "path";
import { fileURLToPath } from "url";
import useRouter from "./routes/auth.routes.js";
import chatRouter from "./routes/chat.routes.js";
import globalContextRouter from "./routes/globalContext.routes.js";

dotenv.config();

const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: [process.env.FRONTEND_URL!],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use("/api/v1/user", useRouter);
app.use("/api/v1/chat", chatRouter);
app.use("/api/v1/global-context", globalContextRouter);
app.use("/auth", useRouter);

// Fix for ES modules __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("__dirname", __dirname);

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  // Correct path: backend -> root -> frontend/dist
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  // Catch-all route - use regex for Express 5+
  app.get(/.*/, (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`app is running on ${port}`);
});
