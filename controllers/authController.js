const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const authMiddleware = require("../middleware/authMiddleware"); // Import middleware

const client = new OAuth2Client(process.env.GG_CLIENT_ID);

// Đăng ký người dùng
exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = new User({ username, email, password });
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
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Thông tin đăng nhập không hợp lệ" });
    }
    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(200).json({ message: "Đăng nhập thành công", token: jwtToken });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.googleLogin = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: "Thiếu token Google" });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { email, name, picture } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        username: name, // Giả định dùng name làm username
        email,
        avatar: picture,
        isGoogleUser: true,
      });
      await user.save();
    }

    const userToken = user.generateAuthToken();
    res.status(200).json({ token: userToken, user });
  } catch (error) {
    console.error("Error during Google login:", error);
    res.status(400).send("Đăng nhập Google thất bại");
  }
};

// Đăng nhập cho quản lý
exports.adminLogin = async (req, res) => {
  const { username, password, role } = req.body;
  console.log("Username:", username);
  console.log("Password:", password);
  console.log("Role:", role);
  try {
    const user = await User.findOne({ username, role }); // Tìm theo username và role
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Thông tin đăng nhập không hợp lệ" });
    }

    if (!["admin", "salesperson", "delivery staff"].includes(user.role)) {
      return res.status(403).json({ message: "Truy cập bị từ chối" });
    }

    const jwtToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({ 
      message: "Đăng nhập thành công", 
      token: jwtToken, 
      role: user.role 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
