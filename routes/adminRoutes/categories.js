const express = require("express");
const router = express.Router();
const Category = require("../../models/Category");

router.all("/*", (req, res, next) => {
  req.app.locals.layout = "admin";
  next();
});

router.get("/", async (req, res) => {
  try {
    const categories = await Category.find({});
    res.render("admin/categories/index", { categories });
  } catch (err) {
    res.status(400).send("could not find the categories");
  }
});

router.post("/create", async (req, res) => {
  const newCategory = Category({
    name: req.body.name,
  });
  try {
    await newCategory.save();
    res.render("admin/categories");
  } catch (err) {
    res.status(400).send("could not save the category");
  }
});

router.get("/edit/:id", async (req, res) => {
  try {
    const category = await Category.find({ _id: req.params.id });
    res.render("admin/categories/edit", { category });
  } catch (err) {
    res.status(400).send("could not find the category");
  }
});

router.put("/edit/:id", async (req, res) => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).send("Category not found");
    }

    req.flash("success", "Category updated successfully");
    res.redirect("/admin/categories");
  } catch (err) {
    req.flash("error", "Failed to update category");
    res.redirect(`/admin/categories/edit/${req.params.id}`);
  }
});

module.exports = router;
