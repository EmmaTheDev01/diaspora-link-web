'use client';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function CustomsClearancePage() {
  return (
    <main className="min-h-screen bg-white text-[#111111] py-16 px-4 lg:px-8 max-w-4xl mx-auto font-sans space-y-12">
      {/* Header */}
      <div className="space-y-3 pb-6 border-b border-gray-100">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-black transition mb-2">
          <ArrowLeft size={14} /> Back to Home
        </Link>
        <span className="text-xs font-bold uppercase tracking-widest bg-black text-white px-3.5 py-1 rounded-full block w-fit">
          Logistics Compliance
        </span>
        <h1 className="text-4xl lg:text-5xl font-black text-[#111111] font-retro-heading">Customs Clearance & Duty Guide</h1>
        <p className="text-gray-500 text-sm font-medium">RDB (Rwanda) • CBSA (Canada) • Air Waybill Manifest Standards</p>
      </div>

      {/* Clean White Well-Proportioned Sections */}
      <div className="space-y-12 text-base text-gray-700 font-medium leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-black font-retro-heading">1. Rwanda Development Board (RDB) Export Standards</h2>
          <p className="leading-loose">
            Commercial goods dispatched from Rwanda through Magic Link must originate from entities holding active RDB registration and verified Tax Identification Numbers (TIN). The RDB regulates export promotion and international trade standards across Rwanda.
          </p>
          <p className="leading-loose">
            Agricultural commodities such as specialty Arabica coffee beans and organic teas require export permits issued by the National Agricultural Export Development Board (NAEB) to ensure 100% compliance with international quality standards.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-black font-retro-heading">2. Canada Border Services Agency (CBSA) Import Rules</h2>
          <p className="leading-loose">
            Shipments arriving in Canada at Toronto Pearson International Airport (YYZ) are subject to customs inspection governed by the CBSA. Commercial importers act as the Importer of Record (IOR) for incoming consignments under the Customs Act.
          </p>
          <p className="leading-loose">
            Magic Link generates automated e-manifest payloads compliant with CBSA Single Window Initiative standards. Importers must supply a valid Canada Revenue Agency (CRA) Business Number (BN) equipped with an active import-export account extension.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-black font-retro-heading">3. Harmonized System (HS) Tariff Classification</h2>
          <p className="leading-loose">
            Accurate commodity classification under 6-digit or 8-digit Harmonized System (HS) codes is mandatory for all listed products. HS codes determine applicable customs duty rates, excise taxes, and import controls in destination countries.
          </p>
          <p className="leading-loose">
            For instance, unroasted specialty Arabica coffee beans are classified under HS Code 0901.11.00, while black tea packages fall under HS Code 0902.30.10. Magic Link's automated engine calculates estimated duties and taxes at checkout.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-black font-retro-heading">4. Air Waybill (AWB) Manifest Generation</h2>
          <p className="leading-loose">
            The Air Waybill (AWB) is the official legal contract of carriage for air freight across the Kigali to Toronto trade corridor. Upon order confirmation and cargo hub inspection, Magic Link generates a standardized master AWB manifest (e.g. AWB-KGL-99201).
          </p>
          <p className="leading-loose">
            The AWB number is encoded into tamper-evident QR security seals affixed to each parcel box. Scanning the AWB barcode at logistics milestones ensures digital chain of custody tracking for aviation and border authorities.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-black font-retro-heading">5. Phytosanitary Biosecurity Inspections (CFIA & RAB)</h2>
          <p className="leading-loose">
            Agricultural commodities and organic food products imported into Canada are subject to biosecurity inspection enforced by the Canadian Food Inspection Agency (CFIA). Exports from Rwanda are inspected by RAB plant health officers.
          </p>
          <p className="leading-loose">
            All agricultural shipments shipped via Magic Link must be accompanied by official RAB Phytosanitary Certificates verifying freedom from plant pests. Items must be packaged in sealed, food-grade containers suitable for air transit.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-black font-retro-heading">6. Passenger Courier Baggage Declarations</h2>
          <p className="leading-loose">
            Logistics Air Couriers carrying pre-inspected trade parcels as part of passenger baggage allowances (such as on RwandAir WB302 flights) present official Magic Link Flight Manifests to airport customs officers upon request.
          </p>
          <p className="leading-loose">
            Couriers act as contracted physical freight carriers carrying tamper-sealed commercial goods matching e-manifests. Couriers are exempt from personal customs duty liability for pre-cleared commercial parcels.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-black font-retro-heading">7. Rwanda Revenue Authority (RRA) EBM Compliance</h2>
          <p className="leading-loose">
            Rwandan Exporters must satisfy tax invoicing regulations enforced by the Rwanda Revenue Authority (RRA). Vendors generate official Electronic Billing Machine (EBM) tax invoices for every completed international dispatch.
          </p>
          <p className="leading-loose">
            Magic Link integrates with RRA EBM APIs to issue digital VAT tax invoices displaying vendor TIN numbers, itemized prices, zero-rated export VAT notations, and official RRA cryptographic signatures.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-black font-retro-heading">8. Valuation & Sales Tax Assessments (GST/HST)</h2>
          <p className="leading-loose">
            Customs valuation is based on the WTO transaction value method paid in CAD $ or RWF at checkout. In Canada, commercial importations exceeding de minimis thresholds are subject to GST/HST taxes calculated based on destination provinces.
          </p>
          <p className="leading-loose">
            Magic Link calculates required GST/HST amounts at checkout and includes tax breakdowns on commercial invoices, ensuring parcels clear border customs without unexpected Cash on Delivery (COD) duty fees.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-black font-retro-heading">9. Customs Quarantine & Inspection Holds</h2>
          <p className="leading-loose">
            Parcels selected for random physical inspection or agricultural sampling by CBSA, CFIA, or RRA officers may be placed in temporary customs quarantine at Toronto Pearson Airport or Kigali Cargo Terminal.
          </p>
          <p className="leading-loose">
            During customs holds, 256-bit Escrow Vault holdings remain locked, protecting buyer payments. If a shipment is rejected due to prohibited items or unverified credentials, full escrow refunds are returned to the buyer.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-black font-retro-heading">10. Preferential Bilateral Trade Agreements</h2>
          <p className="leading-loose">
            Magic Link operates in alignment with international trade agreements promoting economic cooperation between Rwanda and Canada, including preferential tariff treatment under the African Continental Free Trade Area (AfCFTA) framework.
          </p>
          <p className="leading-loose">
            Qualifying Rwandan goods (roasted Arabica coffee, teas, woven crafts) benefit from reduced or zero-rated customs tariff duties when entering Canadian commercial import corridors.
          </p>
        </section>
      </div>
    </main>
  );
}
