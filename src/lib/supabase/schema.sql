-- =============================================================================
-- DIASPORA LINK COMPREHENSIVE DATABASE SCHEMA (SUPABASE / POSTGRESQL)
-- Protocol: Cross-Border Diaspora E-Commerce & Freight Luggage Logistics
-- Corridors: KGL (Kigali, Rwanda) ↔ YYZ (Toronto, Canada)
-- =============================================================================

-- Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- SAFELY CREATE CUSTOM ENUMS (IDEMPOTENT GUARDS)
-- =============================================================================

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('buyer', 'vendor_rwanda', 'vendor_canada', 'logistics_courier', 'admin');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'corridor_code') THEN
        CREATE TYPE corridor_code AS ENUM ('KGL_YYZ', 'YYZ_KGL', 'BOTH');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
        CREATE TYPE order_status AS ENUM ('created', 'escrow_holding', 'hub_received', 'in_transit_flight', 'customs_cleared', 'courier_dispatched', 'delivered', 'cancelled');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'escrow_status') THEN
        CREATE TYPE escrow_status AS ENUM ('holding', 'partially_released', 'fully_released', 'refunded', 'disputed');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'product_category') THEN
        CREATE TYPE product_category AS ENUM ('coffee_tea', 'fashion', 'crafts', 'gifts', 'decor', 'books', 'business', 'general');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'trip_status') THEN
        CREATE TYPE trip_status AS ENUM ('listed', 'fully_booked', 'in_flight', 'completed', 'cancelled');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'milestone_status') THEN
        CREATE TYPE milestone_status AS ENUM ('completed', 'current', 'pending');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'document_status') THEN
        CREATE TYPE document_status AS ENUM ('pending', 'verified', 'rejected');
    END IF;
END $$;

-- =============================================================================
-- 1. PROFILES TABLE (USER IDENTITY, ROLE APPROVAL & SETTLEMENT ACCOUNTS)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  phone_number TEXT,
  avatar_url TEXT,
  role user_role NOT NULL DEFAULT 'buyer',
  corridor_preference corridor_code NOT NULL DEFAULT 'KGL_YYZ',
  kyc_verified BOOLEAN NOT NULL DEFAULT FALSE,
  passport_number TEXT,
  
  -- Admin Approval Flag for Seller/Courier Accounts
  is_approved BOOLEAN NOT NULL DEFAULT TRUE, -- TRUE for buyers, FALSE for vendor_rwanda/vendor_canada/logistics_courier until Admin approves
  approved_at TIMESTAMPTZ,
  approved_by UUID,
  
  -- Business Tax Identifiers
  rdb_tin_number TEXT,                -- Rwanda Development Board TIN (Sellers in Rwanda)
  cra_business_number TEXT,           -- Canada Revenue Agency BN (Sellers in Canada)
  
  -- Financial Settlement Accounts
  stripe_account_id TEXT,             -- Stripe Connect Account ID (CAD Payouts)
  momo_phone_number TEXT,             -- MTN / Airtel Mobile Money Number (RWF Payouts)
  momo_provider VARCHAR(10) DEFAULT 'MTN',
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure role column exists on public.profiles
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'role'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN role user_role NOT NULL DEFAULT 'buyer';
    END IF;
END $$;

-- =============================================================================
-- 2. USER DEVICES TABLE (SYSTEM AUDIT & DEVICE SECURITY MONITORING)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.user_devices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  device_name TEXT NOT NULL,          -- e.g. "iPhone 15 Pro", "MacBook Pro"
  os_version TEXT NOT NULL,           -- e.g. "iOS 17.4", "macOS 15.1"
  ip_address TEXT,                    -- Client IP address
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  last_login_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 3. SYSTEM ACTIVITY & AUDIT LOGS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,               -- e.g. "user.login", "vendor.approved", "escrow.released"
  category TEXT NOT NULL DEFAULT 'system', -- 'auth', 'security', 'escrow', 'customs', 'admin'
  ip_address TEXT,
  device_info TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 4. PRODUCTS TABLE (EXPORT INVENTORY & HS TARIFF CODES)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category product_category NOT NULL DEFAULT 'general',
  origin_country VARCHAR(2) NOT NULL DEFAULT 'RW', -- 'RW' or 'CA'
  target_corridor corridor_code NOT NULL DEFAULT 'KGL_YYZ',
  
  -- Dual-Currency Pricing & Weight
  price_cad NUMERIC(10, 2) NOT NULL,
  price_rwf NUMERIC(12, 2) NOT NULL,
  weight_kg NUMERIC(6, 2) NOT NULL DEFAULT 0.5,
  
  -- Customs & Export Certification
  hs_tariff_code TEXT,                -- Harmonized System Code (e.g. 0901.21.00)
  rdb_certified BOOLEAN NOT NULL DEFAULT TRUE,
  
  -- Catalog Availability Controls & Analytics
  in_stock BOOLEAN NOT NULL DEFAULT TRUE,
  is_unlisted BOOLEAN NOT NULL DEFAULT FALSE,
  stock_quantity INT NOT NULL DEFAULT 100,
  likes_count INT NOT NULL DEFAULT 0,
  purchase_count INT NOT NULL DEFAULT 0,
  
  images TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 4b. USER WISHLISTS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.user_wishlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, product_id)
);

