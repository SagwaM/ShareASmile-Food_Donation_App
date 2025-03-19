const Donation = require('../models/FoodDonation');

const createFoodDonation = async (req, res) => {
    try {
        if (req.user.role !== 'donor') {
            return res.status(403).json({ message: "Only donors can create donations" });
        }

        const { food_name, category, custom_category,quantity, description, expiry_date, pickup_location, status} = req.body;
        const imagePath = req.file ? `/uploads/${req.file.filename}` : '';

        const newDonation = new Donation({
            food_name,
            category: category || "Other",
            custom_category: category === 'Others' ? custom_category : null,
            quantity: Number(quantity), // Convert quantity to number
            description,
            expiry_date: new Date(expiry_date), // Convert expiry_date to Date
            pickup_location,
            status: status || "Available",
            image: imagePath,
            donor: req.user.userId
        });

        await newDonation.save();
        res.status(201).json({ message: "Food donation created successfully!", donation: newDonation });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createFoodDonation };

