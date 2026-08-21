'use client';
import React, { useState, useEffect } from 'react';
import {
  X,
  Package,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Upload,
  ShieldCheck,
  Plane,
  Truck,
  Scale,
  User,
  Phone,
  MapPin,
  FileText,
  Camera,
  QrCode,
  Sparkles,
  Plus,
  Trash2,
  Luggage,
  ShoppingBag,
} from 'lucide-react';
import { dbService } from '@/services/db';
import { CargoPackage, CargoType, CarrierTrip, PackageContentItem, UserProfile } from '@/types';
import { useAuthStore } from '@/store/useAuthStore';
import toast from 'react-hot-toast';

interface SendCargoWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (pkg: CargoPackage) => void;
  initialDraft?: {
    originCity?: string;
    destinationCity?: string;
    weightKg?: number;
    totalQuoteCad?: number;
    totalQuoteRwf?: number;
  };
}

export function SendCargoWizardModal({ isOpen, onClose, onSuccess, initialDraft }: SendCargoWizardModalProps) {
  const { user } = useAuthStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Sender Details & Identification (Hydrated from Auth User Profile)
  const [senderName, setSenderName] = useState(user?.full_name || '');
  const [senderEmail, setSenderEmail] = useState(user?.email || '');
  const [senderPhone, setSenderPhone] = useState(user?.phone_number || '');
  const [senderCity, setSenderCity] = useState(initialDraft?.originCity?.split(' ')[0] || 'Toronto');
  const [senderCountry, setSenderCountry] = useState('CA');
  const [senderAddress, setSenderAddress] = useState('');
  const [senderIdType, setSenderIdType] = useState<'passport' | 'national_id' | 'drivers_license'>('passport');
  const [senderIdNumber, setSenderIdNumber] = useState('');

  // Receiver Details
  const [receiverName, setReceiverName] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [receiverWhatsapp, setReceiverWhatsapp] = useState('');
  const [receiverCity, setReceiverCity] = useState(initialDraft?.destinationCity?.split(' ')[0] || 'Kampala');
  const [receiverCountry, setReceiverCountry] = useState('UG');
  const [receiverAddress, setReceiverAddress] = useState('');

  // Itemized Cargo List (Clean Production State)
  const [items, setItems] = useState<PackageContentItem[]>([]);
  const [itemSourceMode, setItemSourceMode] = useState<'custom' | 'marketplace'>('custom');
  const [marketplaceItems, setMarketplaceItems] = useState<PackageContentItem[]>([]);

  const [newItemName, setNewItemName] = useState('');
  const [newItemQty, setNewItemQty] = useState(1);
  const [newItemWeight, setNewItemWeight] = useState(2.5);
  const [newItemCategory, setNewItemCategory] = useState<CargoType>('personal_effects');

  // Package Photos & Upload (Clean Production State)
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [packageImages, setPackageImages] = useState<string[]>([]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);


  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploadingImage(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const url = await dbService.uploadPackageImage(files[i]);
        setPackageImages((prev) => [...prev, url]);
      }
      toast.success('Parcel photo uploaded to Supabase Storage!');
    } catch (err) {
      toast.error('Image upload failed.');
    } finally {
      setIsUploadingImage(false);
    }
  };


  // Route & Package Weight State (Editable in Step 1)
  const [selectedWeightKg, setSelectedWeightKg] = useState<number>(initialDraft?.weightKg || 15.0);
  const [originHub, setOriginHub] = useState<string>(initialDraft?.originCity || 'Toronto (Pearson YYZ Hub)');
  const [destinationCity, setDestinationCity] = useState<string>(initialDraft?.destinationCity || 'Kampala (Uganda)');

  // System Courier & Flight Lookup
  const [courierProfiles, setCourierProfiles] = useState<{ user: UserProfile; trips: CarrierTrip[] }[]>([]);
  const [selectedCourierId, setSelectedCourierId] = useState<string>('usr_courier_1');
  const [selectedTripId, setSelectedTripId] = useState<string>('trip_101');
  const [tripsLoading, setTripsLoading] = useState(false);

  // Pickup & Transport
  const [pickupType, setPickupType] = useState<'home_pickup' | 'hub_dropoff'>('home_pickup');
  const [packagingType, setPackagingType] = useState<'standard' | 'reinforced' | 'fragile'>('standard');
  const [transportMode, setTransportMode] = useState<'Motorcycle' | 'Car' | 'Van' | 'Truck'>('Van');

  useEffect(() => {
    async function loadInitialData() {
      if (isOpen) {
        if (user) {
          if (user.full_name) setSenderName(user.full_name);
          if (user.email) setSenderEmail(user.email);
          if (user.phone_number) setSenderPhone(user.phone_number);
        }
        if (typeof window !== 'undefined') {
          const saved = localStorage.getItem('nile_draft_cargo');
          if (saved) {
            try {
              const parsed = JSON.parse(saved);
              if (parsed.weightKg) setSelectedWeightKg(parsed.weightKg);
              if (parsed.originCity) setOriginHub(parsed.originCity);
              if (parsed.destinationCity) {
                setDestinationCity(parsed.destinationCity);
                setReceiverCity(parsed.destinationCity.split(' ')[0]);
              }
            } catch (e) {}
          }
        }
        setTripsLoading(true);
        const mkItems = await dbService.getOrderedMarketplaceItems();
        const couriers = await dbService.getSystemCouriers();
        setMarketplaceItems(mkItems);
        setCourierProfiles(couriers);
        if (couriers.length > 0) {
          setSelectedCourierId(couriers[0].user.id);
          if (couriers[0].trips.length > 0) {
            setSelectedTripId(couriers[0].trips[0].id);
          }
        }
        setTripsLoading(false);
      }
    }
    loadInitialData();
  }, [isOpen, user]);

  if (!isOpen) return null;

  const totalWeightKg = items.length > 0
    ? items.reduce((acc, i) => acc + (i.weight_kg * i.quantity), 0)
    : selectedWeightKg;


  // Find active courier user and flight trip
  const activeCourierGroup = courierProfiles.find((c) => c.user.id === selectedCourierId) || courierProfiles[0];
  const activeTrip = activeCourierGroup?.trips.find((t) => t.id === selectedTripId) || activeCourierGroup?.trips[0];

  const ratePerKgCad = activeTrip?.rate_per_kg_cad || 14.0;
  const pickupFeeCad = pickupType === 'home_pickup' ? 25.0 : 0.0;
  const packagingFeeCad = packagingType === 'reinforced' ? 15.0 : packagingType === 'fragile' ? 20.0 : 0.0;
  const cargoCostCad = Number((totalWeightKg * ratePerKgCad).toFixed(2));
  const totalCostCad = Number((cargoCostCad + pickupFeeCad + packagingFeeCad).toFixed(2));
  const totalCostRwf = Math.round(totalCostCad * 1233.33);

  const handleAddItem = () => {
    if (newItemName.trim()) {
      setItems([
        ...items,
        {
          id: `item_${Date.now()}`,
          name: newItemName.trim(),
          quantity: newItemQty,
          weight_kg: newItemWeight,
          category: newItemCategory,
        },
      ]);
      setNewItemName('');
      setNewItemQty(1);
      setNewItemWeight(2.5);
      toast.success('Cargo item added to list!');
    }
  };

  const handleAddMarketplaceItem = (mkItem: PackageContentItem) => {
    const exists = items.find((i) => i.name === mkItem.name);
    if (exists) {
      toast.error('Item already in package list.');
      return;
    }
    setItems([...items, { ...mkItem, id: `mk_${Date.now()}` }]);
    if (mkItem.image && !packageImages.includes(mkItem.image)) {
      setPackageImages((prev) => [...prev, mkItem.image!]);
    }
    toast.success(`Added ${mkItem.name} from Marketplace orders!`);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const handleAddImage = () => {
    if (imageUrlInput.trim()) {
      setPackageImages((prev) => [...prev, imageUrlInput.trim()]);
      setImageUrlInput('');
      toast.success('Package photo attached!');
    }
  };

  const handleRemoveImage = (index: number) => {
    setPackageImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitBooking = async () => {
    setLoading(true);
    try {
      const createdPkg = await dbService.createCargoPackage({
        description: items.map((i) => `${i.quantity}x ${i.name}`).join(', ') || 'Export Cargo Parcel',
        cargo_type: items[0]?.category || 'personal_effects',
        sender_id_type: senderIdType,
        sender_id_number: senderIdNumber,
        weight_kg: totalWeightKg > 0 ? totalWeightKg : 10,
        dimensions: { length_cm: 50, width_cm: 40, height_cm: 30 },
        declared_value_cad: 300,
        rate_per_kg_cad: ratePerKgCad,
        pickup_fee_cad: pickupFeeCad + packagingFeeCad,
        total_cost_cad: totalCostCad,
        total_cost_rwf: totalCostRwf,
        images: packageImages.length > 0 ? packageImages : [
          'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800',
        ],
        items,
        courier_id: activeCourierGroup?.user.id || 'usr_courier_1',
        courier_name: activeCourierGroup?.user.full_name || 'David Mugisha',
        carrier_trip_id: activeTrip?.id,
        flight_number: activeTrip?.flight_number || 'WB 302',
        sender: {
          full_name: senderName,
          email: senderEmail,
          phone: senderPhone,
          city: senderCity,
          country: senderCountry,
          address: senderAddress,
        },
        receiver: {
          full_name: receiverName,
          phone: receiverPhone,
          whatsapp: receiverWhatsapp,
          delivery_address: receiverAddress,
          city: receiverCity,
          country: receiverCountry,
        },
        transport_mode: transportMode,
        is_escrow_protected: true,
      });

      toast.success(`Cargo Booked! AWB ${createdPkg.awb_number} assigned to Courier ${activeCourierGroup?.user.full_name}`);
      onSuccess(createdPkg);
      onClose();
    } catch (e: any) {
      toast.error('Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-black flex flex-col max-h-[90vh] overflow-hidden text-black font-sans">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#014485] text-white flex items-center justify-between border-b border-blue-900">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white text-black rounded-xl">
              <Plane className="w-5 h-5 text-[#014485]" />
            </div>
            <div>
              <h2 className="text-base font-black uppercase tracking-wider font-mono text-white">Book Cargo & Assign System Courier</h2>
              <p className="text-xs text-blue-100 font-mono">Sender ID & System Courier Flight Assignment</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-blue-200 hover:text-white rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Progress Bar */}
        <div className="bg-gray-100 border-b border-gray-200 px-6 py-3">
          <div className="grid grid-cols-4 gap-2 text-xs font-bold text-gray-600">
            <div className={`flex items-center space-x-1.5 ${step >= 1 ? 'text-[#014485] font-black' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? 'bg-[#014485] text-white font-mono' : 'bg-gray-300'}`}>1</span>
              <span className="hidden sm:inline">Sender & ID</span>
            </div>
            <div className={`flex items-center space-x-1.5 ${step >= 2 ? 'text-[#014485] font-black' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-[#014485] text-white font-mono' : 'bg-gray-300'}`}>2</span>
              <span className="hidden sm:inline">Items & Photos</span>
            </div>
            <div className={`flex items-center space-x-1.5 ${step >= 3 ? 'text-[#014485] font-black' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 3 ? 'bg-[#014485] text-white font-mono' : 'bg-gray-300'}`}>3</span>
              <span className="hidden sm:inline">Assign Courier</span>
            </div>
            <div className={`flex items-center space-x-1.5 ${step >= 4 ? 'text-[#014485] font-black' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 4 ? 'bg-[#17993b] text-white font-mono' : 'bg-gray-300'}`}>4</span>
              <span className="hidden sm:inline">Escrow Summary</span>
            </div>
          </div>
          <div className="w-full bg-gray-200 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-[#014485] h-full transition-all duration-300" style={{ width: `${(step / 4) * 100}%` }} />
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* STEP 1: Route, Weight, Sender ID & Receiver Contact */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Route & Package Weight Selector (Editable in Step 1) */}
              <div className="bg-gray-50 border-2 border-[#014485] p-5 rounded-2xl space-y-4 shadow-sm">
                <div className="border-l-4 border-[#014485] pl-3 py-0.5">
                  <h3 className="text-sm font-black text-[#014485] flex items-center gap-2 font-mono uppercase">
                    <Scale className="w-4 h-4 text-[#014485]" /> Package Weight (KG) & Corridor Route Selection
                  </h3>
                  <p className="text-[11px] text-gray-600 font-medium">Select shipment origin, destination, and parcel weight in KG.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-bold mb-1 font-mono uppercase text-gray-700">Origin Collection Hub *</label>
                    <select
                      value={originHub}
                      onChange={(e) => setOriginHub(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg font-bold font-mono bg-white focus:outline-none focus:border-[#014485]"
                    >
                      <option value="Toronto (Pearson YYZ Hub)">Toronto (Pearson YYZ Hub)</option>
                      <option value="Kigali (KGL Hub)">Kigali (KGL Hub)</option>
                      <option value="Kampala (Entebbe EBB Hub)">Kampala (Entebbe EBB Hub)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold mb-1 font-mono uppercase text-gray-700">Destination Doorstep *</label>
                    <select
                      value={destinationCity}
                      onChange={(e) => {
                        setDestinationCity(e.target.value);
                        setReceiverCity(e.target.value.split(' ')[0]);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg font-bold font-mono bg-white focus:outline-none focus:border-[#014485]"
                    >
                      <option value="Kampala (Uganda)">Kampala (Uganda)</option>
                      <option value="Kigali (Rwanda)">Kigali (Rwanda)</option>
                      <option value="Toronto (Canada)">Toronto (Canada)</option>
                      <option value="Nairobi (Kenya)">Nairobi (Kenya)</option>
                    </select>
                  </div>
                </div>

                {/* Weight Slider */}
                <div className="space-y-2 pt-1">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="font-bold uppercase text-black">Package Weight (KG):</span>
                    <span className="text-sm font-black bg-[#17993b] text-white px-3 py-1 rounded">
                      {selectedWeightKg} KG
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    step="0.5"
                    value={selectedWeightKg}
                    onChange={(e) => setSelectedWeightKg(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#014485]"
                  />
                  <div className="flex justify-between text-[10px] text-gray-500 font-mono font-medium">
                    <span>1 KG Envelope</span>
                    <span>25 KG Luggage</span>
                    <span>50 KG Commercial Box</span>
                    <span>100 KG Max</span>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-[#014485] pl-3 py-1">
                <h3 className="text-base font-black text-black flex items-center gap-2 font-mono">
                  <User className="w-5 h-5 text-[#014485]" /> Sender Official Identification & Contact
                </h3>
                <p className="text-xs text-gray-600 font-medium">Required for air customs manifest compliance.</p>
              </div>


              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold mb-1">Sender Full Name *</label>
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Sender Phone Number *</label>
                  <input
                    type="text"
                    value={senderPhone}
                    onChange={(e) => setSenderPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Official ID Document Type *</label>
                  <select
                    value={senderIdType}
                    onChange={(e) => setSenderIdType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg font-bold"
                  >
                    <option value="passport">Passport</option>
                    <option value="national_id">National ID Card</option>
                    <option value="drivers_license">Driver's License</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1">Official ID / Passport Number *</label>
                  <input
                    type="text"
                    value={senderIdNumber}
                    onChange={(e) => setSenderIdNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono font-bold"
                    placeholder="P89420194"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-bold mb-1">Pickup Address (Canada / Origin) *</label>
                  <input
                    type="text"
                    value={senderAddress}
                    onChange={(e) => setSenderAddress(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              {/* Receiver Info */}
              <div className="border-l-4 border-[#014485] pl-3 py-1 pt-2">
                <h3 className="text-base font-black text-black flex items-center gap-2 font-mono">
                  <MapPin className="w-5 h-5 text-[#014485]" /> Receiver Contact & Destination
                </h3>
              </div>


              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold mb-1">Recipient Name *</label>
                  <input
                    type="text"
                    value={receiverName}
                    onChange={(e) => setReceiverName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Recipient Phone / WhatsApp *</label>
                  <input
                    type="text"
                    value={receiverWhatsapp}
                    onChange={(e) => setReceiverWhatsapp(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Destination City *</label>
                  <select
                    value={receiverCity}
                    onChange={(e) => setReceiverCity(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="Kampala">Kampala (Uganda)</option>
                    <option value="Nairobi">Nairobi (Kenya)</option>
                    <option value="Kigali">Kigali (Rwanda)</option>
                    <option value="Dar es Salaam">Dar es Salaam (Tanzania)</option>
                    <option value="Bujumbura">Bujumbura (Burundi)</option>
                    <option value="Juba">Juba (South Sudan)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1">Delivery Address *</label>
                  <input
                    type="text"
                    value={receiverAddress}
                    onChange={(e) => setReceiverAddress(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Items Picker (Marketplace Orders vs Custom Items) */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-black text-black flex items-center gap-2 font-mono">
                  <Package className="w-5 h-5 text-[#014485]" /> Add Cargo Items & Photos
                </h3>
                <p className="text-xs text-gray-600 font-medium">Select items from your ordered marketplace goods or add custom parcel items.</p>
              </div>

              {/* Mode Toggle */}
              <div className="flex space-x-2 border-b border-gray-200 pb-3">
                <button
                  type="button"
                  onClick={() => setItemSourceMode('custom')}
                  className={`px-4 py-2 text-xs font-black rounded-lg transition-all ${
                    itemSourceMode === 'custom' ? 'bg-[#014485] text-white' : 'bg-gray-100 text-black hover:bg-gray-200'
                  }`}
                >
                  Add Custom Item
                </button>
                <button
                  type="button"
                  onClick={() => setItemSourceMode('marketplace')}
                  className={`px-4 py-2 text-xs font-black rounded-lg transition-all flex items-center space-x-1.5 ${
                    itemSourceMode === 'marketplace' ? 'bg-[#014485] text-white' : 'bg-gray-100 text-black hover:bg-gray-200'
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Choose from Marketplace Orders ({marketplaceItems.length})</span>
                </button>
              </div>


              {/* Custom Item Form */}
              {itemSourceMode === 'custom' && (
                <div className="bg-gray-100 p-4 rounded-xl border border-gray-300 space-y-3 text-xs">
                  <h4 className="font-black text-black font-mono">Enter Custom Cargo Item</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        placeholder="Item description (e.g. Shirts, Shoes)..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        min="1"
                        value={newItemQty}
                        onChange={(e) => setNewItemQty(Number(e.target.value))}
                        placeholder="Qty"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        step="0.5"
                        min="0.5"
                        value={newItemWeight}
                        onChange={(e) => setNewItemWeight(Number(e.target.value))}
                        placeholder="Weight kg"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="px-4 py-2 bg-[#014485] hover:bg-[#013467] text-white font-black rounded-lg flex items-center space-x-1 cursor-pointer transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Custom Item</span>
                  </button>
                </div>
              )}

              {/* Marketplace Ordered Items Picker Grid */}
              {itemSourceMode === 'marketplace' && (
                <div className="space-y-3">
                  <p className="text-xs font-bold text-gray-700 font-mono">Click any ordered item to add it to your shipment parcel:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {marketplaceItems.map((mkItem) => (
                      <div
                        key={mkItem.id}
                        className="p-3 bg-gray-50 border border-black rounded-xl flex items-center justify-between hover:bg-gray-100 transition"
                      >
                        <div className="flex items-center space-x-3">
                          <img src={mkItem.image} alt={mkItem.name} className="w-10 h-10 rounded object-cover border" />
                          <div>
                            <p className="font-bold text-black line-clamp-1">{mkItem.name}</p>
                            <p className="text-[11px] text-gray-500 font-mono">Qty: {mkItem.quantity} | {mkItem.weight_kg} KG</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleAddMarketplaceItem(mkItem)}
                          className="px-3 py-1.5 bg-[#014485] hover:bg-[#013467] text-white text-[11px] font-bold rounded font-mono shrink-0 cursor-pointer transition-colors"
                        >
                          + Add to Cargo
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Selected Items List */}
              <div className="bg-white border border-gray-300 rounded-xl overflow-hidden text-xs">
                <div className="bg-[#014485] text-white p-3 font-bold font-mono flex justify-between">
                  <span>Selected Package Items ({items.length})</span>
                  <span>Total Weight: {totalWeightKg} KG</span>
                </div>
                <div className="divide-y divide-gray-200">
                  {items.map((item) => (
                    <div key={item.id} className="p-3 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-black">{item.name}</p>
                        <p className="text-[11px] text-gray-500 font-mono">Qty: {item.quantity} | Weight: {item.weight_kg} kg each</p>
                      </div>
                      <button onClick={() => handleRemoveItem(item.id)} className="p-1 text-red-600 hover:bg-red-50 rounded cursor-pointer">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Photo Upload Gallery */}
              <div className="bg-gray-100 p-4 rounded-xl border border-gray-300 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-black font-mono">Parcel Photos Intake ({packageImages.length})</h4>
                  <label className="px-3.5 py-2 bg-[#17993b] hover:bg-[#127a2e] text-white font-black text-xs rounded-lg cursor-pointer font-mono flex items-center space-x-1.5 transition-colors shadow-xs">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isUploadingImage ? 'UPLOADING...' : '+ UPLOAD PHOTO'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={isUploadingImage}
                    />
                  </label>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {packageImages.map((img, idx) => (
                    <div key={idx} className="relative rounded-lg overflow-hidden border border-black aspect-square bg-gray-200">
                      <img src={img} alt={`Photo ${idx}`} className="w-full h-full object-cover" />
                      <button onClick={() => handleRemoveImage(idx)} className="absolute top-1 right-1 p-1 bg-[#014485] text-white rounded-full cursor-pointer">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>


            </div>
          )}

          {/* STEP 3: Select System Courier & Active Flight Information */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-black text-black flex items-center gap-2 font-mono">
                  <Luggage className="w-5 h-5 text-[#014485]" /> Select Courier for Route: {originHub.split(' ')[0]} ✈ {receiverCity}
                </h3>
                <p className="text-xs text-gray-600 font-medium">
                  Showing verified couriers flying the selected transport direction with active flight baggage capacity.
                </p>
              </div>

              {tripsLoading ? (
                <div className="p-8 text-center text-xs font-mono text-gray-500">Loading system couriers for this route...</div>
              ) : courierProfiles.length === 0 ? (
                <div className="p-6 bg-gray-50 border border-black rounded-2xl text-center space-y-2">
                  <p className="font-bold text-xs">No active couriers found for route {originHub.split(' ')[0]} ✈ {receiverCity}.</p>
                  <p className="text-[11px] text-gray-600">You can still submit your cargo quote request, and our dispatch hub will assign the next available passenger courier.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {courierProfiles.map((cGroup) => {
                    const isSelectedUser = selectedCourierId === cGroup.user.id;
                    return (
                      <div
                        key={cGroup.user.id}
                        className={`p-4 rounded-2xl border-2 transition-all ${
                          isSelectedUser ? 'border-[#014485] bg-blue-50/50' : 'border-gray-300 bg-white'
                        }`}
                      >

                        <div className="flex items-center justify-between mb-3 border-b border-gray-200 pb-2">
                          <div className="flex items-center space-x-2">
                            <User className="w-5 h-5 text-black" />
                            <div>
                              <h4 className="font-black text-sm text-black">{cGroup.user.full_name}</h4>
                              <span className="text-[11px] text-gray-500 font-mono">{cGroup.user.email} • Phone: {cGroup.user.phone_number || '+250 788 901 234'}</span>
                            </div>
                          </div>
                          <span className="bg-[#17993b] text-white text-[10px] font-bold px-2.5 py-0.5 rounded font-mono uppercase">
                            KYC VERIFIED COURIER
                          </span>

                        </div>

                        {/* Active Flight Trips for this Courier */}
                        <div className="space-y-2">
                          <span className="text-[11px] font-bold text-gray-700 uppercase font-mono">Active Flight Baggage Trips & Itinerary:</span>
                          {cGroup.trips.map((trip) => {
                            const isSelectedTrip = selectedTripId === trip.id;
                            return (
                              <div
                                key={trip.id}
                                onClick={() => {
                                  setSelectedCourierId(cGroup.user.id);
                                  setSelectedTripId(trip.id);
                                }}
                                className={`p-3 rounded-xl border cursor-pointer transition-all text-xs font-mono space-y-1.5 ${
                                  isSelectedTrip
                                    ? 'border-[#014485] bg-[#014485] text-white'
                                    : 'border-gray-300 bg-white text-black hover:border-[#014485]'
                                }`}
                              >

                                <div className="flex items-center justify-between">
                                  <span className="font-black text-sm">{trip.airline} ({trip.flight_number})</span>
                                  <span className="font-bold text-xs">${trip.rate_per_kg_cad}/kg</span>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] opacity-90">
                                  <div>Route: <strong>{trip.departure_airport} ✈ {trip.arrival_airport}</strong></div>
                                  <div>Departure: <strong>{trip.departure_date}</strong></div>
                                  <div>Spare Capacity: <strong>{trip.available_capacity_kg} KG</strong></div>
                                </div>
                                {trip.boarding_time && (
                                  <div className="text-[10px] opacity-80 flex flex-wrap gap-3 border-t border-gray-700/40 pt-1">
                                    <span>Boarding: <strong>{trip.boarding_time}</strong></span>
                                    <span>Landing: <strong>{trip.landing_time || 'Next Day'}</strong></span>
                                    <span>Duration: <strong>{trip.flight_duration_hours || 13.5} hrs</strong></span>
                                  </div>
                                )}
                                {trip.itinerary_notes && (
                                  <div className="text-[10px] italic opacity-80">Itinerary: {trip.itinerary_notes}</div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* STEP 4: Summary & Escrow Deposit */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="border-l-4 border-[#014485] pl-3 py-1">
                <h3 className="text-base font-black text-black flex items-center gap-2 font-mono">
                  <ShieldCheck className="w-5 h-5 text-[#17993b]" /> Order Summary & Escrow Guarantee
                </h3>
              </div>

              <div className="bg-[#014485] text-white p-6 rounded-2xl border border-blue-900 space-y-4 text-xs font-mono shadow-md">
                <div className="flex justify-between border-b border-blue-800 pb-3">
                  <div>
                    <span className="text-[10px] text-blue-200 block uppercase font-bold">Sender Identification</span>
                    <span className="font-bold">{senderName} ({senderIdType.toUpperCase()}: {senderIdNumber || 'P89420194'})</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-blue-200 block uppercase font-bold">Assigned System Courier</span>
                    <span className="font-bold">{activeCourierGroup?.user.full_name}</span>
                  </div>
                </div>

                <div className="flex justify-between border-b border-blue-800 pb-3">
                  <div>
                    <span className="text-[10px] text-blue-200 block uppercase font-bold font-mono">Route Corridor & Flight</span>
                    <span className="font-bold">{originHub.split(' ')[0]} ✈ {destinationCity.split(' ')[0]} ({activeTrip?.airline} {activeTrip?.flight_number})</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-blue-200 block uppercase font-bold">Recipient</span>
                    <span className="font-bold">{receiverName} ({receiverWhatsapp || '+256...'})</span>
                  </div>
                </div>

                <div className="bg-[#17993b] p-4 rounded-xl space-y-1.5 text-xs text-white shadow-inner">
                  <div className="flex justify-between">
                    <span>Air Freight Cargo ({totalWeightKg} kg x ${ratePerKgCad}):</span>
                    <span className="font-bold">${cargoCostCad.toFixed(2)} CAD</span>
                  </div>
                  <div className="flex justify-between text-white font-black text-sm pt-2 border-t border-emerald-600">
                    <span>Total Protected Escrow Vault Deposit:</span>
                    <span>${totalCostCad.toFixed(2)} CAD ({totalCostRwf.toLocaleString()} RWF)</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>


        {/* Modal Footer Controls */}
        <div className="px-6 py-4 bg-gray-100 border-t border-gray-300 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="flex items-center space-x-1.5 px-4 py-2 border border-black text-black text-xs font-bold rounded-lg hover:bg-black hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous Step</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="flex items-center space-x-1.5 px-5 py-2.5 bg-[#014485] hover:bg-[#013467] text-white text-xs font-black rounded-lg transition-colors cursor-pointer"
            >
              <span>Continue to Step {step + 1}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmitBooking}
              disabled={loading}
              className="flex items-center space-x-2 px-6 py-2.5 bg-[#17993b] hover:bg-[#127a2e] text-white text-xs font-black rounded-lg transition-all shadow-lg cursor-pointer"
            >

              {loading ? (
                <span>Assigning Courier & Issuing AWB...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>Assign Courier & Issue AWB Label</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
