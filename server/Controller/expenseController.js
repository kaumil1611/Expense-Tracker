const mongoose = require("mongoose");
const Expense = mongoose.model("Expenses");
const Category = mongoose.model("Categories");
const User = mongoose.model("User");
const { ObjectId } = require("mongodb");
const { validateExpenseInput } = require("../Utils/validation");

module.exports.addExpense = async (req, res) => {
  const { title, description, amount, category } = req.body;
  const userId = req.user._id;
  const emptyFieldError = validateExpenseInput(req.body);
  if (emptyFieldError) return res.status(422).send({ error: emptyFieldError });

  const categoryExists = await Category.findOne({
    _id: ObjectId(category),
    categoryAddedBy: userId,
  });
  if (!categoryExists) {
    return res.status(400).json({
      errors: [{ msg: "Category does not exist or is not added by you" }],
    });
  }
  // Check if the amount is within the category expense limit
  const categoryExpenseLimit = categoryExists.categoryExpenseLimit;
  const categoryResponse =
    await customResuseFunctionalityForCategoryTotalAmount(
      req.user._id,
      amount,
      categoryExpenseLimit,
      category
    );
  if (Array.isArray(categoryResponse) && categoryResponse.length) {
    return res.status(400).json({ message: categoryResponse[0].msg });
  }

  const user = await User.findOne({ _id: req.user._id });
  const totalExpenseLimit = user.totalExpenseLimit;

  if (!user) {
    return res.status(400).json({
      errors: [{ msg: "User does not exist" }],
    });
  }

  if (totalExpenseLimit) {
    const response = await customReuseFunctionalityForTotalAmount(
      req.user._id,
      amount,
      totalExpenseLimit
    );
    if (Array.isArray(response) && response.length) {
      return res.status(400).json({ message: response[0].msg });
    }

    req.user.password = undefined;
    const expense = new Expense({
      title,
      description,
      amount,
      category,
      expenseAddedBy: req.user,
    });
    expense
      .save()
      .then((result) => {
        res.json({
          expense: result,
          message: "expense added successfully",
          status: 1,
        });
      })
      .catch((err) => console.log(err));
  } else {
    throw new Error("Total expense limit not set for user");
  }
};

module.exports.getAllExpenses = (req, res) => {
  Expense.find()
    .select("title description amount category expenseAddedBy")
    .populate("expenseAddedBy", "_id userName")
    .exec((err, expenses) => {
      if (err) {
        return res.status(400).json({ error: "Could not retrieve expenses" });
      }
      res.json(expenses);
    });
};

module.exports.getExpensesByUser = (req, res) => {
  const { page, pageSize, searchField } = req.query;
  let sort = req.query.sort ? req.query.sort : { createdAt: -1 };

  let where = { expenseAddedBy: req.user._id };
  if (searchField) {
    where = {
      $and: [
        { expenseAddedBy: req.user._id },
        { title: { $regex: searchField, $options: "i" } },
      ],
    };
  }
  if (where && page && pageSize) {
    Expense.find({
      $and: [{ expenseAddedBy: req.user._id }, where],
    })
      .populate("expenseAddedBy", "_id userName")
      .populate("category", "_id categoryName")
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort(sort)
      .select("title description amount category expenseAddedBy")
      .exec((err, expenses) => {
        if (err) {
          return res
            .status(400)
            .json({ message: "Could not retrieve my expenses" });
        }
        Expense.countDocuments(
          { expenseAddedBy: req.user._id },
          (err, totalCount) => {
            if (err) {
              return res.status(400).json({ message: err.message });
            }
            res.json({
              expenses,
              total: expenses.length,
              totalCount,
              message: "Successfully retrieved expenses",
              status: 1,
            });
          }
        );
      });
  } else {
    Expense.find({ expenseAddedBy: req.user._id })
      .populate("expenseAddedBy", "_id userName")
      .populate("category", "_id categoryName")
      .sort(sort)
      .exec((err, expenses) => {
        if (err) {
          return res
            .status(400)
            .json({ message: "Could not retrieve my expenses" });
        }
        res.json({
          expenses,
          total: expenses.length,
          message: "Successfully retrieved expenses",
          status: 1,
        });
      });
  }
};

