const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

    res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ message: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: "Incorrect password" });

  // You can use JWT or session-based authentication
  const token = jwt.sign({ id: user._id }, "secretKey", { expiresIn: "1d" });

  res.status(200).json({ message: "Login successful", token });
};

// Get Profile
const getProfile = async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};

// Update Profile
const updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    if (updates.password) delete updates.password;

    const updated = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
