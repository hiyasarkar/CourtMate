import React from "react";
import Navbar from "../components/Navbar.jsx";
import about from "../assets/about.png";
import mission from "../assets/mission.png";
import about1 from "../assets/about1.png";
import about2 from "../assets/about2.png";
import about3 from "../assets/about3.png";
import team from "../assets/team.png";
import Footer from "../components/Footer.jsx";
const About = () => {
  return (
    <div>
      <Navbar />
      <section className="px-6 py-16 bg-gray-100">
        <div className="max-w-6xl mx-auto w-250 rounded-3xl px-10 py-20 text-center bg-gradient-to-r from-black via-[#3b1f00] to-orange-700 text-white shadow-xl">
          <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
            Making Justice Accessible
            <br />
            for Everyone
          </h1>

          <p className="mt-6 max-w-2xl mx-auto text-gray-200 text-lg">
            CourtMate AI empowers individuals with legal knowledge and guidance,
            <br />
            bridging the gap between complexity and clarity.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-6">
            <button className=" px-6 py-3 bg-orange-500 text-black font-semibold rounded-full hover:scale-105 hover:bg-orange-300 transition transform duration-200">
              Read Our Mission
            </button>
            <button className="px-6 py-3 border border-white/40 text-white rounded-full hover:bg-white/10 hover:scale-105 transition transform duration-200">
              Join the Team
            </button>
          </div>
        </div>

        <div className=" mt-20 max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="text-left">
            <div className="inline-flex items-center h-6 w-40 rounded-full bg-orange-100 border border-orange-300 gap-2 px-4 py-1">
              {/* <span className="mr-2 h-2.5 w-2.5 rounded-full bg-orange-500"></span> */}
              <img src={mission}></img>
              <span className="text-orange-500 whitespace-nowrap">
                OUR MISSION
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold leading-tight text-gray-900">
              Democratizing legal access through technology
            </h2>
            <p className="mt-6 text-gray-600 leading-relaxed">
              We believe everyone deserves equal access to justice, regardless
              of their financial situation or legal background. The legal system
              is often opaque and intimidating. CourtMate AI exists to shine a
              light on the process, providing affordable, understandable, and
              accessible legal assistance to all.
            </p>
            <div className="mt-10 flex gap-10">
              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="text-2xl font-bold text-gray-900">50k+</h3>
                <p className="text-gray-500 text-sm">Users Helped</p>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="text-2xl font-bold text-gray-900">24/7</h3>
                <p className="text-gray-500 text-sm">Support Access</p>
              </div>
            </div>
          </div>

          <div>
            <img src={about}></img>
          </div>
        </div>

        <div className="mt-20 grid md:grid-cols-3 gap-8 flex justify-center items-center">
          <Card
            img={about1}
            heading="Simplifying Law"
            detail="Breaking down complex legal jargon into plain English so you know exactly where you stand."
          />
          <Card
            img={about2}
            heading="Empowering Users"
            detail="Giving you the interactive tools and guided workflows to understand your rights confidently."
          />
          <Card
            img={about3}
            heading="Democratizing Access"
            detail="Making high-quality, professional legal assistance affordable and reachable for all."
          />
        </div>

        <div className=" mt-20 h-65 w-280 bg-white rounded-2xl px-2 py-6 shadow-md ">
          <h1 className="text-2xl text-black font-bold">Our Story</h1>
          <p className="mt-5 text-base text-gray-400">
            It started at a weekend hackathon in 2023. Our team of four
            strangers—a law student, two developers,
            <br />
            and a designer—bonded over a shared frustration: why is legal help
            so expensive and confusing?
          </p>
          <p className="mt-5 text-base text-gray-400">
            We spent 48 hours fueled by coffee and pizza building the first
            prototype of CourtMate. What began as
            <br />
            a simple chatbot has grown into a comprehensive platform, but our
            core belief remains the same:
            <br />
            Justice shouldn't be a luxury product.
          </p>
        </div>

        <div className="mt-15 text-3xl font-bold text-black">
            Meet the Team
        </div>
        <div className="mt-6 text-base text-gray-400">The passionate individuals working to make the legal system fairer for everyone.</div>
        <div className="mt-20 grid md:grid-cols-3 gap-8 flex justify-center items-center">
            <Team img = {team} heading = "Aishik Mondal" detail = "I build AI because I believe technology is the key to scaling justice."/>
            <Team img = {team} heading = "Abhirup Datta Khan" detail = "Designing for clarity means designing for trust in moments of crisis."/>
            <Team img = {team} heading = "Hiya Sarkar" detail = "Building reliable systems from database to interface, focused on performance and clarity."/>
        </div>


      </section>
      <Footer/>
    </div>
  );
};

const Card = ({ heading, detail, img }) => {
  return (
    <div className="h-55 w-80 bg-white rounded-2xl px-2 py-6 shadow-md ">
      <img src={img} className="mx-auto"></img>
      <h3 className="text-gray-700 font-bold">{heading}</h3>
      <p className="text-gray-500 text-base">{detail}</p>
    </div>
  );
};

const Team = ({ heading, detail, img }) => {
  return (
    <div className="min-h-[300px] w-80 bg-white rounded-2xl px-2 py-6 shadow-md ">
      <img src={img} className="mx-auto"></img>
      <h3 className="text-gray-700 font-bold">{heading}</h3>
      <p className="text-gray-500 text-base">{detail}</p>
    </div>
  );
};

export default About;
