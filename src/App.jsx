import { useEffect, useState } from "react";
import { wakeBackend } from "./api/axios";
import Login from "./auth/Login";
import AdminDashboard from "./pages/AdminDashboard";
import GateDashboard from "./pages/GateDashboard";
import YardDashboard from "./pages/YardDashboard";

function App() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    wakeBackend().finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold">
        Starting server, please wait...
      </div>
    );
  }

  if (!token) return <Login />;

  if (role === "ROLE_ADMIN") return <AdminDashboard />;
  if (role === "ROLE_GATE") return <GateDashboard />;
  if (role === "ROLE_YARD") return <YardDashboard />;
  
  <Route path="/admin" element={<AdminDashboard />} />


  return <Login />;
}

export default App;
