import express from "express";
import { createAssignment } from "../controllers/instructor.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/role.middleware.js";

const router = express.Router();

router.post(
  "/assignments",
  authenticateUser,
  authorize(["instructor"]),
  createAssignment
);

export default router;
