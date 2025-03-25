import express from "express";
import {
  deleteSubmission,
  filterAssignments,
  submitAssignment,
  updateSubmission,
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

router.patch(
  "/submissions/:id",
  authenticateUser,
  authorize(["student"]),
  updateSubmission
);

router.delete(
  "/submissions/:id",
  authenticateUser,
  authorize(["student"]),
  deleteSubmission
);

export default router;
