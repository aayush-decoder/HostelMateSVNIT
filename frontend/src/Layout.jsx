import { useEffect, useState, useRef, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { signInWithPopup, auth, provider } from './firebase';
import { signOut } from 'firebase/auth';
import Navbar from './components/ui/Navbar';
import IncomingRequests from './featurePopups/IncomingRequests';
import RequestExchange from './featurePopups/SendRequest';
import Myroom from './components/Myroom';
import RoomSetupModal from "./featurePopups/UpdateDetailsPopup";
import LoginContext from './context/logincontext';
import OutgoinRequests from './featurePopups/OutgoinRequests';
import { gsap } from "gsap";
import HostelMatrix from './roomMatrix/SwamiMatrix';
import App from './App';


export default function Layout() {
  const [user, setUser] = useState(null);
  const [appToken, setAppToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const login_context = useContext(LoginContext);
  const pageRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    const name = localStorage.getItem("name");

    if (token && email) {
      fetch("http://localhost:8000/me", {
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

      const res = await fetch("http://localhost:8000/login", {
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
        alert("Login failed. " + (data.detail || ""));
      }
    } catch (err) {
      console.error(err);
      alert("Login error");
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
      <Navbar user={user} handleLogin={handleLogin} handleLogout={handleLogout} />

      <Router>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/room-matrix" element={<HostelMatrix />} />
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </Router>
      
    </>
  );
}
