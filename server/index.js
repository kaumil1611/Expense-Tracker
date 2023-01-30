const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
dotenv.config({ path: "./config.env" });
const PORT = process.env.PORT;

require("./DB/connection");

require("./Models/userSchema");
require("./Models/expensesSchema");
require("./Models/categorySchema");
require("./Models/totalExpense");

app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));
app.disable("x-powered-by");

const userRoute = require("./Routes/user_routes");
const expenseRoute = require("./Routes/expenses_routes");
const categoryRoute = require("./Routes/category_routes");
const totalExpRoute = require("./Routes/totalExpense_route");

app.use("/api/v1/users/", userRoute);
app.use("/api/v1/expenses", expenseRoute);
app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/totalExpense", totalExpRoute);

app.listen(PORT, () => {
  console.log(`Server Is Running On Port Number::- ${PORT}`);
});
