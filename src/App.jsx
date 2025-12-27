import Login from "./auth/Login";
import AdminDashboard from "./pages/AdminDashboard";
import GateDashboard from "./pages/GateDashboard";
import YardDashboard from "./pages/YardDashboard";

function App() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) return <Login />;

  if (role === "ROLE_ADMIN") return <AdminDashboard />;
  if (role === "ROLE_GATE") return <GateDashboard />;
  if (role === "ROLE_YARD") return <YardDashboard />;
  
  <Route path="/admin" element={<AdminDashboard />} />


  return <Login />;
}

export default App;
