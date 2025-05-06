import React from "react";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const Contact = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Content */}
      <div className="flex-grow bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
        {/* Title Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Get in Touch</h2>
          <p className="text-gray-600 mt-2">
            Have any questions? Fill out the form or reach us directly.
          </p>
        </div>

        {/* Contact Section */}
        <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Send a Message</h3>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <textarea
                rows="4"
                placeholder="Your Message"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition">
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="bg-white shadow-md rounded-lg p-6 flex flex-col justify-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h3>
            <div className="space-y-4">
              <p className="flex items-center gap-3 text-gray-600">
                <FaPhone className="text-blue-600" /> +234-814-150-1346
              </p>
              <p className="flex items-center gap-3 text-gray-600">
                <FaEnvelope className="text-blue-600" /> contact@gmail.com
              </p>
              <p className="flex items-center gap-3 text-gray-600">
                <FaMapMarkerAlt className="text-blue-600" /> 123, Lagos Street, Nigeria
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
