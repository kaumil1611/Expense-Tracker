const express = require("express");
const router = express.Router();
const {
  register,
  loginAuthentication,
  userFieldUpdate,
} = require("../Controller/userController");
const requireLogin = require("../Middleware/requireLogin");

router.post("/signup", register);
router.post("/signin", loginAuthentication);
router.put("/updateUser", requireLogin, userFieldUpdate);

module.exports = router;
