import mongoose from "mongoose";
import { applyPasswordValidatingAndHashing } from "../utils/hashUtils.js";

const { Schema, model } = mongoose;

const systemAdminSchema = new Schema({
  email: {
    type: String,
    required: [true],
    unique: [true],
    trim: true,
    lowercase: true,
  },
  hash: {
    type: String,
    required: [true, "Password must be provided"],
  },
  salt: {
    type: String,
  },
  userType: {
    type: String,
    default: "systemAdmin",
  },
});

applyPasswordValidatingAndHashing(systemAdminSchema);

const SystemAdminModel = model("SystemAdmin", systemAdminSchema);

export default SystemAdminModel;
