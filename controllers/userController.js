const User = require("../models/User");
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user) {
      return res.status(200).json(user);
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllUser = async (req, res) => {
  try {
    const users = await User.find().select({ password: 0, __v: 0 }).lean();
    if (users.length > 0) {
      return res.status(200).json(users);
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateUserProfile = async (req, res) => {
  const { _id, name, email, password } = req.body;
  const user = await User.findById(_id);
  if (user) {
    user.name = name || user.name;
    user.email = email || user.email;
    user.updatedAt = Date.now();
    user.password = password || user.password;

    const updatedUser = await user.save();
    // console.log("User cập nhật", user);
    const newToken = await updatedUser.generateAuthToken();
    return res.status(200).json({
      updatedUser,
      token: newToken,
      message: "Cập nhật thành công",
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};
