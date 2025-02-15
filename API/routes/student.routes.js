import express from "express";
import AssignmentModel from "../models/Assignment.model.js";

const router = express.Router();

router.get("/assignments", async (req, res, next) => {
  const assignments = await AssignmentModel.find({});
});

export default router;
