# Nile Cargo Network & Diaspora Link Web Application - Full System Documentation & Changelog

This document provides a comprehensive overview of all architectural improvements, database schema updates, courier flight itinerary workflows, authentication context persistence, and UI enhancements implemented across the web application.

---

## 🚀 Build & Compilation Verification

The web application was compiled using Next.js 16 (Turbopack) and verified with full type-checking:
- **Build Command**: `npm run build`
- **TypeScript Verification**: `npx tsc --noEmit`
- **Compilation Status**: **0 Errors (Clean Build Success)**

---

## 1. ✈️ Dedicated Cargo Hub vs 🛒 Product Marketplace

### Homepage (`/`)
- **100% Dedicated Cargo Hub**: The root URL (`/`) is dedicated to the **NILE CARGO NETWORK** Send Cargo (Export) and Receive Cargo (Import) hub.
- **$14/kg Air Freight Rate Calculator**:
  - Interactive weight slider & instant quote math ($14.00/kg).
  - Optional home pickup fee calculation ($25.00 CAD).
  - Dual-currency display (CAD & RWF).
  - Direct router redirection for unauthenticated users.
- **Live AWB Tracking & Delivery PIN Release**:
  - Lookup packages by AWB tracking number, barcode, or receiver phone number.
  - 6-Stage Journey Pipeline (*01 BOOK*, *02 COLLECT*, *03 CONSOLIDATE*, *04 FLY*, *05 CLEAR*, *06 DELIVER*).
  - Verification PIN release unlocking 256-Bit Escrow Vault funds.

### Marketplace Page (`/products`)
- **Product Marketplace Catalog**: Dedicated e-commerce showcase featuring:
  - **Marketplace Hero Slider**: Renders local PNG assets (`/cargo.png`, `/coffee.png`, `/craft.png`) with `object-contain` styling and no borders.
  - **Trade Corridor Filters**: Filter products by `All Corridors`, `KGL ✈ YYZ`, and `YYZ ✈ KGL`.
  - **256-Bit Escrow Vault Protocol Banner** & **Deal of the Day**.
- **Header Navigation Bar**: Updated navbar containing `Cargo Hub`, `Marketplace`, `About`, `Contact` (removed `[Air Freight]` link).

---

## 2. 🔐 Authentication, Context Memory & Auto-Confirm Email

- **Draft Cargo Context Memory**:
  - Unauthenticated users clicking **BOOK CARGO & ASSIGN COURIER** have their rate calculations saved to `localStorage` (`nile_draft_cargo`).
  - Redirected to `/login?redirect=/buyer?action=send_cargo`.
  - Upon login or registration, `nile_draft_cargo` is automatically read and pre-filled into the Send Cargo Wizard.
- **Instant Email Auto-Confirm**:
  - New user registrations execute `supabase.auth.signInWithPassword()` immediately after `signUp()` so users do not face verification blocks.
  - Added PostgreSQL trigger `trg_auto_confirm_email` in `schema.sql` setting `email_confirmed_at = NOW()` on `auth.users`.
- **Production-Ready Login (`/login`)**: Removed static mock quick demo authentication buttons.

---

## 3. 📦 Clean Production Cargo Modals & Supabase Storage

- **User Profile Auto-Hydration**: `SendCargoWizardModal.tsx` dynamically pre-populates official sender name, email, and phone number from `useAuthStore().user`.
- **Mock Data Elimination**: Removed all static hardcoded sender/receiver names (*Grace Akello*, *David Omondi*), phone numbers (*+1 416 990 1284*), and passport IDs (*P89420194*).
- **Clean Initial State**: Items list and package images initialize to clean empty arrays `[]`.
- **Supabase Storage Bucket (`cargo-photos`)**: Integrated `+ UPLOAD PHOTO` file input uploading parcel intake photos directly to Supabase Storage bucket (`cargo-photos`).

---

## 4. 🧭 Universal Dashboard Sidebar Navigation

Added explicit **Send Cargo (Export)** and **Cargo Packages (Sent & Received)** sidebar tabs across all user dashboards:
1. **Buyer Dashboard** (`/buyer`)
2. **Rwanda Vendor Dashboard** (`/vendor-rwanda`)
3. **Canada Vendor Dashboard** (`/vendor-canada`)
4. **Logistics Courier Dashboard** (`/logistics`)

---

## 5. 🛫 Flight Itinerary, Route Filtering & Editable Courier Trips

