import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const { loginWithRedirect, isLoading } = useAuth0();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  const handleEmailSignup = () => {
    loginWithRedirect({
      authorizationParams: {
        screen_hint: "signup",
      },
    });
  };

  const handleGoogleSignup = () => {
    loginWithRedirect({
      authorizationParams: {
        connection: "google-oauth2",
      },
    });
  };

const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8">
        
        {/* Heading */}
        <h2 className="text-2xl font-bold text-center">
          Create your account
        </h2>

        <p className="text-gray-500 text-sm text-center mt-2 mb-6">
          Start preparing your case in minutes with our AI-powered legal assistant.
        </p>

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
          <span className="text-sm font-medium">
            Sign up with Google
          </span>
        </button>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="px-3 text-gray-400 text-sm">or</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Form Fields (UI only, Auth0 handles actual signup) */}
        <div className="space-y-4">

          <input
            type="text"
            placeholder="Enter your full name"
            className="w-full border rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          <input
            type="email"
            placeholder="Enter your email"
            className="w-full border rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          <input
            type="password"
            placeholder="Create a password"
            className="w-full border rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          <div className="flex gap-4">
            <select className="w-1/2 border rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400">
              <option>Select State</option>
              <option>California</option>
              <option>Texas</option>
              <option>New York</option>
            </select>

            <select className="w-1/2 border rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400">
              <option>English</option>
              <option>Spanish</option>
            </select>
          </div>

          {/* Create Account Button */}
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-full py-3 font-semibold shadow-md transition"
          >
            Create Account
          </button>
        </div>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-orange-500 font-medium cursor-pointer"
          >
            Log in
          </span>
        </p>

        {/* Footer */}
        <p className="text-xs text-gray-400 text-center mt-4">
          🔒 Your data is encrypted and secure.
        </p>
      </div>
    </div>
  );
};

export default Signup;