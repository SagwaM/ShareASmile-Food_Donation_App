const express = require('express');
const FoodDonation = require('../models/FoodDonation');
const {authenticateUser, donor, multipleRoles} = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploads');
const { createFoodDonation } = require('../controllers/foodController');
const Notification = require('../models/Notification');
const User = require('../models/User');
const Claim = require('../models/Claims');
const router = express.Router();


// ✅  Create a new food donation (only donors)
router.post('/', authenticateUser, donor, upload.single('image'), createFoodDonation);

// ✅  Get all food donations
router.get('/', async (req, res) => {
  try {
    const donations = await FoodDonation.find({ status: {$in:['Available', 'Claimed', 'Expired' ]}})
      .populate('donor', 'name email _id');

    console.log("Donations Data:", donations);
    res.json(donations);
  } catch (err) {
    console.error("Error fetching donations:", err);
    res.status(500).json({ error: 'Server error' });
  }
});
// ✅  Get all available food donations
router.get('/available', async (req, res) => {
  try {
    const donations = await FoodDonation.find({status: 'Available'})
      .populate('donor', 'name email _id');

    console.log("Donations Data:", donations);
    res.json(donations);
  } catch (err) {
    console.error("Error fetching donations:", err);
    res.status(500).json({ error: 'Server error' });
  }
});
// ✅ Get all food donations created by the logged-in donor
router.get('/my-donations', authenticateUser, donor, async (req, res) => {
  try {
    const donations = await FoodDonation.find({ donor: req.user.userId })
      .populate('claimed_by', 'name email')
      .sort({ createdAt: -1 }); // Sort by latest donations

    res.json(donations);
  } catch (err) {
    console.error("Error fetching my donations:", err);
    res.status(500).json({ error: 'Server error' });
  }
});


