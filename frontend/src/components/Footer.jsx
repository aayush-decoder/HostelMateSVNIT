// Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-purple-800 via-indigo-800 to-blue-800 text-white py-6 mt-10 shadow-inner">
      <div className="container mx-auto px-4 flex flex-col items-center text-center space-y-2">
        <p className="text-lg font-semibold tracking-wide">
          🚀 Built with 💙 by <span className="text-yellow-300">Aayush Prasad</span> & <span className="text-yellow-300">Bhaskar Sahu</span> 
        </p>
        
        <p className="text-sm text-gray-300">
          📧 Contact us: <a href="mailto:bhscodz7@gmail.com" className="no-underline text-blue-200 hover:text-blue-400">bhscodz7@gmail.com</a> / <a href="mailto:aayushp336@gmail.com" className="text-blue-200 no-underline hover:text-blue-400">aayushp336@gmail.com</a>
        </p>
        <p className="text-xs text-gray-400">© {new Date().getFullYear()} HostelMate. All rights reserved. 🔐</p>
      </div>
    </footer>
  );
};

export default Footer;
