import express from "express";
import "dotenv/config";
import errorHandler from "./middlewares/errorHandlere.middleware.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/user", userRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use(errorHandler);

export default app;
