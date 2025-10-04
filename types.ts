

import type React from 'react';

export interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number; // in sqft
  type: 'House' | 'Apartment' | 'Condo' | 'Villa';
  status: 'For Sale' | 'For Rent' | 'Sold' | 'Rented' | 'Paused';
  images: string[];
  description: string;
  features: string[];
  amenities: string[];
  agent: Agent;
  year_built: number;
}

export interface Agent {
  name: string;
  imageUrl: string;
  phone: string;
  email: string;
}

export interface Service {
  icon: React.ElementType;
  title: string;
  description: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  location: string;
}

export interface BlogPost {
  id: string;
  title: string;
  author: string;
  date: string;
  excerpt: string;
  imageUrl: string;
  category: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'New' | 'Contacted' | 'Appointment Scheduled' | 'Closed' | 'Lost';
  inquiry_date: string;
  property_id?: string;
  initial_message?: string;
  property?: {
    id: string;
    title: string;
  } | null;
}

export interface ClientStatusHistory {
  id: number;
  client_id: string;
  old_status: Client['status'];
  new_status: Client['status'];
  changed_at: string;
}

export interface WebsiteContent {
  id: number;
  hero_headline: string;
  hero_subheadline: string;
  hero_image: string;
  why_choose_us_title: string;
  why_choose_us_text: string;
}