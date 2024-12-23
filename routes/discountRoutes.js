const express = require("express");
const {
  createDiscount,
  validateDiscountForUser,
  getDiscounts,
} = require("../controllers/discountController");
const { verifyUser } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", createDiscount);
router.get("/:code", verifyUser, validateDiscountForUser);
router.get("/", getDiscounts);
// router.get("/ongoing", getOngoingDiscounts);
// router.get("/upcoming", getUpcomingDiscounts);

module.exports = router;
