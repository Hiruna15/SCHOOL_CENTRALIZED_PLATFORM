import mongoose from "mongoose";
const { Schema, model } = mongoose;

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, "username is required"],
    unique: [true, "this username is already taken"],
    minLength: [2, "username cannot have less than 2 characters"],
    maxLength: [20, "username cannot have more than 20 characters"],
    lowercase: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "email must be provided"],
    unique: [
      true,
      "an account has been already registered with the email you provided",
    ],
    match: [emailRegex, "Invalid email address"],
  },
  hash: {
    type: String,
    required: [true, "Password must be provided"],
  },
  salt: {
    type: String,
  },
  date: { type: Date, default: Date.now },
});

userSchema.pre("save", function () {
  // const pwdRegex =
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/;

  // if (!pwdRegex.test(this.hash)) {
  //   throw new BadRequest("Inavlid password");
  // }

  const { hash, salt } = hashPassword(this.hash);
  this.hash = hash;
  this.salt = salt;
});

const UserModel = model("User", userSchema);

export default UserModel;
