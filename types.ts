
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
  yearBuilt: number;
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
  inquiryDate: string;
}
