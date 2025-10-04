import React, { useState, useEffect } from 'react';
import { supabase } from '../../context/AuthContext';
import type { Client } from '../../types';

const AdminClients: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('inquiry_date', { ascending: false });
      
      if (error) {
        console.error('Error fetching clients:', error);
      } else {
        setClients(data as Client[]);
      }
      setLoading(false);
    };

    fetchClients();
  }, []);

  const handleStatusChange = async (clientId: string, newStatus: Client['status']) => {
    // Optimistically update the UI
    const originalClients = [...clients];
    setClients(clients.map(c => c.id === clientId ? { ...c, status: newStatus } : c));

    // Update the database
    const { error } = await supabase
        .from('clients')
        .update({ status: newStatus })
        .match({ id: clientId });
    
    if (error) {
        console.error('Error updating client status:', error);
        alert('Failed to update status.');
        // Revert UI on error
        setClients(originalClients);
    }
  };
  
  const getStatusColor = (status: Client['status']) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-800';
      case 'Contacted': return 'bg-yellow-100 text-yellow-800';
      case 'Appointment Scheduled': return 'bg-purple-100 text-purple-800';
      case 'Closed': return 'bg-green-100 text-green-800';
      case 'Lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const statusOptions: Client['status'][] = ['New', 'Contacted', 'Appointment Scheduled', 'Closed', 'Lost'];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Manage Clients (CRM)</h1>

      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inquiry Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={4} className="text-center py-4">Loading clients...</td></tr>
            ) : (
              clients.map(client => (
                <tr key={client.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{client.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{client.email}</div>
                    <div className="text-sm text-gray-500">{client.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {client.inquiryDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select 
                          value={client.status} 
                          onChange={(e) => handleStatusChange(client.id, e.target.value as Client['status'])}
                          className={`px-2 text-xs leading-5 font-semibold rounded-full border-none focus:ring-0 ${getStatusColor(client.status)}`}
                      >
                        {statusOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
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

export default AdminClients;