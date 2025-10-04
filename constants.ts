import type { Property, Service, Testimonial, BlogPost, Client } from './types';
import { HomeIcon, BuildingOffice2Icon, BanknotesIcon, UserGroupIcon, ShieldCheckIcon, ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline';

export const SERVICES: Service[] = [
  {
    icon: HomeIcon,
    title: 'Property Sales',
    description: 'We provide expert assistance for selling your property at the best market price, handling everything from listing to closing.',
  },
  {
    icon: BuildingOffice2Icon,
    title: 'Property Buying',
    description: 'Our team helps you find and purchase your dream home, guiding you through every step of the buying process with personalized service.',
  },
  {
    icon: BanknotesIcon,
    title: 'Mortgage Assistance',
    description: 'We connect you with trusted financial partners to secure the best mortgage rates and terms for your new property.',
  },
  {
    icon: UserGroupIcon,
    title: 'Property Management',
    description: 'Comprehensive management services for your rental properties, ensuring peace of mind and maximizing your investment return.',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Legal Consulting',
    description: 'Access to our network of real estate legal experts to ensure all transactions are smooth, secure, and legally sound.',
  },
  {
    icon: ChatBubbleBottomCenterTextIcon,
    title: 'Market Analysis',
    description: 'Receive in-depth market analysis and property valuation to make informed decisions whether you are buying or selling.',
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    quote: 'Working with Prestige Realty was a dream. They were professional, knowledgeable, and made the entire process of buying our first home seamless and stress-free. Highly recommended!',
    author: 'The Johnson Family',
    location: 'Austin, TX',
  },
  {
    quote: 'They sold our house in less than a week for above asking price! The marketing was top-notch and their negotiation skills are unparalleled. We couldn\'t be happier.',
    author: 'Maria Garcia',
    location: 'Malibu, CA',
  },
  {
    quote: 'As an investor, I rely on expert advice. The team at Prestige Realty understands the market inside and out. They have been instrumental in growing my property portfolio.',
    author: 'David Chen',
    location: 'New York, NY',
  },
];

export const BLOG_POSTS: BlogPost[] = [
    {
        id: '1',
        title: '5 Tips for First-Time Homebuyers in 2024',
        author: 'Jane Smith',
        date: 'July 15, 2024',
        excerpt: 'Navigating the real estate market for the first time can be daunting. Here are five essential tips to help you make a smart and confident purchase...',
        imageUrl: 'https://picsum.photos/seed/blog1/600/400',
        category: 'Buying',
    },
    {
        id: '2',
        title: 'How to Stage Your Home to Sell for Top Dollar',
        author: 'John Doe',
        date: 'July 10, 2024',
        excerpt: 'Home staging is a critical step in the selling process. Learn how to showcase your home\'s best features to attract buyers and maximize your profit.',
        imageUrl: 'https://picsum.photos/seed/blog2/600/400',
        category: 'Selling',
    },
    {
        id: '3',
        title: 'Understanding the Current Mortgage Rate Trends',
        author: 'Emily White',
        date: 'July 5, 2024',
        excerpt: 'Mortgage rates are always changing. We break down the current trends and what they mean for you whether you\'re buying, selling, or refinancing.',
        imageUrl: 'https://picsum.photos/seed/blog3/600/400',
        category: 'Finance',
    },
];