module.exports.updateExpenseByUser = async (req, res) => {
  const { title, description, amount, category, expenseId } = req.body;
  const userId = req.user._id; // Assume that req.user is the authenticated user
  // Check if category exists and is added by the user
  const categoryExists = await Category.findOne({
    _id: ObjectId(category),
    categoryAddedBy: userId,
  });
  if (!categoryExists) {
    return res.status(400).json({
      errors: [{ msg: "Category does not exist or is not added by you" }],
    });
  }
  // Check if the amount is within the category expense limit
  const categoryExpenseLimit = categoryExists.categoryExpenseLimit;
  const categoryResponse =
    await customResuseFunctionalityForCategoryTotalAmount(
      req.user._id,
      title,
      description,
      amount,
      categoryExpenseLimit,
      category
    );
  if (Array.isArray(categoryResponse) && categoryResponse.length) {
    return res.status(400).json({ message: categoryResponse[0].msg });
  }

  const user = await User.findOne({ _id: req.user._id });
  const totalExpenseLimit = user.totalExpenseLimit;

  if (!user) {
    return res.status(400).json({
      message: "User does not exist",
    });
  }
  if (totalExpenseLimit) {
    const response = await customReuseFunctionalityForTotalAmount(
      req.user._id,
      amount,
      totalExpenseLimit
    );
    if (Array.isArray(response) && response.length) {
      return res.status(400).json({ message: response[0].msg });
    }

    const updatedExpense = await Expense.findByIdAndUpdate(
      expenseId,

      req.body,
      { new: true }
    );

    return res.status(200).json({
      updatedExpense,
      message: "Expense update successfully",
      status: 1,
    });
  } else {
    throw new Error("Total expense limit not set for user");
  }
};

const customReuseFunctionalityForTotalAmount = async (
  user_id,
  amount,
  totalExpenseLimit
) => {
  const sumOfExpenseAmount = await Expense.aggregate([
    {
      $match: {
        expenseAddedBy: user_id,
      },
    },
    {
      $group: {
        _id: "$expenseAddedBy",
        total: { $sum: "$amount" },
      },
    },
  ]);

  if (
    sumOfExpenseAmount[0]?.total || sumOfExpenseAmount.length !== 0
      ? sumOfExpenseAmount[0]?.total + amount > totalExpenseLimit
      : amount > totalExpenseLimit
  ) {
    let error = [{ msg: "Expense amount exceeds the total expense limit" }];
    return error;
  }
};

const customResuseFunctionalityForCategoryTotalAmount = async (
  user_id,
  title,
  description,
  amount,
  categoryExpenseLimit,
  categoryId
) => {
  const existingCategoryAmount = await Expense.aggregate([
    {
      $match: {
        expenseAddedBy: ObjectId(user_id),
        category: ObjectId(categoryId),
      },
    },
    {
      $group: {
        _id: "$expenseAddedBy",
        totalAmount: { $sum: "$amount" },
      },
    },
  ]);

  const totalCategoryAmount =
    existingCategoryAmount.length > 0
      ? existingCategoryAmount[0].totalAmount + amount
      : amount;
  if (totalCategoryAmount > categoryExpenseLimit) {
    let error = [{ msg: "Category amount exceeds the category limit" }];
    return error;
  }
};

module.exports.deleteExpense = (req, res) => {
  let { expenseId } = req.body;
  if (!expenseId) {
    return res.status(400).send({
      message: "Expense id is required",
    });
  }

  if (!Array.isArray(expenseId)) {
    expenseId = [expenseId];
  }

  Expense.find({ _id: { $in: expenseId } })
    .then((expenses) => {
      if (!expenses || expenses.length === 0) {
        return res.status(400).send({
          message: "Expense not found with the provided id",
        });
      }

      expenses.forEach((expense) => {
        if (expense.expenseAddedBy.toString() !== req.user._id.toString()) {
          return res.status(400).send({
            message: "Unauthorized to delete this expense",
          });
        }
      });
      Expense.deleteMany({ _id: { $in: expenseId } })
        .then(() => {
          res
            .status(200)
            .json({ message: "Expense(s) deleted successfully", status: 1 });
        })
        .catch((err) => {
          res.status(400).send({
            message: "Error deleting expense(s)",
          });
        });
    })
    .catch((err) => {
      res.status(400).send({
        message: "Error finding expense(s)",
      });
    });
};

module.exports.deleteAllExpense = async (req, res) => {
  Expense.deleteMany({ expenseAddedBy: req.user._id }).then(() => {
    res.json({ message: "All expense deleted successfully" });
  });
};
