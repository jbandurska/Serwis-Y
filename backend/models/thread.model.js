import { Schema, model } from "mongoose";

const threadSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  quote: {
    type: Schema.Types.ObjectId,
    ref: "Thread",
    required: false,
  },
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

async function deleteFromParent(next) {
  const doc = await this.model.findOne(this.getQuery());
  const id = doc._id;
  const isMainThread = doc.isMainThread;

  if (!isMainThread) {
    await this.model.updateOne(
      {
        children: id,
      },
      {
        $pull: {
          children: id,
        },
      }
    );
  }

  next();
}

async function deleteChildren(next) {
  const doc = await this.model.findOne(this.getQuery());

  if (doc.children?.length) {
    await this.model.deleteMany({
      _id: {
        $in: doc.children,
      },
    });
  }

  next();
}

threadSchema.pre("deleteOne", function (next) {
  deleteChildren.bind(this)(next);
  deleteFromParent.bind(this)(next);
});
threadSchema.pre("deleteMany", function (next) {
  deleteChildren.bind(this)(next);
});

export default model("Thread", threadSchema);
