import React from "react";
import NewsletterBox from '../components/NewsletterBox';
import { FaCheckCircle, FaTools, FaHeadset } from "react-icons/fa";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="text-center max-w-3xl">
        <h2 className="text-4xl font-bold text-gray-800">About Us</h2>
        <p className="text-gray-600 mt-4">
          Welcome to our store! We are committed to providing you with the best products and exceptional customer service. Our mission is to ensure that every customer enjoys a seamless shopping experience.
        </p>
      </div>

      {/* Why Choose Us Section */}
      <div className="mt-12 w-full max-w-5xl">
        <h3 className="text-3xl font-semibold text-center text-gray-800 mb-6">Why Choose Us?</h3>
        <div className="grid sm:grid-cols-3 gap-6">
          
          {/* Quality Assurance */}
          <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center text-center hover:shadow-xl transition duration-300">
            <FaCheckCircle className="text-green-600 text-5xl mb-4" />
            <h4 className="text-lg font-semibold">Quality Assurance</h4>
            <p className="text-gray-600 mt-2 text-sm">
              We guarantee premium quality in every product, ensuring long-lasting satisfaction.
            </p>
          </div>

          {/* Installment */}
          <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center text-center hover:shadow-xl transition duration-300">
            <FaTools className="text-yellow-600 text-5xl mb-4" />
            <h4 className="text-lg font-semibold">Installment Options</h4>
            <p className="text-gray-600 mt-2 text-sm">
              Enjoy flexible payment options that make shopping easier for you.
            </p>
          </div>

          {/* Exceptional Customer Care */}
          <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center text-center hover:shadow-xl transition duration-300">
            <FaHeadset className="text-blue-600 text-5xl mb-4" />
            <h4 className="text-lg font-semibold">Exceptional Customer Care</h4>
            <p className="text-gray-600 mt-2 text-sm">
              Our support team is always available to assist you with any inquiries.
            </p>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="mt-16 w-full">
        <NewsletterBox />
      </div>
    </div>
  );
};

export default About;

