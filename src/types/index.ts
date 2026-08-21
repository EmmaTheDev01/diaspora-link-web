export type UserRole =
  | 'buyer'
  | 'vendor_rwanda'
  | 'vendor_canada'
  | 'logistics_courier'
  | 'transporter'
  | 'admin';

export type CorridorType = 'KGL_TO_YYZ' | 'YYZ_TO_KGL' | 'BOTH' | 'KGL_YYZ' | 'YYZ_KGL';

export interface UserProfile {
  id: string;
  email: string;
  phone_number: string;
  full_name: string;
  role: UserRole;
  country: 'RW' | 'CA';
  is_kyc_verified: boolean;
  is_approved?: boolean;
  rdb_tin_number?: string;
  cra_business_number?: string;
  flight_pnr?: string;
  avatar_url?: string;
  momo_number?: string;
  momo_provider?: 'MTN' | 'AIRTEL';
  stripe_account_id?: string;
  created_at: string;
}

export interface UserSettings {
  id?: string;
  user_id: string;
  preferred_language: 'en' | 'fr' | 'rw';
  preferred_currency: 'CAD' | 'RWF';
  push_notifications_enabled: boolean;
  haptics_enabled: boolean;
  biometric_auth_enabled: boolean;
  data_saver_enabled: boolean;
  updated_at?: string;
}

export type ProductCategory =
  | 'coffee_tea'
  | 'fashion'
  | 'crafts'
  | 'gifts'
  | 'decor'
  | 'books'
  | 'business'
  | 'general';

export interface Product {
  id: string;
  vendor_id: string;
  vendor_name: string;
  title: string;
  description: string;
  category: ProductCategory;
  origin_country: 'RW' | 'CA';
  target_corridor: CorridorType;
  price_rwf: number;
  price_cad: number;
  weight_kg: number;
  hs_tariff_code?: string;
  images: string[];
  stock_quantity: number;
  is_active?: boolean;
  in_stock?: boolean;
  is_unlisted?: boolean;
  rdb_certified?: boolean;
  likes_count?: number;
  purchase_count?: number;
  rating?: number;
  created_at: string;
}

export type EscrowStatus =
  | 'holding'
  | 'partially_released'
  | 'fully_released'
  | 'disputed'
  | 'refunded';

export type ShipmentStatus =
  | 'created'
  | 'escrow_holding'
  | 'hub_received'
  | 'in_flight'
  | 'customs_cleared'
  | 'courier_dispatched'
  | 'delivered'
  | 'cancelled';

export interface OrderItem {
  product_id: string;
  title: string;
  quantity: number;
  unit_price_cad: number;
  unit_price_rwf: number;
  weight_kg: number;
  image?: string;
}

export interface Order {
  id: string;
  order_number: string;
  buyer_id: string;
  buyer_name?: string;
  vendor_id: string;
  vendor_name?: string;
  courier_id?: string;
  items: OrderItem[];
  corridor: CorridorType;
  total_cad: number;
  total_rwf: number;
  shipping_fee_cad: number;
  customs_duty_cad: number;
  payment_method: 'STRIPE' | 'MTN_MOMO' | 'AIRTEL_MONEY';
  status: ShipmentStatus;
  escrow_status: EscrowStatus;
  awb_number: string;
  qr_seal_code: string;
  escrow_released?: boolean;
  escrow_release_pin?: string;
  delivery_address: {
    street: string;
    city: string;
    province_or_state: string;
    postal_code: string;
    country: 'RW' | 'CA';
    recipient_name: string;
    recipient_phone: string;
  };
  created_at: string;
  updated_at: string;
}

export interface CarrierTrip {
  id: string;
  courier_id: string;
  courier_name: string;
  courier_phone?: string;
  courier_whatsapp?: string;
  courier_email?: string;
  flight_number: string;
  airline: string;
  departure_airport: string;
  arrival_airport: string;
  departure_date: string;
  boarding_time?: string;
  landing_time?: string;
  flight_duration_hours?: number;
  itinerary_notes?: string;
  total_capacity_kg: number;
  available_capacity_kg: number;
  rate_per_kg_cad: number;
  rate_per_kg_rwf: number;
  status: 'listed' | 'fully_booked' | 'in_flight' | 'completed';
  created_at: string;
}


export interface ShipmentMilestone {
  id: string;
  title: string;
  location: string;
  status: 'completed' | 'current' | 'pending';
  timestamp: string;
}

export interface UserDevice {
  id: string;
  user_id: string;
  user_name: string;
  device_name: string;
  os_version: string;
  ip_address: string;
  is_active: boolean;
  last_login_at: string;
}

export interface ActivityLog {
  id: string;
  user_id?: string;
  user_name?: string;
  action: string;
  category: 'auth' | 'security' | 'escrow' | 'customs' | 'admin';
  ip_address?: string;
  metadata?: any;
  created_at: string;
}

export interface EscrowAccount {
  id: string;
  order_id: string;
  order_number: string;
  buyer_id: string;
  buyer_name: string;
  vendor_id: string;
  vendor_name: string;
  courier_id?: string;
  amount_cad: number;
  amount_rwf: number;
  status: EscrowStatus;
  released_at?: string;
  created_at: string;
}

export type CargoStageCode =
  | '01_BOOK'
  | '02_COLLECT'
  | '03_CONSOLIDATE'
  | '04_FLY'
  | '05_CLEAR'
  | '06_DELIVER';

export type CargoType =
  | 'personal_effects'
  | 'household_items'
  | 'commercial_goods'
  | 'electronics'
  | 'apparel'
  | 'gifts'
  | 'documents';

export interface PackageContentItem {
  id: string;
  name: string;
  quantity: number;
  weight_kg: number;
  category: CargoType;
  image?: string;
}

export interface CargoPackage {
  id: string;
  awb_number: string;
  qr_seal_code: string;
  barcode_id: string;
  description: string;
  cargo_type: CargoType;
  
  // Sender Contact & Official Identification
  sender_id_type: 'passport' | 'national_id' | 'drivers_license';
  sender_id_number: string;
  sender: {
    full_name: string;
    email: string;
    phone: string;
    city: string;
    country: string;
    address: string;
  };
  
  // Receiver Contact & Destination
  receiver: {
    full_name: string;
    phone: string;
    whatsapp: string;
    delivery_address: string;
    city: string;
    country: string;
  };
  
  // Itemized Contents List
  items: PackageContentItem[];
  
  // Assigned Courier Flight & Trip
  courier_id?: string;
  courier_name?: string;
  carrier_trip_id?: string;
  flight_number?: string;
  
  // Physical Specs & Rates
  weight_kg: number;
  dimensions: {
    length_cm: number;
    width_cm: number;
    height_cm: number;
  };
  declared_value_cad: number;
  rate_per_kg_cad: number;
  pickup_fee_cad: number;
  total_cost_cad: number;
  total_cost_rwf: number;
  
  // Package Photos Array
  images: string[];
  
  // Milestones & Logistics
  current_stage: CargoStageCode;
  stage_title: string;
  milestones: ShipmentMilestone[];
  transport_mode: 'Motorcycle' | 'Car' | 'Van' | 'Truck';
  proof_of_delivery_pin?: string;
  is_escrow_protected: boolean;
  created_at: string;
  updated_at: string;
}


