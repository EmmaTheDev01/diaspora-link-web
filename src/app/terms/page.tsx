'use client';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white text-[#111111] py-16 px-4 lg:px-8 max-w-4xl mx-auto font-sans space-y-12">
      {/* Header */}
      <div className="space-y-3 pb-6 border-b border-gray-100">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-black transition mb-2">
          <ArrowLeft size={14} /> Back to Home
        </Link>
        <span className="text-xs font-bold uppercase tracking-widest bg-black text-white px-3.5 py-1 rounded-full block w-fit">
          Trade Protocol Terms
        </span>
        <h1 className="text-4xl lg:text-5xl font-black text-[#111111] font-retro-heading">Terms of Cross-Border Trade & Escrow Vault</h1>
        <p className="text-gray-500 text-sm font-medium">Effective Date: August 2026 • Magic Link Cross-Border Protocol</p>
      </div>

      {/* Clean White Well-Proportioned Sections */}
      <div className="space-y-12 text-base text-gray-700 font-medium leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-black font-retro-heading">1. Scope of Agreement & Multi-Role Platform Access</h2>
          <p className="leading-loose">
            This agreement governs all commerce, logistics dispatch bookings, and escrow settlements executed on Magic Link connecting Kigali (KGL) and Toronto (YYZ). By creating an account or completing transactions, users agree to abide by these terms across five specialized role profiles: Diaspora Buyer, Rwanda Exporter, Canada Importer, Air Courier, and System Administrator.
          </p>
          <p className="leading-loose">
            Exporters in Rwanda agree to satisfy Rwanda Development Board (RDB) export mandates, while Canadian importers agree to comply with Canada Revenue Agency (CRA) import standards. Magic Link reserves the right to suspend accounts attempting escrow bypass or submitting unverified credentials.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-black font-retro-heading">2. 256-Bit Escrow Vault & PIN Release Mechanics</h2>
          <p className="leading-loose">
            Financial transactions on Magic Link are protected by our automated 256-bit Escrow Vault. Upon checkout, 100% of order funds—including product item costs and freight tariffs—are locked in escrow. Escrow holdings remain untouched by sellers or couriers during transport.
          </p>
          <p className="leading-loose">
            Escrow release requires cryptographic verification via a unique 6-digit confirmation PIN delivered to the buyer. Upon physical parcel delivery in Toronto or Kigali, the recipient inspects the tamper-evident QR seal and enters the PIN to instantly release funds to the vendor and courier.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-black font-retro-heading">3. Rwandan Exporter Quality & RDB TIN Warranties</h2>
          <p className="leading-loose">
            Exporters (vendor_rwanda) listing products on Magic Link must maintain an active RDB Tax Identification Number (TIN) and satisfy National Agricultural Export Development Board (NAEB) quality benchmarks. Agricultural items, including Gishwati tea and Lake Kivu Arabica coffee, must hold valid phytosanitary certificates.
          </p>
          <p className="leading-loose">
            Exporters warrant that listed items are authentic, accurately described, and packaged in food-grade, moisture-resistant containers suitable for high-altitude air transit. Shipments rejected at Kigali Airport due to packaging defects shall be returned at the seller's expense.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-black font-retro-heading">4. Canadian Importer CRA Business Number Compliance</h2>
          <p className="leading-loose">
            Commercial importers in Canada (vendor_canada) purchasing wholesale export inventory warrant that they hold a valid Canada Revenue Agency (CRA) Business Number (BN) equipped with an active import-export account extension. Importers act as the official Importer of Record (IOR) for all incoming air cargo consignments.
          </p>
          <p className="leading-loose">
            Importers are responsible for reviewing Harmonized System (HS) tariff classifications and ensuring compliance with applicable customs duties and sales taxes assessed by Canada Border Services Agency (CBSA).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-black font-retro-heading">5. Passenger Flight Air Courier Baggage Terms</h2>
          <p className="leading-loose">
            Logistics Air Couriers participating in passenger flight luggage dispatch on routes such as RwandAir Flight WB302 agree to act as independent freight couriers using their baggage allowance. Couriers must hold valid passports, confirmed ticket PNR bookings, and travel authority.
          </p>
          <p className="leading-loose">
            Couriers inspect packaged parcels alongside cargo hub inspectors to verify contents match Air Waybill manifests. Once parcels are accepted and sealed with tamper-evident QR codes, couriers earn guaranteed per-kilogram escrow payouts upon successful PIN delivery confirmation.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-black font-retro-heading">6. Air Waybill (AWB) Tracking & Tamper-Evident QR Seals</h2>
          <p className="leading-loose">
            Every order is assigned a unique Air Waybill number (e.g. AWB-KGL-99201) and sealed with a tamper-evident QR security code. Scanning the QR code displays parcel origin, cooperative details, declared weight, and flight dispatch metadata.
          </p>
          <p className="leading-loose">
            If a recipient receives a package with a broken or altered security seal, they must reject the delivery and flag the order as "Tamper Breach" within the app, freezing escrow funds and initiating an immediate hub investigation.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-black font-retro-heading">7. Dual-Currency Exchange Settlement Engine</h2>
          <p className="leading-loose">
            Magic Link operates a real-time dual-currency settlement engine supporting Canadian Dollars (CAD $) and Rwandan Francs (RWF). Prices update dynamically based on official foreign exchange benchmark rates (e.g. 1 CAD = 1,333.33 RWF).
          </p>
          <p className="leading-loose">
            Escrow holdings locked during checkout are guaranteed against currency fluctuations for thirty days. Exporters in Rwanda receive payouts converted into RWF at the locked transaction rate, insulating agricultural producers against foreign exchange risk.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-black font-retro-heading">8. Cancellations, Returns & Dispute Mechanics</h2>
          <p className="leading-loose">
            Buyers may cancel orders for a 100% escrow refund at any time prior to parcel sealing and flight manifest assignment at cargo hubs. Once sealed and assigned an AWB manifest, cancellations are locked due to international customs regulations.
          </p>
          <p className="leading-loose">
            If a delivered parcel arrives damaged or defective, the buyer must file a Dispute Claim within 48 hours without disclosing the 6-digit PIN. Valid claims result in full escrow refunds credited back to the buyer.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-black font-retro-heading">9. Limitation of Liability & Indemnification</h2>
          <p className="leading-loose">
            To the maximum extent permitted by law, Magic Link and its software operators shall not be liable for indirect damages, flight delays, customs holds, or force majeure events. Magic Link's total aggregate liability is limited to the total escrow transaction value of the specific order.
          </p>
          <p className="leading-loose">
            Users agree to indemnify Magic Link against third-party claims or penalties resulting from fraudulent tax credentials or transport violations.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-black font-retro-heading">10. Dispute Resolution & Governing Jurisdiction</h2>
          <p className="leading-loose">
            These terms are governed by the laws of Rwanda for trade originating in Kigali and the laws of Ontario and Canada for trade terminating or originating in Toronto.
          </p>
          <p className="leading-loose">
            Disputes that cannot be settled through administrative mediation within 30 days shall be submitted to binding arbitration under the rules of the Kigali International Arbitration Centre (KIAC) or Canadian Arbitration Association (CAA).
          </p>
        </section>
      </div>
    </main>
  );
}
