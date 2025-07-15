import { useEffect, useState } from 'react';
import { signInWithPopup, auth, provider } from './firebase';
import { signOut } from 'firebase/auth';
import { useContext } from 'react';
import LoginContext from './context/logincontext';
function App() {
  const [user, setUser] = useState(null);
  const [appToken, setAppToken] = useState(null);
  const login_context=useContext(LoginContext)
  // Check login on load
  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    const name = localStorage.getItem("name");
    if (token && email) {
      setAppToken(token);
      setUser({ email, name });
      login_context.setLogin(true);
    }
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
        login_context.setLogin(true)
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
    login_context.setLogin(false)
    setUser(null);
    setAppToken(null);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "5rem" }}>
      <h1>Roomie Login</h1>

      {user ? (
        <>
          <p>You are logged in as: <strong>{user.name}</strong></p>
          <p>Email: {user.email}</p>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <button onClick={handleLogin}>Login with Google</button>
      )}
    </div>
  );
}

export default App;
