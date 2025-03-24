import express from "express";
import {
  filterAssignments,
  submitAssignment,
} from "../controllers/student.controller.js";
import authenticateUser from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/role.middleware.js";

const router = express.Router();

router.get(
  "/assignments/filter",
  authenticateUser,
  authorize(["student"]),
  filterAssignments
);

router.post(
  "/assignments/submit",
  authenticateUser,
  authorize(["student"]),
  submitAssignment
);

router.get(
  "/submissions",
  authenticateUser,
  authorize(["student"]),
  getSubmissions
);

export default router;
