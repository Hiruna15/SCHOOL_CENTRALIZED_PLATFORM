import express from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/role.middleware.js";
import { registerStudent } from "../controllers/schoolAdmin.controller.js";

const router = express.Router();

router.post(
  "/students",
  authenticateUser,
  authorize(["schoolAdmin"]),
  registerStudent
);

export default router;
