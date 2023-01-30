const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const categorySchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: true,
    },
    categoryExpenseLimit: {
      type: Number,
      required: true,
    },
    categoryAddedBy: {
      type: ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);
mongoose.model("Categories", categorySchema);
