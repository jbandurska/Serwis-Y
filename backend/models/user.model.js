import { Schema, model } from "mongoose";
import Thread from "./thread.model.js";

const userSchema = new Schema({
  login: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  password: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    required: false,
  },
  following: {
    type: Array,
    required: true,
    default: [],
  },
});

userSchema.pre("findOneAndDelete", async function (next) {
  const doc = await this.model.findOne(this.getQuery());

  if (doc) {
    await Thread.deleteMany({
      user: doc._id,
      isMainThread: true,
    });
  }

  next();
});

export default model("User", userSchema);
