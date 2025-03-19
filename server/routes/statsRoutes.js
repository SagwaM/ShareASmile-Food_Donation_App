const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middlewares/authMiddleware");
const Donation = require("../models/FoodDonation");
const User = require("../models/User");
const mongoose = require("mongoose");

// 1️⃣ Donor Stats Route
router.get("/donor", authenticateUser, async (req, res) => {
    try {
        console.log("Authenticated User:", req.user);
        console.log("User ID:", req.user.userId);
        console.log("User ID Type:", typeof req.user.userId);

        if (!mongoose.Types.ObjectId.isValid(req.user.userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }
        const userId = new mongoose.Types.ObjectId(req.user.userId); // Ensure it's an ObjectId
        console.log("User ID:", userId);
        console.log("User ID Type:", typeof userId);


        const activeDonations = await Donation.countDocuments({ donor: userId, status: "Available" });
        const totalDonations = await Donation.countDocuments({ donor: userId });
        const claimedDonations = await Donation.countDocuments({ donor: userId, status: "Claimed", claimed_by: { $ne: null } });

        const foodSaved = await Donation.aggregate([
            { $match: { donor: userId } },
            { $group: { _id: null, total: { $sum: "$quantity" } } },
        ]);

        const totalFoodByCategory = await Donation.aggregate([
            { $match: { donor: userId } },
            { $group: { _id: "$category", total: { $sum: "$quantity" } } },
        ]);
        

        res.status(200).json({ 
            activeDonations, 
            foodSaved: foodSaved[0]?.total || 0, 
            totalDonations, 
            claimedDonations, 
            totalFoodByCategory,
        });

    } catch (error) {
        console.error("Error in /donor stats route:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
// 4️⃣ Activity Routes
router.get("/activities/donor", authenticateUser, async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.userId);

        const activities = await Donation.find({ donor: userId })
            .sort({ created_at: -1 })
            .limit(10)
            .populate("claimed_by", "name email _id")
            .select("_id status created_at claimed_by donor");

        res.status(200).json({ activities });
    } catch (error) {
        console.error("Error fetching donor activities:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 2️⃣ NGO / Recipient Stats Route
router.get("/recipient", authenticateUser, async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.userId);

        const totalClaims = await Donation.countDocuments({ claimed_by: userId });
        const activeClaims = await Donation.countDocuments({ claimed_by: userId, approval_status: "Approved" });
        const availableDonations = await Donation.countDocuments({ status: "Available" });

        const foodReceivedResult = await Donation.aggregate([
            { $match: { claimed_by: userId, status: "Claimed" } },
            { $group: { _id: null, total: { $sum: "$quantity" } } },
        ]);
        const foodReceived = foodReceivedResult.length > 0 ? foodReceivedResult[0].total : 0;

        res.status(200).json({ totalClaims, activeClaims, availableDonations, foodReceived });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
router.get("/activities/recipient", authenticateUser, async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.userId);

        const activities = await Donation.find({ claimed_by: userId })
            .sort({ createdAt: -1 })
            .limit(10)
            .populate("donor", "name")
            .select("_id status created_at donor");

        res.status(200).json({ activities });
    } catch (error) {
        console.error("Error fetching recipient activities:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// 3️⃣ Admin Stats Route
router.get("/admin", authenticateUser, async (req, res) => {
    try {
        if (!req.user || req.user.role !== "admin") {
            return res.status(403).json({ error: "Access denied" });
        }

        const totalUsers = await User.aggregate([
            { $group: { _id: "$role", count: { $sum: 1 } } },
        ]);
        const userCounts = {};
        totalUsers.forEach(u => userCounts[u._id] = u.count);

        const totalDonations = await Donation.countDocuments();
        const totalClaims = await Donation.countDocuments({ claimed_by: { $ne: null } });
        const availableDonations = await Donation.countDocuments({ status: "Available" });

        res.status(200).json({ 
            totalUsers: userCounts, 
            totalDonations, 
            totalClaims, 
            availableDonations });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/activities/admin", authenticateUser, async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ error: "Access denied" });
        }

        const activities = await Donation.find({ claimed_by: { $ne: null } })
            .sort({ created_at: -1 })
            .limit(10)
            .populate("donor claimed_by", "name")
            .select("_id status created_at donor claimed_by");

        res.status(200).json({ activities });
    } catch (error) {
        console.error("Error fetching admin activities:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 3️⃣ Admin Reports Routes
router.get("/reports/total-donations", authenticateUser, async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ error: "Access denied" });
        }
        const donationsOverTime = await Donation.aggregate([
            { $group: { _id: { $dateToString: { format: "%Y-%m", date: "$created_at" } }, count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);
        res.status(200).json(donationsOverTime);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/reports/donations-by-category", authenticateUser, async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ error: "Access denied" });
        }
        const donationsByCategory = await Donation.aggregate([
            { $group: { _id: "$category", count: { $sum: 1 } } }
        ]);
        res.status(200).json(donationsByCategory);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/reports/top-donors", authenticateUser, async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ error: "Access denied" });
        }
        const topDonors = await Donation.aggregate([
            { $group: { _id: "$donor", count: { $sum: 1} } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);
        res.status(200).json(topDonors);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/reports/requests-by-status", authenticateUser, async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ error: "Access denied" });
        }
        const requestsByStatus = await Donation.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);
        res.status(200).json(requestsByStatus);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});


module.exports = router;
