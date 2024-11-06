// get
const Product = require("../models/Product"); // Đường dẫn có thể thay đổi tùy cấu trúc dự án

const getAllProducts = async (req, res) => {
  try {
    // Sử dụng `find` để lấy tất cả các sản phẩm, có thể bổ sung thêm các tùy chọn phân trang hoặc sắp xếp nếu cần
    const products = await Product.find();

    // Trả về danh sách sản phẩm
    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách sản phẩm",
    });
  }
};

module.exports = { getAllProducts };
