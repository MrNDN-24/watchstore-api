const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rating: {
    type: Number,
    required: [true, "Đánh giá là bắt buộc"],
    min: [1, "Đánh giá tối thiểu là 1"],
    max: [5, "Đánh giá tối đa là 5"],
  },
  comment: {
    type: String,
    trim: true,
  },
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Tên sản phẩm là bắt buộc"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Mô tả sản phẩm là bắt buộc"],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "Giá sản phẩm là bắt buộc"],
    min: [0, "Giá sản phẩm không thể nhỏ hơn 0"],
  },
  stock: {
    type: Number,
    required: [true, "Số lượng tồn kho là bắt buộc"],
    min: [0, "Số lượng tồn kho không thể nhỏ hơn 0"],
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  reviews: [reviewSchema],
  imageUrl: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
