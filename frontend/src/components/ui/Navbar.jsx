import React, { useState } from 'react';
import Swal from 'sweetalert2';

export default function Navbar({ user, handleLogin, handleLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLoginWarning = () => {
    Swal.fire({
      title: 'Welcome to HostelMate Buddy!',
      text: 'To use Hostel Mate - SVNIT, you need to log in with your SVNIT email (like u24xxxxx@svnit.ac.in).',
      imageUrl: 'cheersMeme.png',
      imageWidth: 240,
      imageHeight: 180,
      imageAlt: 'Bruh moment',
      background: '#fefefe',
      confirmButtonText: 'Got it, take me to login 🚀',
      confirmButtonColor: '#0a5aef',
      allowEscapeKey: false,
      customClass: {
        popup: 'rounded-3xl shadow-md',
        title: 'text-xl font-bold',
        content: 'text-gray-700 text-sm',
        image: 'rounded-xl'
      },
    }).then((result) => {
      if (result.isConfirmed) {
        handleLogin(); // call login after confirm
      }
    });
  };

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
          <a href="/visualize" className="hover:text-blue-400 transition">Visualize</a>
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
              onClick={handleLoginWarning}
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
          <a href="/visualize" className="hover:text-blue-400 transition block">Visualize</a>
          <a href="mailto:aayushp336@gmail.com" className="hover:text-blue-400 transition block">Contribute data</a>
          <a href="/room-matrix" className="hover:text-blue-400 transition mr-3 block">Room Matrix</a>

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
              onClick={handleLoginWarning}
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