// ✅  Claim a food donation (only recipients or NGOs)
router.put('/claim/:id', authenticateUser, multipleRoles(['recipient', 'ngo']), async (req, res) => {
  try {
    const donation = await FoodDonation.findById(req.params.id).populate('donor');

    if (!donation || donation.status !== 'Available') {
      return res.status(404).json({ error: 'Food donation not found or already claimed' });
    }

    if (donation.approval_status === 'Approved') {
      return res.status(400).json({ error: 'This donation has already been approved' });
    }

    // Check if the same user has already requested this donation
    const existingClaim = await Claim.findOne({ donation: req.params.id, claimed_by: req.user.userId });
    if (existingClaim && existingClaim.status !== 'Cancelled') {
      return res.status(400).json({ error: 'You have already requested this food donation' });
    } else if (existingClaim && existingClaim.status === 'Cancelled') {
      // If the claim was canceled before, update it instead of creating a new one
      existingClaim.status = 'Claimed';
      existingClaim.claimed_date = new Date();
      existingClaim.approval_status = 'Pending';
      await existingClaim.save();
    } else {

    // Create a new claim record
    const newClaim = new Claim({
      donation: donation._id,
      claimed_by: req.user.userId,
      claimed_date: new Date(),
      status: 'Claimed', // ✅ Mark as claimed
      approval_status: 'Pending'
    });

    await newClaim.save();
  }

    if (!donation.claimed_by) {
      donation.claimed_by = []; // ✅ Initialize as an empty array if null
    }
    // ✅ Assign claim details
    donation.claimed_by.push(req.user.userId);
    donation.approval_status = 'Pending'; // ✅ Mark as pending approval
    await donation.save();


    // ✅ Fetch the user who claimed the donation
    const claimingUser = await User.findById(req.user.userId);
    if (!claimingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // ✅ Determine whether it's a recipient or an NGO
    const claimedByName = claimingUser.role === 'ngo' ? `NGO: ${claimingUser.name}` : claimingUser.name;


    // 🔔 Create notifications
    await Notification.create([
      { user: donation.donor._id, message: `Your food donation (${donation.food_name}) has been requested by ${claimedByName}! Please approve or reject.` },
      { user: req.user.userId, message: `You have successfully requested for the food donation (${donation.food_name})!` }
    ]);

    res.json({ message: 'Request submitted successfully and is pending approval', donation });

  } catch (err) {
    console.error("Error in claiming food:", err); // Log error for debugging
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/requests', authenticateUser, multipleRoles(['recipient', 'ngo']), async (req, res) => {
  try {
    const claims = await FoodDonation.find({ claimed_by: req.user.userId })
      .populate('donor', 'name email')
      .select('food_name approval_status claimed_date donor');

    res.json(claims);
  } catch (err) {
    console.error("Error fetching recipient requests:", err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Get all claimed donations by the logged-in user
router.get('/claimed', authenticateUser, async (req, res) => {
  try {
    console.log("User requesting claimed food:", req.user);
    let filter = { approval_status: {$in: ['Approved', 'Pending']} };  // ✅ Ensure only approved claims are shown
    
    // Recipients & NGOs should see only what they claimed
    if (req.user.role === 'recipient' || req.user.role === 'ngo') {
      filter.claimed_by = req.user.userId;

      // Donors should see all their donations (claimed & available)
    } else if (req.user.role === 'donor') {
      filter = { donor: req.user.userId, status: 'Claimed' };
    }

    console.log("Filter applied:", filter); // Debugging log

    const donations = await FoodDonation.find(filter)
      .populate('donor', 'name email')
      .populate('claimed_by', 'name email') //  we add `claimed_by` field later
      .select('food_name quantity donor claimed_by created_date'); // Select only needed fields

    res.json(donations);
  } catch (err) {
    console.error("Error fetching claimed donations:", err); // Log error
    res.status(500).json({ error: 'Server error' });
  }
});
router.get('/claims', authenticateUser, multipleRoles(['donor', 'admin']), async (req, res) => {
  try {
    const claims = {
      Pending: await FoodDonation.find({ donor: req.user.userId, approval_status: "Pending" })
        .populate({path: "claimed_by", select: "name",}) // Populate only the name field
        .select("_id food_name claimed_by approval_status claimed_date"),
      Approved: await FoodDonation.find({ donor: req.user.userId, approval_status: "Approved" })
        .populate("claimed_by", "name") // Populate only the name field
        .select("_id food_name claimed_by approval_status claimed_date"),
      Rejected: await FoodDonation.find({ donor: req.user.userId, approval_status: "Rejected" })
        .populate("claimed_by", "name") // Populate only the name field
        .select("_id food_name claimed_by approval_status claimed_date"),
    };
    res.json(claims);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


// ✅ Get recent food donations (sorted by latest first)
router.get('/recent', async (req, res) => {
  try {
    // Check if filtering is requested
    const { available } = req.query;

    // Define the start date (March 1, 2025)
    const startDate = new Date('2025-03-01');

    // Build the query dynamically
    let query = {created_at: { $gte: startDate }}; // Filter for donations from March 2025 onward
    if (available === 'true') {
      query.status = 'Available'; // Assuming 'status' field tracks availability
    }

    const recentDonations = await FoodDonation.find()
      .populate('donor', 'name email')
      .sort({ created_at: -1 }) // Sort by latest first
      .limit(5); // Limit to 10 recent donations (adjust as needed)

    res.json(recentDonations);
  } catch (err) {
    console.error("Error fetching recent donations:", err.message);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// Cancel claimed food donation
router.put('/cancel/:id', authenticateUser, async (req, res) => {
  try {
    console.log("User:", req.user.userId);

    // Find the donation and populate donor details
    let donation = await FoodDonation.findById(req.params.id).populate('donor', 'name email');
    
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }
    
    console.log("Food Item Before Update:", donation); // Debugging data
    console.log("Logged-in User ID:", req.user.userId);
    console.log("Claimed By (Before Filtering):", donation.claimed_by.map(id => id.toString()));

    // Check if the logged-in user is the one who claimed the donation
    if (!donation.claimed_by || !donation.claimed_by.map(id => id.toString()).includes(req.user.userId)) {
      return res.status(400).json({ message: 'Unauthorized: You can only cancel your own claimed donations' });
    }

    // Fetch recipient details
    const recipient = await User.findById(req.user.userId);
    if (!recipient) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Identify recipient type
    const claimRecipientName = recipient.role === 'ngo' ? `NGO: ${recipient.name}` : recipient.name;

    // Remove the user who is canceling
    donation.claimed_by = donation.claimed_by.filter(id => id.toString() !== req.user.userId.toString());

    // Reset status and approval_status if no recipients are left
    if (donation.claimed_by.length === 0) {
      donation.status = 'Available';
      donation.approval_status = null;
      donation.claimed_date = null;
    }

    // Save updated donation
    await donation.save();
    console.log("Updated Food Item:", donation);

    // 🛠️ Update the Claims collection
    const updatedClaim = await Claim.findOneAndUpdate(
      { donation: donation._id, claimed_by: req.user.userId },
      { status: 'Cancelled' }, // Mark claim as canceled
      { new: true }
    );

    if (updatedClaim) {
      console.log("Updated Claim Record:", updatedClaim);
    } else {
      console.log("No Claim Record Found for User");
    }

    // Create a notification for the donor
    const donorNotification = new Notification({
      user: donation.donor._id,
      message: `Your food donation "${donation.food_name}" has been cancelled by ${claimRecipientName}.`,
      type: 'cancellation',
    });

    await donorNotification.save();

    // Create a notification for the recipient (only if it was claimed)
      const recipientNotification = new Notification({
        user: req.user.userId, // The recipient who cancelled the claim
        message: `Your request for "${donation.food_name}" has been successfully cancelled.`,
        type: 'cancellation',
      });

      await recipientNotification.save();

    res.json({ message: 'Food request cancelled successfully', donation });

  } catch (error) {
    console.error('Error:', error); // Log the full error for debugging
    res.status(500).json({ message: 'Server error', error });
  }
});


router.put('/:id/approve', authenticateUser, multipleRoles(['donor', 'admin']), async (req, res) => {
  try {
    const { action, rejection_reason, claimId } = req.body; // action = 'approve' or 'reject'
    const donation = await FoodDonation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({ error: 'Food donation not found' });
    }

    if (donation.approval_status !== 'Pending') {
      return res.status(400).json({ error: 'This claim is not pending approval' });
    }

    if (donation.status !== 'Available') {
      return res.status(400).json({ error: 'Food is no longer available' });
    }
    // ✅ Find the specific claim
    const claim = await Claim.findById(claimId).populate('claimed_by');
    if (!claim || claim.approval_status !== 'Pending') {
      return res.status(404).json({ error: 'Claim not found or already processed' });
    }

    if (action === 'approve') {
      // ✅ Update claim as Approved
      claim.approval_status = 'Approved';
      await claim.save();

      donation.approval_status = 'Approved';
      donation.status = 'Claimed';
      donation.claimed_by = claim.claimed_by._id; // Assign the approved recipient
      donation.approved_by = req.user.userId;
      donation.claimed_date = new Date(); // ✅ Set claimed_date when approved
      

      // 🔔 Notify recipient of approval
     
      await Notification.create({
        user: claim.claimed_by._id,
        message: `Your claim for (${donation.food_name}) has been Approved! Pickup at: ${donation.pickup_location}`,
      });

        // ❌ Reject all other pending claims
      await FoodClaim.updateMany(
        { donation: donation._id, approval_status: 'Pending' },
        { $set: { approval_status: 'Rejected' } }
      );

    } else if (action === 'reject') {
      if (!rejection_reason) {
        return res.status(400).json({ error: 'Rejection reason is required' });
      }

      // ✅ Update the claim as Rejected
      claim.approval_status = 'Rejected';
      claim.rejection_reason = rejection_reason;
      await claim.save();
    
      const rejectedUser = donation.claimed_by; // Reset claim if rejected
      donation.approval_status = 'Rejected';
      donation.claimed_by = null;
      donation.status = 'Available'; // Allow others to claim
      donation.claimed_date = null; // ✅ Reset claimed_date if rejected
      donation.rejection_reason = rejection_reason; // Store rejection reason


      // 🔔 Notify recipient of rejection
      if (rejectedUser) { // ✅ Ensure claimed_by is not null before notifying
      await Notification.create({
        user: rejectedUser._id,
        message: `Your claim for (${donation.food_name}) has been rejected. Reason: ${rejection_reason}`,
      });
    }
      
    } else {
      return res.status(400).json({ error: 'Invalid action' });
    }

    await donation.save();
    res.json({ message: `Claim ${action}d successfully`, donation });

  } catch (err) {
    console.error("Error approving claim:", err);
    res.status(500).json({ error: 'Server error' });
  }
});
// ✅ Update a food donation (Only the donor who created it)
router.put('/:id', authenticateUser, donor, upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { food_name, category, custom_category, quantity, description, expiry_date, pickup_location, status } = req.body;
    
    // Find the donation by ID
    let donation = await FoodDonation.findById(id);
    if (!donation) {
      return res.status(404).json({ error: "Donation not found" });
    }

    // Ensure the logged-in user is the owner of the donation
    if (donation.donor.toString() !== req.user.userId) {
      return res.status(403).json({ error: "You are not authorized to edit this donation" });
    }

    // Update fields if provided
    if (food_name) donation.food_name = food_name;
    if (category) donation.category = category;
    if (category === 'Others' && custom_category) {
      donation.custom_category = custom_category;
    }
    if (quantity && !isNaN(quantity)) donation.quantity = Number(quantity);
    if (description) donation.description = description;
    if (expiry_date && !isNaN(Date.parse(expiry_date))) {
      donation.expiry_date = new Date(expiry_date);
    }
    if (pickup_location) donation.pickup_location = pickup_location;
    if (status) donation.status = status;

    // Handle new image upload
    if (req.file) {
      donation.image = `/uploads/${req.file.filename}`;
    }

    await donation.save();
    res.json({ message: "Donation updated successfully!", donation });

  } catch (err) {
    console.error("Error updating donation:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅  Delete a food donation (Only donors or admins)
router.delete('/:id', authenticateUser, multipleRoles(['admin', 'donor']), async (req, res) => {
  try {
    const donation = await FoodDonation.findById(req.params.id);
    if (!donation) return res.status(404).json({ error: 'Food donation not found' });

    if (req.user.role === 'donor' && donation.donor.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized to delete this donation' });
    }

    await donation.deleteOne();
    res.json({ message: 'Food donation deleted successfully' });

  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Search food donations (by food name, donor name, or status)
router.get('/search', async (req, res) => {
  try {
    const { food_name, donor_name, status } = req.query;
    let filter = {};

    // 🔍 Search by food name (partial match)
    if (food_name) {
      filter.food_name = { $regex: food_name, $options: 'i' }; // Case-insensitive search
    }

    // 🔍 Search by donor name (partial match)
    if (donor_name) {
      const donors = await User.find({ name: { $regex: donor_name, $options: 'i' } }).select('_id');
      const donorIds = donors.map(donor => donor._id);
      filter.donor = { $in: donorIds };
    }

    // 🔍 Filter by status (exact match)
    if (status) {
      filter.status = status.toLowerCase();
    }

    console.log("Search filter:", filter); // Debugging log

    // Fetch food donations matching the search criteria
    const donations = await FoodDonation.find(filter)
      .populate('donor', 'name email')
      .limit(50);

    res.json(donations);
  } catch (err) {
    console.error("Error searching donations:", err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Get a specific food donation by ID
router.get('/:id', async (req, res) => {
  try {
    const donation = await FoodDonation.findById(req.params.id)
      .populate('donor', 'name email phone') // Include donor details
      .populate('claimed_by', 'name email phone') // Include recipient details (if claimed)
      .select('food_name donor claimed_by claimed_date');

    if (!donation) {
      return res.status(404).json({ error: 'Food donation not found' });
    }

    res.json(donation);
  } catch (err) {
    console.error("Error fetching food donation:", err);
    res.status(500).json({ error: 'Server error' });
  }
});





module.exports = router;
