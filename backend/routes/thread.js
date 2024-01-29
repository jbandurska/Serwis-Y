import { Router } from "express";
import User from "../models/user.model.js";
import Thread from "../models/thread.model.js";
import { authGuard } from "../middleware/authGuard.js";
import { findSubthreads } from "./threads/findSubthreads.js";
import { findSubthreadsAround } from "./threads/findSubthreadsAround.js";
import { sortThreadsByTime } from "./threads/sortThreadsByTime.js";

const router = Router();

router.use(authGuard);

router.get("/feed", async (req, res) => {
  let limit = parseInt(req.query.limit) || 10;
  if (limit > 20) limit = 20;

  const following = req.user.following;

  // default values
  const query = {
    user: {
      $in: following,
    },
    isMainThread: true,
    seenBy: {
      $ne: req.user._id,
    },
  };
  const sort = {
    _id: -1,
  };

  const lastThreadId = req.query.threadId;
  if (lastThreadId) {
    const newer = req.query.time_direction === "newer";

    if (newer) {
      query._id = {
        $gt: lastThreadId,
      };
      sort._id = 1;
    } else {
      query._id = {
        $lt: lastThreadId,
      };
    }
  }

  try {
    const threads = await Thread.find(query)
      .populate({
        path: "user",
        select: "login profilePicture",
      })
      .sort(sort)
      .limit(limit)
      .lean();

    const sortedThreads = sortThreadsByTime(threads);

    return res.json({
      threads: sortedThreads,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/:threadId", async (req, res) => {
  const threadId = req.params.threadId;

  try {
    const thread = await Thread.findOneAndUpdate(
      { _id: threadId },
      {
        $addToSet: {
          seenBy: req.user._id,
        },
      },
      {
        new: true,
      }
    ).populate({
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

router.get("/:threadId/subthreads", async (req, res, next) => {
  const threadId = req.params.threadId;
  const subthreadId = req.query.threadId;
  const time_direction = req.query.time_direction;

  let limit = parseInt(req.query.limit) || 10;
  if (limit > 20) limit = 20;

  let threads;
  try {
    if (time_direction === "around") {
      threads = await findSubthreadsAround(threadId, subthreadId, limit);
    } else {
      threads = await findSubthreads(
        threadId,
        subthreadId,
        time_direction,
        limit
      );
    }

    const sortedThreads = sortThreadsByTime(threads);

    return res.json({
      threads: sortedThreads,
    });
  } catch (err) {
    return next(err);
  }
});

router.get("/user/:userId", async (req, res) => {
  const userId = req.params.userId;

  let limit = parseInt(req.query.limit) || 10;
  if (limit > 20) limit = 20;

  // default values
  const query = {
    user: userId,
    isMainThread: true,
  };
  const sort = {
    _id: -1,
  };

  const lastThreadId = req.query.threadId;
  if (lastThreadId) {
    const newer = req.query.time_direction === "newer";

    if (newer) {
      query._id = {
        $gt: lastThreadId,
      };
      sort._id = 1;
    } else {
      query._id = {
        $lt: lastThreadId,
      };
    }
  }

  try {
    const threads = await Thread.find(query)
      .populate({
        path: "user",
        select: "login profilePicture",
      })
      .sort(sort)
      .limit(limit)
      .lean();

    const sortedThreads = sortThreadsByTime(threads);

    return res.json({
      threads: sortedThreads,
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
    const thread = await Thread.findOne({ _id: threadId });

    if (!thread) {
      return res.status(404).json({ message: "Thread not found" });
    }

    if (thread.user.toString() != req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You cannot delete threads that are not yours" });
    }

    await Thread.deleteOne({ _id: threadId, user: req.user._id });

    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
