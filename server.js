import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import passport from "passport";
import cors from "cors";

import './startegies/local-startegy.js';
import routes from "./routes/auth.js";

const app = express();

mongoose.connect("mongodb://localhost/reactlogin")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Error:", err));

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use(session({
  secret: 'secret123',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: 'mongodb://localhost/reactlogin' }),
  cookie: { maxAge: 60 * 60 * 1000 }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', routes);

app.listen(3000, () => {
  console.log("Server running on PORT 3000");
});
