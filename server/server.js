const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const donationRoutes = require("./routes/donationRoutes");
const foodBankRoutes = require("./routes/foodBankRoutes");

dotenv.config();
connectDB(); // Connect to MongoDB using your config

const app = express();
app.use(express.json()); // Middleware for parsing JSON

// Routes
app.use("/api/users", userRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/foodbanks", foodBankRoutes); // Added food bank routes

// Sample route
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
