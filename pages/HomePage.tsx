import React, { useState, useEffect } from 'react';
import { SERVICES, TESTIMONIALS } from '../constants';
import PropertyCard from '../components/PropertyCard';
import { MapPinIcon, BuildingOfficeIcon, CurrencyDollarIcon, UsersIcon } from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';
import { supabase } from '../context/AuthContext';
import type { Property } from '../types';

// Hero Section Component
const HeroSection: React.FC = () => (
    <div className="relative h-[60vh] md:h-[80vh] bg-cover bg-center" style={{ backgroundImage: "url('https://picsum.photos/seed/hero/1920/1080')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center text-white p-4">
                <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">Encuentra la Propiedad de Tus Sueños</h1>
                <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto">Tu socio de confianza en bienes raíces, dedicado a ayudarte a navegar tu próximo gran movimiento.</p>
                <div className="bg-white bg-opacity-90 p-4 md:p-6 rounded-lg shadow-2xl max-w-4xl mx-auto">
                    <form className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        <input type="text" placeholder="Ubicación (Ciudad, Estado)" className="col-span-1 md:col-span-2 lg:col-span-2 p-3 rounded-md text-gray-700 focus:ring-2 focus:ring-blue-500" />
                        <select className="p-3 rounded-md text-gray-500 focus:ring-2 focus:ring-blue-500">
                            <option>Tipo de Propiedad</option>
                            <option>Casa</option>
                            <option>Apartamento</option>
                            <option>Condominio</option>
                        </select>
                        <select className="p-3 rounded-md text-gray-500 focus:ring-2 focus:ring-blue-500">
                            <option>Rango de Precio</option>
                            <option>$100k - $300k</option>
                            <option>$300k - $600k</option>
                            <option>$600k - $1M</option>
                        </select>
                        <button type="submit" className="col-span-1 md:col-span-4 lg:col-span-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md transition duration-300">
                            Buscar
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
);

// Featured Properties Section
const FeaturedProperties: React.FC = () => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProperties = async () => {
            const { data, error } = await supabase
                .from('properties')
                .select('*')
                .limit(3);
            
            if (error) {
                console.error('Error fetching properties:', error);
            } else {
                setProperties(data as Property[]);
            }
            setLoading(false);
        };

        fetchProperties();
    }, []);

    return (
        <div className="py-16 bg-gray-100">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-center mb-2">Propiedades Destacadas</h2>
                <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">Explore una selección de nuestras mejores propiedades en ubicaciones privilegiadas, cuidadosamente seleccionadas para usted.</p>
                {loading ? (
                    <div className="text-center">Cargando propiedades...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {properties.map(property => (
                            <PropertyCard key={property.id} property={property} />
                        ))}
                    </div>
                )}
                <div className="text-center mt-12">
                    <Link to="/properties" className="inline-block bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-blue-700 transition duration-300">
                        Ver Todas las Propiedades
                    </Link>
                </div>
            </div>
        </div>
    );
};

// Services Section
const ServicesSection: React.FC = () => (
    <div className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-2">Nuestros Servicios</h2>
             <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">Ofrecemos un conjunto completo de servicios de bienes raíces para garantizar una experiencia fluida y exitosa.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
                {SERVICES.slice(0, 6).map(service => (
                    <div key={service.title} className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center justify-center h-16 w-16 bg-blue-100 text-blue-600 rounded-full mx-auto mb-4">
                            <service.icon className="h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                        <p className="text-gray-600">{service.description}</p>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

// Why Choose Us Section
const WhyChooseUs: React.FC = () => (
    <div className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                    <h2 className="text-3xl font-bold mb-4">¿Por Qué Elegirnos?</h2>
                    <p className="mb-8">Con años de experiencia y un compromiso con la excelencia, ofrecemos resultados inigualables y un servicio al cliente excepcional. Somos más que solo agentes; somos sus socios en bienes raíces.</p>
                    <div className="grid grid-cols-2 gap-8">
                        <div className="text-center">
                            <p className="text-4xl font-bold">500+</p>
                            <p>Propiedades Vendidas</p>
                        </div>
                        <div className="text-center">
                            <p className="text-4xl font-bold">98%</p>
                            <p>Tasa de Satisfacción</p>
                        </div>
                        <div className="text-center">
                            <p className="text-4xl font-bold">10+</p>
                            <p>Años de Experiencia</p>
                        </div>
                         <div className="text-center">
                            <p className="text-4xl font-bold">24/7</p>
                            <p>Soporte Dedicado</p>
                        </div>
                    </div>
                </div>
                <div className="space-y-6">
                    {TESTIMONIALS.slice(0, 2).map((testimonial, index) => (
                        <div key={index} className="bg-white bg-opacity-20 p-6 rounded-lg">
                            <div className="flex mb-2">
                                {[...Array(5)].map((_, i) => <StarIcon key={i} className="h-5 w-5 text-yellow-400" />)}
                            </div>
                            <p className="italic mb-4">"{testimonial.quote}"</p>
                            <p className="font-bold text-right">- {testimonial.author}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

// Agent Profile Section
const AgentProfile: React.FC = () => {
    // Note: In a real app, this agent info would likely come from the database.
    const agent = { name: 'John Doe', imageUrl: 'https://picsum.photos/seed/agent1/200/200' };
    return (
        <div className="py-16 bg-gray-100">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-xl p-8 md:flex items-center gap-10">
                    <img src={agent.imageUrl} alt={agent.name} className="w-48 h-48 rounded-full mx-auto md:mx-0 object-cover" />
                    <div className="text-center md:text-left mt-6 md:mt-0">
                        <h2 className="text-3xl font-bold mb-2">Conoce a Tu Agente Experto</h2>
                        <h3 className="text-2xl font-semibold text-blue-600 mb-2">{agent.name}</h3>
                        <p className="text-gray-600 mb-4 max-w-xl">Con una pasión por conectar personas con propiedades, {agent.name} aporta una gran cantidad de conocimiento local y experiencia en la industria para guiarlo a través de cada paso de su viaje inmobiliario.
                        </p>
                        <Link to="/schedule" className="inline-block bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300">
                            Agendar una Cita
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Contact Form Section
const ContactForm: React.FC = () => (
    <div className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-2">Ponte en Contacto</h2>
                <p className="text-gray-600 mb-8">¿Tienes alguna pregunta o estás listo para comenzar? Envíanos un mensaje y nos pondremos en contacto contigo en breve.</p>
                <form className="space-y-4 text-left">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" placeholder="Tu Nombre" className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                        <input type="email" placeholder="Tu Email" className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <input type="text" placeholder="Asunto" className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                    <textarea placeholder="Tu Mensaje" rows={5} className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"></textarea>
                    <div className="text-center">
                        <button type="submit" className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-blue-700 transition duration-300">
                            Enviar Mensaje
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
);


const HomePage: React.FC = () => {
  return (
    <div>
      <HeroSection />
      <FeaturedProperties />
      <ServicesSection />
      <WhyChooseUs />
      <AgentProfile />
      <ContactForm />
    </div>
  );
};

export default HomePage;