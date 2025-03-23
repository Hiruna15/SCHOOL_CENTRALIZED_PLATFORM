import express from "express";
import { filterAssignments } from "../controllers/student.controller.js";
import authenticateUser from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/role.middleware.js";

const router = express.Router();

router.get(
  "/assignments/filter",
  authenticateUser,
  authorize(["student"]),
  filterAssignments
);

export default router;
