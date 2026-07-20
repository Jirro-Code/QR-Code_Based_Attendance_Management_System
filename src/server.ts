import express from "express";
import authRoute from "./routes/authRoute.ts";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/auth", authRoute);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

export default app;