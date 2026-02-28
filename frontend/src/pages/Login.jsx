import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { loginWithRedirect } = useAuth0();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleGoogleLogin = () => {
    loginWithRedirect({
      authorizationParams: {
        connection: "google-oauth2",
      },
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch(
      `https://${import.meta.env.VITE_AUTH0_DOMAIN}/oauth/token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grant_type: "password",
          username: email,
          password: password,
          client_id: import.meta.env.VITE_AUTH0_CLIENT_ID,
          scope: "openid profile email",
        }),
      }
    );

    const data = await response.json();
    console.log(data);
  };
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8">

        <h2 className="text-2xl font-bold text-center">
          Welcome back
        </h2>

        <p className="text-gray-500 text-sm text-center mt-2 mb-6">
          Log in to continue your case or start a new one.
        </p>

        {/* Google Login */}
        <button
          onClick={handleGoogleLogin}
          className="w-full bg-gray-100 rounded-full py-3 flex items-center justify-center gap-3 hover:bg-gray-200 transition"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            className="w-5 h-5"
          />
          Continue with Google
        </button>

        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="px-3 text-gray-400 text-sm">or</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">

          <input
            type="email"
            placeholder="Enter your email"
            className="w-full border rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Enter your password"
            className="w-full border rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
          onClick={() => navigate("/")}
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-full py-3 font-semibold shadow-md transition"
          >
            Log In
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          New to CourtMate?{" "}
          <span onClick={() => navigate("/signup")}
          className="text-orange-500 cursor-pointer">
            Create an account
          </span>
        </p>

        <p className="text-xs text-gray-400 text-center mt-4">
          🔒 Your data is encrypted and secure.
        </p>
      </div>
    </div>
  );
};

export default Login;