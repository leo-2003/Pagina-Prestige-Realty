
import React from 'react';
import { SERVICES } from '../constants';
import { Link } from 'react-router-dom';

const ServicesPage: React.FC = () => {
  return (
    <div className="bg-gray-50">
      {/* Page Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900">Nuestros Servicios Integrales</h1>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Desde la consulta inicial hasta el cierre final, nuestro equipo de expertos está aquí para guiarlo a través de cada aspecto de su viaje inmobiliario con un servicio profesional y personalizado.
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICES.map((service, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col transform hover:-translate-y-2 transition-transform duration-300">
                <div className="p-8 flex-grow">
                  <div className="flex items-center justify-center h-20 w-20 bg-blue-100 text-blue-600 rounded-full mx-auto mb-6">
                    <service.icon className="h-10 w-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-center mb-4">{service.title}</h3>
                  <p className="text-gray-600 text-center leading-relaxed">
                    {service.description}
                  </p>
                </div>
                <div className="p-6 bg-gray-50 text-center">
                  <a href="#contact" className="font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                    Aprende más &rarr;
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-blue-600" id="contact">
        <div className="container mx-auto py-20 px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">¿Listo para dar el siguiente paso?</h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Ya sea que esté comprando, vendiendo o simplemente explorando, nuestro equipo está listo para ayudarlo. Contáctenos hoy para una consulta gratuita y sin compromiso.
          </p>
          <Link to="/contact" className="inline-block bg-white text-blue-600 font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition-transform transform hover:scale-105 duration-300 shadow-lg">
            Contáctenos Ahora
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
