const express = require("express");
const router = express.Router();
const Post = require("../../models/Post");
const Category = require("../../models/Category");

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

router.get("/posts/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const post = await Post.findOne({ _id: id });
    const categories = await Category.find({});
    res.render("home/post", { post, categories });
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
