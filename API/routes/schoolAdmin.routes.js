import express from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/role.middleware.js";
import {
  registerInstructor,
  registerStudent,
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

export default router;
