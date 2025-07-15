import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyCJg1-oXQBIaT6APVUBIYOaPm2rv66cBo4",
  authDomain: "swamibhavanbackend.firebaseapp.com",
  projectId: "swamibhavanbackend",
  storageBucket: "swamibhavanbackend.firebasestorage.app",
  messagingSenderId: "466366079678",
  appId: "1:466366079678:web:909fd8696144c8be5d74ef",
  measurementId: "G-RTT02JGRQD",
}
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup };
