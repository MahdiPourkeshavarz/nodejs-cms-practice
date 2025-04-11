const express = require("express");
const router = express.Router();
const Post = require("../../models/Post.js");
const faker = require("faker");
const { userAuthenticated } = require("../../utils/authentication.js");

router.all("/*", userAuthenticated, (req, res, next) => {
  req.app.locals.layout = "admin";
  next();
});

router.get("/", async (req, res) => {
  try {
    const postCount = await Post.count({});
    res.render("admin/index", { postCount });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating post");
  }
});

router.get("/dashboard", (req, res) => {
  res.render("admin/dashboard");
});

router.get("/logout", (req, res) => {
  req.logOut();
  res.redirect("/home/index");
});

router.post("/generate-fake-post", async (req, res) => {
  const possibleStatuses = ["public", "private", "draft"];
  const quantity = req.body.quantity;
  const posts = Array.from({ length: quantity }).map(() => ({
    title: faker.name.title(),
    status: faker.helpers.arrayElement(possibleStatuses),
    allowComments: faker.datatype.boolean(),
    body: faker.lorem.paragraphs(3),
  }));
  await Post.insertMany(posts);
  res.redirect("/admin/posts");
});

module.exports = router;
