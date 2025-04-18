const express = require("express");
const router = express.Router();
const Post = require("../../models/Post");
const Category = require("../../models/Category");
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const LocalStrategy = require("passport-local");

router.all("/*", (req, res, next) => {
  req.app.locals.layout = "home";
  next();
});

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find({});
    const categories = await Category.find({});
    res.render("home/index", { posts, categories });
  } catch (error) {
    res.status(404).send("no post to display");
  }
});

router.get("/posts/:slug", async (req, res) => {
  const slug = req.params.slug;
  try {
    const post = await Post.findOne({ slug })
      .populate({
        path: "comments",
        match: { approvedComment: true },
        populate: { path: "user", model: "users" },
      })
      .populate("user");
    const categories = await Category.find({});
    res.render("home/post", { post, categories });
  } catch (error) {
    res.status(401).send("no post found");
  }
});

router.get("/login", (req, res) => {
  res.render("home/login");
});

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return done(null, false, { message: "No user with that email" });
        }

        const isMatch = await user.isPasswordValid(password);
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Incorrect password" });
        }
      } catch (err) {
        return done(err);
      }
    }
  )
);

router.post("/login", (req, res) => {
  passport.Authenticator("local", {
    successRedirect: "/home",
    failureRedirect: "/login",
    failureFlash: true,
  })(req, res, next);
  res.render("home/index");
});

router.get("/logout", (req, res) => {
  req.logOut();
  res.redirect("home/index");
});

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

router.get("/register", (req, res) => {
  res.render("home/register");
});

router.post("/register", async (req, res) => {
  const { firstName, lastName, email, password, passwordConfirm } = req.body;

  let errors = [];

  if (!firstName) errors.push({ message: "First name is required" });
  if (!lastName) errors.push({ message: "Last name is required" });
  if (!email) errors.push({ message: "Email is required" });
  if (!password) errors.push({ message: "Password is required" });
  if (password.length < 6)
    errors.push({ message: "Password should be at least 6 characters" });
  if (password !== passwordConfirm)
    errors.push({ message: "Passwords do not match" });

  if (errors.length > 0) {
    return res.render("/home/register", {
      errors,
      firstName,
      lastName,
      email,
    });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      errors.push({ message: "Email already registered" });
      return res.render("/home/register", {
        errors,
        firstName,
        lastName,
        email,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    req.flash("success-message", "Registration successful! Please log in");
    res.redirect("/home/login");
  } catch (err) {
    console.error("Registration Error:", err);
    req.flash("error-message", "Registration failed. Please try again");
    res.redirect("/home/register");
  }
});

module.exports = router;
