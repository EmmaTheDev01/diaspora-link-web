'use client';
import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { dbService } from '@/services/db';
import { CarrierTrip, CargoPackage, CargoStageCode } from '@/types';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { CourierCapacityChart } from '@/components/charts/CourierCapacityChart';
import { PackageDetailModal } from '@/components/home/PackageDetailModal';
import { Plane, Plus, Luggage, X, ShieldCheck, User, Settings, CreditCard, Package, CheckCircle2, QrCode } from 'lucide-react';
import toast from 'react-hot-toast';

import { StatCardSkeleton, TableRowSkeleton } from '@/components/common/Skeleton';

export default function LogisticsPage() {
  const { user, currency } = useAuthStore();
  const [activeTab, setActiveTab] = useState('cargo');
  const [trips, setTrips] = useState<CarrierTrip[]>([]);
  const [cargoPackages, setCargoPackages] = useState<CargoPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTripModalOpen, setIsTripModalOpen] = useState(false);

  // Selected package for detail modal
  const [selectedPkg, setSelectedPkg] = useState<CargoPackage | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [editingTripId, setEditingTripId] = useState<string | null>(null);
  const [flightNumber, setFlightNumber] = useState('WB 302');
  const [airline, setAirline] = useState('RwandAir');
  const [departureAirport, setDepartureAirport] = useState('YYZ');
  const [arrivalAirport, setArrivalAirport] = useState('KGL');
  const [date, setDate] = useState('2026-09-15');
  const [boardingTime, setBoardingTime] = useState('14:30 EST');
  const [landingTime, setLandingTime] = useState('08:15 CAT (+1 day)');
  const [flightDurationHours, setFlightDurationHours] = useState(13.5);
  const [itineraryNotes, setItineraryNotes] = useState('Direct express flight from Toronto Pearson (YYZ) to Kigali (KGL)');
  const [courierPhone, setCourierPhone] = useState(user?.phone_number || '+250 788 901 234');
  const [courierWhatsapp, setCourierWhatsapp] = useState(user?.phone_number || '+250 788 901 234');
  const [capacityKg, setCapacityKg] = useState(40.0);
  const [rateCad, setRateCad] = useState(14.0);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const tripData = await dbService.getCarrierTrips();
      const pkgData = await dbService.getCargoPackages();
      setTrips(tripData);
      setCargoPackages(pkgData);
      setLoading(false);
    }
    loadData();
  }, []);

  const openEditTripModal = (trip: CarrierTrip) => {
    setEditingTripId(trip.id);
    setFlightNumber(trip.flight_number);
    setAirline(trip.airline);
    setDepartureAirport(trip.departure_airport);
    setArrivalAirport(trip.arrival_airport);
    setDate(trip.departure_date);
    setBoardingTime(trip.boarding_time || '14:30 EST');
    setLandingTime(trip.landing_time || '08:15 CAT');
    setFlightDurationHours(trip.flight_duration_hours || 13.5);
    setItineraryNotes(trip.itinerary_notes || '');
    setCourierPhone(trip.courier_phone || user?.phone_number || '+250 788 901 234');
    setCourierWhatsapp(trip.courier_whatsapp || user?.phone_number || '+250 788 901 234');
    setCapacityKg(trip.total_capacity_kg);
    setRateCad(trip.rate_per_kg_cad);
    setIsTripModalOpen(true);
  };

  const handleSaveTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTripId) {
      const updated = await dbService.updateCarrierTrip(editingTripId, {
        flight_number: flightNumber,
        airline,
        departure_airport: departureAirport,
        arrival_airport: arrivalAirport,
        departure_date: date,
        boarding_time: boardingTime,
        landing_time: landingTime,
        flight_duration_hours: flightDurationHours,
        itinerary_notes: itineraryNotes,
        courier_phone: courierPhone,
        courier_whatsapp: courierWhatsapp,
        total_capacity_kg: capacityKg,
        available_capacity_kg: capacityKg,
        rate_per_kg_cad: rateCad,
      });

      if (updated) {
        setTrips(trips.map((t) => (t.id === editingTripId ? updated : t)));
      }
      toast.success('Flight baggage trip updated successfully!');
    } else {
      const created = await dbService.createCarrierTrip({
        courier_id: user?.id || 'usr_courier_1',
        courier_name: user?.full_name || 'Passenger Courier',
        courier_phone: courierPhone,
        courier_whatsapp: courierWhatsapp,
        courier_email: user?.email || 'courier@diaspora.ca',
        flight_number: flightNumber,
        airline,
        departure_airport: departureAirport,
        arrival_airport: arrivalAirport,
        departure_date: date,
        boarding_time: boardingTime,
        landing_time: landingTime,
        flight_duration_hours: flightDurationHours,
        itinerary_notes: itineraryNotes,
        total_capacity_kg: capacityKg,
        available_capacity_kg: capacityKg,
        rate_per_kg_cad: rateCad,
        rate_per_kg_rwf: Math.round(rateCad * 1233.33),
      });

      setTrips([created, ...trips]);
      toast.success(`Flight trip ${created.flight_number} posted to carrier network!`);
    }

    setIsTripModalOpen(false);
    setEditingTripId(null);
  };


  const handleUpdateStage = async (awb: string, nextStage: CargoStageCode) => {
    const updated = await dbService.updateCargoPackageStage(awb, nextStage);
    if (updated) {
      setCargoPackages(cargoPackages.map((p) => (p.awb_number === awb ? { ...updated } : p)));
      if (selectedPkg?.awb_number === awb) {
        setSelectedPkg({ ...updated });
      }
      toast.success(`Package ${awb} stage updated to ${nextStage}!`);
    }
  };

  const menuItems = [
    { id: 'cargo', label: 'Assigned Cargo Parcels', icon: <Package size={18} /> },
    { id: 'trips', label: 'Travel & Trips', icon: <Plane size={18} /> },
    { id: 'analytics', label: 'Capacity Analytics', icon: <Luggage size={18} /> },
    { id: 'profile', label: 'Courier Profile', icon: <User size={18} /> },
  ];

  const totalCapacityUsed = cargoPackages.reduce((acc, p) => acc + p.weight_kg, 0);

  return (
    <DashboardLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      menuItems={menuItems}
      title={user?.full_name || 'David Mugisha (Air Courier)'}
      subtitle="Luggage Courier Portal • RwandAir Flight Baggage Allowance • KGL ✈ YYZ Corridor"
    >
      {/* TAB 1: ASSIGNED CARGO PARCELS */}
      {activeTab === 'cargo' && (
        <div className="space-y-8 text-black font-sans">
          <div className="bg-white border-2 border-black p-6 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-md">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest bg-[#014485] text-white px-3 py-1 rounded font-mono">
                  COURIER DASHBOARD
                </span>

                <span className="text-xs font-mono font-bold text-gray-600">RwandAir Flight WB 302</span>
              </div>
              <h2 className="text-2xl font-black font-retro-heading">Assigned Export Parcels ({cargoPackages.length})</h2>
              <p className="text-xs text-gray-600 font-medium">Parcels assigned to your flight baggage allowance. Review weight limits and update delivery stages.</p>
            </div>

            <div className="bg-gray-100 p-4 rounded-2xl border border-black text-xs font-mono">
              <span className="text-gray-500 block font-bold">Trip Capacity Loaded</span>
              <span className="text-lg font-black text-black">{totalCapacityUsed.toFixed(1)} KG / 36.5 KG</span>
            </div>
          </div>

          {/* Cargo Packages Table */}
          <div className="bg-white rounded-2xl border-2 border-black overflow-hidden shadow-sm">
            <div className="p-4 bg-gray-100 border-b border-black flex justify-between items-center">
              <h3 className="font-bold text-sm font-retro-heading">Assigned Cargo Packages List</h3>
              <span className="text-xs text-gray-600 font-mono">Schema `cargo_packages`</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-medium">
                <thead className="bg-[#014485] text-white font-bold uppercase tracking-wider text-[11px] font-mono">

                  <tr>
                    <th className="p-4">AWB / QR Seal</th>
                    <th className="p-4">Sender & ID</th>
                    <th className="p-4">Receiver & Phone</th>
                    <th className="p-4">Weight (KG)</th>
                    <th className="p-4">Stage Status</th>
                    <th className="p-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {cargoPackages.map((pkg) => (
                    <tr key={pkg.id} className="hover:bg-gray-50 transition">
                      <td className="p-4 font-mono font-bold text-black">
                        <div>{pkg.awb_number}</div>
                        <div className="text-[10px] text-gray-500">{pkg.qr_seal_code}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold">{pkg.sender.full_name}</div>
                        <div className="text-[10px] text-gray-500 font-mono">{pkg.sender_id_type?.toUpperCase()}: {pkg.sender_id_number}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold">{pkg.receiver.full_name} ({pkg.receiver.city})</div>
                        <div className="text-[10px] text-gray-500 font-mono">{pkg.receiver.whatsapp}</div>
                      </td>
                      <td className="p-4 font-bold font-mono text-black">{pkg.weight_kg} KG</td>
                      <td className="p-4">
                        <span className="bg-black text-white font-bold px-2 py-0.5 text-[10px] rounded font-mono">
                          {pkg.current_stage}
                        </span>
                      </td>
                      <td className="p-4 space-x-1">
                        <button
                          onClick={() => {
                            setSelectedPkg(pkg);
                            setIsDetailModalOpen(true);
                          }}
                          className="px-3 py-1 bg-black text-white text-[11px] font-bold rounded hover:bg-gray-800 font-mono"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TRAVEL & TRIPS */}
      {activeTab === 'trips' && (
        <div className="space-y-8 text-black font-sans">
          <div className="bg-white border-2 border-black p-6 rounded-3xl flex justify-between items-center shadow-md">
            <div>
              <h2 className="text-2xl font-black font-retro-heading">Passenger Flight Baggage Trips</h2>
              <p className="text-xs text-gray-600">Monetise spare baggage capacity carrying verified export parcels on `KGL ✈ YYZ` flights.</p>
            </div>
            <button
              onClick={() => setIsTripModalOpen(true)}
              className="bg-black text-white font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-mono hover:bg-gray-800"
            >
              + Post Flight Trip
            </button>
          </div>

          <div className="bg-white rounded-2xl border-2 border-black overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-medium">
                <thead className="bg-[#014485] text-white font-bold uppercase tracking-wider text-[11px] font-mono">

                  <tr>
                    <th className="p-4">Flight / Airline</th>
                    <th className="p-4">Departure Date</th>
                    <th className="p-4">Route</th>
                    <th className="p-4">Capacity</th>
                    <th className="p-4">Freight Rate</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {trips.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-50">
                      <td className="p-4 font-mono font-bold text-black">
                        <div>{t.flight_number} ({t.airline})</div>
                        <div className="text-[10px] text-gray-500 font-medium">{t.itinerary_notes || 'Express Flight'}</div>
                      </td>
                      <td className="p-4 font-bold font-mono">
                        <div>{t.departure_date}</div>
                        <div className="text-[10px] text-gray-500">{t.boarding_time || '14:30 EST'} ✈ {t.landing_time || '08:15 CAT'}</div>
                      </td>
                      <td className="p-4 font-bold uppercase font-mono">
                        <div>{t.departure_airport} ✈ {t.arrival_airport}</div>
                        <div className="text-[10px] text-gray-500">{t.flight_duration_hours || 13.5} hrs flight</div>
                      </td>
                      <td className="p-4 font-bold font-mono">{t.available_capacity_kg} kg / {t.total_capacity_kg} kg</td>
                      <td className="p-4 font-bold font-mono">${t.rate_per_kg_cad.toFixed(2)} / kg</td>
                      <td className="p-4">
                        <span className="bg-black text-white font-bold px-2 py-0.5 rounded text-[10px] font-mono uppercase">{t.status}</span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => openEditTripModal(t)}
                          className="px-3 py-1 bg-black hover:bg-gray-800 text-white font-mono text-[11px] font-black rounded-lg transition-all"
                        >
                          EDIT TRIP
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CAPACITY ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6 text-black font-sans">
          <div className="bg-white border-2 border-black p-6 rounded-3xl shadow-md">
            <h2 className="text-xl font-black font-retro-heading">Baggage Capacity Analytics</h2>
            <p className="text-xs text-gray-600 font-medium">Overview of flight baggage monetization across your active flight trips.</p>
          </div>
          <CourierCapacityChart />
        </div>
      )}

      {/* TAB 4: PROFILE */}
      {activeTab === 'profile' && (
        <div className="bg-white border-2 border-black p-6 rounded-3xl shadow-md text-black font-sans space-y-4">
          <h2 className="text-xl font-black font-retro-heading">Air Courier Identity Profile</h2>
          <div className="grid grid-cols-2 gap-4 text-xs font-mono">
            <div className="bg-gray-50 p-3 rounded-xl border border-black">
              <span className="text-gray-500 block">Courier Name</span>
              <span className="font-bold text-black">{user?.full_name || 'David Mugisha'}</span>
            </div>
            <div className="bg-gray-50 p-3 rounded-xl border border-black">
              <span className="text-gray-500 block">Verification Status</span>
              <span className="font-bold text-black">KYC & Passport Verified</span>
            </div>
          </div>
        </div>
      )}

      {/* Post / Edit Trip Modal */}
      {isTripModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-3xl border-2 border-black max-w-lg w-full text-black space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-black pb-3">
              <div>
                <h3 className="font-black text-base font-retro-heading">
                  {editingTripId ? 'Edit Flight Baggage Trip' : 'Post New Flight Baggage Trip'}
                </h3>
                <p className="text-xs text-gray-600 font-mono">Monetize your unused airline luggage capacity</p>
              </div>
              <button onClick={() => { setIsTripModalOpen(false); setEditingTripId(null); }}>
                <X className="w-5 h-5 text-black" />
              </button>
            </div>

            <form onSubmit={handleSaveTrip} className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1 font-mono">Airline Name *</label>
                  <input
                    type="text"
                    value={airline}
                    onChange={(e) => setAirline(e.target.value)}
                    className="w-full p-2.5 border border-black rounded-xl font-mono"
                    placeholder="RwandAir / Air Canada"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1 font-mono">Flight Number *</label>
                  <input
                    type="text"
                    value={flightNumber}
                    onChange={(e) => setFlightNumber(e.target.value)}
                    className="w-full p-2.5 border border-black rounded-xl font-mono"
                    placeholder="WB 302 / AC 840"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1 font-mono">Departure Airport *</label>
                  <input
                    type="text"
                    value={departureAirport}
                    onChange={(e) => setDepartureAirport(e.target.value.toUpperCase())}
                    className="w-full p-2.5 border border-black rounded-xl font-mono uppercase"
                    placeholder="YYZ (Toronto)"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1 font-mono">Arrival Airport *</label>
                  <input
                    type="text"
                    value={arrivalAirport}
                    onChange={(e) => setArrivalAirport(e.target.value.toUpperCase())}
                    className="w-full p-2.5 border border-black rounded-xl font-mono uppercase"
                    placeholder="KGL (Kigali)"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1 font-mono">Departure Date *</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2.5 border border-black rounded-xl font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1 font-mono">Flight Duration (Hours) *</label>
                  <input
                    type="number"
                    step="0.5"
                    value={flightDurationHours}
                    onChange={(e) => setFlightDurationHours(Number(e.target.value))}
                    className="w-full p-2.5 border border-black rounded-xl font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1 font-mono">Boarding Time *</label>
                  <input
                    type="text"
                    value={boardingTime}
                    onChange={(e) => setBoardingTime(e.target.value)}
                    className="w-full p-2.5 border border-black rounded-xl font-mono"
                    placeholder="14:30 EST"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1 font-mono">Landing Time *</label>
                  <input
                    type="text"
                    value={landingTime}
                    onChange={(e) => setLandingTime(e.target.value)}
                    className="w-full p-2.5 border border-black rounded-xl font-mono"
                    placeholder="08:15 CAT (+1 day)"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1 font-mono">Itinerary & Route Details</label>
                <input
                  type="text"
                  value={itineraryNotes}
                  onChange={(e) => setItineraryNotes(e.target.value)}
                  className="w-full p-2.5 border border-black rounded-xl font-mono text-xs"
                  placeholder="e.g. Direct express flight YYZ to KGL via RwandAir / Brussels Transit"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1 font-mono">Courier Phone Number *</label>
                  <input
                    type="text"
                    value={courierPhone}
                    onChange={(e) => setCourierPhone(e.target.value)}
                    className="w-full p-2.5 border border-black rounded-xl font-mono"
                    placeholder="+250 788 901 234"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1 font-mono">WhatsApp Number *</label>
                  <input
                    type="text"
                    value={courierWhatsapp}
                    onChange={(e) => setCourierWhatsapp(e.target.value)}
                    className="w-full p-2.5 border border-black rounded-xl font-mono"
                    placeholder="+250 788 901 234"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1 font-mono">Baggage Capacity (KG) *</label>
                  <input
                    type="number"
                    value={capacityKg}
                    onChange={(e) => setCapacityKg(Number(e.target.value))}
                    className="w-full p-2.5 border border-black rounded-xl font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1 font-mono">Freight Rate ($/KG) *</label>
                  <input
                    type="number"
                    step="0.5"
                    value={rateCad}
                    onChange={(e) => setRateCad(Number(e.target.value))}
                    className="w-full p-2.5 border border-black rounded-xl font-mono"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-black hover:bg-gray-800 text-white font-mono font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer"
              >
                {editingTripId ? 'SAVE FLIGHT TRIP CHANGES' : 'POST FLIGHT TRIP TO CARRIER NETWORK'}
              </button>
            </form>
          </div>
        </div>
      )}


      {/* Package Detail Modal */}
      <PackageDetailModal
        isOpen={isDetailModalOpen}
        packageData={selectedPkg}
        onClose={() => setIsDetailModalOpen(false)}
        onAdvanceStage={handleUpdateStage}
      />
    </DashboardLayout>
  );
}
