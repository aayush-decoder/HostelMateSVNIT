import { useEffect, useState, useRef, useContext } from 'react';
import { signInWithPopup, auth, provider } from './firebase';
import { signOut } from 'firebase/auth';
import Navbar from './components/ui/Navbar';
import IncomingRequests from './featurePopups/IncomingRequests';
import RequestExchange from './featurePopups/SendRequest';
import Myroom from './components/Myroom';
import RoomSetupModal from "./featurePopups/UpdateDetailsPopup";
import LoginContext from './context/logincontext';
import OutgoinRequests from './featurePopups/OutgoinRequests';

import Swal from 'sweetalert2';


export default function App() {
  const [user, setUser] = useState(null);
  const [appToken, setAppToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const login_context = useContext(LoginContext);
  const pageRef = useRef(null);

  // useEffect(() => {
  //   // Vibe entrance animation ✨
  //   gsap.from(pageRef.current, {
  //     opacity: 0,
  //     y: 50,
  //     duration: 1,
  //     ease: "power3.out",
  //   });
  // }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    const name = localStorage.getItem("name");

    if (token && email) {
      fetch("https://hostelmate-nqe3.onrender.com/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
      })
        .then(response => response.json())
        .then(data => {
          if (data.name) {
            setAppToken(token);
            setUser({ email, name });
            login_context.setLogin(true);
          }
        })
        .catch(error => console.error("Error", error));
    }
    setLoading(false);
  }, []);

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      const idToken = await firebaseUser.getIdToken();

      const res = await fetch("https://hostelmate-nqe3.onrender.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      const data = await res.json();
      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("email", firebaseUser.email);
        localStorage.setItem("name", firebaseUser.displayName);
        setUser({ email: firebaseUser.email, name: firebaseUser.displayName });
        login_context.setLogin(true);
        setAppToken(data.access_token);
      } else {
        // alert("Login failed. " + (data.detail || ""));

        Swal.fire({
          icon: 'error',
          title: 'Oops! That login attempt didn’t vibe 💥',
          text: data.detail || 'Something went wrong while trying to let you in. Try again, maybe with a magic touch ✨',
          confirmButtonText: 'Let me try again 🔁',
          background: '#1e1e1e',
          color: '#eee',
          customClass: {
            popup: 'rounded-2xl shadow-lg',
            confirmButton: 'bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md',
          }
        });

      }
    } catch (err) {
      console.error(err);
      // alert("Login error");
      Swal.fire({
        icon: 'error',
        title: 'Oops! That login attempt didn’t vibe 💥',
        text: data.detail || 'Something went wrong while trying to let you in. Try again, maybe with a magic touch ✨',
        confirmButtonText: 'Let me try again 🔁',
        background: '#1e1e1e',
        color: '#eee',
        customClass: {
          popup: 'rounded-2xl shadow-lg',
          confirmButton: 'bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md',
        }
      });
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("name");
    login_context.setLogin(false);
    setUser(null);
    setAppToken(null);
  };

  return (
    <>
      {/* <Navbar user={user} handleLogin={handleLogin} handleLogout={handleLogout} /> */}
      {/* dark mode: bg-gray-950 text-white */}
      <div
        ref={pageRef}
        className="px-4 py-8 min-h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/hostel-bg.jpeg')", backgroundSize: "cover", backgroundClip: "fixed", backgroundAttachment: "fixed" }}
      >

      <Myroom />

        {/* <div className="text-center mb-6">
          <h1 className="text-4xl font-extrabold text-blue-400 mb-2">
            🛏️ Hostelmate Dashboard
          </h1>
          <p className="text-gray-400 text-sm">"Where Room Swaps Meet Vibes 😎"</p>
        </div> */}

        <div className="flex justify-center mb-6 mt-3">
          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 text-white px-6 py-2 rounded-xl shadow-xl font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
          >
            🚀 Setup Your Data
          </button>
        </div>

        <RoomSetupModal isOpen={showModal} onClose={() => setShowModal(false)} />

        {/* 🔥 Responsive layout */}
        <div className="flex flex-col lg:flex-row lg:items-start gap-6 w-full px-2">
          {/* Left - RequestExchange */}
          <div className="lg:w-1/2 w-full flex flex-col justify-center bg-theme backdrop-blur-[6px] p-4 rounded-xl shadow-md border border-gray-800">
            <RequestExchange />
            <OutgoinRequests/>
          </div>

          {/* Right - IncomingRequests */}
          <div className="lg:w-1/2 w-full lg:h-full bg-gray-900 p-4 rounded-xl  shadow-md border border-gray-800">
            <IncomingRequests />
          </div>
        </div>

        <div className="text-center mt-10 mx-auto space-y-3 backdrop-blur-[4px] bg-[#ffffff64] rounded-xl">
          <h2 className="text-xl font-bold text-green-600 text-shadow-gray-800">Roomie Login Info</h2>

          {user ? (
            <>
              <p>Logged in as: <strong>{user.name}</strong></p>
              <p>Email: <code>{user.email}</code></p>
              <button
                onClick={handleLogout}
                className="mt-2 px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 transition-all"
              >
                🔓 Logout
              </button>
            </>
          ) : (
            <button
              onClick={handleLogin}
              className="px-6 py-2 mt-2 rounded-md bg-blue-700 hover:bg-blue-800 transition-all"
            >
              🔐 Login with Google
            </button>
          )}
        </div>
      </div>
    </>
  );
}
