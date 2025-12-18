import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error("All fields are required");
      return;
    }

    try {
      setLoading(true);
      await api.post("/auth/register", { name, email, password });
      toast.success("Registration successful");
      navigate("/");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <form
        onSubmit={submit}
        className="w-full max-w-md bg-white border rounded-xl shadow-sm p-6"
      >
        {/* Heading */}
        <h2 className="text-2xl font-bold mb-1 text-center">
          Create Account
        </h2>
        <p className="text-sm text-gray-500 mb-6 text-center">
          Register to start managing your tasks
        </p>

        {/* Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Name
          </label>
          <input
            className="w-full border rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            className="w-full border rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            type="password"
            className="w-full border rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2.5 rounded-lg hover:bg-gray-900 transition disabled:opacity-50"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        {/* Footer */}
        <p className="text-sm text-gray-500 mt-4 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-black font-medium hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
