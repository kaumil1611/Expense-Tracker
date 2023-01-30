const mongoose = require("mongoose");
const User = mongoose.model("User");
const { ObjectId } = require("mongodb");
const {
  validateEmail,
  validateUsername,
  validatePassword,
  validateTotalExpenseInput,
} = require("../Utils/validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const jwtKey = process.env.JWT_PRIVATE_KEY;

module.exports.register = (req, res) => {
  const { userName, email, password, totalExpenseLimit } = req.body;

  const usernameError = validateUsername(userName);
  if (usernameError) return res.status(400).send({ error: usernameError });

  const emailError = validateEmail(email);
  if (emailError) return res.status(400).send({ error: emailError });

  const passwordError = validatePassword(password);
  if (passwordError) return res.status(400).send({ error: passwordError });

  const emptyFieldError = validateTotalExpenseInput(totalExpenseLimit);
  if (emptyFieldError) return res.status(422).send({ error: emptyFieldError });

  User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        return res
          .status(208)
          .send({ error: "User already exists with that email" });
      }
      bcrypt.hash(password, 12).then((hashedPassword) => {
        const user = new User({
          userName,
          email,
          password: hashedPassword,
          totalExpenseLimit,
        });
        user
          .save()
          .then(() => {
            res.json({ message: "User Register successfully" });
          })
          .catch((err) => console.log("Something went wrong", err));
      });
    })
    .catch((err) => console.log("Something went wrong", err));
};

module.exports.loginAuthentication = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .send({ error: "Please provide both a username/email and a password." });
  }
  User.findOne({ email: email })
    .then((savedUser) => {
      if (!savedUser) {
        return res.status(422).send({
          error: "Invalid user email",
        });
      }
      bcrypt
        .compare(password, savedUser.password)
        .then((doMatch) => {
          if (doMatch) {
            const token = jwt.sign({ _id: savedUser._id }, jwtKey);
            const { _id, userName, email, totalExpenseLimit } = savedUser;
            res.status(201).send({
              token: token,
              user: { _id, userName, email, totalExpenseLimit },
              message: "user Sign In successfully",
            });
          } else {
            return res.status(422).send({
              error: "Invalid user password",
            });
          }
        })
        .catch((err) => console.log("Something went wrong in login", err));
    })
    .catch((err) => console.log("Something Went Wrong in signIn ", err));
};

module.exports.userFieldUpdate = (req, res) => {
  const { userId, userName, email, password, oldPassword, totalExpenseLimit } =
    req.body;
  var user_id = new ObjectId(userId);
  // Validate the input fields
  const usernameError = validateUsername(userName);
  if (usernameError) {
    return res.status(400).send({ error: usernameError });
  }

  const emailError = validateEmail(email);
  if (emailError) {
    return res.status(400).send({ error: emailError });
  }

  const emptyFieldError = validateTotalExpenseInput(totalExpenseLimit);
  if (emptyFieldError) return res.status(422).send({ error: emptyFieldError });

  // Find the user by their userId
  User.findOne({ _id: user_id })
    .then((savedUser) => {
      if (!savedUser) {
        return res
          .status(404)
          .send({ error: "User not found with the provided userId" });
      }
      // Compare the provided old password with the user's hashed password
      bcrypt
        .compare(oldPassword, savedUser.password)
        .then((doMatch) => {
          if (!doMatch) {
            return res.status(422).send({
              error: "The provided old password is incorrect",
            });
          }
          // Hash the new password if it was provided
          if (password) {
            const passwordError = validatePassword(password);
            if (passwordError)
              return res.status(400).send({ error: passwordError });

            bcrypt.hash(password, 12).then((hashedPassword) => {
              // Update the user's fields
              User.updateOne(
                { _id: user_id },
                {
                  $set: {
                    userName,
                    email,
                    password: hashedPassword,
                    totalExpenseLimit,
                  },
                }
              )
                .then(() => {
                  res.status(201).send({
                    message: "User updated successfully",
                    status: 1,
                  });
                })
                .catch((err) => {
                  res.status(404).send({
                    message: err,
                  });
                });
            });
          } else {
            // Update the user's fields without the password
            User.updateOne(
              { _id: user_id },
              {
                $set: {
                  userName,
                  email,
                  totalExpenseLimit,
                },
              }
            )
              .then(() => {
                res.status(201).send({
                  message: "User updated successfully",
                  status: 1,
                });
              })
              .catch((err) => {
                res.status(404).send({
                  message: err,
                });
              });
          }
        })
        .catch((err) => {
          res.status(404).send({
            message: err,
          });
        });
    })
    .catch((err) => {
      res.status(404).send({
        message: err,
        status: 0,
      });
    });
};
