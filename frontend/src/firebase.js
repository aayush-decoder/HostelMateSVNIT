import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyASrQtbWbDfZ82kEcwAqyZXpoyGM3yA6dw",
  authDomain: "swamibhavanbackend2.firebaseapp.com",
  projectId: "swamibhavanbackend2",
  storageBucket: "swamibhavanbackend2.firebasestorage.app",
  messagingSenderId: "1088865105633",
  appId: "1:1088865105633:web:5151512031b129d1d429a0",
  measurementId: "G-PQ5ESQ7ZRY"
};
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup };
