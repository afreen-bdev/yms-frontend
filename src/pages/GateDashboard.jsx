import { useState } from "react";
import api from "../api/axios";

export default function GateDashboard() {
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [driverName, setDriverName] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/gate/register", {
        vehicleNumber,
        vehicleType,
        driverName,
      });

      setSuccess("Vehicle registered successfully");
      setVehicleNumber("");
      setVehicleType("");
      setDriverName("");
    } catch {
      setSuccess("Error registering vehicle");
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 flex items-center justify-center">
      <div className="bg-white shadow-card rounded-xl p-8 w-full max-w-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-primary">
            Gate Entry
          </h1>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            className="text-red-500 text-sm"
          >
            Logout
          </button>
        </div>

        {success && (
          <div className="mb-4 text-center text-green-600 text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
            placeholder="Vehicle Number"
            value={vehicleNumber}
            onChange={(e) => setVehicleNumber(e.target.value)}
            required
          />

          <input
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
            placeholder="Vehicle Type (Truck, Van, etc.)"
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
            required
          />

          <input
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
            placeholder="Driver Name"
            value={driverName}
            onChange={(e) => setDriverName(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-lg hover:bg-secondary transition"
          >
            Register Vehicle
          </button>
        </form>
      </div>
    </div>
  );
}
