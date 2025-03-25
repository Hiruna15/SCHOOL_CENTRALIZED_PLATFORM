import express from "express";
import "dotenv/config";
import errorHandler from "./middlewares/errorHandlere.middleware.js";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import studentRoutes from "./routes/student.routes.js";
import instructorRoutes from "./routes/instructor.routes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("api/auth", authRoutes);
app.use("api/students", studentRoutes);
app.use("api/instructors", instructorRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use(errorHandler);

export default app;
