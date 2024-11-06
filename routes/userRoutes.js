const express = require("express");
const {
  getUserProfile,
  getAllUser,
  updateUserProfile,
} = require("../controllers/userController");
const {
  authMiddleware,
  verifyUser,
  formatUserData,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/profile", verifyUser, getUserProfile);
// router.get("/alluser", getAllUser);
router.put("/profile", formatUserData, updateUserProfile);

module.exports = router;
