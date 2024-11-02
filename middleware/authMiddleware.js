const jwt = require('jsonwebtoken');

// Middleware để kiểm tra token
exports.authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Gán thông tin người dùng vào req để sử dụng trong các route tiếp theo
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token is not valid', error: err.message }); // Thêm thông tin lỗi
  }
};