-- =============================================================================
-- 5. CARRIER TRIPS TABLE (FLIGHT CAPACITY MONETISATION)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.carrier_trips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  courier_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  flight_number TEXT NOT NULL,         -- e.g. WB 302 / ET 602
  airline TEXT NOT NULL DEFAULT 'RwandAir',
  departure_airport VARCHAR(3) NOT NULL DEFAULT 'KGL',
  arrival_airport VARCHAR(3) NOT NULL DEFAULT 'YYZ',
  departure_date DATE NOT NULL,
  
  -- Luggage Capacity (kg) & Rates
  total_capacity_kg NUMERIC(6, 2) NOT NULL DEFAULT 15.0,
  available_capacity_kg NUMERIC(6, 2) NOT NULL DEFAULT 15.0,
  rate_per_kg_cad NUMERIC(8, 2) NOT NULL DEFAULT 10.00,
  
  status trip_status NOT NULL DEFAULT 'listed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 6. ORDERS TABLE (CROSS-BORDER PURCHASES)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT NOT NULL UNIQUE,  -- e.g. ORD-2026-88219
  buyer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  vendor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  courier_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  
  status order_status NOT NULL DEFAULT 'created',
  corridor corridor_code NOT NULL DEFAULT 'KGL_YYZ',
  
  total_cad NUMERIC(10, 2) NOT NULL,
  total_rwf NUMERIC(12, 2) NOT NULL,
  shipping_fee_cad NUMERIC(8, 2) NOT NULL DEFAULT 0.00,
  customs_duty_cad NUMERIC(8, 2) NOT NULL DEFAULT 0.00,
  
  -- Delivery Address
  recipient_name TEXT NOT NULL,
  recipient_phone TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'Toronto',
  country VARCHAR(2) NOT NULL DEFAULT 'CA',
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 7. ORDER ITEMS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  quantity INT NOT NULL DEFAULT 1,
  unit_price_cad NUMERIC(10, 2) NOT NULL,
  unit_price_rwf NUMERIC(12, 2) NOT NULL,
  total_cad NUMERIC(10, 2) NOT NULL,
  total_rwf NUMERIC(12, 2) NOT NULL
);

