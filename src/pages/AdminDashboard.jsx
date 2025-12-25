import { useEffect, useState } from "react";
import api from "../api/axios";

export default function AdminDashboard() {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    api.get("/admin/vehicles").then((res) => {
      setVehicles(res.data);
    });
  }, []);

  return (
    <div className="min-h-screen bg-background p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary">
          Admin Dashboard
        </h1>
        <button
          onClick={() => {
            localStorage.clear();
            window.location.reload();
          }}
          className="bg-red-500 text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Vehicles" value={vehicles.length} />
        <StatCard
          title="In Yard"
          value={vehicles.filter(v => v.status === "IN_YARD").length}
        />
        <StatCard
          title="Registered"
          value={vehicles.filter(v => v.status === "REGISTERED").length}
        />
      </div>

      {/* Table */}
      <div className="bg-white shadow-card rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Vehicle Records</h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3">Vehicle No</th>
                <th className="p-3">Type</th>
                <th className="p-3">Driver</th>
                <th className="p-3">Status</th>
                <th className="p-3">Slot</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map(v => (
                <tr key={v.id} className="border-b">
                  <td className="p-3">{v.vehicleNumber}</td>
                  <td className="p-3">{v.vehicleType}</td>
                  <td className="p-3">{v.driverName}</td>
                  <td className="p-3">
                    <span className={`px-3 py-1 rounded-full text-sm
                      ${v.status === "IN_YARD"
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"}`}>
                      {v.status}
                    </span>
                  </td>
                  <td className="p-3">
                    {v.yardSlot ? v.yardSlot.slotNumber : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white shadow-card rounded-xl p-6">
      <p className="text-gray-500 text-sm">{title}</p>
      <h3 className="text-3xl font-bold text-primary">{value}</h3>
    </div>
  );
}
