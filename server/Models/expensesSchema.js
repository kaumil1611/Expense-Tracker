const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const expensesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    category: {
      type: ObjectId,
      ref: "Categories",
    },
    // category: {
    //   type: {
    //     categoryId: {
    //       type: ObjectId,
    //       ref: "Categories",
    //       required: true,
    //     },
    //     categoryName: {
    //       type: String,
    //       required: true,
    //     },
    //   },
    //   required: true,
    // },

    expenseAddedBy: {
      type: ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);
mongoose.model("Expenses", expensesSchema);
