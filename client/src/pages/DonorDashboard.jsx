// client/src/pages/DonorDashboard.jsx
import React, { useState } from 'react';
import axios from 'axios';

const DonorDashboard = () => {
  // Form state for donation details
  const [donationData, setDonationData] = useState({
    donorName: '',
    foodType: '',
    quantity: ''
  });
  const [message, setMessage] = useState('');

  // Update form state when input fields change
  const handleChange = (e) => {
    setDonationData({
      ...donationData,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send a POST request to the backend donation endpoint
      const response = await axios.post('http://localhost:5000/api/donate', donationData);
      setMessage('Donation submitted successfully!');
      console.log('Inserted donation:', response.data);
      
      // Optionally, reset the form fields after submission
      setDonationData({ donorName: '', foodType: '', quantity: '' });
    } catch (error) {
      console.error('Error submitting donation:', error);
      setMessage('Error submitting donation.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Donor Dashboard</h2>
      {message && <p className="mb-4">{message}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label>
          Donor Name:
          <input 
            type="text" 
            name="donorName" 
            value={donationData.donorName} 
            onChange={handleChange} 
            className="p-2 border rounded" 
            required 
          />
        </label>
        <label>
          Food Type:
          <input 
            type="text" 
            name="foodType" 
            value={donationData.foodType} 
            onChange={handleChange} 
            className="p-2 border rounded" 
            required 
          />
        </label>
        <label>
          Quantity:
          <input 
            type="number" 
            name="quantity" 
            value={donationData.quantity} 
            onChange={handleChange} 
            className="p-2 border rounded" 
            required 
          />
        </label>
        <button 
          type="submit" 
          className="bg-green-700 text-white px-6 py-3 rounded hover:bg-green-800 transition"
        >
          Submit Donation
        </button>
      </form>
    </div>
  );
};

export default DonorDashboard;
