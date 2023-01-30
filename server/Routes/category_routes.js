const express = require("express");
const router = express.Router();
const requireLogin = require("../Middleware/requireLogin");
const {
  addCategory,
  getAllCategory,
  getCategoryByUser,
  updateCategory,
  deleteCategory,
  deleteAllCategories,
  getExpensesAndCategoriesByUser,
} = require("../Controller/categoryController");

router.post("/createCategory", requireLogin, addCategory);
router.get("/allCategory", requireLogin, getAllCategory);
router.get("/getMyCategory", requireLogin, getCategoryByUser);
router.put("/updateCategory", requireLogin, updateCategory);
router.delete("/deleteCategoryById", requireLogin, deleteCategory);
router.delete("/deleteAllCategory", requireLogin, deleteAllCategories);
router.get(
  "/getExpensesAndCategoriesOfUser",
  requireLogin,
  getExpensesAndCategoriesByUser
);

module.exports = router;
