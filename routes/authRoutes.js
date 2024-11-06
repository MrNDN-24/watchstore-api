// Routes
const express = require("express");
const {
  register,
  login,
  googleLogin,
  adminLogin,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google-login", googleLogin);
router.post("/adminLogin", adminLogin);

module.exports = router;
