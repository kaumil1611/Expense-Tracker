const mongoose = require("mongoose");
const Category = mongoose.model("Categories");
const Expense = mongoose.model("Expenses");
const { ObjectId } = require("mongodb");
const { validateCategoryInput } = require("../Utils/validation");

module.exports.addCategory = (req, res) => {
  const { categoryName, categoryExpenseLimit } = req.body;
  const emptyFieldError = validateCategoryInput(req.body);
  if (emptyFieldError) return res.status(422).send({ error: emptyFieldError });

  Category.findOne({ categoryName, categoryAddedBy: req.user._id }).then(
    (foundCategory) => {
      if (foundCategory) {
        return res
          .status(422)
          .json({ message: "Category already added by user" });
      } else {
        req.user.password = undefined;
        const category = new Category({
          categoryName,
          categoryExpenseLimit,
          categoryAddedBy: req.user,
        });
        category
          .save()
          .then((result) => {
            res.json({
              category: result,
              message: "Category added successfully",
              status: 1,
            });
          })
          .catch((err) =>
            res.json({
              category: result,
              message: err,
              status: 0,
            })
          );
      }
    }
  );
};

module.exports.getAllCategory = (req, res) => {
  Category.find()
    .select("categoryName categoryExpenseLimit categoryAddedBy")
    .populate("categoryAddedBy", "_id userName")
    .exec((err, category) => {
      if (err) {
        return res.status(400).json({ error: "Could not retrieve categories" });
      }
      res.json(category);
    });
};

