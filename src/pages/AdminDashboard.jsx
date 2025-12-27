import { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  // ========================
  // LOAD DATA
  // ========================
  const loadData = async () => {
    try {
      setLoading(true);

      const vehicleRes = await api.get("/admin/vehicles");
      setVehicles(vehicleRes.data);

      const receiptRes = await api.get("/admin/receipts");
      setReceipts(receiptRes.data);

      const revenue = receiptRes.data.reduce(
        (sum, r) => sum + (r.totalAmount || 0),
        0
      );
      setTotalRevenue(revenue);

    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      toast.error("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ========================
  // LOGOUT
  // ========================
  const logout = () => {
    localStorage.clear();
    window.location.reload();
  };

  // ========================
  // DOWNLOAD CSV (JWT SAFE)
  // ========================
  const downloadCsv = async () => {
    try {
      const res = await api.get(
        "/admin/receipts/export",
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "yard-receipts.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("CSV downloaded successfully");
    } catch {
      toast.error("Failed to download CSV");
    }
  };

  // ========================
  // UI
  // ========================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading admin dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      {/* HEADER */}
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary">
          Admin Dashboard
        </h1>
        <button
          onClick={logout}
          className="text-red-500 font-semibold"
        >
          Logout
        </button>
      </header>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white shadow-card rounded-xl p-6">
          <p className="text-gray-500">Total Vehicles</p>
          <h2 className="text-2xl font-bold">{vehicles.length}</h2>
        </div>

        <div className="bg-white shadow-card rounded-xl p-6">
          <p className="text-gray-500">Total Receipts</p>
          <h2 className="text-2xl font-bold">{receipts.length}</h2>
        </div>

        <div className="bg-white shadow-card rounded-xl p-6">
          <p className="text-gray-500">Total Revenue</p>
          <h2 className="text-2xl font-bold text-green-600">
            ₹{totalRevenue.toLocaleString("en-IN")}
          </h2>
        </div>
      </div>

      {/* ================= CSV ================= */}
      <button
        onClick={downloadCsv}
        className="mb-8 bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary transition"
      >
        Download Receipts CSV
      </button>

      {/* ================= VEHICLE TABLE ================= */}
      <div className="bg-white shadow-card rounded-xl p-6 mb-10">
        <h2 className="text-lg font-semibold mb-4">
          All Vehicles Status
        </h2>

        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">Vehicle</th>
              <th className="p-3 text-left">Driver</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((v) => (
              <tr key={v.id} className="border-b">
                <td className="p-3">{v.vehicleNumber}</td>
                <td className="p-3">{v.driverName}</td>
                <td
                  className={`p-3 font-semibold ${
                    v.status === "EXITED"
                      ? "text-green-600"
                      : v.status === "IN_YARD"
                      ? "text-orange-500"
                      : "text-gray-600"
                  }`}
                >
                  {v.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= RECEIPTS ================= */}
      <div className="bg-white shadow-card rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">
          Payment Receipts
        </h2>

        {receipts.length === 0 ? (
          <p className="text-gray-500">No receipts generated yet</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left">Vehicle</th>
                <th className="p-3 text-left">Driver</th>
                <th className="p-3 text-left">Hours</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {receipts.map((r) => (
                <tr key={r.id} className="border-b">
                  <td className="p-3">{r.vehicleNumber}</td>
                  <td className="p-3">{r.driverName}</td>
                  <td className="p-3">{r.durationInHours}</td>
                  <td className="p-3">₹{r.totalAmount}</td>
                  <td className="p-3 font-semibold text-green-600">
                    {r.paymentStatus}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
