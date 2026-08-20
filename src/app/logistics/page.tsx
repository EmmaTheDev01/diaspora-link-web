'use client';
import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { dbService } from '@/services/db';
import { CarrierTrip } from '@/types';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { CourierCapacityChart } from '@/components/charts/CourierCapacityChart';
import { Plane, Plus, Luggage, X, ShieldCheck, User, Settings, CreditCard } from 'lucide-react';

export default function LogisticsPage() {
  const { user, currency } = useAuthStore();
  const [activeTab, setActiveTab] = useState('trips');
  const [trips, setTrips] = useState<CarrierTrip[]>([]);
  const [isTripModalOpen, setIsTripModalOpen] = useState(false);

  const [flightNumber, setFlightNumber] = useState('WB 302');
  const [airline, setAirline] = useState('RwandAir');
  const [date, setDate] = useState('2026-09-12');
  const [capacityKg, setCapacityKg] = useState(20.0);
  const [rateCad, setRateCad] = useState(12.0);

  useEffect(() => {
    async function loadTrips() {
      const data = await dbService.getCarrierTrips();
      setTrips(data);
    }
    loadTrips();
  }, []);

  const handleCreateTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    const created = await dbService.createCarrierTrip({
      courier_id: user?.id || 'usr_courier_1',
      courier_name: user?.full_name || 'David Mugisha',
      flight_number: flightNumber,
      airline,
      departure_date: date,
      total_capacity_kg: capacityKg,
      available_capacity_kg: capacityKg,
      rate_per_kg_cad: rateCad,
      rate_per_kg_rwf: Math.round(rateCad * 1233.33),
    });

    setTrips([created, ...trips]);
    setIsTripModalOpen(false);
  };

  const menuItems = [
    { id: 'trips', label: 'Travel & Trips', icon: <Plane size={18} /> },
    { id: 'analytics', label: 'Capacity Analytics', icon: <Luggage size={18} /> },
    { id: 'manifests', label: 'Delivery Manifests', icon: <ShieldCheck size={18} /> },
    { id: 'profile', label: 'Courier Profile', icon: <User size={18} /> },
  ];

  return (
    <DashboardLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      menuItems={menuItems}
      title={user?.full_name || 'David Mugisha (Air Courier)'}
      subtitle="Luggage Courier Portal • RwandAir Flight Baggage Allowance • KGL ✈ YYZ Corridor"
    >
      {/* TAB 1: TRAVEL & TRIPS */}
      {activeTab === 'trips' && (
        <div className="space-y-8">
          <div className="bg-black text-white p-8 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest bg-white text-black px-3.5 py-1 rounded-full flex items-center gap-1.5">
                  <Plane size={14} /> RwandAir Luggage Courier Hub
                </span>
              </div>
              <h2 className="text-2xl lg:text-3xl font-black font-retro-heading uppercase">Baggage Capacity Monetisation</h2>
              <p className="text-gray-300 text-xs font-medium">Monetise spare baggage allowance carrying verified export parcels on `KGL ✈ YYZ` flights.</p>
            </div>

            <button
              onClick={() => setIsTripModalOpen(true)}
              className="bg-white hover:bg-gray-100 text-black font-bold px-6 py-3.5 rounded-xl transition text-xs uppercase tracking-wider cursor-pointer shadow-md"
            >
              <Plus size={16} className="inline mr-1.5" /> Post Flight Baggage Trip
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-bold text-lg text-black font-retro-heading">Registered Passenger Flight Trips ({trips.length})</h3>
              <span className="text-xs text-gray-500 font-mono">Schema `carrier_trips`</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-[#111111] font-medium">
                <thead className="bg-black text-white font-bold uppercase tracking-wider text-xs">
                  <tr>
                    <th className="p-4">Flight / Airline</th>
                    <th className="p-4">Departure Date</th>
                    <th className="p-4">Route</th>
                    <th className="p-4">Spare Capacity</th>
                    <th className="p-4">Freight Rate ($/kg)</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {trips.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-50 transition">
                      <td className="p-4 font-mono font-bold text-black">{t.flight_number} ({t.airline})</td>
                      <td className="p-4 font-bold">{t.departure_date}</td>
                      <td className="p-4 font-bold uppercase">{t.departure_airport} ✈ {t.arrival_airport}</td>
                      <td className="p-4 font-bold text-black">{t.available_capacity_kg} kg / {t.total_capacity_kg} kg</td>
                      <td className="p-4 font-bold text-black">${t.rate_per_kg_cad.toFixed(2)} / kg</td>
                      <td className="p-4">
                        <span className="bg-black text-white font-bold px-2.5 py-1 text-xs rounded uppercase">{t.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CAPACITY ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-black font-retro-heading">Luggage Capacity Utilization Analytics</h2>
          <CourierCapacityChart />
        </div>
      )}

      {/* TAB 3: MANIFESTS */}
      {activeTab === 'manifests' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-black font-retro-heading">Delivery Manifests & Tamper Seals</h2>
          <div className="bg-white p-6 rounded-2xl border border-gray-200 space-y-3 text-xs font-medium">
            <div className="flex justify-between py-2 border-b">
              <span>Air Waybill Manifest:</span>
              <span className="font-mono font-bold text-black">AWB-KGL-88291</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span>Tamper Security Code:</span>
              <span className="font-mono font-bold text-black">QR-SEAL-9920</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: COURIER PROFILE */}
      {activeTab === 'profile' && (
        <div className="bg-white p-8 rounded-3xl border border-gray-200 max-w-2xl mx-auto space-y-6 shadow-xs">
          <h2 className="text-2xl font-bold text-black font-retro-heading">Air Courier Passport & PNR Profile</h2>
          <div className="space-y-4 text-xs font-medium">
            <div>
              <label className="font-bold text-black uppercase block mb-1">Full Name (Traveler Passport)</label>
              <input type="text" disabled value={user?.full_name || 'David Mugisha'} className="w-full p-3 bg-gray-50 border rounded-xl font-bold text-sm text-black" />
            </div>
            <div>
              <label className="font-bold text-black uppercase block mb-1">Passport Verification Status</label>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 font-bold text-black">KYC Verified</div>
            </div>
          </div>
        </div>
      )}

      {/* Post Trip Modal */}
      {isTripModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs font-sans">
          <div className="bg-white rounded-2xl max-w-lg w-full p-8 space-y-5 shadow-2xl relative border border-gray-200">
            <button onClick={() => setIsTripModalOpen(false)} className="absolute top-4 right-4 text-black hover:opacity-60 cursor-pointer">
              <X size={20} />
            </button>

            <div className="space-y-1">
              <h3 className="text-2xl font-black text-[#111111] font-retro-heading uppercase">Post Baggage Capacity</h3>
              <p className="text-xs text-gray-500 font-medium">List available baggage allowance on passenger flights.</p>
            </div>

            <form onSubmit={handleCreateTrip} className="space-y-4 text-xs font-medium">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-[#111111] uppercase block mb-1">Flight Number</label>
                  <input
                    type="text"
                    required
                    value={flightNumber}
                    onChange={(e) => setFlightNumber(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl font-mono font-bold text-sm"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#111111] uppercase block mb-1">Airline</label>
                  <input
                    type="text"
                    required
                    value={airline}
                    onChange={(e) => setAirline(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl font-bold text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-[#111111] uppercase block mb-1">Departure Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl font-bold text-sm"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#111111] uppercase block mb-1">Spare (kg)</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={capacityKg}
                    onChange={(e) => setCapacityKg(parseFloat(e.target.value))}
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl font-bold text-sm"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#111111] uppercase block mb-1">Rate/kg ($)</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={rateCad}
                    onChange={(e) => setRateCad(parseFloat(e.target.value))}
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl font-bold text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-black hover:bg-gray-800 text-white font-bold py-4 rounded-xl text-xs uppercase tracking-widest cursor-pointer shadow-md transition"
              >
                Post Baggage Trip to Registry
              </button>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
