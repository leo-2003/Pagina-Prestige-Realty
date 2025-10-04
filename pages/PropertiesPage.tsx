
import React, { useState } from 'react';
import { MOCK_PROPERTIES } from '../constants';
import PropertyCard from '../components/PropertyCard';
import { FunnelIcon } from '@heroicons/react/24/solid';

const PropertiesPage: React.FC = () => {
    const [properties, setProperties] = useState(MOCK_PROPERTIES);
    // In a real app, these would be used to filter 'properties'
    const [filters, setFilters] = useState({
        location: '',
        type: 'all',
        price: 'all',
        bedrooms: 'all',
        bathrooms: 'all',
        sortBy: 'default'
    });
    const [showFilters, setShowFilters] = useState(false);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    // Placeholder for filter logic
    // useEffect(() => {
    //   let filtered = MOCK_PROPERTIES;
    //   // apply filters here
    //   setProperties(filtered);
    // }, [filters]);
    
    const FilterSidebar = () => (
        <aside className="lg:col-span-1 bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold mb-6">Filtros Avanzados</h3>
            <div className="space-y-6">
                 <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">Ubicación</label>
                    <input type="text" name="location" id="location" onChange={handleFilterChange} value={filters.location} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                </div>
                 <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700">Tipo de Propiedad</label>
                    <select id="type" name="type" onChange={handleFilterChange} value={filters.type} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                        <option value="all">Todos</option>
                        <option value="House">Casa</option>
                        <option value="Apartment">Apartamento</option>
                        <option value="Condo">Condominio</option>
                        <option value="Villa">Villa</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">Rango de Precio</label>
                    <select id="price" name="price" onChange={handleFilterChange} value={filters.price} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                        <option value="all">Cualquiera</option>
                        <option value="0-500000">$0 - $500,000</option>
                        <option value="500000-1000000">$500,000 - $1,000,000</option>
                        <option value="1000000-2000000">$1,000,000 - $2,000,000</option>
                        <option value="2000000+">$2,000,000+</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700">Habitaciones</label>
                    <select id="bedrooms" name="bedrooms" onChange={handleFilterChange} value={filters.bedrooms} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                        <option value="all">Cualquiera</option>
                        <option value="1">1+</option>
                        <option value="2">2+</option>
                        <option value="3">3+</option>
                        <option value="4">4+</option>
                         <option value="5">5+</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700">Baños</label>
                    <select id="bathrooms" name="bathrooms" onChange={handleFilterChange} value={filters.bathrooms} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                        <option value="all">Cualquiera</option>
                        <option value="1">1+</option>
                        <option value="2">2+</option>
                        <option value="3">3+</option>
                        <option value="4">4+</option>
                    </select>
                </div>
                <button className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300">
                    Aplicar Filtros
                </button>
            </div>
        </aside>
    );

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="bg-white shadow-sm">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <h1 className="text-4xl font-extrabold text-gray-900">Nuestras Propiedades</h1>
                    <p className="mt-2 text-lg text-gray-600">Explore nuestro portafolio completo de propiedades disponibles.</p>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Filter Sidebar (Desktop) */}
                    <div className="hidden lg:block">
                        <FilterSidebar />
                    </div>

                    {/* Properties Grid */}
                    <div className="lg:col-span-3">
                        <div className="flex justify-between items-center mb-6">
                           <p className="text-gray-700">Mostrando <span className="font-bold">{properties.length}</span> resultados</p>
                           <div className="flex items-center gap-4">
                                <select name="sortBy" id="sortBy" onChange={handleFilterChange} value={filters.sortBy} className="border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                                    <option value="default">Ordenar por</option>
                                    <option value="price_asc">Precio: de menor a mayor</option>
                                    <option value="price_desc">Precio: de mayor a menor</option>
                                    <option value="date_new">Más recientes</option>
                                </select>
                                 <button className="lg:hidden p-2 bg-white border rounded-md" onClick={() => setShowFilters(!showFilters)}>
                                    <FunnelIcon className="h-5 w-5"/>
                                </button>
                           </div>
                        </div>
                        
                        {/* Mobile Filters */}
                        {showFilters && <div className="lg:hidden mb-6"><FilterSidebar /></div>}
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                            {properties.map(property => (
                                <PropertyCard key={property.id} property={property} />
                            ))}
                        </div>
                        
                        {/* Pagination */}
                        <div className="mt-12 flex justify-center">
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">Anterior</a>
                                <a href="#" aria-current="page" className="z-10 bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">1</a>
                                <a href="#" className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">2</a>
                                <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">Siguiente</a>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertiesPage;
