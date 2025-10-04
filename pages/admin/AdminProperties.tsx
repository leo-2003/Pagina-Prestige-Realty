import React, { useState, useEffect } from 'react';
import { supabase } from '../../context/AuthContext';
import type { Property } from '../../types';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';

const AdminProperties: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching properties:', error);
      } else {
        setProperties(data as Property[]);
      }
      setLoading(false);
    };

    fetchProperties();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      const { error } = await supabase
        .from('properties')
        .delete()
        .match({ id });

      if (error) {
        console.error('Error deleting property:', error);
        alert('Failed to delete property.');
      } else {
        setProperties(properties.filter(p => p.id !== id));
      }
    }
  };
  
  const getStatusColor = (status: Property['status']) => {
    switch (status) {
      case 'For Sale': return 'bg-blue-100 text-blue-800';
      case 'For Rent': return 'bg-indigo-100 text-indigo-800';
      case 'Sold': return 'bg-green-100 text-green-800';
      case 'Rented': return 'bg-teal-100 text-teal-800';
      case 'Paused': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Manage Properties</h1>
        <Link to="/admin/properties/new" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center">
          <PlusIcon className="h-5 w-5 mr-2" />
          Add New Property
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={4} className="text-center py-4">Loading properties...</td></tr>
            ) : (
              properties.map(property => (
                <tr key={property.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{property.title}</div>
                    <div className="text-sm text-gray-500">{property.location}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">${property.price.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(property.status)}`}>
                      {property.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link to={`/admin/properties/edit/${property.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4 inline-block align-middle">
                      <PencilIcon className="h-5 w-5"/>
                    </Link>
                    <button onClick={() => handleDelete(property.id)} className="text-red-600 hover:text-red-900 align-middle">
                      <TrashIcon className="h-5 w-5"/>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProperties;