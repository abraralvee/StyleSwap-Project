const Admin = require("../models/admin");
const User = require("../models/user");
const Product = require("../models/product");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Admin Login
const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Admin login successful",
      token,
      admin: { id: admin._id, email: admin.email, name: admin.name }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Remove Post
const removePost = async (req, res) => {
  try {
    const post = await Product.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json({ message: "Post removed successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Ban User
const banUser = async (req, res) => {
  const { userId, duration } = req.body;
  
  let banExpiry;
  switch(duration) {
    case '3d':
      banExpiry = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
      break;
    case '1w':
      banExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      break;
    case '1m':
      banExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      break;
    case '1y':
      banExpiry = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
      break;
    case 'permanent':
      banExpiry = new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000);
      break;
    default:
      return res.status(400).json({ message: "Invalid ban duration" });
  }

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { isBanned: true, banExpiry },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json({ message: "User banned successfully", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Unban User
const UnbanUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { isBanned: false, banExpiry: null },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json({ message: "User unbanned successfully", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  adminLogin,
  removePost,
  banUser,
  UnbanUser
};