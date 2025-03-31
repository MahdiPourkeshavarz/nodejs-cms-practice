const express = require("express");
const router = express.Router();
const Post = require("../../models/Post");
router.all("/*", (req, res, next) => {
  req.app.locals.layout = "home";
  next();
});

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find({});
    res.render("home/index", { posts });
  } catch (error) {
    res.status(404).send("no post to display");
  }
});

router.get("/about", (req, res) => {
  res.render("home/about");
});

router.get("/login", (req, res) => {
  res.render("home/login");
});

router.get("/register", (req, res) => {
  res.render("home/register");
});

module.exports = router;
