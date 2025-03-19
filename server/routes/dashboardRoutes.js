const express = require("express");
const router = express.Router();
const { verifyToken, verifyRole } = require("../middleware/authMiddleware");
const DashboardController = require("../controllers/dashboardController");

// Admin Dashboard - Requires Admin Role
router.get("/admin", verifyToken, verifyRole("admin"), DashboardController.adminDashboard);

// Donor Dashboard - Requires Donor Role
router.get("/donor", verifyToken, verifyRole("donor"), DashboardController.donorDashboard);

// Recipient Dashboard - Requires Recipient Role
router.get("/recipient", verifyToken, verifyRole("recipient"), DashboardController.recipientDashboard);

// NGO Dashboard - Requires NGO Role
router.get("/ngo", verifyToken, verifyRole("ngo"), DashboardController.ngoDashboard);

module.exports = router;