module.exports.getCategoryByUser = (req, res) => {
  const { page, pageSize, searchField } = req.query;

  let sort = { createdAt: -1 };
  if (req.query.sort) {
    /* converted String values in to object
       param values should be in this format {"fieldName": sortDirection}
    */
    sort = JSON.parse(req.query.sort.toString());
  }
  let where = { categoryAddedBy: req.user._id };
  if (searchField) {
    where = {
      $and: [
        { categoryAddedBy: req.user._id },
        { categoryName: { $regex: searchField, $options: "i" } },
      ],
    };
  }

  Category.find({ $and: [{ categoryAddedBy: req.user._id }, where] })
    .populate("categoryAddedBy", "_id userName")
    .sort(sort)
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .select("categoryName categoryExpenseLimit categoryAddedBy")
    .exec((err, categories) => {
      if (err) {
        return res
          .status(400)
          .json({ error: "Could not retrieve my categories" });
      }
      Category.countDocuments(
        { categoryAddedBy: req.user._id },
        (err, totalCount) => {
          if (err) {
            return res.status(400).json({ message: err.message });
          }
          res.json({
            categories,
            total: categories.length,
            totalCount,
            message: "Successfully get Category Listing",
            status: 1,
          });
        }
      );
    });
};
module.exports.updateCategory = async (req, res) => {
  const { categoryId, categoryName, categoryExpenseLimit } = req.body;

  if (typeof categoryId === String || typeof categoryId === "string") {
    var cId = new ObjectId(categoryId);
  }

  const user_id = req.user._id;
  try {
    // Update categoryName and categoryExpenseLimit in the Category model
    const updatedCategory = await Category.findOneAndUpdate(
      { _id: ObjectId(categoryId), categoryAddedBy: user_id },
      { $set: { categoryName, categoryExpenseLimit } },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(400).json({
        message:
          "This category does not exist or you are not authorized to update it",
      });
    }

    // Check if the total amount of expenses in this category is less than or equal to the updated categoryExpenseLimit
    const existingCategoryAmount = await Expense.aggregate([
      {
        $match: {
          category: cId,
          expenseAddedBy: user_id,
        },
      },
      {
        $group: {
          _id: "$expenseAddedBy",
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);
    if (existingCategoryAmount[0]?.totalAmount > categoryExpenseLimit) {
      return res.status(400).json({
        message:
          "Some expenses in this category have already exceeded the updated categoryExpenseLimit",
      });
    }

    return res.status(200).json({
      message: "Category updated successfully",
      status: 1,
    });
  } catch (error) {
    if (error) {
      return res.status(500).json({
        message: "Error updating the category",
        error,
      });
    }
  }
};

module.exports.deleteCategory = (req, res) => {
  let { categoryId } = req.body;
  if (!categoryId) {
    return res.status(400).send({
      message: "Category id is required",
    });
  }

  if (!Array.isArray(categoryId)) {
    categoryId = [categoryId];
  }

  Category.find({ _id: { $in: categoryId } })
    .then((categories) => {
      if (!categories || categories.length === 0) {
        return res.status(400).send({
          message: "Category not found with the provided id",
        });
      }

      categories.forEach((category) => {
        if (category.categoryAddedBy.toString() !== req.user._id.toString()) {
          return res.status(400).send({
            message: "Unauthorized to delete this expense",
          });
        }
      });
      Category.deleteMany({ _id: { $in: categoryId } })
        .then(() => {
          res
            .status(200)
            .json({ message: "Category(s) deleted successfully", status: 1 });
        })
        .catch((err) => {
          res.status(400).send({
            message: "Error deleting Category(s)",
          });
        });
    })
    .catch((err) => {
      res.status(400).send({
        message: "Error finding Category(s)",
      });
    });
};

module.exports.deleteAllCategories = (req, res) => {
  Category.deleteMany({ categoryAddedBy: req.user._id }).then(() => {
    res.json({ message: "All categories deleted successfully" });
  });
};

/* module.exports.getExpensesAndCategoriesByUser = (req, res) => {
  const userId = req.user._id; // Get the userId from the request object
  const categoryId = req.query.category;
  const { page, pageSize } = req.query;

  categoryAndExpenseByCIdCombine(userId, categoryId).exec((err, result) => {
    if (err) {
      return res.status(400).json({
        error: "Could not retrieve expenses and categories for user",
      });
    }
    res.json(result);
  });
};

const categoryAndExpenseByCIdCombine = (userId, categoryId) => {
  let matchObject = { categoryAddedBy: userId };
  if (categoryId) {
    matchObject._id = ObjectId(categoryId);
  }
  return Category.aggregate([
    {
      $match: matchObject,
    },
    {
      $lookup: {
        from: "expenses",
        localField: "categoryAddedBy",
        foreignField: "expenseAddedBy",
        as: "expense",
      },
    },
    {
      $lookup: {
        from: "expenses",
        localField: "_id",
        foreignField: "category",
        as: "expense",
      },
    },
    {
      $project: {
        _id: 1,
        categoryName: 1,
        categoryExpenseLimit: 1,
        categoryAddedBy: 1,
        expenses: {
          $map: {
            input: "$expense",
            as: "expense",
            in: {
              _id: "$$expense._id",
              title: "$$expense.title",
              description: "$$expense.description",
              amount: "$$expense.amount",
              category: "$$expense.category",
              expenseAddedBy: "$$expense.expenseAddedBy",
            },
          },
        },
      },
    },
  ]);
}; */

module.exports.getExpensesAndCategoriesByUser = async (req, res) => {
  let { page, pageSize, search, sortBy, direction } = req.query;
  const userId = req.user._id;
  pageSize = parseInt(pageSize);
  // Calculate skip value for pagination
  const skip = (page - 1) * pageSize;

  // Define query conditions
  let conditions = { expenseAddedBy: userId };
  let categoryId;
  if (search) {
    // Look up category by name
    const category = await Category.findOne({
      categoryName: { $regex: search, $options: "i" },
      categoryAddedBy: userId,
    });
    if (category) {
      categoryId = category._id;
      conditions.category = categoryId;
    } else {
      return res.status(400).json({ error: "Invalid category search" });
    }
  }

  // Use aggregate method to join data from two collections
  let aggregatePipeline = [
    { $match: conditions },
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    },
    { $unwind: "$category" }, //unwind the category array
    {
      $project: {
        title: 1,
        amount: 1,
        categoryName: "$category.categoryName", //project the categoryName
        description: 1,
        createdAt: 1,
      },
    },
  ];

  // Define sorting options
  if (sortBy) {
    let sort = {};
    sort[sortBy] = direction === "1" ? 1 : -1;
    aggregatePipeline.push({ $sort: sort });
  } else {
    aggregatePipeline.push({ $sort: { createdAt: -1 } });
  }

  aggregatePipeline.push({ $skip: skip }, { $limit: pageSize });

  const data = await Expense.aggregate(aggregatePipeline);

  // Get total count of documents
  const totalCount = await Expense.countDocuments(conditions);

  // Send response
  res.json({
    data,
    totalCount,
  });
};
