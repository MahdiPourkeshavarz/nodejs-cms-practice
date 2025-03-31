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

router.get("/posts/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const post = await Post.findOne({ _id: id });
    res.render("home/post", { post });
  } catch (error) {
    res.status(401).send("no post found");
  }
});

router.get("/login", (req, res) => {
  res.render("home/login");
});

router.get("/register", (req, res) => {
  res.render("home/register");
});

module.exports = router;
