import { Router } from "express";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";

const router = Router();

router.get("/check-session", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ isAuthenticated: true, user: req.user });
  } else {
    res.json({ isAuthenticated: false });
  }
});

router.post("/login", (req, res, next) => {
  req.passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: "Invalid login credentials" });
    }

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }

      return res.json({ message: "Login successful", user });
    });
  })(req, res, next);
});

router.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed", error: err });
    }
    return res.json({ message: "Logout successful" });
  });
});

router.post("/register", async (req, res) => {
  const { login, password, email } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ login }, { email }] });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const newUser = new User({
      login,
      password: await bcrypt.hash(password, 10),
      email,
    });
    await newUser.save();

    req.logIn(newUser, (err) => {
      if (err) {
        return next(err);
      }

      return res.json({ message: "Registration successful", user: newUser });
    });
  } catch (error) {
    if (error.errors?.email?.properties?.message) {
      return res
        .status(400)
        .json({ message: error.errors.email.properties.message });
    }

    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