-- =============================================================================
-- 8. ESCROW ACCOUNTS TABLE (DUAL-CURRENCY SECURITY LOCK)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.escrow_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL UNIQUE REFERENCES public.orders(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  vendor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  courier_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  
  amount_cad NUMERIC(10, 2) NOT NULL,
  amount_rwf NUMERIC(12, 2) NOT NULL,
  status escrow_status NOT NULL DEFAULT 'holding',
  
  security_pin_hash TEXT,             -- 6-digit Security PIN for release approval
  released_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 9. SHIPMENT MANIFESTS & QR SEALS TABLE (IATA AIR WAYBILLS)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.shipment_manifests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL UNIQUE REFERENCES public.orders(id) ON DELETE CASCADE,
  awb_number TEXT NOT NULL UNIQUE,    -- e.g. AWB-KGL-88219
  carrier_trip_id UUID REFERENCES public.carrier_trips(id) ON DELETE SET NULL,
  
  origin_hub TEXT NOT NULL DEFAULT 'Kigali Cargo Hub 01',
  destination_hub TEXT NOT NULL DEFAULT 'YYZ Pearson Airport Terminal 3',
  weight_kg NUMERIC(6, 2) NOT NULL,
  declared_value_cad NUMERIC(10, 2) NOT NULL,
  
  cbsa_clearance_status TEXT NOT NULL DEFAULT 'pre_cleared',
  qr_seal_code TEXT NOT NULL UNIQUE,  -- e.g. RW-SEAL-8842
  inspection_photo_url TEXT,
  
  current_location TEXT DEFAULT 'Kigali International Airport Hub',
  estimated_delivery_date DATE,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 10. SHIPMENT MILESTONES TABLE (WAYBILL TIMELINE TRACKING)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.shipment_milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  manifest_id UUID NOT NULL REFERENCES public.shipment_manifests(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  status milestone_status NOT NULL DEFAULT 'pending',
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 11. KYC DOCUMENTS TABLE (VERIFICATION ATTACHMENTS)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.kyc_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,        -- 'passport', 'rdb_tin', 'cra_bn', 'flight_ticket'
  document_number TEXT,
  file_url TEXT NOT NULL,
  status document_status NOT NULL DEFAULT 'pending',
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 12. MASTER SYSTEM NOTIFICATIONS CATCH-ALL TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  channel VARCHAR(20) NOT NULL DEFAULT 'in_app',
  category VARCHAR(30) NOT NULL DEFAULT 'order_update',
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  action_route TEXT,
  data_payload JSONB DEFAULT '{}'::jsonb,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 13. USER SETTINGS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  preferred_language VARCHAR(5) NOT NULL DEFAULT 'en',
  preferred_currency VARCHAR(3) NOT NULL DEFAULT 'CAD',
  push_notifications_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  haptics_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  biometric_auth_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  data_saver_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- STORAGE BUCKETS PROVISIONING
-- =============================================================================

INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('documents', 'documents', false),
  ('product-images', 'product-images', true),
  ('manifest-photos', 'manifest-photos', true)
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- AUTOMATIC TIMESTAMPTZ & AUTH PROFILE CREATION TRIGGERS
-- =============================================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_products_updated_at ON public.products;
CREATE TRIGGER trg_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_carrier_trips_updated_at ON public.carrier_trips;
CREATE TRIGGER trg_carrier_trips_updated_at BEFORE UPDATE ON public.carrier_trips FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_orders_updated_at ON public.orders;
CREATE TRIGGER trg_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_escrow_updated_at ON public.escrow_accounts;
CREATE TRIGGER trg_escrow_updated_at BEFORE UPDATE ON public.escrow_accounts FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_shipment_manifests_updated_at ON public.shipment_manifests;
CREATE TRIGGER trg_shipment_manifests_updated_at BEFORE UPDATE ON public.shipment_manifests FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_user_settings_updated_at ON public.user_settings;
CREATE TRIGGER trg_user_settings_updated_at BEFORE UPDATE ON public.user_settings FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  role_text TEXT;
  assigned_role public.user_role := 'buyer'::public.user_role;
  auto_approved BOOLEAN := TRUE;
BEGIN
  BEGIN
    role_text := NEW.raw_user_meta_data->>'role';
    
    IF role_text = 'vendor_rwanda' THEN
      assigned_role := 'vendor_rwanda'::public.user_role;
      auto_approved := FALSE;
    ELSIF role_text = 'vendor_canada' THEN
      assigned_role := 'vendor_canada'::public.user_role;
      auto_approved := FALSE;
    ELSIF role_text = 'logistics_courier' OR role_text = 'transporter' THEN
      assigned_role := 'logistics_courier'::public.user_role;
      auto_approved := FALSE;
    ELSIF role_text = 'admin' THEN
      assigned_role := 'admin'::public.user_role;
      auto_approved := TRUE;
    ELSE
      assigned_role := 'buyer'::public.user_role;
      auto_approved := TRUE;
    END IF;
  EXCEPTION WHEN OTHERS THEN
    assigned_role := 'buyer'::public.user_role;
    auto_approved := TRUE;
  END;

  BEGIN
    INSERT INTO public.profiles (
      id, email, full_name, role, is_approved, rdb_tin_number, cra_business_number, phone_number
    )
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'full_name', 'Diaspora Link Member'),
      assigned_role,
      auto_approved,
      NEW.raw_user_meta_data->>'rdb_tin_number',
      NEW.raw_user_meta_data->>'cra_business_number',
      NEW.raw_user_meta_data->>'phone_number'
    )
    ON CONFLICT (id) DO UPDATE SET
      role = EXCLUDED.role,
      is_approved = EXCLUDED.is_approved;

    INSERT INTO public.user_settings (user_id) VALUES (NEW.id) ON CONFLICT (user_id) DO NOTHING;
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'handle_new_user profile insert exception: %', SQLERRM;
  END;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carrier_trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.escrow_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipment_manifests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Profiles RLS
DROP POLICY IF EXISTS "Public Read Profiles" ON public.profiles;
CREATE POLICY "Public Read Profiles" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users Update Own Profile" ON public.profiles;
CREATE POLICY "Users Update Own Profile" ON public.profiles FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Users Insert Own Profile" ON public.profiles;
CREATE POLICY "Users Insert Own Profile" ON public.profiles FOR INSERT WITH CHECK (true);

-- Products RLS
DROP POLICY IF EXISTS "Public Read Products" ON public.products;
CREATE POLICY "Public Read Products" ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Insert Products" ON public.products;
CREATE POLICY "Public Insert Products" ON public.products FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public Update Products" ON public.products;
CREATE POLICY "Public Update Products" ON public.products FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Public Delete Products" ON public.products;
CREATE POLICY "Public Delete Products" ON public.products FOR DELETE USING (true);

