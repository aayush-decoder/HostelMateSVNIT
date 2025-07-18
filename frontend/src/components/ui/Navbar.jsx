import React, { useState } from 'react';

export default function Navbar({ user, handleLogin, handleLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const getAdmissionNumber = (email) => {
    if (!email) return '';
    return email.split('@')[0].toUpperCase();
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 shadow-md">
      <div className="w-full mx-auto flex items-center justify-between">
        
        <div className="text-xl font-bold"><a href="/">Hostelmate - SVNIT</a></div>

        {/* Desktop */}
        <div className="hidden md:flex gap-9 items-center">
          <a href="/visualize" className="hover:text-blue-400 transition">Incoming Request</a>
          <a href="mailto:aayushp336@gmail.com" className="hover:text-blue-400 transition">Contribute data</a>
          <a href="/room-matrix" className="hover:text-blue-400 transition mr-3">Room Matrix</a>

          {user ? (
            <div className="flex items-center gap-3">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`}
                alt="avatar"
                className="w-10 h-10 rounded-full border border-gray-500"
              />
              <div className="text-sm">
                <div className="font-semibold">{user.name}</div>
                <div className="flex justify-between items-center">
                  <div className="text-gray-400 text-xs inline-block">
                  {getAdmissionNumber(user.email)}
                </div>
                <button
                  onClick={handleLogout}
                  className="text-red-400 mt-1 hover:underline text-xs inline-block"
                >
                  Logout
                </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={handleLogin}
              className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-md text-sm font-medium"
            >
              Quick Login
            </button>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden mt-4 px-4 space-y-3">
          <a href="mailto:aayushp336@gmail.com" className="block hover:text-blue-400">Contribute data</a>
          <a href="/visualize" className="block hover:text-blue-400">Visualize with Graphs</a>
          <a href="/room-matrix" className="block hover:text-blue-400">See Room Matrix</a>

          {user ? (
            <div className="mt-2 border-t border-gray-700 pt-3">
              <div className="text-sm font-semibold">{user.name}</div>
              <div className="text-xs text-gray-400">{getAdmissionNumber(user.email)}</div>
              <button
                onClick={handleLogout}
                className="text-red-400 hover:underline text-sm mt-2"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogin}
              className="bg-blue-600 hover:bg-blue-700 w-full px-4 py-2 rounded-md text-sm font-medium"
            >
              Quick Login
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
