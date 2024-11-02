const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const authMiddleware = require("../middleware/authMiddleware"); // Import middleware

const client = new OAuth2Client(process.env.GG_CLIENT_ID);

// Đăng ký người dùng
// exports.register = async (req, res) => {
//   const { name, email, password } = req.body;

//   try {
//     const user = new User({ name, email, password });
//     await user.save();
//     res.status(201).json({ message: "User registered successfully" });
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// };
// Đăng ký người dùng
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = new User({ name, email, password });
    await user.save();
    res.status(201).json({ message: "Người dùng đã đăng ký thành công" });
  } catch (err) {
    const errors = {};
    if (err.errors) {
      for (let field in err.errors) {
        errors[field] = err.errors[field].message; // Lưu thông báo lỗi cho từng trường
      }
    }
    res.status(400).json({ message: "Đăng ký thất bại", errors });
  }
};

// Đăng nhập người dùng
exports.login = async (req, res) => {
  const { name, password } = req.body;

  try {
    const user = await User.findOne({ name });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(200).json({ message: "Login successful", token: jwtToken });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.googleLogin = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: "Google token is missing" });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { email, name, picture } = ticket.getPayload();

    // Tìm người dùng trong database
    let user = await User.findOne({ email });

    if (!user) {
      // Nếu người dùng chưa tồn tại, tạo một tài khoản mới
      user = new User({
        name,
        email,
        avatar: picture,
        isGoogleUser: true, // Đánh dấu đây là người dùng Google
      });
      await user.save();
    }

    // Tạo token cho người dùng và gửi phản hồi
    const userToken = user.generateAuthToken(); // Giả định bạn có phương thức này trong model
    res.status(200).json({ token: userToken, user });
  } catch (error) {
    console.error("Error during Google login:", error);
    res.status(400).send("Google login failed");
  }
};
