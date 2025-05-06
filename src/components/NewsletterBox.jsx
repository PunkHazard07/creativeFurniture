import React from "react";

const NewsletterBox = () => {
return (
    <div className="bg-gray-100 py-10 px-5 md:px-16 text-center rounded-lg shadow-md my-10">
      {/* Title Section */}
    <div className="mb-6">
        <p className="text-xl md:text-2xl font-bold text-gray-800">
        Subscribe now & get <span className="text-blue-600">20% off</span>
        </p>
        <p className="text-sm text-gray-600 mt-2 max-w-lg mx-auto">
        Stay updated with our latest news and exclusive offers. Sign up for
        our newsletter today and get a 20% discount on your next purchase!
        </p>
    </div>

      {/* Form section */}
    <div className="flex justify-center">
        <form className="flex flex-col md:flex-row items-center gap-4 w-full max-w-md">
        <input
            type="email"
            placeholder="Enter your email address"
            className="w-full md:w-3/4 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
            type="submit"
            className="w-full md:w-1/4 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
        >
            Subscribe
        </button>
        </form>
    </div>
    </div>
);
};

export default NewsletterBox;
