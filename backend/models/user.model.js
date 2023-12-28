import { Schema, model } from "mongoose";

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
  },
  password: {
    type: String,
    required: true,
  },
  posts: {
    type: Array,
    required: true,
    default: [],
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

export default model("User", userSchema);
