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