export type UserRole = 'HOST' | 'VENDOR';

export interface HostProfile {
  organization_name: string;
  contact_phone: string;
  bio: string;
  avatar_url: string;
}

export interface VendorProfile {
  business_name: string;
  business_description: string;
  website_url: string;
  logo_url: string;
  social_links: {
    instagram?: string;
    twitter?: string;
  };
}

// FOR HOSTS
export type EventStatus = 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'COMPLETED';

export interface PopUpEvent {
  id?: string;
  host_id: string;
  title: string;
  description: string;
  category: string;
  start_date: string;
  end_date: string;
  location_address: string;
  location_lat: number,
  location_lng: number,
  booth_price: number;
  price_negotiable: boolean;
  spots_available: number;
  spots_filled: number;
  application_deadline: string;
  booth_specifications: string;
  amenities: string[];
  images: string[];
  status: EventStatus;
}