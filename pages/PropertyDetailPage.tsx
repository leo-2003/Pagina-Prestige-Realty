
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { MOCK_PROPERTIES } from '../constants';
import { MapPinIcon, BuildingOffice2Icon, CalendarIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import { PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

const BedIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
  </svg>
);
const BathIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.5a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM3.5 6.5A1.5 1.5 0 002 8v11a2 2 0 002 2h16a2 2 0 002-2V8a1.5 1.5 0 00-1.5-1.5h-15zm16.5 0h-2m-13 0h-2" />
    </svg>
);
const AreaIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 0h-4m4 0l-5-5" />
    </svg>
);

const PropertyDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const property = MOCK_PROPERTIES.find(p => p.id === id);
    const [mainImage, setMainImage] = useState(property?.images[0] || '');

    if (!property) {
        return <div className="text-center py-20">Property not found.</div>;
    }

    return (
        <div className="bg-gray-100 py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-900">{property.title}</h1>
                    <p className="text-lg text-gray-600 flex items-center mt-2">
                        <MapPinIcon className="h-5 w-5 mr-2 text-gray-500" />
                        {property.location}
                    </p>
                </div>

                {/* Image Gallery */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
                    <div className="lg:col-span-2">
                        <img src={mainImage} alt={property.title} className="w-full h-[500px] object-cover rounded-lg shadow-lg"/>
                    </div>
                    <div className="grid grid-rows-4 gap-4">
                         {property.images.map((img, index) => (
                            <img key={index} src={img} alt={`${property.title} - view ${index + 1}`} 
                                className={`w-full h-full object-cover rounded-lg cursor-pointer transition-opacity duration-300 ${mainImage === img ? 'opacity-50 ring-2 ring-blue-500' : 'hover:opacity-80'}`}
                                onClick={() => setMainImage(img)}
                            />
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white p-8 rounded-lg shadow-lg">
                        <div className="flex justify-between items-start border-b pb-6 mb-6">
                            <div>
                                <p className="text-4xl font-bold text-blue-600">${property.price.toLocaleString()}</p>
                                <div className="mt-2 flex items-center text-lg text-gray-700 bg-gray-100 px-3 py-1 rounded-full w-fit">
                                    <BuildingOffice2Icon className="h-5 w-5 mr-2 text-blue-500"/>
                                    {property.type}
                                </div>
                            </div>
                             <div className="text-right">
                                <span className="bg-green-100 text-green-800 text-lg font-medium px-4 py-2 rounded-full">{property.status}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 text-center">
                            <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg"><BedIcon /> <div><span className="font-bold text-xl">{property.bedrooms}</span> Habitaciones</div></div>
                            <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg"><BathIcon /> <div><span className="font-bold text-xl">{property.bathrooms}</span> Baños</div></div>
                            <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg"><AreaIcon /> <div><span className="font-bold text-xl">{property.area.toLocaleString()}</span> sqft</div></div>
                            <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg"><CalendarIcon className="h-6 w-6 mr-2 text-blue-600"/> <div><span className="font-bold text-xl">{property.yearBuilt}</span> Año</div></div>
                        </div>
                        
                        <div className="mb-8">
                            <h3 className="text-2xl font-bold mb-4">Descripción</h3>
                            <p className="text-gray-700 leading-relaxed">{property.description}</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-2xl font-bold mb-4">Características</h3>
                                <ul className="space-y-2">
                                    {property.features.map(feature => <li key={feature} className="flex items-center text-gray-700"><CheckCircleIcon className="h-5 w-5 mr-2 text-green-500" />{feature}</li>)}
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold mb-4">Amenidades</h3>
                                <ul className="space-y-2">
                                    {property.amenities.map(amenity => <li key={amenity} className="flex items-center text-gray-700"><CheckCircleIcon className="h-5 w-5 mr-2 text-green-500" />{amenity}</li>)}
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    {/* Agent/Contact Card */}
                    <div className="bg-white p-8 rounded-lg shadow-lg h-fit sticky top-24">
                        <h3 className="text-2xl font-bold mb-6 text-center">Contactar al Agente</h3>
                        <div className="flex flex-col items-center mb-4">
                            <img src={property.agent.imageUrl} alt={property.agent.name} className="w-24 h-24 rounded-full object-cover mb-3" />
                            <p className="font-bold text-xl">{property.agent.name}</p>
                        </div>
                         <div className="space-y-3 mb-6">
                            <a href={`tel:${property.agent.phone}`} className="flex items-center text-gray-700 hover:text-blue-600">
                                <PhoneIcon className="h-5 w-5 mr-3"/> {property.agent.phone}
                            </a>
                             <a href={`mailto:${property.agent.email}`} className="flex items-center text-gray-700 hover:text-blue-600">
                                <EnvelopeIcon className="h-5 w-5 mr-3"/> {property.agent.email}
                            </a>
                        </div>
                        <form className="space-y-4">
                            <input type="text" placeholder="Tu Nombre" className="w-full p-3 border rounded-md" />
                            <input type="email" placeholder="Tu Email" className="w-full p-3 border rounded-md" />
                            <textarea placeholder="Estoy interesado en esta propiedad..." rows={4} className="w-full p-3 border rounded-md"></textarea>
                            <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300">
                                Enviar Mensaje
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyDetailPage;
