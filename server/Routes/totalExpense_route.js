const express = require("express");
const router = express.Router();
const requireLogin = require("../Middleware/requireLogin");
const {
  addTotalExpense,
  getTotalExpensesByUser,
  getTotalExpenses,
} = require("../Controller/totalExpenseController");

router.post("/createTotalExpense", requireLogin, addTotalExpense);
router.get("/getAllTotalExpense", requireLogin, getTotalExpenses);
router.get("/getMyTotalExpense", requireLogin, getTotalExpensesByUser);

module.exports = router;
