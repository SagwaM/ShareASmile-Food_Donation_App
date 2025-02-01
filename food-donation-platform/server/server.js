import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar: Contains the site title and navigation links */}
      <nav className="bg-green-600 text-white p-4 flex justify-between items-center shadow-md">
        <h1 className="text-2xl font-bold">Food Donation Platform</h1>
        <div>
          {/* Links to Login and Sign Up pages */}
          <Link to="/login" className="mr-4">Login</Link>
          <Link to="/signup" className="bg-white text-green-600 px-4 py-2 rounded-lg">Sign Up</Link>
        </div>
      </nav>
      
      {/* Hero Section: Main call to action */}
      <header className="text-center py-20 bg-green-500 text-white">
        <motion.h2 
          className="text-4xl font-bold"
          initial={{ opacity: 0, y: -20 }}  // Animation starts with slight upward offset
          animate={{ opacity: 1, y: 0 }}   // Smoothly moves into position
          transition={{ duration: 0.8 }}   // Animation duration of 0.8 seconds
        >
          Help End Hunger, Reduce Food Waste
        </motion.h2>
        <p className="mt-4 text-lg">Join us in making a difference by donating surplus food to those in need.</p>
        {/* Button to navigate to the donation page */}
        <Link to="/donate">
          <Button className="mt-6 bg-white text-green-600 px-6 py-3 rounded-full font-bold">Get Started</Button>
        </Link>
      </header>
      
      {/* About Section: Brief description of the platform's purpose */}
      <section className="p-10 max-w-4xl mx-auto text-center">
        <h3 className="text-3xl font-semibold text-green-700">About Us</h3>
        <p className="mt-4 text-gray-700">
          Our platform connects restaurants, supermarkets, and individuals with food banks and charities to donate surplus food.
          Together, we fight hunger and reduce food waste.
        </p>
      </section>
      
      {/* Features Section: Highlights platform capabilities */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 p-10">
        {/* Card 1: Posting food donations */}
        <Card className="shadow-md">
          <CardContent className="p-6 text-center">
            <h4 className="text-xl font-semibold">Post Food Donations</h4>
            <p className="text-gray-600 mt-2">Easily list surplus food for donation.</p>
          </CardContent>
        </Card>
        
        {/* Card 2: Tracking pickups */}
        <Card className="shadow-md">
          <CardContent className="p-6 text-center">
            <h4 className="text-xl font-semibold">Track Pickups</h4>
            <p className="text-gray-600 mt-2">Monitor donation pickups in real-time.</p>
          </CardContent>
        </Card>
        
        {/* Card 3: Viewing impact metrics */}
        <Card className="shadow-md">
          <CardContent className="p-6 text-center">
            <h4 className="text-xl font-semibold">Impact Metrics</h4>
            <p className="text-gray-600 mt-2">See the difference your donations make.</p>
          </CardContent>
        </Card>
      </section>
      
      {/* Footer: Copyright information */}
      <footer className="bg-gray-800 text-white text-center p-4 mt-10">
        <p>&copy; 2025 Food Donation Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}
