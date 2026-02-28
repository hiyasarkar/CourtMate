import React from 'react' 
import Logo from "../assets/Logo.png"
import { Info } from "lucide-react";

const Footer = () => {
  return (
    <div className="w-full border-t bg-gray-50 mt-15">
      <div className='grid md:grid-cols-2'>
        <div className='inline-flex'>
          <img src = {Logo}></img>
          <p>CourtMate Unified</p>
        </div>
        <div>
          © 2025 Magistics. All rights reserved. Privacy • Terms
        </div>
      </div>
      <div className="mt-8 max-w-7xl mx-auto px-6 pb-10">
        <div className="flex gap-3 items-start bg-gray-100 border rounded-xl p-4 text-sm text-gray-600">
          
          <Info className="w-5 h-5 mt-0.5 text-gray-500" />

          <p>
            <span className="font-semibold">Disclaimer:</span> CourtMate provides legal information and 
            self-help software. We are not a law firm and cannot provide legal advice. 
            Our "Win Probability" and scripts are based on data analysis, not legal counsel. 
            Use of our products is subject to our Terms of Service and Privacy Policy.
          </p>

        </div>
      </div>
    </div>
  )
}

export default Footer
