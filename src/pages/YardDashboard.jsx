import { useEffect, useState, useCallback } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function YardDashboard() {
  const [registeredVehicles, setRegisteredVehicles] = useState([]);
  const [inYardVehicles, setInYardVehicles] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  // ========================
  // LOAD VEHICLES
  // ========================
  const loadVehicles = useCallback(async () => {
    try {
      const res = await api.get("/yard/vehicles");

      setRegisteredVehicles(
        res.data.filter((v) => v.status === "REGISTERED")
      );

      setInYardVehicles(
        res.data.filter((v) => v.status === "IN_YARD")
      );
    } catch {
      toast.error("Failed to load vehicles");
    }
  }, []);

  useEffect(() => {
    loadVehicles();
  }, [loadVehicles]);

  // ========================
  // ALLOCATE
  // ========================
  const allocate = async (id) => {
    try {
      setLoadingId(id);
      await api.post(`/yard/allocate/${id}`);
      toast.success("Vehicle allocated successfully");
      loadVehicles();
    } catch {
      toast.error("Allocation failed");
    } finally {
      setLoadingId(null);
    }
  };

  // ========================
  // EXIT
  // ========================
  const exitVehicle = async (id) => {
    try {
      setLoadingId(id);
      await api.post(`/yard/exit/${id}`);
      toast.success("Vehicle exited successfully");
      loadVehicles();
    } catch {
      toast.error("Exit failed");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      {/* HEADER */}
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary">
          Yard Dashboard
        </h1>
        <button
          onClick={() => {
            localStorage.clear();
            window.location.reload();
          }}
          className="text-red-500 font-semibold"
        >
          Logout
        </button>
      </header>

      {/* ================= REGISTERED VEHICLES ================= */}
      <div className="bg-white shadow-card rounded-xl p-6 mb-10">
        <h2 className="text-lg font-semibold mb-4">
          Vehicles Awaiting Allocation
        </h2>

        {registeredVehicles.length === 0 ? (
          <p className="text-gray-500 text-center py-6">
            No vehicles pending allocation
          </p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left">Vehicle No</th>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Driver</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {registeredVehicles.map((v) => (
                <tr key={v.id} className="border-b">
                  <td className="p-3">{v.vehicleNumber}</td>
                  <td className="p-3">{v.vehicleType}</td>
                  <td className="p-3">{v.driverName}</td>
                  <td className="p-3">
                    <button
                      disabled={loadingId === v.id}
                      onClick={() => allocate(v.id)}
                      className={`px-4 py-2 rounded-lg text-white ${
                        loadingId === v.id
                          ? "bg-gray-400"
                          : "bg-primary hover:bg-secondary"
                      }`}
                    >
                      {loadingId === v.id ? "Processing..." : "Allocate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ================= IN-YARD VEHICLES ================= */}
      <div className="bg-white shadow-card rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">
          Vehicles Inside Yard
        </h2>

        {inYardVehicles.length === 0 ? (
          <p className="text-gray-500 text-center py-6">
            No vehicles currently in yard
          </p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left">Vehicle No</th>
                <th className="p-3 text-left">Driver</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {inYardVehicles.map((v) => (
                <tr key={v.id} className="border-b">
                  <td className="p-3">{v.vehicleNumber}</td>
                  <td className="p-3">{v.driverName}</td>
                  <td className="p-3">
                    <button
                      disabled={loadingId === v.id}
                      onClick={() => exitVehicle(v.id)}
                      className={`px-3 py-1 rounded text-white ${
                        loadingId === v.id
                          ? "bg-gray-400"
                          : "bg-red-500 hover:bg-red-600"
                      }`}
                    >
                      {loadingId === v.id ? "Processing..." : "Exit"}
                    </button>
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
