import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import heroImage from "../assets/hero-image.webp";
import donateImage from "../assets/donate.webp";
import trackImage from "../assets/track.png";
import impactImage from "../assets/impact.png";

const HomePage = () => {
  return (
    <div className="bg-gray-100 text-gray-900 min-h-screen">
      {/* Sticky Navbar */}
      <nav className="bg-green-700 text-white p-6 shadow-md fixed w-full top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-wide">Share A Smile</h1>
          <div>
            <Link to="/login" className="mr-6 text-lg hover:underline">Login</Link>
            <Link to="/register" className="bg-white text-green-700 px-6 py-2 rounded-full text-lg font-semibold shadow-md hover:bg-gray-200 transition">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative text-center text-white py-32 flex flex-col items-center justify-center min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(${heroImage})` }}>
        <motion.h2 
          className="text-5xl font-extrabold drop-shadow-md"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Help End Hunger, Reduce Food Waste
        </motion.h2>
        <p className="mt-4 text-xl font-medium max-w-2xl">Join us in making a difference by donating surplus food to those in need.</p>
        <Link to="/donate">
          <Button className="mt-6 bg-white text-green-700 px-8 py-3 rounded-full text-lg font-bold shadow-lg hover:bg-gray-200 transition">
            Get Started
          </Button>
        </Link>
      </header>

      {/* Impact Metrics */}
      <section className="py-12 px-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div className="bg-white shadow-md p-6 rounded-lg">
          <h2 className="text-3xl font-bold text-green-700">1000+</h2>
          <p className="text-gray-700">Lives Impacted</p>
        </div>
        <div className="bg-white shadow-md p-6 rounded-lg">
          <h2 className="text-3xl font-bold text-green-700">500+</h2>
          <p className="text-gray-700">Successful Projects</p>
        </div>
        <div className="bg-white shadow-md p-6 rounded-lg">
          <h2 className="text-3xl font-bold text-green-700">300+</h2>
          <p className="text-gray-700">Dedicated Volunteers</p>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-200">
        <div className="container mx-auto px-6 md:max-w-6xl">
          <h3 className="text-4xl font-bold text-center text-green-800 mb-10">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[{ title: "Post Food Donations", image: donateImage, text: "Easily list surplus food for donation." },
              { title: "Track Pickups", image: trackImage, text: "Monitor donation pickups in real-time." },
              { title: "Impact Metrics", image: impactImage, text: "See the difference your donations make." }].map((feature, index) => (
              <motion.div 
                key={index}
                className="bg-white shadow-lg rounded-xl overflow-hidden text-center transform transition hover:scale-105"
                whileHover={{ scale: 1.05 }}
              >
                <img src={feature.image} alt={feature.title} className="w-full h-48 object-cover" />
                <Card className="p-6">
                  <CardContent>
                    <h4 className="text-2xl font-bold text-green-700 mb-3">{feature.title}</h4>
                    <p className="text-gray-600">{feature.text}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="bg-white py-12 px-6 text-center shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h2>
        <p className="text-gray-700 max-w-2xl mx-auto">We strive to create a better world by supporting those in need. Your donations empower individuals and communities through impactful programs.</p>
      </section>

      {/* Call to Action */}
      <section className="py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Join Us in Making a Difference</h2>
        <button className="bg-green-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-green-800 transition">Get Involved</button>
      </section>

      {/* Footer */}
      <footer className="bg-green-700 text-white text-center py-6">
        <p>&copy; {new Date().getFullYear()} Share A Smile. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
