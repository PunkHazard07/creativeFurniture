import React from 'react';

const Footer = () => {
  return (
    <div className="bg-gray-100 text-gray-800 pt-10 pb-6">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-6 sm:gap-14 my-10 sm:p-6 p-4">
        
        {/* Left Section (Company Info) */}
        <div className="flex flex-col gap-6 sm:max-w-[480px]">
          {/* Placeholder for Logo */}
          <div className="w-24 h-12 bg-gray-300 rounded-md mb-3"></div>  
          <p className="text-gray-600 text-sm leading-relaxed">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Magnam, voluptates accusamus quidem quos eum, provident obcaecati officiis ad, consequuntur nisi possimus eius debitis voluptatem fugiat hic labore iusto totam tempora.
          </p>
        </div>

        {/* Middle Section (Company Links) */}
        <div className="flex flex-col gap-4">
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-2 text-gray-600 text-sm">
            <li><a href="/" className="hover:text-black">Home</a></li>
            <li><a href="/about" className="hover:text-black">About Us</a></li>
            <li><a href="/collection" className="hover:text-black">Collection</a></li>
            <li><a href="/contact" className="hover:text-black">Contact Us</a></li>
          </ul>
        </div>

        {/* Right Section (Contact Info) */}
        <div className="flex flex-col gap-4">
          <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-2 text-gray-600 text-sm">
            <li>+234-814-150-1346</li>
            <li>contact@gmail.com</li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="w-full text-center border-t border-gray-300">
        <p className="py-5 text-sm">© 2025 frontend.com - All Rights Reserved.</p>
      </div>
    </div>
  );
};

export default Footer;
