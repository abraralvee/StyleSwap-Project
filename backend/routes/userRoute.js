const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware"); 
const {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  forgotPassword,
  resetPassword,
} = require("../controllers/userController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/:id", getProfile);
router.put("/:id", updateProfile);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// route to get current logged-in user
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const { password, ...userData } = req.user.toObject();
    res.json(userData);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user info" });
  }
});

module.exports = router;
