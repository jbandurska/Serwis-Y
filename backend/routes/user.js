import { Router } from "express";
import User from "../models/user.model.js";
import { authGuard } from "../middleware/authGuard.js";
import bcrypt from "bcrypt";

const router = Router();

router.use(authGuard);

router.get("/search", async (req, res) => {
  const key = req.query.key;

  try {
    const users = await User.find({
      login: { $regex: key, $options: "i" },
    });

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId).select({
      login: 1,
      profilePicture: 1,
      _id: 1,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    if (error.kind == "ObjectId") {
      return res.status(400).json({ message: "Invalid Id" });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/:userId/follow", async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { following: req.params.userId },
    });

    res.status(200).json({ message: "Successfully followed user" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/:userId/unfollow", async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { following: req.params.userId },
    });

    res.status(200).json({ message: "Successfully unfollowed user" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/update", async (req, res) => {
  try {
    const user = req.user;

    if (req.body.login) {
      user.login = req.body.login;
    }
    if (req.body.email) {
      user.email = req.body.email;
    }
    if (req.body.password) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      user.password = hashedPassword;
    }
    if (req.files && req.files.profilePicture) {
      const profilePicture = req.files.profilePicture;
      const base64Image = profilePicture.data.toString("base64");
      user.profilePicture = `data:${profilePicture.mimetype};base64,${base64Image}`;
    }

    await user.save();

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Such user already exists" });
    }
    if (
      error.message ===
      "User validation failed: email: Please fill a valid email address"
    ) {
      return res
        .status(400)
        .json({ message: "Please fill a valid email address" });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.delete("/delete", async (req, res) => {
  try {
    const user = req.user;

    await User.findByIdAndDelete(user._id);

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