- **Extended Flight Itinerary Types & Schema**:
  - `departure_airport` & `arrival_airport` (e.g. `YYZ ✈ KGL`)
  - `boarding_time` (e.g. `14:30 EST`)
  - `landing_time` (e.g. `08:15 CAT`)
  - `flight_duration_hours` (e.g. `13.5 hrs`)
  - `itinerary_notes` (e.g. `Direct express flight via RwandAir WB302`)
  - `courier_phone` & `courier_whatsapp`
- **Courier Trip Posting & Editing (`/logistics`)**: Couriers can post new flight baggage trips or click **EDIT TRIP** to modify active flight trips in real-time.
- **Direction-Based Courier Selection**: `SendCargoWizardModal.tsx` filters available couriers based on the sender's origin and destination transport direction (e.g. `YYZ ✈ KGL`).

---

## 6. 📱 Receiver Tracking View & Courier Contact Buttons

- `PackageDetailModal.tsx` displays full parcel details, intake photos, 6-stage milestones, AND direct Courier contact buttons (**Call Courier** & **WhatsApp Courier**).

---

## 7. ⚖️ Interactive Terms & Conditions Modal

Created `TermsAndConditionsModal.tsx` displaying compliance terms for:
- **Couriers**: Baggage allowance rules, non-prohibited item inspection, schedule accuracy.
- **Senders**: Accurate item declaration, zero contraband policy, official sender identification.
- **Receivers**: Delivery inspection and Escrow Vault PIN release.

---

## 8. 🗄️ Complete Supabase Database Schema (`src/lib/supabase/schema.sql`)

Includes all 15 database tables, custom ENUM types, triggers, indexes, and storage buckets:

```sql
-- 1. Profiles (User Identity, KYC & Settlement Accounts)
CREATE TABLE public.profiles (...);

-- 2. User Devices & Activity Logs
CREATE TABLE public.user_devices (...);
CREATE TABLE public.activity_logs (...);

-- 3. Products & Wishlists
CREATE TABLE public.products (...);
CREATE TABLE public.user_wishlists (...);

-- 4. Carrier Trips (Flight Baggage Allowance & Itineraries)
CREATE TABLE public.carrier_trips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  courier_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  courier_name TEXT NOT NULL DEFAULT 'Courier',
  courier_phone TEXT,
  courier_whatsapp TEXT,
  courier_email TEXT,
  flight_number TEXT NOT NULL,
  airline TEXT NOT NULL DEFAULT 'RwandAir',
  departure_airport VARCHAR(10) NOT NULL DEFAULT 'YYZ',
  arrival_airport VARCHAR(10) NOT NULL DEFAULT 'KGL',
  departure_date DATE NOT NULL,
  boarding_time TEXT,
  landing_time TEXT,
  flight_duration_hours NUMERIC(4, 1) DEFAULT 13.5,
  itinerary_notes TEXT,
  total_capacity_kg NUMERIC(6, 2) NOT NULL DEFAULT 40.0,
  available_capacity_kg NUMERIC(6, 2) NOT NULL DEFAULT 28.0,
  rate_per_kg_cad NUMERIC(8, 2) NOT NULL DEFAULT 14.00,
  status trip_status NOT NULL DEFAULT 'listed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Orders, Order Items & Escrow Accounts
CREATE TABLE public.orders (...);
CREATE TABLE public.order_items (...);
CREATE TABLE public.escrow_accounts (...);

-- 6. Shipment Manifests, Shipment Milestones & Cargo Packages
CREATE TABLE public.shipment_manifests (...);
CREATE TABLE public.shipment_milestones (...);
CREATE TABLE public.cargo_packages (...);

-- 7. KYC Documents, Notifications & User Settings
CREATE TABLE public.kyc_documents (...);
CREATE TABLE public.notifications (...);
CREATE TABLE public.user_settings (...);

-- 8. Storage Buckets (Public Storage Buckets)
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('product-images', 'product-images', true),
  ('cargo-photos', 'cargo-photos', true),
  ('package-images', 'package-images', true),
  ('documents', 'documents', true),
  ('manifest-photos', 'manifest-photos', true),
  ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 9. Auto-Confirm Email Trigger
CREATE OR REPLACE FUNCTION public.auto_confirm_email()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.email_confirmed_at IS NULL THEN
    NEW.email_confirmed_at := NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_auto_confirm_email
BEFORE INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.auto_confirm_email();
```
