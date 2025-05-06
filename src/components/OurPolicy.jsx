import React from "react";
import { FaExchangeAlt, FaUndo, FaHeadset } from "react-icons/fa"; // Importing icons
import Title from "./Title";

const OurPolicy = () => {
return (
    <div className="my-10">
      {/* Title section */}
    <div className="text-center py-8">
        <Title text1="OUR" text2="POLICY" />
        <p className="text-sm text-gray-600 max-w-2xl mx-auto">
        We value our customers and ensure a seamless shopping experience with
        our flexible policies and excellent support.
        </p>
    </div>

      {/* Policy Section */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 md:px-10 text-center">
        {/* Policy 1 */}
        <div className="bg-white shadow-md rounded-xl p-6 transition hover:shadow-lg">
        <FaExchangeAlt className="text-4xl text-blue-600 m-auto mb-4" />
        <p className="text-lg font-semibold">Free Exchange</p>
        <p className="text-sm text-gray-600 mt-2">
            We offer a free exchange policy for all our products.
        </p>
        </div>

        {/* Policy 2 */}
        <div className="bg-white shadow-md rounded-xl p-6 transition hover:shadow-lg">
        <FaUndo className="text-4xl text-green-600 m-auto mb-4" />
        <p className="text-lg font-semibold">7 Days Return Policy</p>
        <p className="text-sm text-gray-600 mt-2">
            We provide a 7-day free return policy.
        </p>
        </div>

        {/* Policy 3 */}
        <div className="bg-white shadow-md rounded-xl p-6 transition hover:shadow-lg">
        <FaHeadset className="text-4xl text-red-600 m-auto mb-4" />
        <p className="text-lg font-semibold">Best Customer Support</p>
        <p className="text-sm text-gray-600 mt-2">
            We provide top-notch customer support to assist you.
        </p>
        </div>
    </div>
    </div>
);
}

export default OurPolicy;
