import express from "express";
import {
  createAssignment,
  getAssignments,
} from "../controllers/instructor.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/role.middleware.js";

const router = express.Router();

router.post(
  "/assignments",
  authenticateUser,
  authorize(["instructor"]),
  createAssignment
);

router.get(
  "/assignments",
  authenticateUser,
  authorize(["instructor"]),
  getAssignments
);

export default router;
