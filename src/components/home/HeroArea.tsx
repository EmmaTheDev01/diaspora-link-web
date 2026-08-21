'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plane,
  Package,
  Search,
  ArrowRight,
  ShieldCheck,
  Scale,
  QrCode,
  Truck,
  CheckCircle2,
  Sparkles,
  Luggage,
  Lock,
} from 'lucide-react';
import { SendCargoWizardModal } from './SendCargoWizardModal';
import { PackageDetailModal } from './PackageDetailModal';
import { dbService } from '@/services/db';
import { CargoPackage } from '@/types';
import { useAuthStore } from '@/store/useAuthStore';
import toast from 'react-hot-toast';

export function HeroArea() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'send' | 'track'>('send');

  // Calculator State
  const [weightKg, setWeightKg] = useState<number>(15.0);
  const [originCity, setOriginCity] = useState('Toronto (Canada)');
  const [destinationCity, setDestinationCity] = useState('Kampala (Uganda)');

  // Tracking Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [foundPackage, setFoundPackage] = useState<CargoPackage | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [dbAwbList, setDbAwbList] = useState<string[]>([]);

  // Modals
  const [isSendWizardOpen, setIsSendWizardOpen] = useState(false);
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
  const [selectedPackageData, setSelectedPackageData] = useState<CargoPackage | null>(null);

  React.useEffect(() => {
    async function fetchRealAwbs() {
      const pkgs = await dbService.getCargoPackages();
      if (pkgs && pkgs.length > 0) {
        setDbAwbList(pkgs.slice(0, 4).map((p) => p.awb_number));
      } else {
        setDbAwbList([]);
      }
    }
    fetchRealAwbs();
  }, []);

  // Quote Math
  const ratePerKgCad = 14.0;
  const cargoCostCad = Number((weightKg * ratePerKgCad).toFixed(2));
  const pickupFeeCad = 25.0;
  const totalQuoteCad = Number((cargoCostCad + pickupFeeCad).toFixed(2));
  const totalQuoteRwf = Math.round(totalQuoteCad * 1233.33);

  const router = useRouter();

  const handleBookCargoClick = () => {
    const draftData = {
      originCity,
      destinationCity,
      weightKg,
      ratePerKgCad,
      pickupFeeCad,
      totalQuoteCad,
      totalQuoteRwf,
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem('nile_draft_cargo', JSON.stringify(draftData));
    }

    if (!user) {
      toast.success('Cargo calculation saved! Redirecting to sign in...');
      router.push('/login?redirect=/buyer?action=send_cargo');
    } else {
      setIsSendWizardOpen(true);
      toast.success(`Booking cargo quote for ${weightKg} KG (${originCity} ✈ ${destinationCity})!`);
    }
  };




  const handleTrackSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) {
      toast.error('Please enter an AWB tracking number or recipient phone.');
      return;
    }
    setIsSearching(true);
    const pkg = await dbService.getCargoPackageByAwbOrPhone(searchQuery);
    setIsSearching(false);

    if (pkg) {
      setFoundPackage(pkg);
      setSelectedPackageData(pkg);
      toast.success(`Found package AWB: ${pkg.awb_number}`);
    } else {
      setFoundPackage(null);
      toast.error('No package found matching that AWB number or Phone.');
    }
  };

  const handleSampleChipClick = async (awb: string) => {
    setSearchQuery(awb);
    setIsSearching(true);
    const pkg = await dbService.getCargoPackageByAwbOrPhone(awb);
    setIsSearching(false);
    if (pkg) {
      setFoundPackage(pkg);
      setSelectedPackageData(pkg);
    }
  };

  return (
    <section className="py-8 px-4 lg:px-8 max-w-7xl mx-auto font-sans text-black">
      {/* Container with Light Background (NO Black Container!) */}
      <div className="bg-white border-2 border-black rounded-3xl p-6 sm:p-10 shadow-lg space-y-8">
        {/* Top Header Badge & Navigation Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-6">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="bg-[#014485] text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded font-mono">
                NILE CARGO NETWORK
              </span>
              <span className="text-xs font-bold text-gray-600 font-mono">
                Canada ✈ East Africa Door-to-Door
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-black font-retro-heading">
              Export & Import Door-to-Door Cargo Platform
            </h1>
          </div>

          {/* Dual Tab Switcher */}
          <div className="bg-gray-100 p-1.5 rounded-2xl border border-black flex space-x-1 shrink-0">
            <button
              onClick={() => setActiveTab('send')}
              className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center space-x-2 ${
                activeTab === 'send'
                  ? 'bg-[#014485] text-white shadow-md'
                  : 'text-black hover:bg-gray-200'
              }`}
            >
              <Plane className="w-4 h-4" />
              <span>SEND CARGO (EXPORT)</span>
            </button>

            <button
              onClick={() => setActiveTab('track')}
              className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center space-x-2 ${
                activeTab === 'track'
                  ? 'bg-[#014485] text-white shadow-md'
                  : 'text-black hover:bg-gray-200'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>RECEIVE & TRACK (IMPORT)</span>
            </button>
          </div>
        </div>

        {/* TAB 1: SENDER HUB (EXPORT) */}
        {activeTab === 'send' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left 7 cols: Rate Calculator & Route Selector */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-black text-black font-retro-heading">
                  1. Instant Air Cargo Rate Calculator
                </h2>
                <p className="text-xs text-gray-600 font-medium">
                  Select pickup origin and destination. We calculate transparent rates ($14/kg) with photo intake and passenger courier assignment.
                </p>
              </div>

              {/* Route Selector Dropdowns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1 font-mono">
                    Origin Collection
                  </label>
                  <select
                    value={originCity}
                    onChange={(e) => setOriginCity(e.target.value)}
                    className="w-full p-3 bg-gray-50 border-2 border-black rounded-xl text-xs font-mono font-bold"
                  >
                    <option value="Toronto (Canada)">Toronto (Pearson YYZ Hub)</option>
                    <option value="Kigali (Rwanda)">Kigali (KGL Hub)</option>
                    <option value="Kampala (Uganda)">Kampala (Entebbe EBB Hub)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1 font-mono">
                    Destination Doorstep
                  </label>
                  <select
                    value={destinationCity}
                    onChange={(e) => setDestinationCity(e.target.value)}
                    className="w-full p-3 bg-gray-50 border-2 border-black rounded-xl text-xs font-mono font-bold"
                  >
                    <option value="Kampala (Uganda)">Kampala (Uganda)</option>
                    <option value="Kigali (Rwanda)">Kigali (Rwanda)</option>
                    <option value="Toronto (Canada)">Toronto (Canada)</option>
                  </select>
                </div>
              </div>

              {/* Package Weight Slider */}
              <div className="bg-gray-50 p-5 rounded-2xl border border-black space-y-3">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="font-bold uppercase">Package Weight (KG):</span>
                  <span className="text-sm font-black bg-[#17993b] text-white px-3 py-1 rounded">
                    {weightKg} KG
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  step="0.5"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#014485]"
                />
                <div className="flex justify-between text-[11px] text-gray-500 font-mono font-medium">
                  <span>1 KG Envelope</span>
                  <span>25 KG Luggage</span>
                  <span>50 KG Commercial Box</span>
                  <span>100 KG Max</span>
                </div>
              </div>
            </div>

            {/* Right 5 cols: Instant Quote Breakdown Card */}
            <div className="lg:col-span-5 bg-gray-50 p-6 rounded-3xl border-2 border-black space-y-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-300 pb-3">
                <span className="text-xs font-black uppercase font-mono">Estimated Air Freight</span>
                <span className="text-[10px] bg-[#17993b] text-white px-2.5 py-0.5 rounded font-mono font-bold">
                  Escrow Protected
                </span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between text-gray-700">
                  <span>Air Freight ({weightKg} kg × $14.00):</span>
                  <span className="font-bold text-black">${cargoCostCad.toFixed(2)} CAD</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Home Pickup (Toronto):</span>
                  <span className="font-bold text-black">${pickupFeeCad.toFixed(2)} CAD</span>
                </div>
                <div className="border-t border-gray-300 pt-3 flex justify-between items-end">
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase block font-bold">Total Estimated Cost</span>
                    <span className="text-xl font-black text-[#014485]">${totalQuoteCad.toFixed(2)} CAD</span>
                  </div>
                  <span className="text-xs font-bold text-gray-600">({totalQuoteRwf.toLocaleString()} RWF)</span>
                </div>
              </div>

              <button
                onClick={handleBookCargoClick}
                className="w-full py-3.5 bg-[#014485] hover:bg-[#013467] text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer"
              >
                {!user && <Lock className="w-4 h-4 text-white" />}
                <span>BOOK CARGO & ASSIGN COURIER</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: RECEIVER HUB (IMPORT & TRACKING) */}
        {activeTab === 'track' && (
          <div className="space-y-6">
            <div className="max-w-2xl mx-auto text-center space-y-2">
              <h2 className="text-xl sm:text-2xl font-black text-black font-retro-heading">
                Import Cargo Tracking & Recipient PIN Release
              </h2>
              <p className="text-xs text-gray-600 font-medium">
                Enter AWB number or recipient phone to view photos, live flight milestone timeline, and verify delivery.
              </p>

              {/* Search Bar Form */}
              <form onSubmit={handleTrackSearch} className="flex gap-2 pt-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter AWB (e.g. NE-CA-892104) or Phone (+256...)..."
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-black rounded-xl text-xs font-mono font-bold focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSearching}
                  className="px-6 py-3 bg-black text-white font-black text-xs uppercase tracking-wider rounded-xl hover:bg-gray-800 transition-colors shadow-md"
                >
                  {isSearching ? 'SEARCHING...' : 'TRACK'}
                </button>
              </form>

              {/* Real Database AWBs */}
              {dbAwbList.length > 0 && (
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs">
                  <span className="text-gray-500 font-bold">Active Cargo AWBs:</span>
                  {dbAwbList.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => handleSampleChipClick(chip)}
                      className="px-2.5 py-1 bg-gray-100 hover:bg-black hover:text-white border border-gray-300 rounded-md font-mono text-[11px] font-bold transition-all"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}

            </div>

            {/* Found Package Result Card */}
            {foundPackage && (
              <div className="max-w-2xl mx-auto bg-gray-50 p-5 rounded-2xl border-2 border-black space-y-4 shadow-sm animate-in fade-in">
                <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                  <div>
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider font-mono">AWB TRACKING NUMBER</span>
                    <h3 className="text-lg font-black text-black font-mono">{foundPackage.awb_number}</h3>
                  </div>
                  <span className="text-xs font-bold bg-black text-white px-3 py-1 rounded-full font-mono">
                    {foundPackage.current_stage}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-gray-500 block">Sender</span>
                    <span className="font-bold text-black">{foundPackage.sender.full_name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 block">Receiver</span>
                    <span className="font-bold text-black">{foundPackage.receiver.full_name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 block">Assigned Courier</span>
                    <span className="font-bold text-black">{foundPackage.courier_name || 'RwandAir Courier'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 block">Status</span>
                    <span className="font-bold text-black">{foundPackage.stage_title}</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsPackageModalOpen(true)}
                  className="w-full py-2.5 bg-black hover:bg-gray-800 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all font-mono"
                >
                  VIEW FULL PHOTOS & 6-STAGE TIMELINE
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Booking Wizard Modal */}
      <SendCargoWizardModal

        isOpen={isSendWizardOpen}
        onClose={() => setIsSendWizardOpen(false)}
        onSuccess={(createdPkg) => {
          setSelectedPackageData(createdPkg);
          setIsPackageModalOpen(true);
        }}
      />

      {/* Package Detail Modal */}
      <PackageDetailModal
        isOpen={isPackageModalOpen}
        packageData={selectedPackageData}
        onClose={() => setIsPackageModalOpen(false)}
        onAdvanceStage={async (awb, stage) => {
          const updated = await dbService.updateCargoPackageStage(awb, stage);
          if (updated) {
            setSelectedPackageData({ ...updated });
          }
        }}
      />
    </section>
  );
}
