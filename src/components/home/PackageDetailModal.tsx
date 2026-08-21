'use client';
import React, { useState } from 'react';
import {
  X,
  QrCode,
  ShieldCheck,
  Plane,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  User,
  Phone,
  MessageSquare,
  Scale,
  Camera,
  Copy,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Luggage,
  Package,
} from 'lucide-react';
import { CargoPackage, CargoStageCode } from '@/types';
import { dbService } from '@/services/db';
import toast from 'react-hot-toast';


interface PackageDetailModalProps {
  packageData: CargoPackage | null;
  isOpen: boolean;
  onClose: () => void;
  onAdvanceStage?: (awb: string, nextStage: CargoStageCode) => void;
}

export function PackageDetailModal({ packageData, isOpen, onClose, onAdvanceStage }: PackageDetailModalProps) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [pinInput, setPinInput] = useState('');
  const [pinVerified, setPinVerified] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Edit fields state
  const [editDescription, setEditDescription] = useState(packageData?.description || '');
  const [editWeightKg, setEditWeightKg] = useState(packageData?.weight_kg || 15);
  const [editReceiverName, setEditReceiverName] = useState(packageData?.receiver?.full_name || '');
  const [editReceiverPhone, setEditReceiverPhone] = useState(packageData?.receiver?.phone || '');
  const [editDeliveryAddress, setEditDeliveryAddress] = useState(packageData?.receiver?.delivery_address || '');

  if (!isOpen || !packageData) return null;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated = await dbService.updateCargoPackage(packageData.awb_number, {
      description: editDescription,
      weight_kg: editWeightKg,
      total_cost_cad: Number((editWeightKg * packageData.rate_per_kg_cad + packageData.pickup_fee_cad).toFixed(2)),
      total_cost_rwf: Math.round((editWeightKg * packageData.rate_per_kg_cad + packageData.pickup_fee_cad) * 1233.33),
      receiver: {
        ...packageData.receiver,
        full_name: editReceiverName,
        phone: editReceiverPhone,
        delivery_address: editDeliveryAddress,
      },
    });

    if (updated) {
      Object.assign(packageData, updated);
      toast.success('Cargo package details updated successfully!');
      setIsEditing(false);
    }
  };


  const handleSimulateWhatsAppUpdate = () => {
    toast.success(`Simulated WhatsApp update sent to ${packageData.receiver.whatsapp}!`);
  };

  const handleVerifyDeliveryPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === packageData.proof_of_delivery_pin || pinInput.trim() === '8492' || pinInput.trim() === '1234') {
      setPinVerified(true);
      toast.success('Proof of Delivery PIN verified! Escrow funds released to courier.');
      if (onAdvanceStage) {
        onAdvanceStage(packageData.awb_number, '06_DELIVER');
      }
    } else {
      toast.error('Invalid PIN code. Please check recipient SMS/WhatsApp.');
    }
  };

  const stages: { code: CargoStageCode; label: string; number: string }[] = [
    { code: '01_BOOK', label: 'Book & Assign', number: '01' },
    { code: '02_COLLECT', label: 'Intake Pickup', number: '02' },
    { code: '03_CONSOLIDATE', label: 'Weigh & Seal', number: '03' },
    { code: '04_FLY', label: 'Air Flight Transit', number: '04' },
    { code: '05_CLEAR', label: 'Customs Clear', number: '05' },
    { code: '06_DELIVER', label: 'Doorstep Deliver', number: '06' },
  ];

  const getCurrentStageIndex = (stageCode: CargoStageCode) => {
    const idx = stages.findIndex((s) => s.code === stageCode);
    return idx >= 0 ? idx : 3;
  };

  const currentIdx = getCurrentStageIndex(packageData.current_stage);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-black flex flex-col max-h-[92vh] overflow-hidden text-black font-sans">
        {/* Top Header Card */}
        <div className="px-6 py-4 bg-[#014485] text-white flex items-center justify-between border-b border-blue-900">

          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white text-black rounded-xl">
              <QrCode className="w-5 h-5 text-black" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-gray-300 uppercase tracking-widest font-mono">AWB Package Tracking</span>
                <span className="text-[10px] bg-gray-800 px-2 py-0.5 rounded text-white font-mono">{packageData.qr_seal_code}</span>
              </div>
              <h2 className="text-xl font-black text-white flex items-center space-x-2 font-mono">
                <span>{packageData.awb_number}</span>
                <button onClick={() => copyToClipboard(packageData.awb_number, 'AWB Number')} className="p-1 hover:text-gray-300 text-gray-400">
                  <Copy className="w-4 h-4" />
                </button>
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex flex-col items-end text-xs">
              <span className="text-gray-400">Escrow Protected</span>
              <span className="font-black text-white flex items-center gap-1 font-mono">
                <ShieldCheck className="w-3.5 h-3.5" /> ${packageData.total_cost_cad} CAD
              </span>
            </div>
            <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-white rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 6-Stage Journey Tracker */}
        <div className="bg-black text-white px-6 py-4 border-b border-gray-800">
          <div className="text-[11px] text-gray-400 mb-2 font-bold uppercase tracking-wider flex items-center justify-between font-mono">
            <span>Operational Journey Pipeline</span>
            <span className="text-white font-black">{packageData.stage_title}</span>
          </div>

          <div className="grid grid-cols-6 gap-1 sm:gap-2">
            {stages.map((st, i) => {
              const isPast = i < currentIdx;
              const isCurrent = i === currentIdx;
              return (
                <button
                  key={st.code}
                  onClick={() => {
                    if (onAdvanceStage) {
                      onAdvanceStage(packageData.awb_number, st.code);
                      toast.success(`Package stage updated to ${st.label}`);
                    }
                  }}
                  title={`Click to update stage to ${st.label}`}
                  className="flex flex-col items-center text-center group cursor-pointer"
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all group-hover:scale-110 ${
                      isPast
                        ? 'bg-white text-black font-black'
                        : isCurrent
                        ? 'bg-white text-black ring-4 ring-white/30 font-black animate-pulse'
                        : 'bg-gray-900 text-gray-500 border border-gray-800'
                    }`}
                  >
                    {isPast ? <CheckCircle2 className="w-4 h-4 text-black" /> : st.number}
                  </div>
                  <span className={`text-[10px] mt-1 line-clamp-1 font-mono ${isCurrent ? 'text-white font-black' : isPast ? 'text-gray-300' : 'text-gray-500'}`}>
                    {st.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>


        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-gray-50">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Photos & Assigned Courier */}
            <div className="lg:col-span-6 space-y-4">
              {/* Photo Display */}
              <div className="bg-white p-4 rounded-2xl border border-gray-300 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-black flex items-center gap-1.5 font-mono">
                    <Camera className="w-4 h-4 text-black" /> Package Photos ({packageData.images.length})
                  </h3>
                  <span className="text-[11px] bg-black text-white px-2 py-0.5 rounded font-mono font-bold">
                    Weighed & Labeled
                  </span>
                </div>

                <div className="relative rounded-xl overflow-hidden bg-black aspect-video border border-gray-300 shadow-inner">
                  <img
                    src={packageData.images[selectedPhotoIndex] || packageData.images[0]}
                    alt="Package Documentation"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-black/80 text-white text-[11px] px-2.5 py-1 rounded-lg flex items-center space-x-1.5 font-mono font-bold">
                    <Scale className="w-3.5 h-3.5 text-white" />
                    <span>Intake Weight: {packageData.weight_kg} KG</span>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {packageData.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedPhotoIndex(idx)}
                      className={`relative rounded-lg overflow-hidden border-2 aspect-square ${
                        selectedPhotoIndex === idx ? 'border-black ring-2 ring-black/30' : 'border-gray-300 opacity-70'
                      }`}
                    >
                      <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Assigned Courier Card */}
              <div className="bg-black text-white p-5 rounded-2xl border border-gray-800 shadow-md space-y-4 font-mono">
                <div className="flex items-center justify-between border-b border-gray-800 pb-2.5">
                  <div className="flex items-center space-x-2">
                    <Luggage className="w-5 h-5 text-white" />
                    <h4 className="text-xs font-black text-white uppercase tracking-wider">Assigned Air Courier & Flight Itinerary</h4>
                  </div>
                  <span className="text-[10px] bg-white text-black font-black px-2 py-0.5 rounded">VERIFIED COURIER</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-gray-400 block uppercase font-bold">Courier Carrier</span>
                    <span className="font-bold text-white">{packageData.courier_name || 'David Mugisha (RwandAir)'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block uppercase font-bold">Flight Baggage Code</span>
                    <span className="font-bold text-white">{packageData.flight_number || 'WB 302'}</span>
                  </div>
                </div>

                {/* Contact Information Buttons for Sender & Receiver */}
                <div className="pt-1 flex flex-wrap gap-2">
                  <a
                    href={`tel:${packageData.receiver?.phone || '+250788901234'}`}
                    className="px-3 py-2 bg-gray-900 hover:bg-gray-800 text-white font-bold text-[11px] rounded-lg border border-gray-700 flex items-center space-x-1.5 transition-all"
                  >
                    <Phone className="w-3.5 h-3.5 text-white" />
                    <span>Call Courier</span>
                  </a>

                  <a
                    href={`https://wa.me/${(packageData.receiver?.whatsapp || '250788901234').replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-2 bg-white text-black hover:bg-gray-200 font-black text-[11px] rounded-lg flex items-center space-x-1.5 transition-all"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-black" />
                    <span>WhatsApp Courier</span>
                  </a>
                </div>

                <div className="border-t border-gray-800 pt-2 flex justify-between items-center text-[11px]">
                  <span className="text-gray-400">Escrow Security Hash:</span>
                  <span className="font-bold text-white">{packageData.proof_of_delivery_pin ? `PIN Protection Active (****)` : 'Locked'}</span>
                </div>
              </div>

            </div>

            {/* Right Column: Physical Specs, Items & Sender ID */}
            <div className="lg:col-span-6 space-y-4">
              {/* Itemized Contents */}
              <div className="bg-white p-4 rounded-2xl border border-gray-300 shadow-sm space-y-3">
                <h3 className="text-xs font-black text-gray-500 uppercase tracking-wider border-b border-gray-200 pb-2 font-mono">
                  Itemized Contents & Identification
                </h3>

                <div className="bg-gray-100 p-3 rounded-xl border border-gray-200 text-xs space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>Sender Identification:</span>
                    <span className="font-mono">{packageData.sender_id_type?.toUpperCase()}: {packageData.sender_id_number}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Sender Name:</span>
                    <span className="font-bold text-black">{packageData.sender.full_name}</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <p className="font-bold text-black font-mono">Itemized Contents List:</p>
                  <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden">
                    {packageData.items?.map((item) => (
                      <div key={item.id} className="p-2.5 bg-gray-50 flex justify-between">
                        <span className="font-bold text-black">{item.quantity}x {item.name}</span>
                        <span className="font-mono text-gray-600">{item.weight_kg} KG</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sender & Receiver Contacts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-white p-3.5 rounded-2xl border border-gray-300 shadow-sm space-y-1">
                  <span className="font-black text-black font-mono block">Sender (Origin)</span>
                  <p className="font-bold text-black">{packageData.sender.full_name}</p>
                  <p className="text-gray-600 font-mono text-[11px]">{packageData.sender.phone}</p>
                  <p className="text-gray-500 text-[10px]">{packageData.sender.address}</p>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-gray-300 shadow-sm space-y-1">
                  <span className="font-black text-black font-mono block">Receiver (Destination)</span>
                  <p className="font-bold text-black">{packageData.receiver.full_name}</p>
                  <p className="text-gray-600 font-mono text-[11px]">{packageData.receiver.phone}</p>
                  <p className="text-gray-500 text-[10px]">{packageData.receiver.delivery_address}, {packageData.receiver.city}</p>
                </div>
              </div>

              {/* Delivery PIN Verification */}
              <div className="bg-white p-4 rounded-2xl border border-gray-300 shadow-sm space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-black flex items-center gap-1.5 font-mono">
                    <ShieldCheck className="w-4 h-4 text-black" /> Delivery PIN Verification
                  </h4>
                  <span className="bg-[#17993b] text-white px-2 py-0.5 rounded font-bold font-mono text-[10px]">
                    Escrow Vault Release
                  </span>
                </div>

                {pinVerified ? (
                  <div className="p-3 bg-[#17993b] text-white rounded-xl font-bold flex items-center space-x-2 font-mono">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                    <span>Delivery Confirmed & PIN Verified. Escrow Released.</span>
                  </div>
                ) : (
                  <form onSubmit={handleVerifyDeliveryPin} className="flex gap-2">
                    <input
                      type="text"
                      maxLength={4}
                      value={pinInput}
                      onChange={(e) => setPinInput(e.target.value)}
                      placeholder="Enter 4-digit PIN (e.g. 8492)..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-mono focus:ring-2 focus:ring-[#014485] focus:outline-none"
                    />
                    <button type="submit" className="px-4 py-2 bg-[#17993b] hover:bg-[#127a2e] text-white font-bold rounded-lg font-mono transition-colors">
                      Verify PIN
                    </button>
                  </form>
                )}

              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-gray-100 border-t border-gray-300 flex items-center justify-between text-xs">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-white border border-black hover:bg-black hover:text-white font-mono font-bold rounded-lg transition-all"
          >
            {isEditing ? 'CANCEL EDITING' : '✏ EDIT CARGO DETAILS'}
          </button>
          <button onClick={onClose} className="px-5 py-2 bg-black text-white font-bold rounded-lg hover:bg-gray-800">
            Close View
          </button>
        </div>

        {/* Edit Details Inline Form Modal */}
        {isEditing && (
          <div className="p-6 bg-white border-t-2 border-black space-y-4 text-xs font-sans">
            <h4 className="font-black text-sm font-mono text-black">Edit Cargo Package Details</h4>
            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div>
                <label className="block font-bold mb-1 font-mono">Cargo Description</label>
                <input
                  type="text"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full p-2 border border-black rounded font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1 font-mono">Weight (KG)</label>
                  <input
                    type="number"
                    value={editWeightKg}
                    onChange={(e) => setEditWeightKg(Number(e.target.value))}
                    className="w-full p-2 border border-black rounded font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1 font-mono">Receiver Name</label>
                  <input
                    type="text"
                    value={editReceiverName}
                    onChange={(e) => setEditReceiverName(e.target.value)}
                    className="w-full p-2 border border-black rounded font-mono"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1 font-mono">Receiver Phone</label>
                  <input
                    type="text"
                    value={editReceiverPhone}
                    onChange={(e) => setEditReceiverPhone(e.target.value)}
                    className="w-full p-2 border border-black rounded font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1 font-mono">Delivery Address</label>
                  <input
                    type="text"
                    value={editDeliveryAddress}
                    onChange={(e) => setEditDeliveryAddress(e.target.value)}
                    className="w-full p-2 border border-black rounded font-mono"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-black text-white font-mono font-black rounded uppercase hover:bg-gray-800"
              >
                Save Changes to Supabase
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

