const Discount = require("../models/Discount");
const User = require("../models/User");

// 1. Tạo mới mã giảm giá
const createDiscount = async (req, res) => {
  try {
    const { code, description, discountValue, expirationDate } = req.body;

    // Kiểm tra sự tồn tại của mã giảm giá
    const existingDiscount = await Discount.findOne({ code });
    if (existingDiscount) {
      return res.status(400).json({ message: "Mã giảm giá này đã tồn tại." });
    }

    // Tạo mới mã giảm giá
    const newDiscount = new Discount({
      code,
      description,
      discountValue,
      expirationDate,
    });

    await newDiscount.save();
    res.status(201).json({
      message: "Mã giảm giá đã được tạo thành công!",
      discount: newDiscount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Đã có lỗi xảy ra khi tạo mã giảm giá." });
  }
};

// 2. Lấy danh sách mã giảm giá
const getDiscounts = async (req, res) => {
  try {
    const currentDate = new Date(); // Lấy ngày hiện tại

    // Truy vấn voucher đang diễn ra
    const ongoingDiscounts = await Discount.find({
      isActive: true,
      isDelete: false, // Không lấy voucher đã bị xóa
      startDate: { $lte: currentDate }, // Voucher đã bắt đầu (startDate <= hiện tại)
      expirationDate: { $gt: currentDate }, // Voucher chưa hết hạn (expirationDate > hiện tại)
    }).sort({ startDate: 1 }); // Sắp xếp theo ngày bắt đầu (tăng dần)

    // Truy vấn voucher sắp diễn ra (startDate > hiện tại)
    const upcomingDiscounts = await Discount.find({
      isDelete: false,
      isActive: true, // Không lấy voucher đã bị xóa
      startDate: { $gt: currentDate }, // Voucher chưa bắt đầu (startDate > hiện tại)
    }).sort({ startDate: 1 }); // Sắp xếp theo ngày bắt đầu (tăng dần)

    // Trả về 2 loại voucher
    res.status(200).json({
      ongoingDiscounts,
      upcomingDiscounts,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Đã có lỗi xảy ra khi lấy danh sách mã giảm giá." });
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
      return res.status(404).json({ message: "Mã giảm giá không tồn tại." });
    }

    res
      .status(200)
      .json({ message: "Mã giảm giá đã được cập nhật thành công.", discount });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Đã có lỗi xảy ra khi cập nhật mã giảm giá." });
  }
};

// 4. Xóa mã giảm giá
const deleteDiscount = async (req, res) => {
  try {
    const { code } = req.params;

    const discount = await Discount.findOne({ code, isDelete: false });
    if (!discount) {
      return res.status(404).json({ message: "Mã giảm giá không tồn tại." });
    }

    discount.isDelete = true;
    await discount.save();

    res.status(200).json({ message: "Mã giảm giá đã được xóa thành công." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Đã có lỗi xảy ra khi xóa mã giảm giá." });
  }
};

// 5. Kiểm tra mã giảm giá có hợp lệ với người dùng không
const validateDiscountForUser = async (req, res) => {
  try {
    const { code } = req.params;
    const userId = req.user.id;
    console.log("User id", userId);

    const discount = await Discount.findOne({ code, isDelete: false });
    if (!discount) {
      return res
        .status(404)
        .json({ success: false, message: "Mã giảm giá không tồn tại." });
    }

    const isValid = await discount.isValidForUser(userId);
    if (isValid) {
      res
        .status(200)
        .json({ success: true, message: "Mã giảm giá hợp lệ.", discount });
    } else {
      res.status(400).json({
        success: false,
        message: "Mã giảm giá không hợp lệ cho người dùng này.",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Đã có lỗi xảy ra khi kiểm tra mã giảm giá.",
    });
  }
};

module.exports = {
  createDiscount,
  getDiscounts,
  updateDiscount,
  deleteDiscount,
  validateDiscountForUser,
};
