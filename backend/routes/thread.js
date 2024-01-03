import { Router } from "express";
import User from "../models/user.model.js";
import Thread from "../models/thread.model.js";
import { authGuard } from "../middleware/authGuard.js";

const router = Router();

router.use(authGuard);

router.get("/feed", async (req, res) => {
  const week = 1000 * 60 * 60 * 24 * 7;
  let lastWeek = new Date();
  lastWeek -= week;

  const following = req.user.following;

  try {
    const threads = await Thread.find({
      user: {
        $in: following,
      },
      createdAt: {
        $gt: lastWeek,
      },
      isMainThread: true,
    })
      .populate({
        path: "user",
        select: "login profilePicture",
      })
      .sort({
        createdAt: -1,
      });

    return res.json({
      threads,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/:threadId", async (req, res) => {
  const threadId = req.params.threadId;

  try {
    const thread = await Thread.findById(threadId).populate({
      path: "user",
      select: "login profilePicture",
    });

    if (!thread) {
      return res.status(404).json({ message: "Thread not found" });
    }

    let parentId;
    if (!thread.isMainThread) {
      const parent = await Thread.findOne({
        children: thread._id,
      });
      parentId = parent._id;
    }

    return res.json({
      thread: {
        ...thread._doc,
        parentId,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/:threadId/subthreads", async (req, res) => {
  const threadId = req.params.threadId;

  try {
    const thread = await Thread.findById(threadId).populate({
      path: "children",
      populate: {
        path: "user",
        select: "login",
      },
    });

    return res.json({
      subthreads: thread.children,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/user/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const threads = await Thread.find({
      user: userId,
      isMainThread: true,
    }).sort({
      createdAt: -1,
    });

    const user = await User.findById(userId).select({
      _id: 1,
      login: 1,
      profilePicture: 1,
    });

    const threadsWithUser = threads.map((t) => ({
      ...t._doc,
      user,
    }));

    return res.json({
      threads: threadsWithUser,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/quote/:threadId", async (req, res) => {
  const content = req.body.content;
  const threadId = req.params.threadId;
  const userId = req.user._id;

  if (!content) {
    return res.status(400).json({ message: "No content field" });
  }

  try {
    const newThread = await Thread.create({
      user: userId,
      quote: threadId,
      isMainThread: true,
      content,
    });

    return res.status(201).json({
      thread: {
        ...newThread._doc,
        user: {
          _id: userId,
          login: req.user.login,
        },
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/:threadId", async (req, res) => {
  const content = req.body.content;
  const threadId = req.params.threadId;
  const userId = req.user._id;

  if (!content) {
    return res.status(400).json({ message: "No content field" });
  }

  try {
    const newThread = await Thread.create({
      user: userId,
      content,
    });

    await Thread.findByIdAndUpdate(threadId, {
      $push: {
        children: newThread._id,
      },
    });

    return res.status(201).json({
      thread: {
        ...newThread._doc,
        user: {
          _id: userId,
          login: req.user.login,
        },
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  const content = req.body.content;
  const userId = req.user._id;

  if (!content) {
    return res.status(400).json({ message: "No content field" });
  }

  try {
    const newThread = await Thread.create({
      user: userId,
      content,
      isMainThread: true,
    });

    await User.findByIdAndUpdate(userId, {
      $push: {
        threads: newThread._id,
      },
    });

    return res.status(201).json({ thread: newThread });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/:threadId", async (req, res) => {
  const threadId = req.params.threadId;

  try {
    await Thread.deleteOne({ _id: threadId });

    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
