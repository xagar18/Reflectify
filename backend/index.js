import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import useRouter from "./routes/auth.routes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:4000", "http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/api/v1/user", useRouter);

app.get("/", (req, res) => {
  res.send("Hello World");
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`app is running on ${port}`);
});
