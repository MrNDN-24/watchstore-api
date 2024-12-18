const express = require('express');
const router = express.Router();
const discountController = require('../controllers/discountControllerAdmin');
const { authMiddleware } = require('../middleware/authMiddleware');
// 1. Tạo mới mã giảm giá
router.post('/create',authMiddleware , discountController.createDiscount);

// 2. Lấy danh sách mã giảm giá
router.get('/', authMiddleware ,discountController.getDiscounts);

// 3. Cập nhật mã giảm giá
router.put('/:code',authMiddleware , discountController.updateDiscount);

// 4. Xóa mã giảm giá
router.delete('/:code',authMiddleware , discountController.deleteDiscount);

// 5. Kiểm tra mã giảm giá cho người dùng
router.post('/:code/validate',authMiddleware , discountController.validateDiscountForUser);

module.exports = router;