-- Carrier Trips RLS (Rwanda & Canada Couriers)
DROP POLICY IF EXISTS "Public Read Carrier Trips" ON public.carrier_trips;
CREATE POLICY "Public Read Carrier Trips" ON public.carrier_trips FOR SELECT USING (true);

DROP POLICY IF EXISTS "Couriers Manage Own Carrier Trips" ON public.carrier_trips;
CREATE POLICY "Couriers Manage Own Carrier Trips" ON public.carrier_trips FOR ALL USING (true);

-- Orders & Order Items RLS
DROP POLICY IF EXISTS "Public Read Orders" ON public.orders;
CREATE POLICY "Public Read Orders" ON public.orders FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Insert Orders" ON public.orders;
CREATE POLICY "Public Insert Orders" ON public.orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public Update Orders" ON public.orders;
CREATE POLICY "Public Update Orders" ON public.orders FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Public Read Order Items" ON public.order_items;
CREATE POLICY "Public Read Order Items" ON public.order_items FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Insert Order Items" ON public.order_items;
CREATE POLICY "Public Insert Order Items" ON public.order_items FOR INSERT WITH CHECK (true);

-- Escrow Accounts RLS
DROP POLICY IF EXISTS "Public Read Escrow Accounts" ON public.escrow_accounts;
CREATE POLICY "Public Read Escrow Accounts" ON public.escrow_accounts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Insert Escrow Accounts" ON public.escrow_accounts;
CREATE POLICY "Public Insert Escrow Accounts" ON public.escrow_accounts FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public Update Escrow Accounts" ON public.escrow_accounts;
CREATE POLICY "Public Update Escrow Accounts" ON public.escrow_accounts FOR UPDATE USING (true);

-- Shipment Manifests & Milestones RLS
DROP POLICY IF EXISTS "Public Read Shipment Manifests" ON public.shipment_manifests;
CREATE POLICY "Public Read Shipment Manifests" ON public.shipment_manifests FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Manage Shipment Manifests" ON public.shipment_manifests;
CREATE POLICY "Public Manage Shipment Manifests" ON public.shipment_manifests FOR ALL USING (true);

-- User Wishlists RLS
DROP POLICY IF EXISTS "Users Read Own Wishlist" ON public.user_wishlists;
CREATE POLICY "Users Read Own Wishlist" ON public.user_wishlists FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users Manage Own Wishlist" ON public.user_wishlists;
CREATE POLICY "Users Manage Own Wishlist" ON public.user_wishlists FOR ALL USING (auth.uid() = user_id);

-- User Settings RLS
DROP POLICY IF EXISTS "Users Read Own Settings" ON public.user_settings;
CREATE POLICY "Users Read Own Settings" ON public.user_settings FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users Manage Own Settings" ON public.user_settings;
CREATE POLICY "Users Manage Own Settings" ON public.user_settings FOR ALL USING (auth.uid() = user_id);

-- User Devices RLS
DROP POLICY IF EXISTS "Users Read Devices" ON public.user_devices;
CREATE POLICY "Users Read Devices" ON public.user_devices FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users Manage Devices" ON public.user_devices;
CREATE POLICY "Users Manage Devices" ON public.user_devices FOR ALL USING (true);

-- Activity Logs RLS
DROP POLICY IF EXISTS "Public Read Activity Logs" ON public.activity_logs;
CREATE POLICY "Public Read Activity Logs" ON public.activity_logs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Insert Activity Logs" ON public.activity_logs;
CREATE POLICY "Public Insert Activity Logs" ON public.activity_logs FOR INSERT WITH CHECK (true);

-- KYC Documents RLS
DROP POLICY IF EXISTS "Users Read KYC Docs" ON public.kyc_documents;
CREATE POLICY "Users Read KYC Docs" ON public.kyc_documents FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users Manage KYC Docs" ON public.kyc_documents;
CREATE POLICY "Users Manage KYC Docs" ON public.kyc_documents FOR ALL USING (true);

-- Notifications RLS
DROP POLICY IF EXISTS "Users Read Own Notifications" ON public.notifications;
CREATE POLICY "Users Read Own Notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "Users Manage Notifications" ON public.notifications;
CREATE POLICY "Users Manage Notifications" ON public.notifications FOR ALL USING (true);

-- =============================================================================
-- SUPABASE STORAGE BUCKETS & STORAGE RLS POLICIES
-- =============================================================================

INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('product-images', 'product-images', true),
  ('documents', 'documents', true),
  ('manifest-photos', 'manifest-photos', true),
  ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public Read Storage Objects" ON storage.objects;
CREATE POLICY "Public Read Storage Objects" ON storage.objects FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Insert Storage Objects" ON storage.objects;
CREATE POLICY "Public Insert Storage Objects" ON storage.objects FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public Update Storage Objects" ON storage.objects;
CREATE POLICY "Public Update Storage Objects" ON storage.objects FOR UPDATE USING (true);
