const express = require("express");
const router = express.Router();
const Post = require("../../models/Post.js");
const faker = require("faker");

router.all("/*", (req, res, next) => {
  req.app.locals.layout = "admin";
  next();
});

router.get("/", (req, res) => {
  res.render("admin/index");
});

router.get("/dashboard", (req, res) => {
  res.render("admin/dashboard");
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
