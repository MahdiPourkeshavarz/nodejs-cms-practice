const express = require("express");
const router = express.Router();
const Category = require("../../models/Category");

router.all("/*", (req, res, next) => {
  req.app.locals.layout = "admin";
  next();
});

router.get("/", (req, res) => {
  const categories = Category.find({});
  res.render("admin/categories/index", { categories });
});

router.post("/create", async (req, res) => {
  const newCategory = Category({
    name: req.body.name,
  });
  try {
    await newCategory.save();
    res.render("admin/categories/index");
  } catch (err) {
    res.status(400).send("could not save the category");
  }
});

module.exports = router;
