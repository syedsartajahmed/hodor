import React from "react";

const Footer = () => {
  return (
    <footer className="bg-stone-800 text-white py-6 px-8 w-full  fixed bottom-0">
      <div className="flex flex-col lg:flex-row justify-between items-center max-w-7xl mx-auto">
        {/* Left Section */}
        <div className="flex flex-col items-center lg:items-start">
          <h2 className="text-2xl font-bold mb-2">Optiblack</h2>
          <p className="text-sm text-gray-400">
            1309 Coffeen Ave, Suite 1200 Sheridan, WY, USA, 82801
          </p>
          <div className="flex gap-4 mt-4">
            <a
              href="#"
              className="text-gray-400 hover:text-white transition"
              aria-label="Facebook"
            >
              <i className="fab fa-facebook-f"></i>
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition"
              aria-label="Twitter"
            >
              <i className="fab fa-twitter"></i>
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition"
              aria-label="Instagram"
            >
              <i className="fab fa-instagram"></i>
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition"
              aria-label="YouTube"
            >
              <i className="fab fa-youtube"></i>
            </a>
          </div>
        </div>

        {/* Center Section */}
        <div className="flex flex-col items-center text-center mt-6 lg:mt-0">
          <h3 className="text-lg font-bold">Services</h3>
          <ul className="text-sm text-gray-400 space-y-2">
            <li>Product Accelerator</li>
            <li>Data Accelerator</li>
            <li>AI Accelerator</li>
            <li>Book a Call</li>
          </ul>
        </div>

        {/* Right Section */}
        <div className="flex flex-col items-center text-center mt-6 lg:mt-0">
          <h3 className="text-lg font-bold">Company</h3>
          <ul className="text-sm text-gray-400 space-y-2">
            <li>Who We Are</li>
            <li>Jobs</li>
            <li>FAQs</li>
            <li>Contact Us</li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-gray-700 mt-6 pt-4 text-center text-sm text-gray-500">
        <p>© 2024 Optiblack. All rights reserved. | Privacy Policy</p>
      </div>
    </footer>
  );
};

export default Footer;
