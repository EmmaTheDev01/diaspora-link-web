'use client';
import React, { useState } from 'react';
import { ShieldCheck, X, FileText, CheckCircle2, AlertTriangle, Scale } from 'lucide-react';

interface TermsAndConditionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: 'courier' | 'sender' | 'receiver';
  onAccept?: () => void;
}

export function TermsAndConditionsModal({
  isOpen,
  onClose,
  initialRole = 'sender',
  onAccept,
}: TermsAndConditionsModalProps) {
  const [activeTab, setActiveTab] = useState<'courier' | 'sender' | 'receiver'>(initialRole);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border-2 border-black max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-black text-white flex justify-between items-center border-b border-black">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black font-retro-heading">Nile Cargo Terms & Conditions</h2>
              <p className="text-xs text-gray-300 font-mono">Cross-Border Air Freight & Baggage Compliance Protocol</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Role Selector Tabs */}
        <div className="flex border-b-2 border-black bg-gray-100 font-mono text-xs font-bold">
          <button
            onClick={() => setActiveTab('sender')}
            className={`flex-1 py-3 px-4 text-center transition-all ${
              activeTab === 'sender' ? 'bg-white text-black border-b-2 border-black font-black' : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            SENDER TERMS
          </button>
          <button
            onClick={() => setActiveTab('courier')}
            className={`flex-1 py-3 px-4 text-center transition-all ${
              activeTab === 'courier' ? 'bg-white text-black border-b-2 border-black font-black' : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            COURIER TERMS
          </button>
          <button
            onClick={() => setActiveTab('receiver')}
            className={`flex-1 py-3 px-4 text-center transition-all ${
              activeTab === 'receiver' ? 'bg-white text-black border-b-2 border-black font-black' : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            RECEIVER TERMS
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs font-sans text-gray-800 leading-relaxed flex-1">
          {activeTab === 'sender' && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 border border-black rounded-xl space-y-2">
                <div className="font-black text-black font-retro-heading text-sm flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-black" />
                  <span>Sender Item Declaration & Packaging Terms</span>
                </div>
                <p>
                  As a Sender using Nile Cargo Network, you agree to strictly comply with international aviation security rules, CBSA (Canada Border Services Agency), and East African Revenue Authorities customs guidelines.
                </p>
              </div>

              <div className="space-y-3 font-medium">
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-black shrink-0 mt-0.5" />
                  <p><strong>1. Accurate Itemization:</strong> All items included in your package must be accurately listed with item name, quantity, and weight. Misdeclared goods may be confiscated by customs.</p>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-black shrink-0 mt-0.5" />
                  <p><strong>2. Prohibited Goods Policy:</strong> You certify that your parcel contains no hazardous materials, lithium batteries, narcotics, weapons, contraband, or counterfeit goods.</p>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-black shrink-0 mt-0.5" />
                  <p><strong>3. Official Sender Identification:</strong> Official Passport, National ID, or Driver's License number must be supplied for customs intake records.</p>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-black shrink-0 mt-0.5" />
                  <p><strong>4. Escrow Protection & Fees:</strong> Cargo quotes ($14/kg) are protected by Escrow Vault. Funds are held securely until the recipient confirms delivery via PIN release.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'courier' && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 border border-black rounded-xl space-y-2">
                <div className="font-black text-black font-retro-heading text-sm flex items-center space-x-2">
                  <Scale className="w-4 h-4 text-black" />
                  <span>Passenger Courier Baggage & Transport Terms</span>
                </div>
                <p>
                  As a verified Passenger Courier, you monetize your unused airline baggage allowance. You agree to act as an authorized transport agent adhering to airline baggage weight limits.
                </p>
              </div>

              <div className="space-y-3 font-medium">
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-black shrink-0 mt-0.5" />
                  <p><strong>1. Baggage Intake Inspection:</strong> You have the absolute right to inspect sealed parcels at hub collection to verify non-prohibited contents before boarding your flight.</p>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-black shrink-0 mt-0.5" />
                  <p><strong>2. Contact Availability:</strong> You agree to provide valid Phone, WhatsApp, and Email contacts so Senders and Receivers can coordinate intake and delivery.</p>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-black shrink-0 mt-0.5" />
                  <p><strong>3. Flight Schedule Accuracy:</strong> Flight numbers, boarding times, and landing times posted on your trip must reflect your official ticketed airline itinerary.</p>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-black shrink-0 mt-0.5" />
                  <p><strong>4. Payout Guarantee:</strong> Courier transport earnings are released directly to your Mobile Money or Bank account upon destination hub drop-off and recipient PIN confirmation.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'receiver' && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 border border-black rounded-xl space-y-2">
                <div className="font-black text-black font-retro-heading text-sm flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-black" />
                  <span>Receiver Delivery & PIN Verification Terms</span>
                </div>
                <p>
                  As a Recipient of cross-border air cargo, you are responsible for inspecting your parcel upon arrival and releasing the 6-digit Escrow Verification PIN to the courier.
                </p>
              </div>

              <div className="space-y-3 font-medium">
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-black shrink-0 mt-0.5" />
                  <p><strong>1. Delivery Verification:</strong> Inspect parcel outer seal and intake photos before disclosing your 6-digit Escrow Vault Release PIN to the delivery driver.</p>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-black shrink-0 mt-0.5" />
                  <p><strong>2. Contact & Address:</strong> Ensure your registered phone number and delivery doorstep address are accurate to prevent delivery delays.</p>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-black shrink-0 mt-0.5" />
                  <p><strong>3. Customs Processing:</strong> Destination customs processing times are governed by local airport customs authorities (KRA / URA / RRA).</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-gray-100 border-t border-black flex justify-end space-x-3">
          {onAccept && (
            <button
              onClick={() => {
                onAccept();
                onClose();
              }}
              className="px-6 py-2.5 bg-black hover:bg-gray-800 text-white font-mono text-xs font-black uppercase rounded-xl transition-all shadow-md cursor-pointer"
            >
              I ACCEPT & AGREE TO TERMS
            </button>
          )}
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-black font-mono text-xs font-bold uppercase rounded-xl transition-all cursor-pointer"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}
