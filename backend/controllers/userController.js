const User = require("../models/user");
const bcrypt = require("bcrypt");

// Signup
const registerUser = async (req, res) => {
  const { name, email, phone, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "User already exists" });

    const user = new User({ name, email, phone, password });
    await user.save();

    const { password: _, ...userData } = user.toObject(); // exclude password
    res.status(201).json({ message: "User registered successfully", user: userData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login
const loginUser = async (req, res) => {
  const { email, password, isAdminLogin } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isBanned && user.isBanActive()) {
      return res.status(403).json({ 
        message: "Your account has been banned",
        banExpiry: user.banExpiry 
      });

    }

    //AdminLogin check admin
    if (isAdminLogin && !user.isAdmin) {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Incorrect password" });

    const { password: _, ...userData } = user.toObject(); // exclude password
    res.status(200).json({ message: "Login successful", user: userData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Profile
const updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    if (updates.password) delete updates.password; // Prevent password update this way

    const updated = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select("-password");
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
};
