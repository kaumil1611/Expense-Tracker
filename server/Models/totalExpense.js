const mongoose = require("mongoose");

const totalExpenseSchema = new mongoose.Schema(
  {
    totalExpenseLimit: {
      type: Number,
      required: true,
    },
    totalExpenseAddedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

mongoose.model("TotalExpense", totalExpenseSchema);
