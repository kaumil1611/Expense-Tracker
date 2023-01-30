const mongoose = require("mongoose");
const totalExpenses = mongoose.model("TotalExpense");
const { validateTotalExpenseInput } = require("../Utils/validation");

module.exports.addTotalExpense = (req, res) => {
  const { totalExpenseLimit } = req.body;
  const emptyFieldError = validateTotalExpenseInput(req.body);
  if (emptyFieldError) return res.status(422).send({ error: emptyFieldError });

  totalExpenses
    .findOne({ totalExpenseAddedBy: req.user._id })
    .then((foundTotalExpense) => {
      if (foundTotalExpense) {
        return res
          .status(400)
          .json({ error: "Total expense already added by user" });
      } else {
        req.user.password = undefined;
        const total = new totalExpenses({
          totalExpenseLimit,
          totalExpenseAddedBy: req.user,
        });
        total
          .save()
          .then((result) => {
            res.json({ totalExpenseLimit: result });
          })
          .catch((err) => console.log(err));
      }
    });
};

module.exports.getTotalExpenses = (req, res) => {
  // find total expenses
  totalExpenses.find().then((total) => {
    const totalExpAmount = total.reduce(
      (acc, totalExp) => acc + totalExp.totalExpenseLimit,
      0
    );
    res.json({ allUserTotalExpenseLimit: totalExpAmount });
  });
};

module.exports.getTotalExpensesByUser = (req, res) => {
  totalExpenses
    .find({ totalExpenseAddedBy: req.user._id })
    .populate("totalExpenseAddedBy", "_id userName")
    .exec((err, totalExp) => {
      if (err) {
        return res
          .status(400)
          .json({ error: "Could not retrieve my total expense" });
      }
      res.json({ myTotalExpenseLimit: totalExp });
    });
};
