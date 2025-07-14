import { signInWithPopup, auth, provider } from './firebase';

function App() {
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();
      console.log("Firebase Token:", idToken);

      const res = await fetch("http://localhost:8000/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      const data = await res.json();
      console.log("Backend Token:", data);

      localStorage.setItem("token", data.access_token);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "5rem" }}>
      <h1>Login to Roomie</h1>
      <button onClick={handleLogin}>Login with Google</button>
    </div>
  );
}

export default App;
