import { Router } from "express";
import passport from "passport";
import User from "../database/User.js";
import bcrypt from "bcrypt";

const router = Router();

router.post('/signup', async (req, res) => {
  try {
    const { username, password,UserType } = req.body;
    if (!username || !password || !UserType)
      return res.status(400).json({ msg: "Kindly Provide the All Value" });

    const existing = await User.findOne({ username });
    if (existing)
      return res.status(409).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashedPassword, UserType });


    req.login(user, (err) => {
      if (err) {
        console.error("Login error after signup:", err);
        return res.sendStatus(500);
      }
      res.status(200).json({ user });
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.sendStatus(500);
  }
});

router.post('/login', passport.authenticate('local'), (req, res) => {
  res.status(200).json({ user: req.user });
});

router.get('/status', (req, res) => {
  if (!req.isAuthenticated())
    return res.json({ authenticated: false });
  res.json({ authenticated: true, user: req.user });
});

router.post('/logout', (req, res) => {
  req.logout(() => {
    res.sendStatus(200);
  });
});

export default router;
