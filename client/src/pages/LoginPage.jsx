import { useContext, useState } from "react";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [currstate, setcurrstate] = useState("Sign Up");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const onsubmithandler = async (e) => {
    e.preventDefault();

    if (!termsAccepted) {
      toast.error("Please agree to the Terms of Use and Privacy Policy.");
      return;
    }

    try {
      await login(currstate === "Sign Up" ? "signup" : "login", {
        fullName,
        email,
        password,
        bio,
      });
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Authentication failed. Please check your details.");
    }
  };

  return (
    <div className="min-h-screen bg-cover flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-md px-4">
      {/* Left */}
      <img src={assets.logo_big} alt="Logo" className="w-[min(30vw,250px)]" />

      {/* Right - Form */}
      <form
        className="backdrop-blur-lg bg-white/10 text-white border border-white/20 p-6 flex flex-col gap-5 rounded-xl shadow-xl min-w-[300px] max-w-sm w-full"
        onSubmit={onsubmithandler}
      >
        <h2 className="font-semibold text-2xl flex justify-between items-center">
          {currstate}
        </h2>

        {currstate === "Sign Up" && (
          <>
            <input
              onChange={(e) => setFullName(e.target.value)}
              value={fullName}
              type="text"
              className="p-3 rounded-md bg-white/20 border border-white/30 placeholder:text-white text-white focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Full Name"
              required
            />
            <textarea
              onChange={(e) => setBio(e.target.value)}
              value={bio}
              rows={3}
              className="p-3 rounded-md bg-white/20 border border-white/30 placeholder:text-white text-white focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Short bio..."
            />
          </>
        )}

        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email"
          placeholder="Email"
          className="p-3 rounded-md bg-white/20 border border-white/30 placeholder:text-white text-white focus:outline-none focus:ring-2 focus:ring-blue-300"
          required
        />
        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type="password"
          placeholder="Password"
          className="p-3 rounded-md bg-white/20 border border-white/30 placeholder:text-white text-white focus:outline-none focus:ring-2 focus:ring-blue-300"
          required
        />

        <div className="flex gap-2 text-xs items-center text-gray-200">
          <input
            type="checkbox"
            className="accent-blue-500"
            checked={termsAccepted}
            onChange={() => setTermsAccepted(!termsAccepted)}
          />
          <p>Agree to Terms of Use & Privacy Policy</p>
        </div>

        <button
          type="submit"
          className="py-3 bg-gradient-to-r from-blue-400 to-blue-600 text-white font-semibold rounded-full hover:scale-[1.02] transition-transform"
        >
          {currstate === "Sign Up" ? "Create Account" : "Login Now"}
        </button>

        <div className="py-0 flex flex-col gap-2 text-sm text-white/80">
          {currstate === "Sign Up" ? (
            <p>
              Already have an account?{" "}
              <span
                onClick={() => {
                  setcurrstate("Login");
                }}
                className="text-blue-300 hover:underline cursor-pointer font-medium"
              >
                Login here
              </span>
            </p>
          ) : (
            <p>
              New here?{" "}
              <span
                onClick={() => {
                  setcurrstate("Sign Up");
                }}
                className="text-blue-300 hover:underline cursor-pointer font-medium"
              >
                Create an account
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
