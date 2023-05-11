const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/category");
const express = require("express");
const router = express.Router();
router.route("/").get(getAllCategories);
router.route("/add").post(createCategory);
router.route("/:id").put(updateCategory);
router.get("/:id", getCategoryById);
router.delete("/:id", deleteCategory);

module.exports = router;
