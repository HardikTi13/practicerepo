import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import User from "../database/User.js";
import bcrypt from "bcrypt";

passport.use(new LocalStrategy(
  { passReqToCallback: true }, // 👈 This is the key fix
  async (req, username, password, done) => {
    try {
      const { UserType } = req.body;
      const user = await User.findOne({ username });
      if (!user) return done(null, false, { message: "User not found" });

      const match = await bcrypt.compare(password, user.password);
      if (!match) return done(null, false, { message: "Incorrect password" });

      if (UserType !== user.UserType) {
        return done(null, false, { message: "User type mismatch" });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));


passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});
