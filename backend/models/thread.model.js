import { Schema, model } from "mongoose";

const threadSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  content: {
    type: String,
    required: true,
  },
  children: [{ type: Schema.Types.ObjectId, ref: "Thread" }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isMainThread: {
    type: Boolean,
    default: false,
  },
});

export default model("Thread", threadSchema);
