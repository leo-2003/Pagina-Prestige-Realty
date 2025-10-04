import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { Property } from '../types';
import { supabase } from '../context/AuthContext';
import PropertyCard from '../components/PropertyCard';
import { FunnelIcon } from '@heroicons/react/24/solid';

const PropertiesPage: React.FC = () => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const [propertiesCount, setPropertiesCount] = useState(0);
    const ITEMS_PER_PAGE = 9;
    
    const location = useLocation();
    const navigate = useNavigate();

    // The URL is the single source of truth for filters.
    // useMemo recalculates filters only when the URL search string changes.
    const filters = useMemo(() => {
        const params = new URLSearchParams(location.search);
        return {
            location: params.get('location') || '',
            type: params.get('type') || 'all',
            price: params.get('price') || 'all',
            bedrooms: params.get('bedrooms') || 'all',
            bathrooms: params.get('bathrooms') || 'all',
            sortBy: params.get('sortBy') || 'date_new',
            page: parseInt(params.get('page') || '1', 10),
        };
    }, [location.search]);

    const totalPages = Math.ceil(propertiesCount / ITEMS_PER_PAGE);

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > totalPages) return;
        const newParams = new URLSearchParams(location.search);
        newParams.set('page', newPage.toString());
        navigate({ search: newParams.toString() });
        window.scrollTo(0, 0);
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const newParams = new URLSearchParams(location.search);

        if (value && value !== 'all') {
            newParams.set(name, value);
        } else {
            newParams.delete(name);
        }
        
        // When a filter changes (but not sorting), reset to the first page.
        if (name !== 'sortBy') {
            newParams.set('page', '1');
        }

        // Use navigate to update the URL search params. This will trigger a re-render
        // and cause the `filters` object to be recalculated.
        navigate({ search: newParams.toString() }, { replace: true });
    };
    
    const fetchProperties = useCallback(async () => {
        setError(null);

        let query = supabase.from('properties').select('*', { count: 'exact' });

        // Apply filters
        if (filters.location) {
            query = query.ilike('location', `%${filters.location}%`);
        }
        if (filters.type !== 'all') {
            query = query.eq('type', filters.type);
        }
        if (filters.price !== 'all') {
            if (filters.price.includes('+')) {
                const minPrice = parseInt(filters.price.replace('+', ''), 10);
                query = query.gte('price', minPrice);
            } else {
                const [minPrice, maxPrice] = filters.price.split('-').map(Number);
                if (!isNaN(minPrice)) query = query.gte('price', minPrice);
                if (!isNaN(maxPrice)) query = query.lte('price', maxPrice);
            }
        }
        if (filters.bedrooms !== 'all') {
            query = query.gte('bedrooms', parseInt(filters.bedrooms, 10));
        }
        if (filters.bathrooms !== 'all') {
            query = query.gte('bathrooms', parseInt(filters.bathrooms, 10));
        }

        // Apply sorting
        if (filters.sortBy === 'price_asc') {
            query = query.order('price', { ascending: true });
        } else if (filters.sortBy === 'price_desc') {
            query = query.order('price', { ascending: false });
        } else { // 'date_new' or default
            query = query.order('created_at', { ascending: false });
        }
        
        // Apply pagination
        const from = (filters.page - 1) * ITEMS_PER_PAGE;
        const to = from + ITEMS_PER_PAGE - 1;
        query = query.range(from, to);


        const { data, error, count } = await query;
        
        if (error) {
            console.error('Error fetching properties. This might be due to missing RLS policies. Details:', error.message);
            setError('No se pudieron cargar las propiedades. Revise la consola del navegador para más detalles.');
        } else {
            setProperties(data as Property[]);
            setPropertiesCount(count || 0);
        }
        setLoading(false);
    }, [filters]); // Re-create fetch function only when filters object changes

    // This effect triggers the data fetch whenever the filters change.
    useEffect(() => {
        setLoading(true);
        fetchProperties();
    }, [fetchProperties]);


    const FilterSidebar = () => (
        <aside className="lg:col-span-1 bg-white p-6 rounded-lg shadow-lg">
          <div>
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
                    <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700">Habitaciones (mínimo)</label>
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
                    <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700">Baños (mínimo)</label>
                    <select id="bathrooms" name="bathrooms" onChange={handleFilterChange} value={filters.bathrooms} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                        <option value="all">Cualquiera</option>
                        <option value="1">1+</option>
                        <option value="2">2+</option>
                        <option value="3">3+</option>
                        <option value="4">4+</option>
                    </select>
                </div>
            </div>
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
                           <p className="text-gray-700">
                                {loading ? 'Buscando...' : `Mostrando ${properties.length} de ${propertiesCount} resultados`}
                           </p>
                           <div className="flex items-center gap-4">
                                <select name="sortBy" id="sortBy" onChange={handleFilterChange} value={filters.sortBy} className="border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                                    <option value="date_new">Más recientes</option>
                                    <option value="price_asc">Precio: de menor a mayor</option>
                                    <option value="price_desc">Precio: de mayor a menor</option>
                                </select>
                                 <button className="lg:hidden p-2 bg-white border rounded-md" onClick={() => setShowFilters(!showFilters)}>
                                    <FunnelIcon className="h-5 w-5"/>
                                </button>
                           </div>
                        </div>
                        
                        {/* Mobile Filters */}
                        {showFilters && <div className="lg:hidden mb-6"><FilterSidebar /></div>}
                        
                        {loading && <div className="text-center col-span-full py-10">Cargando...</div>}
                        {error && <div className="text-center col-span-full text-red-500 py-10">{error}</div>}
                        {!loading && !error && (
                            <>
                                {properties.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                        {properties.map(property => (
                                            <PropertyCard key={property.id} property={property} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center col-span-full py-10 bg-white rounded-lg shadow">
                                        <h3 className="text-xl font-semibold">No se encontraron propiedades</h3>
                                        <p className="text-gray-600 mt-2">Intente ajustar sus filtros para encontrar lo que busca.</p>
                                    </div>
                                )}
                            </>
                        )}
                        
                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-12 flex justify-center">
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                    <button
                                        onClick={() => handlePageChange(filters.page - 1)}
                                        disabled={filters.page === 1}
                                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Anterior
                                    </button>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
                                        <button
                                            key={pageNumber}
                                            onClick={() => handlePageChange(pageNumber)}
                                            aria-current={pageNumber === filters.page ? 'page' : undefined}
                                            className={
                                                pageNumber === filters.page
                                                ? "z-10 bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                                                : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                                            }
                                        >
                                            {pageNumber}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => handlePageChange(filters.page + 1)}
                                        disabled={filters.page === totalPages}
                                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Siguiente
                                    </button>
                                </nav>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertiesPage;