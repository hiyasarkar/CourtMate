import React from "react";
import contact1 from "../assets/contact1.png";
import contact2 from "../assets/contact2.png";
import contact3 from "../assets/contact3.png";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

const Card = ({ heading, detail }) => {
  return (
    <div className="h-35 w-80 bg-white rounded-xl px-2 py-4 shadow-md py-5 px-7">
      <h3 className="text-gray-700 font-bold">{heading}</h3>
      <p className="text-gray-500 text-base">{detail}</p>
    </div>
  );
};

const Contact = () => {
  return (
    <div>
      <Navbar/>
      <div className="text-black text-4xl font-extrabold mt-15">
        We're Here to Help
      </div>
      <div className="mt-6 text-base text-gray-400">
        Have questions about CourtMate AI? Whether it's technical support or
        account <br />
        inquiries, our team is ready to assist you.
      </div>
      <div className="mt-20 grid md:grid-cols-2 gap-30 flex justify-center items-center">
        <div className="h-140 w-130 bg-white rounded-2xl shadow-md">
          <div className="text-black text-xl text-left font-bold py-7 px-5">
            ✉ Send us a message
          </div>
          <form className="space-y-7">
            <input
              type="text"
              placeholder="Enter your name"
              className="w-120 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />

            <input
              type="email"
              placeholder="yourname@example.com"
              className="w-120 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />

            <select className="w-120 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400">
              <option>General Inquiry</option>
              <option>Technical Support</option>
              <option>Business Inquiry</option>
            </select>

            <textarea
              rows="4"
              placeholder="How can we help you today?"
              className="w-120 border rounded-2xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />

            <button
              type="submit"
              className="mt-8 px-6 py-3 bg-orange-500 text-white 
              rounded-full font-semibold hover:bg-orange-600 
              hover:scale-105 transition transform duration-200"
            >
              Send Message →
            </button>
          </form>
        </div>

        <div>
          <div className="h-100 w-130 bg-white rounded-2xl shadow-md text-left px-5 py-6">
            <p className="text-2xl text-black font-bold">
              Other Ways to Reach Us
            </p>
            <p className="inline-flex mt-6 gap-6">
              <img src={contact1} className="w-15"></img>
              <div className="text-gray-500">
                <p className="font-bold text-black">Support Team </p>
                <p>For technical issues and help</p>
                <p className="text-orange-400">support@courtmate.ai</p>
              </div>
            </p>
            <p className="inline-flex mt-6 gap-6">
              <img src={contact2} className="w-15"></img>
              <div className="text-gray-500">
                <p className="font-bold text-black">Business Inquiries </p>
                <p>For sales and partnerships</p>
                <p className="text-orange-400">sales@courtmate.ai</p>
              </div>
            </p>
            <p className="inline-flex mt-6 gap-6">
              <img src={contact3} className="w-15"></img>
              <div className="text-gray-500">
                <p className="font-bold text-black">Headquarters</p>
                <p>
                  123 Legal Tech Blvd, Suite 400 <br />
                  San Francisco, CA 94103
                </p>
              </div>
            </p>
          </div>
          <div className="mt-8 h-35 w-130 bg-orange-200 border border-orange-300 rounded-2xl shadow-md px-6 py-6 text-left">
            <p className="text-black font-bold text-xl">Quick Tip</p>
            <p className="text-gray-400 text-base">For legal advice regarding specific cases, please consult a<br/>
qualified attorney. CourtMate AI is an assistant tool, not a law<br/>
firm.</p>
          </div>
        </div>
      </div>
      <div className="mt-20 text-black text-2xl font-bold">
        Frequently Asked Questions
      </div>
      <div className="mt-8 grid md:grid-cols-3 gap-8 flex justify-center items-center text-left">
        <Card heading = "What are your support hours?" detail = "Our team is available Mon-Fri from 9am to 6pm PST to assist you with any inquiries."/>
<Card heading = "Can I get a demo?" detail = "Absolutely! You can schedule a personalized demo directly from our Features page."/>
<Card heading = "Is my data secure?" detail = "Yes, we use bank-level encryption and adhere to strict privacy standards."/>
      </div>
      <Footer/>
    </div>
  );
};


export default Contact;
