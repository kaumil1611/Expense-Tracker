const express = require("express");
const router = express.Router();
const requireLogin = require("../Middleware/requireLogin");
const {
  addExpense,
  getAllExpenses,
  getExpensesByUser,
  updateExpenseByUser,
  deleteExpense,
  deleteAllExpense,
} = require("../Controller/expenseController");

router.post("/createExpense", requireLogin, addExpense);
router.get("/allExpense", requireLogin, getAllExpenses);
router.get("/getMyExpense", requireLogin, getExpensesByUser);
router.put("/updateExpense", requireLogin, updateExpenseByUser);
router.delete("/deleteExpenseById", requireLogin, deleteExpense);
router.delete("/deleteAllExpense", requireLogin, deleteAllExpense);

module.exports = router;
