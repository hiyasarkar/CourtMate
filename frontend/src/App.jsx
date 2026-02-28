import "./App.css"
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import LandingPage from "./pages/LandingPage.jsx"
import About from "./pages/About.jsx"
import Contact from "./pages/Contact.jsx"
import FileCasePage from "./pages/FileCasePage.jsx"
import Login from "./components/Login.jsx"
import Signup from "./pages/signup.jsx"

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/file-case" element={<FileCasePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  )
}

export default App
