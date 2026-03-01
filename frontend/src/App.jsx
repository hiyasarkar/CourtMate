import "./App.css"
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import LandingPage from "./pages/LandingPage.jsx"
import About from "./pages/About.jsx"
import Contact from "./pages/Contact.jsx"
import FileCasePage from "./pages/FileCasePage.jsx"
import Login from "./components/Login.jsx"
import Signup from "./pages/signup.jsx"
import Lawyersignup from "./pages/Lawyersignup.jsx"
import Lawyerlogin from "./components/Lawyerlogin.jsx"
import Lawyer from "./pages/Lawyer.jsx"
import ProfilePage from "./pages/ProfilePage.jsx"
import LawyersPage from "./pages/LawyersPage.jsx"

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/file-case" element={<FileCasePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/lawyersignup" element={<Lawyersignup/>} />
      <Route path="/lawyerlogin" element={<Lawyerlogin/>} />
      <Route path="/lawyer" element={<Lawyer/>} />
      <Route path="/profile" element={<ProfilePage/>} />
      <Route path="/lawyers" element={<LawyersPage/>} />
    </Routes>
  )
}

export default App
