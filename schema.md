-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.applications (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL,
  vendor_id uuid NOT NULL,
  status USER-DEFINED DEFAULT 'PENDING'::application_status,
  business_description text,
  products_offered text,
  booth_requirements text,
  portfolio_images ARRAY,
  special_requests text,
  applied_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  reviewed_at timestamp with time zone,
  host_notes text,
  CONSTRAINT applications_pkey PRIMARY KEY (id),
  CONSTRAINT applications_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id),
  CONSTRAINT applications_vendor_id_fkey FOREIGN KEY (vendor_id) REFERENCES public.users(id)
);
CREATE TABLE public.events (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  host_id uuid NOT NULL,
  title character varying NOT NULL,
  description text,
  category USER-DEFINED NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  location_address text NOT NULL,
  location_lat numeric,
  location_lng numeric,
  booth_price numeric DEFAULT 0.00,
  price_negotiable boolean DEFAULT false,
  spots_available integer DEFAULT 0,
  spots_filled integer DEFAULT 0,
  application_deadline date,
  booth_specifications text,
  amenities ARRAY,
  images ARRAY,
  status USER-DEFINED DEFAULT 'DRAFT'::event_status,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT events_pkey PRIMARY KEY (id),
  CONSTRAINT events_host_id_fkey FOREIGN KEY (host_id) REFERENCES public.users(id)
);
CREATE TABLE public.hosts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  organization_name character varying NOT NULL,
  contact_phone character varying,
  bio text,
  avatar_url text,
  CONSTRAINT hosts_pkey PRIMARY KEY (id),
  CONSTRAINT hosts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.messages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  application_id uuid,
  sender_id uuid NOT NULL,
  receiver_id uuid NOT NULL,
  content text NOT NULL,
  attachments ARRAY,
  is_read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT messages_pkey PRIMARY KEY (id),
  CONSTRAINT messages_application_id_fkey FOREIGN KEY (application_id) REFERENCES public.applications(id),
  CONSTRAINT messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.users(id),
  CONSTRAINT messages_receiver_id_fkey FOREIGN KEY (receiver_id) REFERENCES public.users(id)
);
CREATE TABLE public.users (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  email character varying NOT NULL UNIQUE,
  password_hash text NOT NULL,
  role USER-DEFINED NOT NULL,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  is_verified boolean DEFAULT false,
  CONSTRAINT users_pkey PRIMARY KEY (id)
);
CREATE TABLE public.vendors (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  business_name character varying NOT NULL,
  business_description text,
  categories ARRAY,
  portfolio_images ARRAY,
  website_url text,
  social_links jsonb DEFAULT '{}'::jsonb,
  logo_url text,
  CONSTRAINT vendors_pkey PRIMARY KEY (id),
  CONSTRAINT vendors_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);