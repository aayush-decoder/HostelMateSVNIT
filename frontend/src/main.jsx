import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { signInWithPopup, auth, provider } from './firebase';
import { signOut } from 'firebase/auth';
import './index.css'
import App from './App.jsx'
import LoginContextProvider from './context/LoginContextProvider.jsx'
import HostelMatrix from './roomMatrix/SwamiMatrix.jsx';
import Navbar from './components/ui/Navbar.jsx';
import Layout from './Layout.jsx';


createRoot(document.getElementById('root')).render(

  <StrictMode>
    <LoginContextProvider>
      <Layout />
    </LoginContextProvider>
  </StrictMode>,
)
