import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../context/AuthContext';
import type { Property } from '../types';
import { MapPinIcon, BuildingOffice2Icon, CalendarIcon, CheckCircleIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
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

// Agent Contact Form Component
const AgentContactForm: React.FC<{ agent: Property['agent'], propertyId: string }> = ({ agent, propertyId }) => {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.phone) {
            alert('Por favor, complete los campos de nombre, correo electrónico y teléfono.');
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus('idle');

        const { error } = await supabase.from('clients').insert([
            {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                initial_message: formData.message,
                property_id: propertyId,
                status: 'Appointment Scheduled',
                inquiry_date: new Date().toISOString().split('T')[0]
            }
        ]);

        if (error) {
            console.error('Error creating new client lead:', error);
            setSubmitStatus('error');
            setIsSubmitting(false);
        } else {
            // On success, redirect to the scheduling page
            navigate('/schedule');
        }
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-lg h-fit sticky top-24">
            <h3 className="text-2xl font-bold mb-6 text-center">Agendar una Visita</h3>
            <div className="flex flex-col items-center mb-4">
                <img src={agent.imageUrl} alt={agent.name} className="w-24 h-24 rounded-full object-cover mb-3" />
                <p className="font-bold text-xl">{agent.name}</p>
            </div>
            <div className="space-y-3 mb-6">
                <a href={`tel:${agent.phone}`} className="flex items-center text-gray-700 hover:text-blue-600">
                    <PhoneIcon className="h-5 w-5 mr-3"/> {agent.phone}
                </a>
                <a href={`mailto:${agent.email}`} className="flex items-center text-gray-700 hover:text-blue-600">
                    <EnvelopeIcon className="h-5 w-5 mr-3"/> {agent.email}
                </a>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" name="name" placeholder="Tu Nombre" value={formData.name} onChange={handleChange} required className="w-full p-3 border rounded-md" />
                <input type="email" name="email" placeholder="Tu Email" value={formData.email} onChange={handleChange} required className="w-full p-3 border rounded-md" />
                <input type="tel" name="phone" placeholder="Tu Teléfono" value={formData.phone} onChange={handleChange} required className="w-full p-3 border rounded-md" />
                <textarea name="message" placeholder="¿Algún mensaje adicional? (Opcional)" value={formData.message} onChange={handleChange} rows={3} className="w-full p-3 border rounded-md"></textarea>
                <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300 disabled:bg-blue-400">
                    {isSubmitting ? 'Registrando...' : 'Agendar y Continuar'}
                </button>
            </form>
            {submitStatus === 'error' && (
                <p className="mt-4 text-center text-red-600 bg-red-100 p-2 rounded-md">
                    Hubo un error al enviar su solicitud. Por favor, inténtelo de nuevo.
                </p>
            )}
        </div>
    );
};


const PropertyDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [property, setProperty] = useState<Property | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const fetchProperty = async () => {
            if (!id) return;
            setLoading(true);
            setError(null);

            const { data, error } = await supabase
                .from('properties')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error("Error fetching property. This might be due to missing RLS policies. Details:", error.message);
                setError("Property not found.");
            } else {
                setProperty(data as Property);
                setCurrentImageIndex(0);
            }
            setLoading(false);
        };

        fetchProperty();
    }, [id]);
    
    const goToPrevious = () => {
        if (!property) return;
        setCurrentImageIndex(prevIndex => (prevIndex === 0 ? property.images.length - 1 : prevIndex - 1));
    };

    const goToNext = () => {
        if (!property) return;
        setCurrentImageIndex(prevIndex => (prevIndex === property.images.length - 1 ? 0 : prevIndex + 1));
    };


    if (loading) {
        return <div className="text-center py-20">Loading property details...</div>;
    }
    
    if (error || !property) {
        return <div className="text-center py-20">{error || 'Property not found.'}</div>;
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

                {/* Image Carousel */}
                {property.images && property.images.length > 0 && (
                     <div className="mb-8">
                        <div className="relative">
                            <img 
                                src={property.images[currentImageIndex]} 
                                alt={property.title} 
                                className="w-full h-[500px] object-cover rounded-lg shadow-lg"
                            />
                            {property.images.length > 1 && (
                                <>
                                    <button 
                                        onClick={goToPrevious} 
                                        className="absolute top-1/2 left-4 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition"
                                        aria-label="Previous image"
                                    >
                                        <ChevronLeftIcon className="h-6 w-6"/>
                                    </button>
                                    <button 
                                        onClick={goToNext} 
                                        className="absolute top-1/2 right-4 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition"
                                        aria-label="Next image"
                                    >
                                        <ChevronRightIcon className="h-6 w-6"/>
                                    </button>
                                </>
                            )}
                        </div>
                        {/* Thumbnails */}
                        {property.images.length > 1 && (
                            <div className="mt-4 flex space-x-2 overflow-x-auto pb-2">
                                {property.images.map((img, index) => (
                                    <img 
                                        key={index} 
                                        src={img} 
                                        alt={`Thumbnail ${index + 1}`}
                                        className={`flex-shrink-0 w-24 h-24 object-cover rounded-md cursor-pointer transition-all duration-300 ${currentImageIndex === index ? 'ring-4 ring-blue-500' : 'hover:opacity-80'}`}
                                        onClick={() => setCurrentImageIndex(index)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
               

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
                            <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg"><CalendarIcon className="h-6 w-6 mr-2 text-blue-600"/> <div><span className="font-bold text-xl">{property.year_built}</span> Año</div></div>
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
                    <AgentContactForm agent={property.agent} propertyId={property.id} />
                </div>
            </div>
        </div>
    );
};

export default PropertyDetailPage;