import express from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/role.middleware.js";
import {
  registerInstructor,
  registerStudent,
  unenrollStudents,
} from "../controllers/schoolAdmin.controller.js";

const router = express.Router();

router.post(
  "/student",
  authenticateUser,
  authorize(["schoolAdmin"]),
  registerStudent
);

router.post(
  "/instructor",
  authenticateUser,
  authorize(["schoolAdmin"]),
  registerInstructor
);

router.patch(
  "/student/:id",
  authenticateUser,
  authorize(["schoolAdmin"]),
  unenrollStudents
);

export default router;

//get enrolled students
// add classes
// add subjects
