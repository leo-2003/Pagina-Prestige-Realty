import React, { useState, useEffect } from 'react';
import StatCard from '../../components/admin/StatCard';
import { supabase } from '../../context/AuthContext';
import { BanknotesIcon, HomeModernIcon, UserPlusIcon, CheckCircleIcon } from '@heroicons/react/24/solid';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalSalesValue: 0,
    activeListings: 0,
    newLeads: 0,
    closedDeals: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      
      const propertiesPromise = supabase.from('properties').select('status, price');
      const clientsPromise = supabase.from('clients').select('status');

      const [propertiesResult, clientsResult] = await Promise.all([propertiesPromise, clientsPromise]);

      if (propertiesResult.error || clientsResult.error) {
        console.error('Error fetching stats:', propertiesResult.error || clientsResult.error);
        setLoading(false);
        return;
      }
      
      const properties = propertiesResult.data;
      const clients = clientsResult.data;

      const totalSalesValue = properties
        .filter(p => p.status === 'Sold')
        .reduce((sum, p) => sum + p.price, 0);

      const activeListings = properties.filter(p => p.status === 'For Sale' || p.status === 'For Rent').length;
      
      const newLeads = clients.filter(c => c.status === 'New').length;
      
      const closedDeals = clients.filter(c => c.status === 'Closed').length;

      setStats({ totalSalesValue, activeListings, newLeads, closedDeals });
      setLoading(false);
    };

    fetchStats();
  }, []);


  // Simple placeholder for a chart component
  const ChartPlaceholder = ({ title }: {title: string}) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">{title}</h3>
      <div className="bg-gray-200 h-64 rounded-md flex items-center justify-center">
        <p className="text-gray-500">Datos del Gráfico Aquí</p>
      </div>
    </div>
  );

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Panel de Control</h1>

      {/* Stat Cards */}
      {loading ? (
        <p>Cargando estadísticas...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            icon={BanknotesIcon} 
            title="Valor Total de Ventas" 
            value={`$${(stats.totalSalesValue / 1_000_000).toFixed(2)}M`}
            color="green" 
          />
          <StatCard 
            icon={HomeModernIcon} 
            title="Listados Activos" 
            value={stats.activeListings.toString()} 
            color="blue"
          />
          <StatCard 
            icon={UserPlusIcon} 
            title="Nuevos Leads" 
            value={stats.newLeads.toString()}
            color="purple"
          />
          <StatCard 
            icon={CheckCircleIcon} 
            title="Tratos Cerrados" 
            value={stats.closedDeals.toString()}
            color="yellow"
          />
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartPlaceholder title="Leads por Mes" />
        <ChartPlaceholder title="Resumen de Estado de Propiedades" />
      </div>
    </div>
  );
};

export default AdminDashboard;