import express from "express";
import {
  createAssignment,
  getAssignment,
  getAssignments,
  getClasses,
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

router.get(
  "/assignments/:id",
  authenticateUser,
  authorize(["instructor"]),
  getAssignment
);

router.get("/classes", authenticateUser, authorize(["instructor"]), getClasses);

export default router;
