import landing1 from "../assets/landing1.png";
import landing2 from "../assets/landing2.png";
import landing3 from "../assets/landing3.png";
import container from "../assets/Container.png";
import right from "../assets/right.png";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { useNavigate } from "react-router-dom";
function App() {
  const navigate = useNavigate();
  return (
    <div>
      <Navbar/>
      <div className="mt-15 inline-flex items-center h-8 w-80 rounded-full bg-orange-100 border border-orange-300 gap-2 px-4 py-1">
        <span className="mr-2 h-2.5 w-2.5 rounded-full bg-orange-500"></span>
        <span className="text-orange-500">AI-POWERED LEGAL ASSISTANT</span>
      </div>
      <h1 className="text-black text-5xl font-extrabold mt-8">
        Level the playing field in
      </h1>
      <h1 className="text-orange-400 text-5xl font-extrabold">
        {" "}
        Small Claims Court.
      </h1>
      <div className="text-base text-gray-500 mt-8">
        Don't let legal jargon intimidate you. Get a winning script, filling{" "}
        <br /> instructions, and evidence checklist in minutes - without the
        expensive <br /> lawyer fees.
      </div>
      {/* <div className="mt-10 grid md:grid-cols-2 gap-1 items-center justify-center"> */}
      <div className="mt-10 flex justify-center items-center gap-6">
        <div className="h-12 w-50 rounded-xl bg-orange-400 py-3 transition transform hover:scale-105 duration-300">
          <button onClick={() => navigate('/file-case')} className=" text-white font-bold cursor-pointer ">
            Start My Case Free →
          </button>
        </div>
        <div className="h-12 w-50 rounded-xl bg-white border border-gray-500 py-3 transition transform hover:scale-105 duration-300">
          <button className="text-black font-bold cursor-pointer">
            View Sample Script
          </button>
        </div>
      </div>
      <div className="mt-8 text-xs text-gray-500">
        No credit card required • Free case analysis • Secure & private
      </div>

      <div className="mt-30 text-xl text-gray-500">
        TRUSTED BY FOLKS FILING IN ALL 50 STATES
      </div>
      <div className="mt-8 grid md:grid-cols-5 text-gray-500 font-bold text-xl">
        <h1>The New York Times</h1>
        <h1>TechCrunch</h1>
        <h1>Wall Street Journal</h1>
        <h1>Fast Company</h1>
        <h1>BloomBerg</h1>
      </div>

      <div className="mt-30 text-gray-700 text-3xl font-bold">
        From confusion to confidence in 3 steps
      </div>
      <div className="mt-8 text-gray-500 text-base">
        We break down the complex legal process into a simple conversation.
      </div>

      <div className="mt-8 grid md:grid-cols-3 gap-8 flex justify-center items-center">
        <Card
          img={landing1}
          heading="1. Tell us what happened"
          detail="Answer a few simple questions in plain English about your situation. No legal jargon required."
        />
        <Card
          img={landing2}
          heading="2. AI analyzes your case"
          detail="Our engine reviews local laws, statutes of limitations, and evidence requirements instantly."
        />
        <Card
          img={landing3}
          heading="3. Get your script & forms"
          detail="Download a battle-ready courtroom script, completed filing forms, and an organized evidence pack."
        />
      </div>

      <div className="mt-25 grid md:grid-cols-2 gap 2">
        <div className="text-left">
          <p className="text-3xl font-extrabold text-gray-700">
            Your personal courtroom <br /> coach.
          </p>
          <p className="mt-8 text-gray-500">
            It's not just about filling out forms. CourtMate prepares you <br />{" "}
            for the psychological game of court.
          </p>
          <p className="inline-flex mt-8">
            <img src={right} className="w-10"></img>
            <div className="text-gray-500">
              <p className="font-bold text-gray-700">Evidence Checklist </p>
              <p>Know exactly what receipts, photos, and texts to bring.</p>
            </div>
          </p>

          <p className="inline-flex mt-6">
            <img src={right} className="w-10"></img>
            <div className="text-gray-500">
              <p className="font-bold text-gray-700">Custom Script </p>
              <p>Read word-for-word exactly what to say to the judge.</p>
            </div>
          </p>

          <p className="inline-flex mt-6">
            <img src={right} className="w-10"></img>
            <div className="text-gray-500">
              <p className="font-bold text-gray-700">Filing Instructions </p>
              <p>Step-by-step guide on where to go and how much to pay.</p>
            </div>
          </p>
          <button className="text-orange-400 font-bold cursor-pointer mt-6">
            See how the dashboard works →
          </button>
        </div>
        <div>
          <img src={container}></img>
        </div>
      </div>

      <div className="h-90 w-200 bg-orange-500 rounded-2xl mt-10 mx-auto py-15 text-white">
        <p className="text-4xl font-bold">Ready to claim what's yours?</p>
        <p className="text-base mt-7">
          Join thousands of people who reclaimed their money without hiring a{" "}
          <br />
          lawyer. Start your free case analysis today.
        </p>
        <div className=" mt-7 h-12 w-50 rounded-2xl bg-white py-3 transition transform hover:scale-105 duration-300 mx-auto">
          <button onClick={() => navigate('/file-case')} className=" text-orange-400 font-bold cursor-pointer ">
            Start My Case →
          </button>
        </div>
        <p className="mt-8 text-xs">
          No credit card required for initial analysis.
        </p>
      </div>
      <Footer/>
    </div>
  );
}

const Card = ({ heading, detail, img }) => {
  return (
    <div className="h-55 w-80 bg-white rounded-xl px-2 py-4 shadow-md ">
      <img src={img} className="mx-auto"></img>
      <h3 className="text-gray-700 font-bold">{heading}</h3>
      <p className="text-gray-500 text-base">{detail}</p>
    </div>
  );
};

export default App;
