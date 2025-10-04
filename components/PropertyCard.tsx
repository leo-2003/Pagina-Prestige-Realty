
import React from 'react';
import type { Property } from '../types';
import { MapPinIcon, BuildingOffice2Icon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';

interface PropertyCardProps {
  property: Property;
}

const BedIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
  </svg>
);

const BathIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.5a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM3.5 6.5A1.5 1.5 0 002 8v11a2 2 0 002 2h16a2 2 0 002-2V8a1.5 1.5 0 00-1.5-1.5h-15zm16.5 0h-2m-13 0h-2" />
    </svg>
);


const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 group">
      <Link to={`/properties/${property.id}`} className="block">
        <div className="relative">
          <img
            className="w-full h-56 object-cover"
            src={property.images[0]}
            alt={property.title}
            loading="lazy"
          />
          <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
            {property.status}
          </div>
           <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
              <h3 className="text-white text-xl font-bold truncate">{property.title}</h3>
              <p className="text-blue-200 text-sm flex items-center mt-1">
                <MapPinIcon className="h-4 w-4 mr-1"/>
                {property.location}
              </p>
           </div>
        </div>
        <div className="p-4">
            <div className="flex justify-between items-center mb-3">
                <p className="text-2xl font-bold text-blue-600">
                    ${property.price.toLocaleString()}
                </p>
                 <div className="flex items-center text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
                    <BuildingOffice2Icon className="h-4 w-4 mr-1 text-gray-500"/>
                    {property.type}
                 </div>
            </div>
         
          <div className="flex justify-around items-center text-sm text-gray-700 border-t pt-3">
            <div className="flex items-center">
              <BedIcon />
              <span>{property.bedrooms} Beds</span>
            </div>
            <div className="flex items-center">
              <BathIcon />
              <span>{property.bathrooms} Baths</span>
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 0h-4m4 0l-5-5" />
              </svg>
              <span>{property.area.toLocaleString()} sqft</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PropertyCard;
