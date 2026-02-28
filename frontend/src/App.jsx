import "./App.css"
import React from 'react'
import LandingPage from "./pages/LandingPage.jsx"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import About from "./pages/About.jsx"
import Contact from "./pages/Contact.jsx"

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path = "/" element = {<LandingPage/>}/>
          <Route path = "/about" element = {<About/>}/>
          <Route path = "/contact" element = {<Contact/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
