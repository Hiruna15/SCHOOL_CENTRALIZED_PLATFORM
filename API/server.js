import http from "http";
import "dotenv/config";
import connectDB from "./config/db.js";
import app from "./app.js";

const server = http.createServer(app);

const startServer = async () => {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

startServer();
