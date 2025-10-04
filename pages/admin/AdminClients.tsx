import React, { useState, useEffect } from 'react';
import { supabase } from '../../context/AuthContext';
import type { Client, ClientStatusHistory } from '../../types';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';

const AdminClients: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedClientId, setExpandedClientId] = useState<string | null>(null);
  const [history, setHistory] = useState<ClientStatusHistory[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('clients')
        .select('*, property:properties (id, title)')
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

  const fetchHistory = async (clientId: string) => {
    setHistoryLoading(true);
    setHistory([]);
    const { data, error } = await supabase
      .from('client_status_history')
      .select('*')
      .eq('client_id', clientId)
      .order('changed_at', { ascending: false });

    if (error) {
      console.error('Error fetching client history:', error);
    } else {
      setHistory(data as ClientStatusHistory[]);
    }
    setHistoryLoading(false);
  };

  const toggleClientHistory = (clientId: string) => {
    const newExpandedId = expandedClientId === clientId ? null : clientId;
    setExpandedClientId(newExpandedId);
    if (newExpandedId) {
      fetchHistory(newExpandedId);
    }
  };

  const handleStatusChange = async (clientId: string, newStatus: Client['status']) => {
    const clientToUpdate = clients.find(c => c.id === clientId);
    if (!clientToUpdate) return;

    const oldStatus = clientToUpdate.status;
    if (oldStatus === newStatus) return;

    // Optimistic UI update
    const originalClients = [...clients];
    setClients(clients.map(c => c.id === clientId ? { ...c, status: newStatus } : c));

    // Update client status in DB
    const { error: updateError } = await supabase
        .from('clients')
        .update({ status: newStatus })
        .match({ id: clientId });
    
    if (updateError) {
        console.error('Error updating client status:', updateError);
        alert('Failed to update status.');
        setClients(originalClients); // Revert UI on error
        return;
    }

    // Insert history record
    const { error: historyError } = await supabase
      .from('client_status_history')
      .insert({ client_id: clientId, old_status: oldStatus, new_status: newStatus });
    
    if (historyError) {
      // The main update succeeded, but history failed. Inform user.
      console.error('Error creating history entry:', historyError);
      alert('Status updated, but failed to save history record.');
    } else {
      // If the expanded client is the one we just updated, refresh their history
      if (expandedClientId === clientId) {
        fetchHistory(clientId);
      }
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
  const statusDisplayMap: { [key in Client['status']]: string } = {
    'New': 'Nuevo',
    'Contacted': 'Contactado',
    'Appointment Scheduled': 'Cita Programada',
    'Closed': 'Cerrado',
    'Lost': 'Perdido'
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Gestionar Clientes (CRM)</h1>

      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">Nombre</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">Contacto</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">Fecha de Consulta</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">Estado</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={4} className="text-center py-4">Cargando clientes...</td></tr>
            ) : (
              clients.map(client => (
                <React.Fragment key={client.id}>
                  <tr onClick={() => toggleClientHistory(client.id)} className="cursor-pointer hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                       <div className="flex items-center">
                        {expandedClientId === client.id 
                            ? <ChevronDownIcon className="h-5 w-5 mr-2 text-gray-500" /> 
                            : <ChevronRightIcon className="h-5 w-5 mr-2 text-gray-500" />
                        }
                        <div className="text-sm font-medium text-gray-900">{client.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{client.email}</div>
                      <div className="text-sm text-gray-500">{client.phone}</div>
                      {client.property && (
                        <div className="text-xs text-gray-500 mt-1">
                          Interesado en: <Link to={`/properties/${client.property.id}`} target="_blank" onClick={(e) => e.stopPropagation()} className="text-blue-600 hover:underline">{client.property.title}</Link>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(client.inquiry_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="relative">
                            <select 
                                value={client.status} 
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => handleStatusChange(client.id, e.target.value as Client['status'])}
                                className={`w-full appearance-none text-center px-3 py-1 text-xs leading-5 font-semibold rounded-full border-none focus:ring-2 focus:ring-opacity-50 ${getStatusColor(client.status)}`}
                            >
                            {statusOptions.map(option => (
                                <option key={option} value={option}>{statusDisplayMap[option]}</option>
                            ))}
                            </select>
                            <ChevronDownIcon className="h-4 w-4 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                    </td>
                  </tr>
                  {expandedClientId === client.id && (
                    <tr className="bg-gray-50">
                      <td colSpan={4} className="px-6 py-4">
                        <h4 className="font-bold text-sm mb-3 text-gray-700">Historial de Estado</h4>
                        {historyLoading ? <p className="text-sm text-gray-500">Cargando historial...</p> : (
                          history.length > 0 ? (
                            <ul className="space-y-2">
                              {history.map(h => (
                                <li key={h.id} className="text-sm text-gray-600 flex items-center flex-wrap">
                                  <span className="mr-1">Estado cambiado de</span>
                                  <span className={`mx-1.5 px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(h.old_status)}`}>{statusDisplayMap[h.old_status]}</span>
                                  <span className="mr-1">a</span>
                                  <span className={`mx-1.5 px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(h.new_status)}`}>{statusDisplayMap[h.new_status]}</span>
                                  <span className="text-gray-500 ml-1">el {new Date(h.changed_at).toLocaleString()}</span>
                                </li>
                              ))}
                            </ul>
                          ) : <p className="text-sm text-gray-500">No se encontró historial de estado para este cliente.</p>
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminClients;