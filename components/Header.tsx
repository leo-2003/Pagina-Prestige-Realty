import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Bars3Icon, XMarkIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/solid';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Inicio', path: '/home' },
    { name: 'Propiedades', path: '/properties' },
    { name: 'Servicios', path: '/services' },
    { name: 'Sobre Nosotros', path: '/about' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contacto', path: '/contact' },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar for contact info on larger screens */}
        <div className="hidden md:flex justify-end items-center py-2 border-b border-gray-200">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <a href="tel:123-456-7890" className="flex items-center hover:text-blue-600">
              <PhoneIcon className="h-4 w-4 mr-1" />
              123-456-7890
            </a>
            <a href="mailto:contact@prestigerealty.com" className="flex items-center hover:text-blue-600">
              <EnvelopeIcon className="h-4 w-4 mr-1" />
              contact@prestigerealty.com
            </a>
          </div>
        </div>

        {/* Main navigation */}
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/home" className="text-2xl font-bold text-blue-600">
              Prestige Realty
            </Link>
          </div>

          <nav className="hidden md:flex md:space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `text-gray-600 hover:text-blue-600 transition duration-150 ease-in-out font-medium ${
                    isActive ? 'text-blue-600 border-b-2 border-blue-600' : ''
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>
          
          <div className="hidden md:block">
             <Link to="/schedule" className="ml-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Agendar Cita
              </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium ${
                    isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
             <Link to="/schedule" onClick={() => setIsOpen(false)} className="block w-full text-left mt-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Agendar Cita
              </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;