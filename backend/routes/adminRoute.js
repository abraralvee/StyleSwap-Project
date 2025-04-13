const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { adminAuthMiddleware } = require("../middleware/authMiddleware");

// Admin login
router.post("/login", adminController.adminLogin);

// Protected admin routes
router.delete("/posts/:id", adminAuthMiddleware, adminController.removePost);
router.post("/users/:userId/ban", adminAuthMiddleware, adminController.banUser);
router.post("/users/:userId/unban", adminAuthMiddleware, adminController.UnbanUser);

module.exports = router;