const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Tên là bắt buộc"],
    minlength: [3, "Tên phải có ít nhất 3 ký tự"],
  },
  email: {
    type: String,
    required: [true, "Email là bắt buộc"],
    unique: true,
    match: [/.+\@.+\..+/, "Email không hợp lệ"],
  },
  password: {
    type: String,
    required: function() {
      return !this.isGoogleUser; // Mật khẩu không cần thiết nếu là người dùng Google
    },
    minlength: [6, "Mật khẩu phải có ít nhất 6 ký tự"],
  },
  isGoogleUser: {
    type: Boolean,
    default: false,
  },
  avatar: {
    type: String, // Thêm trường avatar
  },
  phone: {
    type: String,
    match: [/^[0-9]{10,15}$/, "Số điện thoại không hợp lệ"], // Thêm thông báo lỗi cho số điện thoại
  },
  role: {
    type: String,
    enum: ['admin', 'customer', 'salesperson', 'delivery staff'],
    default: 'customer',
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

// Middleware để băm mật khẩu trước khi lưu
userSchema.pre('save', async function (next) {
  if (this.isModified('password') && !this.isGoogleUser) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Phương thức xác thực mật khẩu
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

// Phương thức để tạo token
userSchema.methods.generateAuthToken = function () {
  return jwt.sign({ _id: this._id, email: this.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

module.exports = mongoose.model('User', userSchema);

// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken'); 

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     match: /.+\@.+\..+/,
//   },
//   password: {
//     type: String,
//     required: function() {
//       return !this.isGoogleUser; // Mật khẩu không cần thiết nếu là người dùng Google
//     },
//     minlength: 6,
//   },
//   isGoogleUser: {
//     type: Boolean,
//     default: false,
//   },
//   avatar: {
//     type: String, // Thêm trường avatar
//   },
//   phone: {
//     type: String,
//     match: /^[0-9]{10,15}$/, 
//   },
//   role: {
//     type: String,
//     enum: ['admin', 'customer', 'salesperson', 'delivery staff'],
//     default: 'customer',
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// // Middleware để băm mật khẩu trước khi lưu
// userSchema.pre('save', async function (next) {
//   if (this.isModified('password') && !this.isGoogleUser) {
//     this.password = await bcrypt.hash(this.password, 10);
//   }
//   next();
// });

// // Phương thức xác thực mật khẩu
// userSchema.methods.comparePassword = function (password) {
//   return bcrypt.compare(password, this.password);
// };

// // Phương thức để tạo token
// userSchema.methods.generateAuthToken = function () {
//   return jwt.sign({ _id: this._id, email: this.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
// };

// module.exports = mongoose.model('User', userSchema);
