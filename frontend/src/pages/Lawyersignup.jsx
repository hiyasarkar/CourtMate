import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const Lawyersignup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [regNo, setRegNo] = useState("");
  const [domain, setDomain] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleSignup = async () => {
    setError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/profile` },
    });
    if (error) setError(error.message);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!regNo || !domain) {
      setError("Registration number and Domain are required for Lawyers.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name, role: 'Lawyer' },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // Insert into lawyers table
    if (authData?.user) {
      const { error: dbError } = await supabase.from('lawyers').insert([
        {
          id: authData.user.id,
          full_name: name,
          email: email,
          reg_no: regNo,
          domain: domain
        }
      ]);

      if (dbError) {
        setError(`Auth succeeded but DB insert failed: ${dbError.message}`);
      } else {
        setSuccess("Lawyer account created successfully! Check your email for a confirmation link, then log in.");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8">

        <h2 className="text-2xl font-bold text-center">
          Create your account
        </h2>

        <p className="text-gray-500 text-sm text-center mt-2 mb-6">
          Start preparing your case in minutes with our AI-powered legal assistant.
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3 mb-4">
            {success}
          </div>
        )}

        {/* Google Button */}
        <button
          onClick={handleGoogleSignup}
          className="w-full border border-gray-300 rounded-full py-3 flex items-center justify-center gap-3 hover:bg-gray-50 transition"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="google"
            className="w-5 h-5"
          />
          <span className="text-sm font-medium">Sign up with Google</span>
        </button>

        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="px-3 text-gray-400 text-sm">or</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">

          <input
            type="text"
            placeholder="Enter your full name"
            className="w-full border rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Bar Council Registration No (e.g. MAH/1234/2021)"
            className="w-full border rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
            value={regNo}
            onChange={(e) => setRegNo(e.target.value)}
            required
          />

          <select
            className="w-full border rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            required
          >
            <option value="" disabled>Select Primary Domain</option>
            <option value="Consumer Fraud">Consumer Fraud</option>
            <option value="Medical Negligence">Medical Negligence</option>
            <option value="Deficiency in Service">Deficiency in Service</option>
            <option value="Unfair Trade Practice">Unfair Trade Practice</option>
            <option value="Product Liability">Product Liability</option>
            <option value="General Consumer Law">General Consumer Law</option>
          </select>

          <input
            type="email"
            placeholder="Enter your email"
            className="w-full border rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Create a password (min 6 chars)"
            className="w-full border rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-full py-3 font-semibold shadow-md transition disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/lawyerlogin")}
            className="text-orange-500 font-medium cursor-pointer"
          >
            Log in
          </span>
        </p>

        <p className="text-xs text-gray-400 text-center mt-4">
          🔒 Your data is encrypted and secure.
        </p>
      </div>
    </div>
  );
};

export default Lawyersignup;
