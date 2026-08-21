'use client';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white text-[#111111] py-16 px-4 lg:px-8 max-w-4xl mx-auto font-sans space-y-12">
      {/* Header */}
      <div className="space-y-3 pb-6 border-b border-gray-100">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-black transition mb-2">
          <ArrowLeft size={14} /> Back to Home
        </Link>
        <span className="text-xs font-bold uppercase tracking-widest bg-black text-white px-3.5 py-1 rounded-full block w-fit">
          Privacy Protocol
        </span>
        <h1 className="text-4xl lg:text-5xl font-black text-[#111111] font-retro-heading">Privacy Policy & Security Protocol</h1>
        <p className="text-gray-500 text-sm font-medium">Effective Date: August 2026 • Nile Express Cargo Cross-Border Protocol</p>
      </div>

      {/* Clean White Well-Proportioned Sections */}
      <div className="space-y-12 text-base text-gray-700 font-medium leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-black font-retro-heading">1. PostgreSQL Database Access Security</h2>
          <p className="leading-loose">
            Nile Express Cargo is engineered upon a multi-tenant PostgreSQL database architecture connecting Kigali, Rwanda (KGL) and Toronto, Canada (YYZ). Access controls are enforced natively at the database level across all data tables, including user profiles, order records, escrow holdings, flight trips, and active session devices. When users authenticate, their cryptographic session tokens ensure that buyers, exporters, importers, and air couriers can only read or modify records authorized for their verified identity profile.
          </p>
          <p className="leading-loose">
            This database-level security model prevents unauthorized cross-tenant data access and ensures that trade volumes, pricing structures, and private customer communications remain completely isolated and protected against external data harvesting.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-black font-retro-heading">2. Personal Data Collection & Purpose Scoping</h2>
          <p className="leading-loose">
            To operate an international trade and passenger air freight platform, we collect specific categories of personal data essential for customs clearance, delivery verification, and financial settlements. This includes full legal names, verified email addresses, mobile telephone numbers, delivery street addresses in Canada or Rwanda, passport identity references for couriers, and national business tax identifiers.
          </p>
          <p className="leading-loose">
            Contact information is utilized strictly to send real-time Air Waybill (AWB) milestone updates, tamper-seal verification codes, and 256-bit Escrow Vault release PINs. Nile Express Cargo does not engage in behavioral advertising, third-party data brokerage, or tracking for marketing purposes.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-black font-retro-heading">3. Business Tax Credentials & Verification</h2>
          <p className="leading-loose">
            In compliance with international trade laws enforced by the Rwanda Revenue Authority (RRA) and Canada Border Services Agency (CBSA), commercial entities must provide valid tax identification credentials. Exporters in Rwanda must supply an active RDB Tax Identification Number (TIN), while importers in Canada supply a Canada Revenue Agency (CRA) Business Number (BN).
          </p>
          <p className="leading-loose">
            These credentials validate commercial legitimacy, populate required customs e-manifests, and facilitate preferential bilateral duty treatment. Tax identification data is stored using AES-256 encryption and accessible only to automated compliance systems and authorized platform auditors.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-black font-retro-heading">4. 256-Bit Escrow Vault Cryptography & Protection</h2>
          <p className="leading-loose">
            Financial security across continents is governed by our automated 256-bit Escrow Vault system. When an order is placed, purchase funds are locked in an escrow holding account. Payment tokens and transaction hashes are encrypted using secure cryptographic keys. Funds cannot be drawn down by vendors or air couriers during the transit phase.
          </p>
          <p className="leading-loose">
            Escrow release is triggered exclusively when the recipient receives the parcel in Toronto or Kigali, inspects the unbroken QR tamper seal, and inputs their unique 6-digit confirmation PIN. This protocol guarantees total protection against non-delivery, lost cargo, and payment fraud.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-black font-retro-heading">5. Device Audit & Session Security Monitoring</h2>
          <p className="leading-loose">
            To safeguard user accounts against unauthorized access, credential theft, and fraudulent payout attempts, Nile Express Cargo maintains automated security audit logs. When a user authenticates or triggers financial transactions, our system captures client IP addresses, browser types, operating systems, and geographic location data.
          </p>
          <p className="leading-loose">
            Automated anomaly detection alerts administrators if login attempts occur from recognized threat locations outside established trade corridors. Users can inspect all active sessions within their security preferences and revoke unrecognized devices with a single click.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-black font-retro-heading">6. Air Courier Travel Privacy & Flight Manifests</h2>
          <p className="leading-loose">
            Logistics Air Couriers listing spare baggage capacity on flights (such as RwandAir WB302) provide confirmed flight ticket references, airline details, and declared luggage allowances. Flight ticket references and passport documents are kept strictly confidential and accessed only by certified cargo hub supervisors.
          </p>
          <p className="leading-loose">
            Public listings on the courier flight hub display only anonymized courier names, departure dates, available capacity in kilograms, and freight rates. Full contact information is shared only after cargo space is formally booked and locked in escrow.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-black font-retro-heading">7. International Data Transfers (PIPEDA, GDPR & Rwanda Law)</h2>
          <p className="leading-loose">
            Operating across Rwanda and Canada requires adherence to multi-jurisdictional privacy frameworks, including Canada's Personal Information Protection and Electronic Documents Act (PIPEDA), Rwanda's Law No. 058/2021 relating to Personal Data Protection, and GDPR standards. Personal data is stored in SOC 2 Type II certified cloud environments.
          </p>
          <p className="leading-loose">
            Cross-border data transfers between Kigali and Toronto are protected via TLS 1.3 encryption. Users retain the right to access, rectify, or request deletion of their personal records by submitting a request to our data compliance team.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-black font-retro-heading">8. Essential Cookies & Session Preferences</h2>
          <p className="leading-loose">
            Nile Express Cargo utilizes technical cookies and browser local storage strictly necessary for authentication state management, shopping cart persistence, and preferred currency display (CAD $ or RWF). Cookies ensure secure session state tokens without exposing sensitive credentials to client scripts.
          </p>
          <p className="leading-loose">
            We do not use third-party tracking pixels or behavioral advertising cookies. Disabling technical session cookies may prevent proper access to authenticated user dashboards and escrow confirmation features.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-black font-retro-heading">9. Data Retention & Account Erasure Protocols</h2>
          <p className="leading-loose">
            Personal data and trade transaction manifests are retained only for the duration required to fulfill trade dispatches, resolve disputes, and satisfy statutory tax reporting mandates. Customs and tax invoices are retained for seven years in compliance with international trade laws in Canada and Rwanda.
          </p>
          <p className="leading-loose">
            Upon receiving a verified account deletion request, non-essential personal profile details are permanently purged from active production databases within thirty business days.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-black font-retro-heading">10. Policy Updates & Data Protection Contact</h2>
          <p className="leading-loose">
            Nile Express Cargo periodically updates this Privacy Policy & Security Protocol to reflect evolving international regulatory standards or platform enhancements. Material changes are communicated via account banners and updated revision dates.
          </p>
          <p className="leading-loose">
            For privacy questions or data subject access requests, contact our Data Protection Officer at <strong className="text-black font-mono">dpo@diasporalink.com</strong> or via physical mail at Kigali Cargo Hub 01, KG 7 Ave, Special Economic Zone, Kigali, Rwanda.
          </p>
        </section>
      </div>
    </main>
  );
}
