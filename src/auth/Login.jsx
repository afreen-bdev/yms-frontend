import { useState } from "react";
import api from "../api/axios";

export default function Login() {
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!role) {
      setError("Please select a role");
      return;
    }

    try {
      const res = await api.post("/auth/login", {
        username,
		password,
		role,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      window.location.reload();
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid login credentials"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700">
      <div className="bg-white w-96 p-8 rounded-xl shadow-card">
        <h1 className="text-2xl font-bold text-center text-primary mb-2">
          Yard Management System
        </h1>
        <p className="text-center text-gray-500 text-sm mb-6">
          Role-based secure login
        </p>

        {error && (
          <div className="bg-red-100 text-red-600 p-2 rounded text-sm mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {/* ROLE DROPDOWN */}
          <select
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">Select Role</option>
            <option value="ROLE_ADMIN">Admin</option>
            <option value="ROLE_GATE">Gate</option>
            <option value="ROLE_YARD">Yard</option>
          </select>

          <input
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="w-full bg-primary text-white py-3 rounded-lg hover:bg-secondary transition">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
