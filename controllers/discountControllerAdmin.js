const Discount = require('../models/Discount');
const User = require('../models/User');  

// 1. Tạo mới mã giảm giá
const createDiscount = async (req, res) => {
  try {
    const { code, description, discountValue,startDate, expirationDate } = req.body;

    // Kiểm tra sự tồn tại của mã giảm giá
    const existingDiscount = await Discount.findOne({ code });
    if (existingDiscount) {
      return res.status(400).json({ message: 'Mã giảm giá này đã tồn tại.' });
    }

    // Tạo mới mã giảm giá
    const newDiscount = new Discount({
      code,
      description,
      discountValue,
      expirationDate,
      startDate,
    });

    await newDiscount.save();
    res.status(201).json({ message: 'Mã giảm giá đã được tạo thành công!', discount: newDiscount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Đã có lỗi xảy ra khi tạo mã giảm giá.' });
  }
};

// 2. Lấy danh sách mã giảm giá

// const getDiscounts = async (req, res) => {
//   try {
//     const { page = 1, limit = 5 } = req.query; // Nhận tham số từ query (page & limit)
//     const skip = (page - 1) * limit; // Tính số mục cần bỏ qua

//     const [discounts, total] = await Promise.all([
//       Discount.find({ isDelete: false }) // Lấy danh sách mã giảm giá chưa bị xóa
//         .sort({ expirationDate: 1 }) // Sắp xếp theo ngày hết hạn (tăng dần)
//         .skip(skip)
//         .limit(parseInt(limit)),
//       Discount.countDocuments({ isDelete: false }) // Đếm tổng số mã giảm giá chưa bị xóa
//     ]);

//     res.status(200).json({
//       discounts,
//       total,
//       page: parseInt(page),
//       totalPages: Math.ceil(total / limit), // Tính tổng số trang
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Đã có lỗi xảy ra khi lấy danh sách mã giảm giá.' });
//   }
// };
const getDiscounts = async (req, res) => {
  try {
    const { page, limit, search } = req.query;

    const query = { isDelete: false };
    if (search) {
      query.$or = [
        { code: { $regex: search, $options: "i" } }, // Tìm kiếm theo code
        { description: { $regex: search, $options: "i" } } // Tìm kiếm theo description
      ];
    }
    if (page && limit) {
      const skip = (page - 1) * limit;

      const totalDiscounts = await Discount.countDocuments(query);
      const discounts = await Discount.find(query).skip(skip).limit(parseInt(limit)).sort({ expirationDate: 1 });

      res.status(200).json({
        success: true,
        total: totalDiscounts,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalDiscounts / limit),
        discounts,
      });
    } else {
      const discounts = await Discount.find(query).sort({ expirationDate: 1 });

      res.status(200).json({
        success: true,
        total: discounts.length,
        page: 1,
        limit: discounts.length,
        totalPages: 1,
        discounts,
      });
    }
  } catch (error) {
    console.error("Error in getAllDiscounts:", error);
    res.status(500).json({ error: "Failed to fetch discounts" });
  }
};

// 3. Cập nhật mã giảm giá
const updateDiscount = async (req, res) => {
  try {
    const { code } = req.params;
    const { description, discountValue, expirationDate, isActive } = req.body;

    const discount = await Discount.findOneAndUpdate(
      { code, isDelete: false },
      { description, discountValue, expirationDate, isActive },
      { new: true }
    );

    if (!discount) {
      return res.status(404).json({ message: 'Mã giảm giá không tồn tại.' });
    }

    res.status(200).json({ message: 'Mã giảm giá đã được cập nhật thành công.', discount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Đã có lỗi xảy ra khi cập nhật mã giảm giá.' });
  }
};

// 4. Xóa mã giảm giá
const deleteDiscount = async (req, res) => {
  try {
    const { code } = req.params;

    const discount = await Discount.findOne({ code, isDelete: false });
    if (!discount) {
      return res.status(404).json({ message: 'Mã giảm giá không tồn tại.' });
    }

    discount.isDelete = true;
    await discount.save();

    res.status(200).json({ message: 'Mã giảm giá đã được xóa thành công.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Đã có lỗi xảy ra khi xóa mã giảm giá.' });
  }
};

// 5. Kiểm tra mã giảm giá có hợp lệ với người dùng không
const validateDiscountForUser = async (req, res) => {
  try {
    const { code } = req.params;
    const { userId } = req.body;

    const discount = await Discount.findOne({ code, isDelete: false });
    if (!discount) {
      return res.status(404).json({ message: 'Mã giảm giá không tồn tại.' });
    }

    const isValid = await discount.isValidForUser(userId);
    if (isValid) {
      res.status(200).json({ message: 'Mã giảm giá hợp lệ.', discount });
    } else {
      res.status(400).json({ message: 'Mã giảm giá không hợp lệ cho người dùng này.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Đã có lỗi xảy ra khi kiểm tra mã giảm giá.' });
  }
};

module.exports = {
  createDiscount,
  getDiscounts,
  updateDiscount,
  deleteDiscount,
  validateDiscountForUser,
};
