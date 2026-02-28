import React from "react";
import Logo from "../assets/Logo.png";

const Navbar = () => {
  return (
    <div>
      <header className="w-full bg-gray-100 py-6 flex justify-center mx-10">
        <nav
          className="w-[90%] max-w-6xl flex items-center justify-between 
      bg-white px-6 py-3 rounded-full border border-orange-600 shadow-md"
        >
          <div className="flex items-center gap-3">
            <img src={Logo}></img>
            <span className="font-semibold text-gray-800">
              CourtMate Unified
            </span>
          </div>

          <div className="hidden md:flex items-center text-gray-700 font-medium gap-16">
            <Link href="/" detail="Home" />
            <Link href="/about" detail="About Us" />
            <Link href="/contact" detail="Contact Us" />
          </div>
        </nav>

        <div className="flex items-center gap-4  mx-8">
          <button className="text-gray-700 font-medium hover:text-orange-500 cursor-pointer transition transform hover:scale-110 duration-300 whitespace-nowrap">
            Sign In
          </button>

          <button
            className="px-5 py-2 bg-orange-500 text-white rounded-2xl 
          font-semibold shadow-md hover:bg-orange-600 hover:scale-105 
          transition transform duration-200 whitespace-nowrap cursor-pointer"
          >
            Start Case
          </button>
        </div>
      </header>
    </div>
  );
};

const Link = ({ href, detail }) => {
  return (
    <a
      href={href}
      className="hover:text-orange-500 transition transform hover:scale-110 duration-300"
    >
      {detail}
    </a>
  );
};

export default Navbar;
