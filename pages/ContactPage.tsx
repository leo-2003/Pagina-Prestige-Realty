
import React from 'react';
import { PhoneIcon, EnvelopeIcon, MapPinIcon } from '@heroicons/react/24/solid';

const ContactPage: React.FC = () => {
  return (
    <div className="bg-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Póngase en Contacto</h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Estamos aquí para ayudarle con todas sus necesidades inmobiliarias. No dude en comunicarse con nosotros a través de cualquiera de los siguientes métodos.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="flex items-start p-6 bg-white rounded-lg shadow-md">
              <PhoneIcon className="h-10 w-10 text-blue-600 mt-1 mr-5 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold">Llámenos</h3>
                <p className="text-gray-600 mt-1">Hable directamente con uno de nuestros agentes expertos.</p>
                <a href="tel:123-456-7890" className="text-blue-600 font-semibold mt-2 inline-block hover:underline">123-456-7890</a>
              </div>
            </div>
            <div className="flex items-start p-6 bg-white rounded-lg shadow-md">
              <EnvelopeIcon className="h-10 w-10 text-blue-600 mt-1 mr-5 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold">Envíenos un Correo Electrónico</h3>
                <p className="text-gray-600 mt-1">Para consultas generales o solicitudes detalladas.</p>
                <a href="mailto:contact@prestigerealty.com" className="text-blue-600 font-semibold mt-2 inline-block hover:underline">contact@prestigerealty.com</a>
              </div>
            </div>
            <div className="flex items-start p-6 bg-white rounded-lg shadow-md">
              <MapPinIcon className="h-10 w-10 text-blue-600 mt-1 mr-5 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold">Visite Nuestra Oficina</h3>
                <p className="text-gray-600 mt-1">123 Prestige Lane, Real Estate City, 12345</p>
                <a href="#" className="text-blue-600 font-semibold mt-2 inline-block hover:underline">Obtener Direcciones</a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold mb-6">Envíenos un Mensaje</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">Nombre</label>
                  <input type="text" name="firstName" id="firstName" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Apellido</label>
                  <input type="text" name="lastName" id="lastName" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                <input type="email" name="email" id="email" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
              </div>
               <div>
                <label htmlFor="interest" className="block text-sm font-medium text-gray-700">Estoy interesado en...</label>
                <select id="interest" name="interest" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                    <option>Comprar una propiedad</option>
                    <option>Vender una propiedad</option>
                    <option>Pregunta general</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Mensaje</label>
                <textarea name="message" id="message" rows={5} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
              </div>
              <div>
                <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Enviar Mensaje
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-20">
            <h2 className="text-3xl font-bold text-center mb-8">Nuestra Ubicación</h2>
             <div className="aspect-w-16 aspect-h-9 rounded-lg shadow-lg overflow-hidden">
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.089423773133!2d-122.4194156846813!3d37.77492957975815!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085808c1a2d5e2d%3A0x4f2c5ae5c2a84399!2sSan%20Francisco%2C%20CA%2C%20USA!5e0!3m2!1sen!2s!4v1628892576883!5m2!1sen!2s" 
                    width="100%" 
                    height="450" 
                    style={{border:0}} 
                    allowFullScreen={true}
                    loading="lazy"
                    title="Google Map of office location"
                    >
                </iframe>
             </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
