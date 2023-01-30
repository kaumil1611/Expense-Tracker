// const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;
// mongoose.set("strictQuery", false);
// mongoose
//   .connect(MONGO_URI)
//   .then(() => console.log(`Connection successfull at port number: ${PORT}`))
//   .catch((error) => console.log(error.message));

const mongoose = require("mongoose");

mongoose.set("strictQuery", false);
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;

connection.on("error", (err) => console.log(err));

connection.on("connected", () =>
  console.log("Mongo DB Connection Successfull")
);
