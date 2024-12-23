const mongoose = require("mongoose");

const discountSchema = new mongoose.Schema({
  code: { 
    type: String, 
    required: true, 
    unique: true // Mã giảm giá phải là duy nhất
  },
  description: { 
    type: String, 
    required: true 
  },
  discountValue: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  startDate: { 
    type: Date, 
    required: true 
  },
  expirationDate: { 
    type: Date, 
    required: true 
  },
  usedBy: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
  }],
  isActive: { 
    type: Boolean, 
    default: true 
  },
  isDelete: { 
    type: Boolean, 
    default: false 
  }
});

// Kiểm tra mã giảm giá khi áp dụng
discountSchema.methods.isValidForUser = function (userId) {
  const currentDate = new Date();
  // Đảm bảo mã giảm giá chưa hết hạn, chưa bị xóa và người dùng chưa sử dụng mã giảm giá này
  return (
    this.isActive &&
    !this.isDelete &&
    this.expirationDate > currentDate &&
    !this.usedBy.includes(userId)
  );
};

const Discount = mongoose.model("Discount", discountSchema);

module.exports = Discount;
