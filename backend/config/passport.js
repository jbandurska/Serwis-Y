import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";

const validateUser = async (login, password, done) => {
  try {
    const user = await User.findOne({ login });

    if (user == null) {
      return done(null, false, {
        message: "Incorrect login or password.",
      });
    }

    const authenticated = await bcrypt.compare(password, user.password);
    if (!authenticated) {
      return done(null, false, {
        message: "Incorrect login or password.",
      });
    }

    return done(null, user);
  } catch (err) {
    return done(err);
  }
};

const serializeUser = (user, done) => {
  done(null, user._id);
};

const deserializeUser = async (id, done) => {
  try {
    const user = await User.findById(id);

    if (!user) {
      return done(null, false);
    }

    done(null, user);
  } catch (err) {
    console.dir(`Error: ${err}`);
    done(err);
  }
};

const configurePassport = (app) => {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(new LocalStrategy({ usernameField: "login" }, validateUser));

  passport.serializeUser(serializeUser);
  passport.deserializeUser(deserializeUser);

  app.use((req, _res, next) => {
    req.passport = passport;
    next();
  });

  return passport;
};

export { configurePassport };
